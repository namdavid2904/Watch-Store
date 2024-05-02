const User = require('../models/userModel');
const Product = require('../models/productModel');
const asyncHandling = require("express-async-handler");
const slugify = require("slugify");
const { validate } = require('../utils/validation');

// Create a product
const createProduct = asyncHandling(async (req, res) => {
    if (req.body.name) {
        req.body.slug =  slugify(req.body.name);
    };
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
});

// Update a product
const updateProduct = asyncHandling(async (req,res)=>{
    const { id } = req.params;
    validate(id);
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    };
    console.log(req.body);          
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
    });
    res.json(updatedProduct);
});

// Delete a product
const deleteProduct = asyncHandling(async (req,res)=>{
    const { id } = req.params;
    validate(id);
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    };
    console.log(req.body);          
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
});

// Get a product
const getProduct = asyncHandling(async (req, res) => {
    const { id }  = req.params;
    validate(id);
    const findProduct = await Product.findById(id);
    res.json(findProduct);
});

// Get products
const getProducts = asyncHandling(async (req, res) => {
    // Filter
    const queries = {...req.query};
    const excludeFld = [ 'page', 'sort', 'limit', 'fields'];
    excludeFld.forEach(el => delete queries[el]);
    let Queries = JSON.stringify(queries).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(Queries));

    // Sort
    if (req.query.sort) {
        console.log(req.query.sort);
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");   
    };

    // Limit
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');  
    };

    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1)*limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
        const productDisplayed = await Product.countDocuments();
        if  (skip >= productDisplayed) {
            throw new Error('No available products');
        };
    };
    const Products = await query;
    res.json(Products);
});

const addWishList = asyncHandling(async (req, res) =>{
    const { id } = req.user;
    const { productId } = req.body;
    const user = await User.findById(id);
    const isAlreadyInTheList = user.wishList.includes(productId);
    if (!isAlreadyInTheList) {
        const updatedUser = await User.findByIdAndUpdate(id, {
            $push: {wishList : productId},
        }, {
            new: true,
        })
        res.json(updatedUser);
    } else {
        throw new Error('This product is already in your wishlist');
    }
});


module.exports = { createProduct, getProduct, getProducts, updateProduct, deleteProduct, addWishList };