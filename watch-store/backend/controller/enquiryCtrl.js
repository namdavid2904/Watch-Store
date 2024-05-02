const Enquiry = require("../models/enquiryModel");
const asyncHandling = require("express-async-handler");
const { validate } = require("../utils/validation");

// Create an enquiry
const createEnquiry = asyncHandling(async (req, res) => {
    const newEnquiry = await Enquiry.create(req.body);
    res.json(newEnquiry);
});

// Update an enquiry
const updateEnquiry = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, req.body);
    res.json(updatedEnquiry);
});

// Delete ab enquiry
const deleteEnquiry = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    res.json(deletedEnquiry);
});

// Get an enquiry
const getEnquiry = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const gettingEnquiry = await Enquiry.findById(id);
    res.json(gettingEnquiry);
});

// Get all enquiries
const getEnquiries = asyncHandling(async (req, res) => {
    const allEnquiries = await Enquiry.find();
    res.json(allEnquiries);
});

module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getEnquiries };