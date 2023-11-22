const Admin = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const bcrypt = require("bcrypt");
const Coupon = require("../models/couponModel");
const Offer = require("../models/offerModel");
const User = require("../models/userModel");
const Category = require('../models/categoryModel')
const Banner = require('../models/bannerModel')

const loadAdminLogin = async (req, res) => {
  try {
    if (req.session.admin_id) {  //if user is authenticated
      return res.redirect('/admin/dashboard'); // Redirect to the home page
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.render("adminLogin")
    }
  } catch (err) {
    console.log(err.message);
  }
}
const verifyAdmin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const adminData = await Admin.findOne({ email: email })
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        if (adminData.is_admin) {
          req.session.admin_id = adminData._id;
          // req.session.authenticated=true;
          res.redirect("/admin/dashboard");
        } else {
          return res.render("adminLogin", { message: "Invalid credentials!" })
        }

      } else {
        return res.render("adminLogin", { message: "Invalid credentials!" })
      }
    } else {
      return res.render("adminLogin", { message: "Invalid credentials!" })
    }
  } catch (err) {
    console.log(err.message)
  }
}
//DashBoard

const loadDashboard = async (req, res) => {
  try {
    const userData = await Admin.find({ is_admin: 0 });   
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();   
    const deliveredOrders = await Order.find({ status: "Delivered" });   
    let revenue = 0;
    for (let i = 0; i < deliveredOrders.length; i++) {
      revenue = revenue + deliveredOrders[i].totalAmount;
    }
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    // Extract the count for the "Delivered" status
    const deliveredOrderCount = orderStatusCounts.find(status => status._id === "Delivered")?.count || 0;

    if (userData) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.render("adminDashboard", {
        users: userData,
        revenue: revenue,
        productCount: productCount,
        orderCount: deliveredOrderCount,
        categoryCount: categoryCount
      });
    } else {
      res.redirect("/login");
    } 
  } catch (err) {
    console.log(err.message);
  }
}


const loadUsers = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const userData = await Admin.find({ is_admin: 0 })
    res.render("adminUsersList", { users: userData })

  } catch (err) {
    console.log(err.message)
  }
}


const blockUser = async (req, res) => {
  try {
    const id = req.params.id
    await Admin.findByIdAndUpdate({ _id: id }, { $set: { is_blocked: true } })
    res.redirect('/admin/dashboard/Users')
  } catch (error) {
    console.log(error.message)
  }
}


const unBlockUser = async (req, res) => {
  try {
    const unblockid = req.params.unblockid
    await Admin.findByIdAndUpdate({ _id: unblockid }, { $set: { is_blocked: false } })

    res.redirect('/admin/dashboard/Users')
  } catch (error) {
    console.log(error.message)
  }
}

const adminLogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect("/admin")
  } catch (err) {
    console.log(err.message)
  }
}
//OrderManagement
const loadAdminOrders = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const userData = await Admin.find({ is_admin: 0 })
    const orders = await Order.find({})
    //console.log(orders)
    res.render("orderManagement", { users: userData, orders: orders })
  }
  catch (err) {
    console.log(err.message);
  }
}


