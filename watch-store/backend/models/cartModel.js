const { Schema } = require('mongoose');
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
        }
    }],
    tax: {
        type: Number,
        default: 0.06,
    },
    totalBillNoTax: {
        type: Number,
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);