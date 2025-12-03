"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSuppliers = void 0;
const supplierModel_1 = __importDefault(require("../models/supplierModel"));
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierModel_1.default.find().sort({ createdAt: -1 });
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
};
exports.getSuppliers = getSuppliers;
const createSupplier = async (req, res) => {
    try {
        const newSupplier = new supplierModel_1.default(req.body);
        await newSupplier.save();
        res.status(201).json(newSupplier);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating supplier', error: error.message });
    }
};
exports.createSupplier = createSupplier;
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSupplier = await supplierModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(updatedSupplier);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
};
exports.updateSupplier = updateSupplier;
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        await supplierModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Supplier deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
};
exports.deleteSupplier = deleteSupplier;
