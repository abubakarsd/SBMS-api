import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
    name: string;
    permissions: string[];
    description?: string;
    createdAt: Date;
}

const RoleSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRole>('Role', RoleSchema);
