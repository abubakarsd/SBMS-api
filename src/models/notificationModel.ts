import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    type: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    type: { type: String, required: true }, // 'info', 'warning', 'success', 'error'
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
