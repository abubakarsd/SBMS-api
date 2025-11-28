import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    storeName: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    taxRate: number;
}

const SettingsSchema: Schema = new Schema({
    storeName: { type: String, required: true, default: 'My Store' },
    email: { type: String, required: true, default: 'store@example.com' },
    phone: { type: String, required: true, default: '123-456-7890' },
    address: { type: String, required: true, default: '123 Main St' },
    currency: { type: String, required: true, default: 'NGN' },
    taxRate: { type: Number, required: true, default: 0.1 }
});

export default mongoose.model<ISettings>('Settings', SettingsSchema);
