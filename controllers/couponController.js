const Coupon = require('../models/couponModel');
const User = require('../models/userModel')



var couponCodes
const applyCoupon=async (req,res)=>{
    try {
        const id = req.session.user._id;         
        const code = req.body.couponCode ;
        couponCodes=code
        const cartTotal=req.body.cartTotal;
        const found = await Coupon.findOne({ couponCode: code });
        if (found) {
            const dateNow = new Date();
            // Check if the customer's ID is already in the customers array
            if (found.customers.some(customer => customer.customerId.toString() === id.toString())) {
                res.json({ alreadyUsed: "Coupon code has already been used by this customer" });
                return;
            }       
            if(dateNow<=found.couponExpiry){
                if(cartTotal>=found.minimumAmount){
                    let discount=Math.ceil(cartTotal*(found.couponDiscount/100))
                    if(discount>found.maximumAmount){
                        discount=found.maximumAmount
                    }
                    let amountTotal=cartTotal-discount;
                    await Coupon.updateOne(
                        { _id: found._id },
                        { $push: { customers: { customerId: id } },
                          $set: {couponUsed:true}
                     }
                    );
                    res.json({amountTotal:amountTotal,discount:discount})
                  
                }else{
                    res.json({minimumValid:"Minimum purchase amount should be maintained"})
                }
            }else{
                res.json({expiry:"Coupon Not Available"})
            }
        }else{
            res.json({noCoupon:"Coupon Not Available"})
        }
    } catch (error) {
        res.status(500).send('Oops! Something went wrong.')
    }
}


const getAvailableCoupons = async(req,res)=>{
    try{
        const availableCoupons = await Coupon.find({ couponUsed: false });
        res.json({ availableCoupons });
    }
    catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





module.exports = {

    applyCoupon,
    getAvailableCoupons,

}