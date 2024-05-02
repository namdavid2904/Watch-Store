const Brand = require("../models/brandModel");
const asyncHandling = require("express-async-handler");
const { validate } = require("../utils/validation");

// Create a brand
const createBrand = asyncHandling(async (req, res) => {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
});

// Update a brand
const updateBrand = asyncHandling(async (req,res) => {
    const { id } = req.params;
    validate(id);
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
    res.json({
        updateBrand,
    })
});

// Delete a brand
const deleteBrand = asyncHandling(async (req,res) =>{
    const { id } = req.params;
    validate(id);
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res.json({
        deleteBrand,
    })
});

// Get a brand
const getBrand = asyncHandling(async (req,res) => {
    const { id } = req.params;
    validate(id);
    const getBrand = await Brand.findById(id);
    res.json({
        getBrand,
    })
});

// Get Brands
const getBrands = asyncHandling(async (req, res) => {
    const getBrands = await Brand.find();
    res.json({
        getBrands,
    })
});

module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getBrands };