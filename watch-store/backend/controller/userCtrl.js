const { token } = require("../config/jswebtoken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const asyncHandling = require("express-async-handler");
const { validate } = require("../utils/validation");
const jwt = require('jsonwebtoken');
const { refreshToken } = require("../config/refreshToken");
const { sendEmail } = require("./emailCtrl");
const crypto = require("crypto");
const uniqid = require('uniqid');

// Register a user
const createUser = asyncHandling(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error('Email already exists');
    }
});

// Login
const UserLogin = asyncHandling(async (req, res) => {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.isPasswordCorrect(password)) {
        const refreshtoken = await refreshToken(user?._id);
        const updateUser = await User.findByIdAndUpdate(user._id, { 
            refreshToken: refreshtoken, 
        }, 
        { 
            new: true, 
        });
        res.cookie( "refreshToken", refreshtoken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            //message: "Successful Login",
            id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            mobile: user?.mobile,
            Token: token(user?._id),
        });
    } else {
        res.status(400).json({
            message: "Unsuccessful Login",
            error: "Invalid email or password",
        });
    };
});

// Admin Login
const AdminLogin = asyncHandling(async (req, res) => {
    const { email, password } = req.body;
    const admin = await User.findOne({ email });
    if (admin.role !== "Admin") {
        throw new Error('Unauthorized Access');
    } else {
        if (admin && await admin.isPasswordCorrect(password)) {
            const refreshtoken = await refreshToken(admin?._id);
            const updateUser = await User.findByIdAndUpdate(admin._id, { 
                refreshToken: refreshtoken, 
            }, 
            { 
                new: true, 
            });
            res.cookie( "refreshToken", refreshtoken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                id: admin?._id,
                firstName: admin?.firstName,
                lastName: admin?.lastName,
                email: admin?.email,
                mobile: admin?.mobile,
                Token: token(admin?._id),
            });
        } else {
            res.status(400).json({
                message: "Unsuccessful Login",
                error: "Invalid email or password",
            });
        };
    }
});

// Get all users
const getUsers = asyncHandling(async (req, res) => {
    const Users = await User.find();
    res.json(Users);
});

// Get a user
const getUser = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const getUser = await User.findById(id);
    res.json({
        getUser,
    });
});

// Refresh token
const handlerefreshToken = asyncHandling(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new Error('No refresh token in the cookie!');
    };
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new Error('No matched refresh token');
    };
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            console.log("Refresh token is not valid!");
        }
        const newToken = token(user?._id);
        res.json({ newToken });
    });
});

// Logout
const UserLogout = asyncHandling(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new Error('No refresh token in the cookie!');
    };
    const user = await User.findOne({ refreshToken });
    if (user) {
        await User.findOneAndUpdate({ refreshToken }, {
            refreshToken: "",
        });
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.status(204).send();
});

// Update a user
const updateUser = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id)
    const updateUser = await User.findByIdAndUpdate(id, {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        address: req?.body?.address,
    });
    res.json({
        updateUser,
    })
});

// Delete a user
const deleteUser = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({
        deleteUser,
    });
});

// Update password for a logged-in user
const passwordChange = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id);
    const { password } = req.body;
    if (password) {
        user.password = password;
        const changePassword = await user.save();
        res.json(changePassword);
    } else {
        res.json(user);
    };
});

// Forgot password token
const forgotPasswordToken = asyncHandling(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Cannot find user");
    } else {
        const passwordForgotToken = await user.passwordChangeToken();
        await user.save();
        const resetPasswordURL = `Hello, Follow this link to reset your password for ${email}. <a href="http://localhost:4000/api/user/resetpassword/${passwordForgotToken}">http://localhost:4000/api/user/passwordchange/</a>`;
        const data = {
            to: email,
            text: "Hello!",
            subject: "Forgot Password URL",
            html: resetPasswordURL, 
        };
        await sendEmail(data);
        res.json(passwordForgotToken);
    };
});

