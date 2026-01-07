import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: string;
    phone?: string;
    salary?: number;
    salaryType?: 'Fixed' | 'Commission' | 'Both';
    paymentSchedule?: 'Monthly' | 'Bi-weekly' | 'Weekly';
    status?: 'Active' | 'Inactive';
    hireDate?: Date;
    store_id?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, required: true, default: 'user' },
    phone: { type: String },
    salary: { type: Number },
    salaryType: {
        type: String,
        enum: ['Fixed', 'Commission', 'Both'],
        default: 'Fixed'
    },
    paymentSchedule: {
        type: String,
        enum: ['Monthly', 'Bi-weekly', 'Weekly'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    hireDate: { type: Date, default: Date.now },
    store_id: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
