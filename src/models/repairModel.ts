import mongoose, { Schema, Document } from 'mongoose';

export interface IRepair extends Document {
  customerName: string;
  device: string;
  issue: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Collected';
  cost: number;
  receivedDate: Date;
  completedDate?: Date;
}

const RepairSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  device: { type: String, required: true },
  issue: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Collected'],
    default: 'Pending'
  },
  cost: { type: Number, required: true },
  receivedDate: { type: Date, default: Date.now },
  completedDate: { type: Date }
});

export default mongoose.model<IRepair>('Repair', RepairSchema);
