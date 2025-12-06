import { Request, Response } from 'express';
import Payroll from '../models/payrollModel';
import Staff from '../models/staffModel';

export const createPayroll = async (req: Request, res: Response) => {
    try {
        const { periodStart, periodEnd } = req.body;
        const period = `${periodStart} to ${periodEnd}`; // Simplified period string

        // Fetch all active staff
        const activeStaff = await Staff.find({ status: 'Active' });

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
            await Payroll.insertMany(payrollEntries);
        }

        res.status(201).json({ message: 'Payroll generated', count: payrollEntries.length });
    } catch (error: any) {
        res.status(500).json({ message: 'Error generating payroll', error: error.message });
    }
};

export const createSinglePayroll = async (req: Request, res: Response) => {
    try {
        const { staffId, period, status, paymentMethod } = req.body;

        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const newPayroll = new Payroll({
            employeeName: staff.name,
            employeeEmail: staff.email,
            role: staff.role,
            baseSalary: staff.salary,
            deductions: 0,
            netPay: staff.salary,
            paymentMethod: paymentMethod || (staff.paymentSchedule === 'Weekly' ? 'Cash' : 'Bank Transfer'),
            status: status || 'Pending',
            period: period || new Date().toISOString().slice(0, 7) // Default to current YYYY-MM
        });

        await newPayroll.save();
        res.status(201).json(newPayroll);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating payroll entry', error: error.message });
    }
};

export const getPayroll = async (req: Request, res: Response) => {
    try {
        const history = await Payroll.find();
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching payroll history', error: error.message });
    }
};
export const updatePayrollStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedPayroll = await Payroll.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedPayroll) {
            return res.status(404).json({ message: 'Payroll entry not found' });
        }
        res.json(updatedPayroll);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating payroll status', error: error.message });
    }
};
