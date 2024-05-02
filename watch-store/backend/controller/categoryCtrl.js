const Category = require("../models/categoryModel");
const asyncHandling = require("express-async-handler");
const { validate } = require("../utils/validation");

// Create a category
const createCategory = asyncHandling(async (req, res) => {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
});

// Update a category
const updateCategory = asyncHandling(async (req,res)=>{
    const { id } = req.params;
    validate(id);
    const updateCategory = await Category.findByIdAndUpdate(id, req.body ,{new: true});
    res.json({ updateCategory });
});

// Delete a category
const deleteCategory = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json({ deleteCategory });
});

// Get a category
const getCategory = asyncHandling(async (req, res) => {
    const { id } = req.params;
    validate(id);
    const getCategory = await Category.findById(id);
    res.json({ getCategory });
});

// Get categories
const getCategories = asyncHandling(async (req, res) => {
    const getCategories = await Category.find();
    res.json({ getCategories });
});

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getCategories };