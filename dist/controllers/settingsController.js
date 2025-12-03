"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const settingsModel_1 = __importDefault(require("../models/settingsModel"));
const getSettings = async (req, res) => {
    try {
        let settings = await settingsModel_1.default.findOne();
        if (!settings) {
            settings = new settingsModel_1.default();
            await settings.save();
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const { storeName, email, phone, address, currency, taxRate } = req.body;
        let settings = await settingsModel_1.default.findOne();
        if (!settings) {
            settings = new settingsModel_1.default({ storeName, email, phone, address, currency, taxRate });
        }
        else {
            settings.storeName = storeName;
            settings.email = email;
            settings.phone = phone;
            settings.address = address;
            settings.currency = currency;
            settings.taxRate = taxRate;
        }
        await settings.save();
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};
exports.updateSettings = updateSettings;
