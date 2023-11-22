const mongoose=require("mongoose")

const offerSchema=mongoose.Schema({
    offerCode:{
    type:String
   },
   offerDescription:{
    type:String
   },
   offerDiscount:{
    type:Number
   },
   offerStartsFrom:{
    type:Date
   },

   offerExpiry:{
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
   
})
const offerModel = mongoose.model('Offer', offerSchema);

module.exports = offerModel;

