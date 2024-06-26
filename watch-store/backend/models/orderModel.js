const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
        },
        quantity: {
            type: Number,
        }
    }],
    totalBill: {
        type: Number,
    },
    paymentMethods: {
        supportedMethods: {
            type: String,
            enum: ['basic-card'], 
        },
    },
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Processing", "Success", "Failed", "On Delivery", "Cancelled", "Delivered"],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);