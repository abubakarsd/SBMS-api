import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user || !user.password) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};
// ... existing profile functions ...

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone, salary, paymentSchedule, status } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            salary,
            paymentSchedule,
            status
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = bcrypt.hashSync(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
