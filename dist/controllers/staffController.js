"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.addStaff = exports.getStaff = void 0;
const staffModel_1 = __importDefault(require("../models/staffModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getStaff = async (req, res) => {
    try {
        const staff = await staffModel_1.default.find();
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
};
exports.getStaff = getStaff;
const addStaff = async (req, res) => {
    try {
        const { name, email, phone, role, salary, paymentSchedule, status, password } = req.body;
        // Create User if password is provided
        let userId = null;
        if (password) {
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            const newUser = new userModel_1.default({
                name,
                email,
                password: hashedPassword,
                role: role || 'Cashier',
                store_id: 'default_store' // Assuming a default store for now
            });
            await newUser.save();
            userId = newUser._id;
        }
        // Create Staff Record
        const newStaff = new staffModel_1.default({
            name,
            email,
            phone: phone || 'N/A',
            role: role || 'Cashier',
            salary: salary || 0,
            paymentSchedule: paymentSchedule || 'Monthly',
            status: status || 'Active',
            hireDate: new Date().toISOString().split('T')[0],
            userId: userId
        });
        await newStaff.save();
        res.status(201).json({ message: 'Staff member added successfully', staff: newStaff });
    }
    catch (error) {
        // Check for duplicate email
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};
exports.addStaff = addStaff;
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStaff = await staffModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member updated', staff: updatedStaff });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating staff', error: error.message });
    }
};
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStaff = await staffModel_1.default.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting staff', error: error.message });
    }
};
exports.deleteStaff = deleteStaff;
