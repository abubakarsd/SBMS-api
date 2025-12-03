"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel_1.default.find().sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await notificationModel_1.default.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};
exports.markAsRead = markAsRead;
