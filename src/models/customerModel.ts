import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email: string;
    phone: string;
    totalPurchases: number;
    creditBalance: number;
    createdAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    totalPurchases: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
