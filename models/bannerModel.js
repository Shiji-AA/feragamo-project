const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({

  bannerImages: Array,

  description: {
    type: String,
    required: true,
  },

  isListed: {
    type: Boolean,
    default: true
  },
  
});

module.exports = mongoose.model("Banner", bannerSchema);
