"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getBrands = void 0;
const brandModel_1 = __importDefault(require("../models/brandModel"));
const getBrands = async (req, res) => {
    try {
        const brands = await brandModel_1.default.find();
        res.json(brands);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching brands', error: error.message });
    }
};
exports.getBrands = getBrands;
const createBrand = async (req, res) => {
    try {
        const { name, description, isActive, category } = req.body;
        const newBrand = new brandModel_1.default({ name, description, isActive, category });
        await newBrand.save();
        res.status(201).json(newBrand);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Brand name already exists' });
        }
        res.status(500).json({ message: 'Error creating brand', error: error.message });
    }
};
exports.createBrand = createBrand;
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBrand = await brandModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ message: 'Brand updated', brand: updatedBrand });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating brand', error: error.message });
    }
};
exports.updateBrand = updateBrand;
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBrand = await brandModel_1.default.findByIdAndDelete(id);
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ message: 'Brand deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting brand', error: error.message });
    }
};
exports.deleteBrand = deleteBrand;
