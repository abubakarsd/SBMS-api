import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};
