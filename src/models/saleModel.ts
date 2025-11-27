import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    orderNumber: string;
    customer: string;
    orderDate: string;
    items: number;
    total: number;
    status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
    paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
}

const SaleSchema: Schema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    orderDate: { type: String, required: true }, // Keeping as string to match frontend format for now, could be Date
    items: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Partial'],
        default: 'Unpaid'
    },
    cashierId: { type: String }
});

export default mongoose.model<ISale>('Sale', SaleSchema);
