const Address = require("../models/AddressModel");
const Product = require("../models/productModel")
const Cart = require('../models/cartModel');
const User = require('../models/userModel')
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const Offer = require("../models/offerModel");
const Category = require("../models/categoryModel");
const { v4: uuidv4 } = require('uuid');
// const { response, checkout } = require("../routes/userRoute");
const Razorpay = require('razorpay');
var instance = new Razorpay({
   key_id: 'rzp_test_7uvjpbUMAVksOW',
   key_secret: 'RzjBbWZF3pcyCw195wPO5Ib4',
});



const loadCheckOut = async (req, res) => {
   try {
      const id = req.session.user._id;
      const userId = await User.findOne({ _id: id });
      const addresses = await Address.find({ user: id });
      const userCart = await Cart.findOne({ user: userId }).populate('cart.productId');
      const offers = await Offer.find({});
      const coupons = await Coupon.find({ couponUsed: false });
      const categories = await Category.find({});
      const products = await Product.find({}); 


      res.render('checkout', {
        addresses: addresses,
        user: userId,
        userCart: userCart,
        offers: offers,
        coupons: coupons,
       // categories: categories,
     
      });
   } catch (error) {
      
      res.status(500).send('Internal Server Error');
   }
}


// ================PLACE ORDER==========================

const confirmOrder = async (req, res) => {
   try {   
      let couponDiscount=0;
      if(req.body.couponDiscount>0){
         couponDiscount=req.body.couponDiscount;
      }
      const paymentOption =req.body.paymentMethod;         
      const id = req.session.user._id;   
      const userId = await User.findOne({ _id: id });
      const userCart = await Cart.findOne({ user: userId });
      const address = await Address.findOne(req.body.address) ;
      const couponCode = req.body.couponCode  ;
      const hasUsedCoupon = await Coupon.findOne({
         userId: id,
         couponCode: couponCode,
       });
   
       if (hasUsedCoupon) {
         return res.json({ error: 'Coupon code has already been used.' });
       }
      if (!userId || !userCart || !address) {
         return res.json({ error: 'Invalid user, cart, or address.' });
      }    
// -----------------------------------------------------------------------
      const uniqueOrderId = uuidv4();
      const date = new Date();    
      const prods = [];
      let gTotal = 0;
// -----------------------------------------------------------------------
      for (const item of userCart.cart) {
      const product = await Product.findById(item.productId);        
         if (!product || product.stock === 0){
            continue;
         }
          const productWithQuantity = {
            productId: product._id,
            price: product.price,
            quantity: item.quantity,
         };       
         gTotal += productWithQuantity.price * productWithQuantity.quantity;
         product.stock -= productWithQuantity.quantity;

         await product.save();
         prods.push(productWithQuantity);
      }
// ---------------------OFFER MANAGEMENT----------------------------------------------
const dateNow = new Date();
const activeOffers = await Offer.find({
   offerStartsFrom: { $lte: dateNow },
   offerExpiry: { $gte: dateNow },
});

if (activeOffers.length > 0) {
   let maxOfferAmount = 0;

   for (const offer of activeOffers) {
      if (gTotal >= offer.minimumAmount) {
         let offerAmount = Math.ceil(gTotal * (offer.offerDiscount / 100));
         if (offerAmount > offer.maximumAmount) {
            offerAmount = offer.maximumAmount;
         }

         if (offerAmount > maxOfferAmount) {
            maxOfferAmount = offerAmount;
         }
      }
   }

   let offerPrice = gTotal - maxOfferAmount;

   // ---------------------------------------------------------------
 
      // Create the order outside the loop
      const orderID = uniqueOrderId;
      const order = new Order({
         customerId: userId,
         address: {
            name: address.name,
            housename: address.housename,
            street: address.street,
            city: address.city,
            state: address.state,   
            pincode: address.pincode,
         },
         //products: prods,
         paymentMethod:paymentOption,
         discount: req.body.discount || 0,
         totalAmount: gTotal,
         offerPrice: gTotal-maxOfferAmount,
         shippingCharge: 0,
         createdOn:new Date(),        
         status: 'pending',
         items: prods,
         orderId: orderID,
      });
   // Save the order
   const savedOrder = await order.save();  

  if (savedOrder) { 
  await Cart.updateOne({ user: userId }, { $set: { cart: [] } }); 
  if (paymentOption === "CashOnDelivery") { 
   res.json({ success: true, message: 'Order placed successfully.'}); 
} else if (paymentOption === "Razorpay") {
   console.log("discount "+couponDiscount);
   console.log("offer "+offerPrice);
   const razorpayOrder = await generateRazorpay(orderID, ((offerPrice-couponDiscount)*100));
   // You might want to redirect the user to the Razorpay payment page here
   res.json({ razorpayOrder });  
   } }

}}
   catch (error) {
      
      return res.json({ error: 'An error occurred while processing your order.' });
   }
}

async function generateRazorpay(orderID, offerPrice) 
{
  
 return new Promise((resolve, reject) => {
var options = {
 amount: offerPrice,
 currency: "INR",
receipt: orderID
};
 //console.log(options.amount,"amt");
instance.orders.create(options, function (error, order) {
if (error) {
console.log(error);
reject(error);
} else {
console.log("sending resolve");
resolve(order);
}})})
};

