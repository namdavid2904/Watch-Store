const mongoose = require('mongoose');

var caseSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true,
    },
    dimension: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    waterResist: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    thickness: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
});

var movementSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    powerReserve: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    reference: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    }
});

var technicalSchema = new mongoose.Schema({
    Case: {
        type: caseSchema,
        required: true,
    },
    Movement: {
        type: movementSchema,
        required: true,
    },
});

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required:true,
    },
    category: {
        type: String, 
        //ref: "Category",
        required: true,
    },
    brand: {
        type: String,
        //enum: ["Rado", "Hublot", "Tissot"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }, 
    sold: {
        type: Number,
        default: 0,
    },
    image: {
        type: Array,
    },
    color: {
        type: String,
        //enum: ["Black", "Brown", "Red"],
        required: true,
    },
    /**rating: [{
        star: Number,
        reviewedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    }]**/
    technical: {
        type: technicalSchema,
        required: true,
    },
}, {
    timestamps: true,
}
);

//Export the model
module.exports = mongoose.model('Product', productSchema);