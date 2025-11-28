import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    unitCost: number;
}

export interface IPurchaseOrder extends Document {
    poNumber: string;
    supplier: mongoose.Types.ObjectId;
    items: IPurchaseOrderItem[];
    totalCost: number;
    status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled';
    orderDate: Date;
    expectedDate?: Date;
    receivedDate?: Date;
    notes?: string;
}

const PurchaseOrderSchema: Schema = new Schema({
    poNumber: { type: String, required: true, unique: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitCost: { type: Number, required: true, min: 0 }
    }],
    totalCost: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Ordered', 'Received', 'Cancelled'],
        default: 'Pending'
    },
    orderDate: { type: Date, default: Date.now },
    expectedDate: { type: Date },
    receivedDate: { type: Date },
    notes: { type: String }
});

export default mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
