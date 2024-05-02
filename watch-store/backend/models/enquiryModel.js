const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var enquirySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted", "In Progress", "Resolved"],
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Enquiry', enquirySchema);