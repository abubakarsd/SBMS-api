import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IRepair extends Document {
  bookingKey: string;
  customerName: string;
  phone: string;
  customerEmail?: string;
  customerId?: mongoose.Types.ObjectId;
  device: string;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Collected';
  cost: number;
  partCost: number;
  laborCost: number;
  discount: number;
  totalCost: number;
  engineerId?: mongoose.Types.ObjectId;
  engineerCommission: number;
  receivedDate: Date;
  expectedDate: Date;
  completedDate?: Date;
}

const RepairSchema: Schema = new Schema({
  bookingKey: {
    type: String,
    unique: true,
    default: () => `RK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  customerEmail: { type: String },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  device: { type: String, required: true },
  issue: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Collected'],
    default: 'Pending'
  },
  cost: { type: Number, required: true }, // Legacy field, kept for compatibility but effectively totalCost
  partCost: { type: Number, default: 0 },
  laborCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  engineerId: { type: Schema.Types.ObjectId, ref: 'User' },
  engineerCommission: { type: Number, default: 0 },
  receivedDate: { type: Date, default: Date.now },
  expectedDate: { type: Date, required: true },
  completedDate: { type: Date }
});

export default mongoose.model<IRepair>('Repair', RepairSchema);
