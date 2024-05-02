const express = require("express");
const { uploadImage, removeImage } = require("../controller/uploadCtrl");
const { verifyToken, isAdmin } = require("../middlewares/authMW");
const { uploadFile, productImageEdit } = require("../middlewares/fileUpload"); 
const router = express.Router();

router.post("/", verifyToken, isAdmin, uploadFile.array("images", 20), productImageEdit, uploadImage);
router.delete("/:id", verifyToken, isAdmin, removeImage);

module.exports = router;