const loadEditOrders = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    
    const orders = await Order.findOne({ _id: orderId }).populate('items.productId')
    const productData = orders.items
    //console.log(productData,"HO")
    res.render('adminEditOrders', { orders, productData });
  } catch (error) {
    console.error(error.message);
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.query.orderId;
    const order = await Order.findOne({ orderId: orderId }).populate('items.productId');
    
    if (!order) {
      // Handle the case where the order with the given ID is not found.
      return res.status(404).send("Order not found");
    }

    const newStatus = req.body.orderStatusOption;

    if (newStatus === "Cancelled") {
      const products = order.items;

      for (const product of products) {
        const productIdId = product.productId._id;
        const productQuantity = product.quantity;

        const foundProduct = await Product.findById(productIdId);

        if (foundProduct) {
          // Update the stock of the product
          foundProduct.stock += productQuantity;

          // Save the updated product
          await foundProduct.save();
        }
      }
    }

    // Update the status of the order
    order.status = newStatus;
    await order.save();

    res.redirect("/admin/dashboard/ordersPagination");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


// COUPON STARTS HERE
// ===================

const couponManagementPage=async (req,res)=>{
  try {
    const couponDetails=await Coupon.find({})    
      res.render("couponManagement",{couponDetails:couponDetails})
  } catch (error) {
      console.log(error)
  }
}


const addCoupon=async (req,res)=>{
  try {
      const couponCode=req.body.couponCode
      const coupons=await Coupon.findOne({couponCode:couponCode})
      const couponDetails=await Coupon.find({})
      
      if(coupons){
          res.render("couponManagement",{couponDetails:couponDetails,message:"Coupon Already Exist"})
      }else{
          const coupon = new Coupon({
              couponCode:couponCode,
              couponDescription:req.body.couponDescription,
              couponDiscount:req.body.couponDiscount,
              couponExpiry:req.body.couponExpiry,
              maximumAmount:req.body.maximumAmount,
              minimumAmount:req.body.minimumAmount,
              createdOn:new Date()
          })
          const coup=await coupon.save()
          console.log(coup.couponExpiry);
          if(coup){
              res.redirect("/admin/dashboard/coupon")
          }
      }
      
  } catch (error) {
      console.log(error);
  }
}


const editCouponPage=async (req,res)=>{
  try {
      const couponId=req.params._id;   
      const couponDetails=await Coupon.findOne({_id:couponId})
      res.render("editCoupon",{couponDetails:couponDetails})
  } catch (error) {
      console.log(error)
  }
}

const updateCoupon=async (req,res)=>{
  try {
    
      const coup= await Coupon.updateMany({_id:req.query.couponId},{$set:{
          couponCode:req.body.couponCode,
          couponDescription:req.body.couponDescription,
          couponDiscount:req.body.couponDiscount,
          couponExpiry:req.body.couponExpiry,
          maximumAmount:req.body.maximumAmount,
          minimumAmount:req.body.minimumAmount}})
          if(coup){
              res.redirect("/admin/dashboard/coupon")
          }
  } catch (error) {
      console.log(error);
  }
}


const deleteCoupon=async (req,res)=>{
  try {
      const id=req.params._id;     
      deleted=await Coupon.deleteOne({_id:id})
      if(deleted){
          res.redirect("/admin/dashboard/coupon")
      }
  } catch (error) {
      console.log(error);
  }
}


// offer STARTS HERE
// ===================

const offerManagementPage=async (req,res)=>{
  try {
    const offerDetails=await Offer.find({})    
      res.render("offerManagement",{offerDetails:offerDetails})
  } catch (error) {
      console.log(error)
  }
}

const addOffer=async (req,res)=>{
  try {
      const offerCode=req.body.offerCode
      const offers=await Offer.findOne({offerCode:offerCode})
      const offerDetails=await Offer.find({})
      
      if(offers){
          res.render("offerManagement",{offerDetails:offerDetails,message:"Offer Already Exist"})
      }else{
          const offer = new Offer({
              offerCode:offerCode,
              offerDescription:req.body.offerDescription,
              offerDiscount:req.body.offerDiscount,
              offerStartsFrom:req.body.offerStartsFrom,
              offerExpiry:req.body.offerExpiry,
              maximumAmount:req.body.maximumAmount,
              minimumAmount:req.body.minimumAmount,
              createdOn:new Date()
          })
          const offe=await offer.save()
          console.log(offe.offerExpiry);
          if(offe){
              res.redirect("/admin/dashboard/offer")
          }
      }
      
  } catch (error) {
      console.log(error);
  }
}


const editOfferPage=async (req,res)=>{
  try {
      const offerId=req.params._id;   
      const offerDetails=await Offer.findOne({_id:offerId})
      res.render("editOffer",{offerDetails:offerDetails})
  } catch (error) {
      console.log(error)
  }
}

const updateOffer=async (req,res)=>{
  try {
    
      const offe= await Offer.updateMany({_id:req.query.offerId},{$set:{
          offerCode:req.body.offerCode,
          offerDescription:req.body.offerDescription,
          offerDiscount:req.body.offerDiscount,
          offerStartsFrom:req.body.offerStartsFrom,
          offerExpiry:req.body.offerExpiry,
          maximumAmount:req.body.maximumAmount,
          minimumAmount:req.body.minimumAmount}})
          if(offe){
              res.redirect("/admin/dashboard/offer")
          }
  } catch (error) {
      console.log(error);
  }
}
const deleteOffer=async (req,res)=>{
  try {
      const id=req.params._id;     
      deleted=await Offer.deleteOne({_id:id})
      if(deleted){
          res.redirect("/admin/dashboard/offer")
      }
  } catch (error) {
      console.log(error);
  }
}


//return
const acceptRequest =async(req,res)=>{
  try {   
   
      const orderid=req.params.id; 
      const order= await Order.findOne({_id:orderid})   
      const update=await Order.updateOne({_id:orderid} , {$set:{returnStatus:"Request Accepted" , return:false}})
      await order.save() ;
      console.log("admin changed status")
      await order.save();   
          res.redirect(`/admin/dashboard/ordersPagination`);
  } catch (error) {
      console.log(error.message)
  }
}
const rejectRequest = async(req,res)=>{
  try {
      const orderid=req.params.id
      const order= await Order.findOne({_id:orderid})
      const update=await Order.updateOne({_id:orderid} , {$set:{returnStatus:"Request Rejected" , return:false}})
      await order.save();
      console.log("admin changed status")
      await order.save();   
      res.redirect(`/admin/dashboard/ordersPagination`);
      } catch (error) {
      console.log(error.message)
  }
}




const loadSalesReport=async(req,res)=>{
  try{
    const order= await Order.find({});
    res.render('salesReport',({order:order}));
  }
  catch(error){
    console.log(error.message)
  }
}

const fetchDataGraph = async (req, res) => {
  try {
      const time = req.params.time;
  
      if (time === 'month') {   
         const currentYear = new Date().getFullYear();
          const data = await Order.aggregate([
              {
                  $match: {
                      createdOn: {
                          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                      }
                  }
              },
              {
                       $group: {
                      _id: { $month: '$createdOn' }, 
                      ordersCount: { $sum: 1 } 
                  }
              }
          ]);

             const allMonths = {
              'January': 0,
              'February': 0,
              'March': 0,
              'April': 0,
              'May': 0,
              'June': 0,
              'July': 0,
              'August': 0,
              'September': 0,
              'October': 0,
              'November': 0,
              'December': 0
          };
          data.forEach(item => {
              const month = new Date(`2023-${item._id}-01`).toLocaleString('default', { month: 'long' });
              allMonths[month] = item.ordersCount;
          });

          res.json(allMonths);
      }
      if (time === 'year') {
          const startYear = 2019;
          const endYear = 2024;
          const ordersByYear = {};     
 for (let year = startYear; year <= endYear; year++) {
              const data = await Order.aggregate([
                  {
                      $match: {
                          createdOn: {
                              $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                              $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                          }
                      }
                  },
                  {
                      $group: {
                          _id: null,
                          ordersCount: { $sum: 1 }
                      }
                  }
              ]);     
              
              const orderCount = data.length > 0 ? data[0].ordersCount : 0;    
              ordersByYear[year] = orderCount;
          }
          res.json(ordersByYear);
      }
      if (time === 'week') {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const currentDay = currentDate.getDate();          
          const dayOfWeek = currentDate.getDay();          
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];          
          
          const startDate = new Date(currentYear, currentMonth, currentDay - dayOfWeek);        
         const ordersByDayOfWeek = {};
          for (let day = 0; day < 7; day++) {
              const date = new Date(startDate);
              date.setDate(startDate.getDate() + day);             
              const data = await Order.aggregate([
                  {
                      $match: {
                          createdOn: {
                              $gte: new Date(date.setHours(0, 0, 0, 0)),
                              $lt: new Date(date.setHours(23, 59, 59, 999))
                          }
                      }
                  },
                  {
                      $group: {
                          _id: null,
                          ordersCount: { $sum: 1 }
                      }
                  }
              ]);              
              const orderCount = data.length > 0 ? data[0].ordersCount : 0;
              ordersByDayOfWeek[dayNames[day]] = orderCount;
          }     
          res.json(ordersByDayOfWeek);
      }          
  } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while fetching data.");
  }
};

