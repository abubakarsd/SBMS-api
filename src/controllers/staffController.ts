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
        console.log('Adding staff with body:', req.body); // Debug log
        const { name, email, phone, role, salary, paymentSchedule, status, password } = req.body;

        // Validations
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        // Create User (Always create a user for staff)
        const userPassword = password || 'staff123'; // Default password if none provided
        const hashedPassword = bcrypt.hashSync(userPassword, 10);

        let userId = null;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            userId = existingUser._id;
            console.log('User already exists, linking to userId:', userId);
        } else {
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role: role || 'Cashier',
                store_id: 'default_store'
            });
            await newUser.save();
            userId = newUser._id;
            console.log('Created new user, userId:', userId);
        }

        // Check if Staff already exists
        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ message: 'Staff with this email already exists' });
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
        console.log('Staff created successfully:', newStaff._id);

        res.status(201).json({ message: 'Staff member added successfully', staff: newStaff, userCreated: !existingUser });
    } catch (error: any) {
        console.error('Error adding staff:', error); // Detailed logging
        // Check for duplicate email
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
};

export const syncUsersToStaff = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        let syncedCount = 0;

        for (const user of users) {
            // Check if staff exists for this user
            const existingStaff = await Staff.findOne({ email: user.email });

            if (!existingStaff) {
                // Create missing staff record
                const newStaff = new Staff({
                    name: user.name,
                    email: user.email,
                    phone: 'N/A', // Placeholder
                    role: 'Admin', // Default to Admin for synced users (usually admin users) or map based on user role if available
                    salary: 0,
                    paymentSchedule: 'Monthly',
                    status: 'Active',
                    hireDate: new Date().toISOString().split('T')[0],
                    userId: user._id
                });
                await newStaff.save();
                syncedCount++;
            } else if (!existingStaff.userId) {
                // Link existing staff to user if missing
                existingStaff.userId = user._id as string;
                await existingStaff.save();
                syncedCount++;
            }
        }

        res.json({ message: 'Sync completed', syncedCount, totalUsers: users.length });
    } catch (error: any) {
        console.error('Sync error:', error);
        res.status(500).json({ message: 'Error syncing users', error: error.message });
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
