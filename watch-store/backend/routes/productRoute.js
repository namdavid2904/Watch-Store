const express = require('express');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct, addWishList } = require('../controller/productCtrl');
const { verifyToken, isAdmin } = require('../middlewares/authMW');
const router = express.Router();
router.post("/", verifyToken, isAdmin, createProduct);
router.get("/:id", getProduct);
router.put('/addWishList', verifyToken, addWishList);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.get("/", getProducts);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
module.exports = router;