// Set a new password for password-forgotten user
const passwordReset = asyncHandling(async (req, res) => {
    const { password } = req.body;
    const { passwordResetToken } = req.params;
    if (!passwordResetToken) {
        throw new Error('Invalid Token')
    };

    const hashPasswordResetToken = crypto.createHash('sha256').update(passwordResetToken).digest( 'hex' );
    const user = await User.findOne({
        passwordResetToken: hashPasswordResetToken, 
        passwordResetExpire: {$gt: Date.now()},
    });
    if (!user) {
        throw new Error('Invalid Token');
    };
    // Save the new password and remove token fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
    res.json(user);
});

// Wish list
const getWishList = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id).populate("wishList");
    res.json(user);
});

// Add to cart
const addToCart = asyncHandling(async (req, res) => {
    const { cart } = req.body;
    const { id } = req.user;
    validate(id);
    let products = [];
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderBy: user.id });

    // Remove old cart
    if (userCart) {
        userCart.remove();
    };

    for (let i = 0; i < cart.length; i++) {
        let item = {};
        item.product = cart[i]._id;
        item.quantity = cart[i].quantity;

        // Get up-to-date product's price
        let price = await Product.findById(cart[i]._id).select("price").exec();
        console.log(price.price);
        item.price = price.price;
        products.push(item);
    };

    // Calculate new total bill before tax
    let totalBillBeforeTax = 0;
    for (let i = 0; i < products.length; i++) {
        totalBillBeforeTax += products[i].price * products[i].quantity;
    }; 

    // Create new cart with new data
    const newCart = await new Cart({
        products,
        totalBillBeforeTax,
        orderBy: user?.id,
    }).save();
    res.json(newCart);
});

// Get user's cart
const getCart = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderBy: user.id}).populate("products.product");
    if (!userCart) {
        throw new Error('No cart found');
    }
    res.json(userCart);
});

// Empty cart
const deleteCart = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id);
    const userCart = await Cart.findOneAndDelete({ orderBy: user.id });
    res.json(userCart);
});

// Create an order
const createOrder = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const { status, payMethod } = req.body;
    if (status !== "Success") {
        throw new Error('Order not successful');
    };
    const user = await User.findById(id);
    const userCart = await Cart.findOne({ orderBy: user?.id });
    if (!userCart) {
        throw new Error('No cart found')
    };
    let totalBillAfterTax = userCart.totalBillNoTax * (1 + userCart.tax);
    const newOrder = await new Order({
        id: uniqid(),
        products: userCart.products,
        totalBillAfterTax,
        paymentMethods: payMethod,
        orderStatus: status,
        orderBy: user?.id,
    }).save();

    // Update product quantity in stock
    const updatedProducts = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
            }
        };
    });
    const productsUpdated = await Product.bulkWrite(updatedProducts);
    res.json({
        message: "Success",
    });
});

// Get an order of a user
const getUserOrder = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id);
    const userOrder = await Order.findOne({ orderBy: user.id }).populate("products.product").populate("orderBy").exec();
    res.json(userOrder);
});

// Get all orders of a user
const getUserOrders = asyncHandling(async (req, res) => {
    const { id } = req.user;
    validate(id);
    const user = await User.findById(id);
    const userOrders = await Order.find({ orderBy: user.id }).populate("products.product").populate("orderBy").exec();
    res.json(userOrders);
});

// Get all orders of all users
const getUsersOrders = asyncHandling(async (req, res) => {
    const allUsersOrders = await Order.find().populate("products.product").populate("orderBy").exec();
    res.json(allUsersOrders);
});

// Update order status
const updateOrderStatus = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const statusUpdate = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.json(statusUpdate);
});


module.exports = { 
    createUser, 
    UserLogin, 
    AdminLogin, 
    getUsers, 
    getUser, 
    updateUser, 
    deleteUser, 
    handlerefreshToken, 
    UserLogout, 
    passwordChange, 
    forgotPasswordToken, 
    passwordReset, 
    getWishList, 
    addToCart, 
    getCart, 
    deleteCart, 
    createOrder,
    getUserOrder,
    getUserOrders,
    getUsersOrders,
    updateOrderStatus
};