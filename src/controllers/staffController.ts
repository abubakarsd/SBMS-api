import { Request, Response } from 'express';
import Staff from '../models/staffModel';
import User from '../models/userModel';

export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
};

export const addStaff = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, salary_type, base_salary, commission_rate, phone, paymentSchedule } = req.body;

        // 1. Create User for login
        const newUser = new User({ name, email, password, role });
        await newUser.save();

        // 2. Create Employee Record
        const newStaff = new Staff({
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
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};
