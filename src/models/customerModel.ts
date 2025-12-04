import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    serviceType: 'Sale' | 'Repair' | 'Both';
    serviceStatus: 'Active' | 'Completed' | 'Pending';
    lastServiceDate?: Date;
    totalPurchases: number;
    creditBalance: number;
    createdAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: false },
    address: { type: String },
    serviceType: {
        type: String,
        enum: ['Sale', 'Repair', 'Both'],
        default: 'Sale'
    },
    serviceStatus: {
        type: String,
        enum: ['Active', 'Completed', 'Pending'],
        default: 'Active'
    },
    lastServiceDate: { type: Date },
    totalPurchases: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