const dailyOrder = async (req, res) => {
  try {
    console.log("Inside dailyOrder function");
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 1);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const order = await Order.find({
      createdOn: { $gte: startOfDay, $lte: endOfDay },
    });
     res.render("salesReport", { order:order });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data.");
  }
};

const weeklyOrder = async (req, res) => {
  try {    
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1)
    );
    startOfWeek.setHours(0, 0, 0, 1);
    const endOfWeek = new Date(now);
    // Set the end of the week to Sunday (end of the day)
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const order = await Order.find({
      createdOn: { $gte: startOfWeek, $lte: endOfWeek },
    })   
    res.render("salesReport", { order:order });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while fetching data.");
  }
};

const yearlyOrder = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 1);
    const endOfYear = new Date(currentYear, 12, 31, 23, 59, 59, 999);
    const order = await Order.find({
      createdOn: { $gte: startOfYear, $lte: endOfYear },
    })     
    res.render("salesReport", { order:order });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while fetching data.");
   
  }
};

const UpdateOrderByDateForm = async (req, res) => {
  try {
    const startOfDay = new Date(req.body.orderFrom);
    startOfDay.setHours(0, 0, 0, 1);
    const endOfDay = new Date(req.body.orderTo);
    endOfDay.setHours(23, 59, 59, 999);
    const order = await Order.find({
      createdOn: { $gte: startOfDay, $lte: endOfDay },
    })      
    res.render("salesReport", { order:order });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while fetching data.");
  }
};


const invoiceSales = async (req, res) => {
  try {
    // Use the aggregation pipeline to calculate totalFinalAmount
    const aggregationPipeline = [
      {
        $group: {
          _id: null,
          totalFinalAmount: { $sum: "$totalAmount" }
        }
      }
    ];
    const result = await Order.aggregate(aggregationPipeline);

    // Extract the totalFinalAmount from the result (if it exists)
    const totalFinalAmount = result.length > 0 ? result[0].totalFinalAmount : 0;

    // Fetch all orders
    const orders = await Order.find({});

    res.render("invoiceSales", { orders, totalFinalAmount });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while fetching data");
  }
};







//OrderManagement  ends here

module.exports = {
  loadAdminLogin,
  verifyAdmin,
  loadDashboard,
  loadUsers,
  blockUser,
  unBlockUser,
  adminLogout,
  loadAdminOrders,
  loadEditOrders,
  updateOrder,
  //returnRequestChange,
  couponManagementPage,
  addCoupon,
  editCouponPage,
  updateCoupon,
  deleteCoupon,
  offerManagementPage,
  addOffer,
  editOfferPage,
  updateOffer,
  deleteOffer,
  acceptRequest ,
  rejectRequest,
  loadSalesReport,
  fetchDataGraph,
  dailyOrder, 
  weeklyOrder,
  yearlyOrder,
  UpdateOrderByDateForm ,
  invoiceSales,
  
}
