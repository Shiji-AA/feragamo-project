const mongoose=require("mongoose")

const couponSchema=mongoose.Schema({
   couponCode:{
    type:String
   },
   couponDescription:{
    type:String
   },
   couponDiscount:{
    type:Number
   },
   couponExpiry:{
    type:Date
   },
   maximumAmount:{
    type:Number
   },
   minimumAmount:{
    type:Number
   },
   createdOn:{
    type:Date
   },
   couponUsed:{
      type:Boolean,
      default:false
   },
   customers:[{
      customerId:{
         type:String
      }
   }
   ]
})
const couponModel = mongoose.model('Coupon', couponSchema);

module.exports = couponModel;

