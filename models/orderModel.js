const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number
        },

        price: {
            type: Number
        }
    }],
    address: {
        name: {
            type: String
        },
        housename: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: String
        }
    },
    paymentMethod: {
        type: String,
    },
    shippingCharge: {
        type: Number
    },
    discount: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    offerPrice: {
        type: Number
    },
    createdOn: {
        type: Date
    },
    deliveredOn: {
        type: Date
    },
    status: {
        type: String
    },
    orderId: {
        type: String,
    
    },
    returnReason:{
        default:'nil',
        type:String,
      },
      returnStatus:{
        type:String,
      },
      return:{
        type: Boolean,
        default: false,
        required: true
      }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
