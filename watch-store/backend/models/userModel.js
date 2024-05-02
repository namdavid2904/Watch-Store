const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { create } = require('./productModel');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
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
    password:{
        type:String,
        required:true,
    },  
    role: {
        type: String,
        default: "User",
    },
    shopping_cart:{
        type: Array,
        default: [],
    },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    address: [{
        type: String,
        ref: "Address",
    }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpire: {
        type: Date,
    },
}, {
    timestamps: true,
});


userSchema.pre( 'save', async function(next) {
    if (!this.isModified( 'password' )) {
        next();
    };
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt); 
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // compare entered password with created password
};

userSchema.methods.passwordChangeToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); // generate  random token for password reset
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex'); // hash the token 
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);