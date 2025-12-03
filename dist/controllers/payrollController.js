"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayrollStatus = exports.getPayroll = exports.createPayroll = void 0;
const payrollModel_1 = __importDefault(require("../models/payrollModel"));
const staffModel_1 = __importDefault(require("../models/staffModel"));
const createPayroll = async (req, res) => {
    try {
        const { periodStart, periodEnd } = req.body;
        const period = `${periodStart} to ${periodEnd}`; // Simplified period string
        // Fetch all active staff
        const activeStaff = await staffModel_1.default.find({ status: 'Active' });
        const payrollEntries = activeStaff.map(employee => ({
            employeeName: employee.name,
            employeeEmail: employee.email,
            role: employee.role,
            baseSalary: employee.salary,
            deductions: 0, // Default deductions
            netPay: employee.salary, // Simplified net pay calculation
            paymentMethod: employee.paymentSchedule === 'Weekly' ? 'Cash' : 'Bank Transfer', // Default logic
            status: 'Pending',
            period
        }));
        if (payrollEntries.length > 0) {
            await payrollModel_1.default.insertMany(payrollEntries);
        }
        res.status(201).json({ message: 'Payroll generated', count: payrollEntries.length });
    }
    catch (error) {
        res.status(500).json({ message: 'Error generating payroll', error: error.message });
    }
};
exports.createPayroll = createPayroll;
const getPayroll = async (req, res) => {
    try {
        const history = await payrollModel_1.default.find();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching payroll history', error: error.message });
    }
};
exports.getPayroll = getPayroll;
const updatePayrollStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedPayroll = await payrollModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedPayroll) {
            return res.status(404).json({ message: 'Payroll entry not found' });
        }
        res.json(updatedPayroll);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating payroll status', error: error.message });
    }
};
exports.updatePayrollStatus = updatePayrollStatus;
