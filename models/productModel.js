const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  images:Array,

  category: {
    type: String

  },
  price: {
    type: Number,
    required: true
  },

  isListed: {
    type: Boolean,
    default: true
  },

  stock: {
    type: Number
  }
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
