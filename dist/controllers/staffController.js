"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStaff = exports.getStaff = void 0;
const staffModel_1 = __importDefault(require("../models/staffModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
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
        const { name, email, password, role, salary_type, base_salary, commission_rate, phone, paymentSchedule } = req.body;
        // 1. Create User for login
        const newUser = new userModel_1.default({ name, email, password, role });
        await newUser.save();
        // 2. Create Employee Record
        const newStaff = new staffModel_1.default({
            name,
            email,
            phone: phone || 'N/A',
            role,
            salary: base_salary,
            paymentSchedule: paymentSchedule || 'Monthly',
            hireDate: new Date().toISOString().split('T')[0]
        });
        await newStaff.save();
        res.status(201).json({ message: 'Staff member added' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};
exports.addStaff = addStaff;
