const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",

  },
  name: {
    type: String,
    required: true,
  },
  housename: {
    type: String,

  },
  street: {
    type: String,

  },
  city: {
    type: String,

  },
  state: {
    type: String,

  },
  pincode: {
    type: String,

  },



});

module.exports = mongoose.model("Address", userAddressSchema)