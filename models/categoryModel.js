const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String

    },
    discountPercentage: {
        type: Number,
        default:0,
        required: true,
    },
    validFrom: {
        type: Date,       
        
    },
    validTo: {
        type: Date,        
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

})
const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;













