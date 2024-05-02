const express = require("express");
const { 
    createUser, 
    UserLogin, 
    AdminLogin, 
    getUsers, 
    getUser, 
    deleteUser, 
    updateUser, 
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
} = require("../controller/userCtrl");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMW");

router.post("/register", createUser);
router.post("/forgotpassword", forgotPasswordToken);
router.put("/resetpassword/:passwordResetToken", passwordReset);
router.put("/passwordchange", verifyToken, passwordChange);
router.post("/login", UserLogin);
router.post("/admin-login", AdminLogin);
router.post("/cart", verifyToken, addToCart);
router.post("/order", verifyToken, createOrder);
router.get("/getusers", verifyToken, isAdmin, getUsers);
router.get("/getuserorder", verifyToken, getUserOrder);
router.get("/getuserorders", verifyToken, getUserOrders);
router.get("/getusersorders", verifyToken, isAdmin, getUsersOrders);
router.get("/refreshtoken", handlerefreshToken);
router.get("/logout", UserLogout);
router.get("/:id", verifyToken, isAdmin, getUser);
router.get("/wishlist/:id", verifyToken, getWishList);
router.get("/usercart/:id", verifyToken, getCart);
router.delete("/deletecart/:id", verifyToken, deleteCart);
router.delete("/:id", deleteUser);
router.put("/order/statusupdate/:id", verifyToken, isAdmin, updateOrderStatus);
router.put("/:id", verifyToken, updateUser);

module.exports = router;