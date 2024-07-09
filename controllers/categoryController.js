require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../dbModels/category.model');
const {uploadImageToCloudinary} = require('../util/cloudinaryUtils')



// Create a new category
const createCategory = async (req, res) => {
    const { category_image } = req.files;
    const { category_name, category_color } = req.body;
    try {
        const result = await uploadImageToCloudinary(category_image);
        console.log({ result, req: req.files });
        // Generate a unique ID for the category
        

        // Create a new category object
        const newCategory = new Category({
            category_name,
            category_color,
            category_image: result.secure_url
        });

        // Save the new category to the database
        await newCategory.save();

        // Send a successful response with the new category
        res.status(201).json(newCategory);
    } catch (error) {
        // Handle any errors during the process
        res.status(500).json({ message: error.message });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category by ID
const updateCategoryById = async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { category_name },
            { new: true }
        );
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category by ID
const deleteCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id);
        if (category) {
            res.json({ message: 'Category deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategoryById,
    deleteCategoryById,
};
