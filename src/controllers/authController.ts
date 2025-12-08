import { Request, Response } from 'express';
import User from '../models/userModel';
import Role from '../models/roleModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name, store_id } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Normalize Role
        let assignedRole = role || 'Cashier';
        const roleDoc = await Role.findOne({ name: { $regex: new RegExp(`^${assignedRole}$`, 'i') } });
        if (roleDoc) {
            assignedRole = roleDoc.name;
        } else {
            // Fallback: Title Case if not found (e.g. "admin" -> "Admin")
            assignedRole = assignedRole.charAt(0).toUpperCase() + assignedRole.slice(1).toLowerCase();
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ email, password: hashedPassword, role: assignedRole, name, store_id });
        await newUser.save();

        res.status(201).json({ message: 'User created', userId: newUser._id });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role, store_id: (user as any).store_id }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, store_id: (user as any).store_id } });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
