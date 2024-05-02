const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const asyncHandling = require("express-async-handler");
const verifyToken = asyncHandling(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const Token = await jwt.verify(token, process.env.SECRET_KEY);
                const user = await User.findById(Token?.id);
                req.user = user;
                next();
            }
        } catch {
            throw new Error('Invalid Token');
        }
    } else {
        throw new Error('No Token');
    };
});

const isAdmin = asyncHandling(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser?.role !== "Admin") {
        throw new Error('You are not an Admin!');
    } else {
        next();
    };
});


module.exports = { verifyToken, isAdmin };