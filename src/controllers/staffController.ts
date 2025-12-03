import { Request, Response } from 'express';
import Staff from '../models/staffModel';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

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
        const { name, email, phone, role, salary, paymentSchedule, status, password } = req.body;

        // Create User if password is provided
        let userId = null;
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new User({
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
        const newStaff = new Staff({
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
    } catch (error: any) {
        // Check for duplicate email
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};

export const updateStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member updated', staff: updatedStaff });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating staff', error: error.message });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting staff', error: error.message });
    }
};
