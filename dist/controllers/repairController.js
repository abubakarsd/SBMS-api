"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRepair = exports.updateStatus = exports.updateRepair = exports.createRepair = exports.getRepairByKey = exports.getRepairs = void 0;
const repairModel_1 = __importDefault(require("../models/repairModel"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const getRepairs = async (req, res) => {
    try {
        const repairs = await repairModel_1.default.find().sort({ receivedDate: -1 });
        res.json(repairs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching repairs', error: error.message });
    }
};
exports.getRepairs = getRepairs;
const getRepairByKey = async (req, res) => {
    try {
        const { bookingKey } = req.params;
        const repair = await repairModel_1.default.findOne({ bookingKey });
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(repair);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching repair', error: error.message });
    }
};
exports.getRepairByKey = getRepairByKey;
const createRepair = async (req, res) => {
    try {
        const { customerName, customerPhone, customerEmail, ...repairData } = req.body;
        let customer = null;
        // Create or update customer for repair
        if (customerPhone) {
            customer = await customerModel_1.default.findOne({ phone: customerPhone });
            if (customer) {
                // Update existing customer
                customer.name = customerName || customer.name;
                customer.email = customerEmail || customer.email;
                customer.serviceType = customer.serviceType === 'Sale' ? 'Both' : 'Repair';
                customer.serviceStatus = 'Pending';
                customer.lastServiceDate = new Date();
                await customer.save();
            }
            else {
                // Create new customer
                customer = new customerModel_1.default({
                    name: customerName,
                    phone: customerPhone,
                    email: customerEmail,
                    serviceType: 'Repair',
                    serviceStatus: 'Pending',
                    lastServiceDate: new Date()
                });
                await customer.save();
            }
        }
        // Create repair record
        const newRepair = new repairModel_1.default({
            ...repairData,
            customerName,
            customerPhone,
            customerEmail,
            customerId: customer?._id
        });
        await newRepair.save();
        res.status(201).json({
            message: 'Repair booking created successfully',
            bookingKey: newRepair.bookingKey,
            repair: newRepair
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repair booking', error: error.message });
    }
};
exports.createRepair = createRepair;
const updateRepair = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRepair = await repairModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json({ message: 'Repair updated successfully', repair: updatedRepair });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating repair', error: error.message });
    }
};
exports.updateRepair = updateRepair;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, completedDate } = req.body;
        const update = { status };
        if (status === 'Completed' && completedDate) {
            update.completedDate = completedDate;
        }
        const updatedRepair = await repairModel_1.default.findByIdAndUpdate(id, update, { new: true });
        res.json({ message: 'Status updated successfully', repair: updatedRepair });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
exports.updateStatus = updateStatus;
const deleteRepair = async (req, res) => {
    try {
        const { id } = req.params;
        await repairModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Repair deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting repair', error: error.message });
    }
};
exports.deleteRepair = deleteRepair;
