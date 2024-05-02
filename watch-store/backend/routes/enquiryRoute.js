const express = require("express");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getEnquiries } = require("../controller/enquiryCtrl");
const { verifyToken, isAdmin } = require("../middlewares/authMW");
const router = express.Router();

router.post("/new-enquiry", createEnquiry);
router.get("/all-enquiries", verifyToken, isAdmin, getEnquiries);
router.get("/get-enquiry/:id", verifyToken, isAdmin, getEnquiry);
router.delete("/delete-enquiry/:id", verifyToken, isAdmin, deleteEnquiry);
router.put("/update-enquiry/:id", verifyToken, isAdmin, updateEnquiry);

module.exports = router;