import { Request, Response } from 'express';
import Payroll from '../models/payrollModel';
import User from '../models/userModel';
import Repair from '../models/repairModel';

export const createPayroll = async (req: Request, res: Response) => {
    try {
        const { periodStart, periodEnd } = req.body;
        const period = `${periodStart} to ${periodEnd}`; // Simplified period string

        // Fetch all active staff (users)
        const activeStaff = await User.find({ status: 'Active' });

        const payrollEntries = await Promise.all(activeStaff.map(async (employee: any) => {
            let commission = 0;

            // Calculate commission if applicable
            if (employee.role === 'Engineer' || employee.salaryType === 'Commission' || employee.salaryType === 'Both') {
                const repairs = await Repair.find({
                    engineerId: employee._id,
                    status: { $in: ['Completed', 'Collected'] },
                    completedDate: {
                        $gte: new Date(periodStart),
                        $lte: new Date(periodEnd)
                    }
                });

                commission = repairs.reduce((sum: number, repair: any) => sum + (repair.engineerCommission || 0), 0);
            }

            const baseSalary = employee.salary || 0;
            const netPay = baseSalary + commission;

            return {
                employeeName: employee.name,
                employeeEmail: employee.email,
                role: employee.role,
                baseSalary,
                commission,
                deductions: 0,
                netPay,
                paymentMethod: employee.paymentSchedule === 'Weekly' ? 'Cash' : 'Bank Transfer',
                status: 'Pending',
                period
            };
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

        const staff = await User.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        const newPayroll = new Payroll({
            employeeName: staff.name,
            employeeEmail: staff.email,
            role: staff.role,
            baseSalary: staff.salary,
            commission: 0, // Manual entry usually doesn't auto-calc commission unless specified
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
