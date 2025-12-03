import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    description?: string;
    isActive: boolean;
    category?: string; // ObjectId as string
    createdAt: Date;
}

const BrandSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBrand>('Brand', BrandSchema);
