const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },


  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Product"
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },     
      quantity: {
        type: Number
      },
      subtotal: {
        type: Number
      },
      orderId: {
        type: Number
      },
      couponAmt: {
        type: Number
      },
    }
  ],



});
module.exports = mongoose.model('Cart', cartSchema);