// -----------------------------------------------------------------------------------------------------


const cancelOrder = async (req, res) => {
   try {
      const id = req.session.user._id;
      const userId = await User.findOne({ _id: id });
      const orderId = req.query.id;
      // Update the order status to "Cancelled"
      const update = await Order.updateOne({ _id: orderId }, { $set: { status: "Cancelled" } });

      if (update) {
         const orders = await Order.findOne({ _id: orderId }).populate('items.productId');
         //console.log(orders,"ii")
         if (orders) {
            const products = orders.items;
            //console.log(products,"eeee")
            for (const product of products) {
               const productIdId = product.productId._id;
               const productQuantity = product.quantity;
               //console.log(productIdId, "dddd");
               //console.log(productQuantity,"pppppp");
               const foundProduct = await Product.findById(productIdId);
               if (foundProduct) {
                  // Update the stock of the product
                  foundProduct.stock = foundProduct.stock + productQuantity;
                  // Save the updated product
                  await foundProduct.save();
               }
            }
       return res.redirect("/myProfile?orderId=" + orderId);
         }
      } else {
         return res.redirect("/myProfile?orderId=" + orderId);
      }
   } catch (error) {
      
      res.status(500).send("Error cancelling order");
   }
};


const loadEmptyCart = async (req, res) => {
   try {
      res.render('emptyCart')
   }
   catch (error) {
      res.status(500).send('Oops! Something went wrong.')
   }
}

const loadOrderPlaced = async (req, res) => {
   try {
      res.render('orderPlaced')
   }
   catch (error) {
res.status(500).send('Oops! Something went wrong.')
   }
}

const loadConfirm = async (req, res) => {
   try {
      const user_id = req.session._id;
      const userData = await User.findOne({ _id: user_id });
      if (userData) {
         res.render("checkout.ejs")
      }
   } catch (error) {
      res.status(500).send('Oops! Something went wrong.')
   }
}

const loadverify = async (req, res) => {
   try {
      const user_id = req.session._id;
      const { payment, order } = req.body
      let or = JSON.parse(order);
      let orderid = or.receipt
      const success = await User.updateOne({ _id: user_id }, { $set: { cart: [] } })
      if (success) {
         res.json({ orderid: orderid })
      }
   } catch (error) {
      res.status(500).send('Oops! Something went wrong.')
   }
}
const loadInvoice = async(req,res)=>{
   try{
      const id = req.session.user._id;
      const user = await User.findOne({ _id: id })    
      const addresses = await Address.findOne({ user: id })   
      const orderId = req.query.orderId;     
      const orders = await Order.findOne({ orderId: orderId }).populate('items.productId')
   //   const productData= orders.items.map((a)=>{console.log(a.productId,"bdjfhdg")})
      const productData = orders.items.map((a) => a.productId);
    // console.log(productData,"db")   
      res.render('Invoice', { user:user, addresses:addresses,orders:orders,productData})
   }
   catch(error){
      res.status(500).send('Oops! Something went wrong.')
   }}   

   const returnRequestChange = async (req, res) => {
      try {
        const selectedReason = req.body.selectedReason;       
        const orderid = req.params.id;    
        const orders = await Order.findOne({ _id: orderid });    
        if (orders) {
          orders.return = true;
          orders.returnStatus = "Request Pending";
          orders.returnReason = selectedReason;
          orders.status="return pending"
          await orders.save(); // Save the updated order 
          res.json({message:"Return Requested"}) // Send success response
        } else {
          return res.status(404).json({ message: "Order Not Found" }); // Send error response if order not found
        }
      } catch (error) {
        res.status(500).send('Oops! Something went wrong.')
      }
    };   


  const ordersPagination = async (req, res) => {
   try {
      const userId= req.session?.user?._id;
       let page = req.query.page || 1;
       let perpage = 5;
       const orderCount = await Order.find({customerId:userId}).countDocuments();
       const count = Math.ceil(orderCount / perpage);     
       const orders = await Order
           .find({customerId:userId})
           .sort({ _id: -1 })
           .skip((page - 1) * perpage)
           .limit(perpage);       
       res.render("orderListingUserside", {orders,count,page});
   } catch (error) {
       
       res.status(500).send('Internal Server Error');
   }
}; 

const ordersPaginationAdmin = async (req, res) => {
   try {      
       let page = req.query.page || 1;
       let perpage = 5;
       const orderCount = await Order.find().countDocuments();
       const count = Math.ceil(orderCount / perpage);
       const orders = await Order
           .find()
           .sort({ _id: -1 })
           .skip((page - 1) * perpage)
           .limit(perpage);      
       res.render("orderManagement", {orders,count,page});
   } catch (error) {       
       res.status(500).send('Internal Server Error');
   }
};


  







module.exports = {
   loadCheckOut,
   confirmOrder,
   cancelOrder,
   loadEmptyCart,
   loadOrderPlaced,
   loadConfirm,
   loadverify,
   loadInvoice,
  returnRequestChange,
  ordersPagination,
  ordersPaginationAdmin,

}

