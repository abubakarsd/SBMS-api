"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.addCustomer = exports.getCustomers = void 0;
const customerModel_1 = __importDefault(require("../models/customerModel"));
const getCustomers = async (req, res) => {
    try {
        const customers = await customerModel_1.default.find();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};
exports.getCustomers = getCustomers;
const addCustomer = async (req, res) => {
    try {
        const newCustomer = new customerModel_1.default(req.body);
        await newCustomer.save();
        res.status(201).json({ message: 'Customer added', customer: newCustomer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding customer', error: error.message });
    }
};
exports.addCustomer = addCustomer;
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCustomer = await customerModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Customer updated', customer: updatedCustomer });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await customerModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Customer deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};
exports.deleteCustomer = deleteCustomer;
