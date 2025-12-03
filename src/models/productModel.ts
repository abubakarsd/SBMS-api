import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    sku: string;
    category: string;
    price: number;
    cost?: number;
    quantity: number;
    minQuantity: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    imageUrl?: string;
    lastUpdated: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    cost: { type: Number },
    quantity: { type: Number, required: true },
    minQuantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        required: true
    },
    imageUrl: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

// Update status based on quantity before saving
ProductSchema.pre('save', async function (this: IProduct) {
    if (this.quantity <= 0) {
        this.status = 'Out of Stock';
    } else if (this.quantity <= this.minQuantity) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
