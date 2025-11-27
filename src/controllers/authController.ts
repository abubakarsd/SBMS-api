import { Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const register = (req: Request, res: Response) => {
    try {
        const { email, password, role, name, store_id } = req.body;
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userId = createUser({ email, password, role, name, store_id });
        res.status(201).json({ message: 'User created', userId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = findUserByEmail(email);
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, store_id: user.store_id }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, store_id: user.store_id } });
    } catch (error: any) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
