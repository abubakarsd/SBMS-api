"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel_1.default.find();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const newCategory = new categoryModel_1.default(req.body);
        await newCategory.save();
        res.status(201).json({ message: 'Category created', category: newCategory });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await categoryModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated', category: updatedCategory });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await categoryModel_1.default.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
