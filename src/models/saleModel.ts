import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
    orderNumber: string;
    customer: string;
    customerName?: string;
    customerId?: mongoose.Types.ObjectId;
    orderDate: string;
    items: number;
    total: number;
    status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
    paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
    discount?: number;
    amountPaid: number;
    amountDue: number;
    dueDate?: Date;
}

const SaleSchema: Schema = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    customerName: { type: String },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    orderDate: { type: String, required: true },
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
    discount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    amountDue: { type: Number, default: function () { return this.total; } },
    cashierId: { type: String },
    dueDate: { type: Date }
});

export default mongoose.model<ISale>('Sale', SaleSchema);
