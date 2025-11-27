"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const register = async (req, res) => {
    try {
        const { email, password, role, name, store_id } = req.body;
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
        const newUser = new userModel_1.default({ email, password: hashedPassword, role, name, store_id });
        await newUser.save();
        res.status(201).json({ message: 'User created', userId: newUser._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, store_id: user.store_id }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name, store_id: user.store_id } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
exports.login = login;
