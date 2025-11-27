import { Request, Response } from 'express';
import { getAllEmployees, createEmployee } from '../models/staffModel';
import { createUser } from '../models/userModel';

export const getStaff = (req: Request, res: Response) => {
    try {
        const staff = getAllEmployees();
        res.json(staff);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
};

export const addStaff = (req: Request, res: Response) => {
    try {
        const { name, email, password, role, salary_type, base_salary, commission_rate } = req.body;

        // 1. Create User
        const userId = createUser({ name, email, password, role });

        // 2. Create Employee Record
        createEmployee({
            user_id: userId as number,
            salary_type,
            base_salary,
            commission_rate
        });

        res.status(201).json({ message: 'Staff member added' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};
