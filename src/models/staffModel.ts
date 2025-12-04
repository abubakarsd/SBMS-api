import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
    name: string;
    email: string;
    phone: string;
    role: 'Admin' | 'Manager' | 'Cashier' | 'Technician';
    salary: number;
    paymentSchedule: 'Monthly' | 'Bi-weekly' | 'Weekly';
    status: 'Active' | 'Inactive';
    hireDate: string;
    password?: string;
    userId?: string;
}

const StaffSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Cashier', 'Technician', 'Engineer', 'Sales', 'Support'],
        required: true
    },
    salary: { type: Number, required: true },
    paymentSchedule: {
        type: String,
        enum: ['Monthly', 'Bi-weekly', 'Weekly'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    hireDate: { type: String, required: true },
    password: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model<IStaff>('Staff', StaffSchema);
