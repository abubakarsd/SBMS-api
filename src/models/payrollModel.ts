import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
    employeeName: string;
    employeeEmail: string;
    role: string;
    baseSalary: number;
    commission: number;
    deductions: number;
    netPay: number;
    paymentMethod: 'Bank Transfer' | 'Cash' | 'Wallet';
    status: 'Pending' | 'Paid';
    period: string; // e.g., "january-2024"
}

const PayrollSchema: Schema = new Schema({
    employeeName: { type: String, required: true },
    employeeEmail: { type: String, required: true },
    role: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Bank Transfer', 'Cash', 'Wallet'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    period: { type: String, required: true }
});

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
