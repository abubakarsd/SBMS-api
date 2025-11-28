import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    products: string[]; // Array of product names or descriptions supplied
    createdAt: Date;
}

const SupplierSchema: Schema = new Schema({
    name: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    products: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISupplier>('Supplier', SupplierSchema);
