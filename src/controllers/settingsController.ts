import { Request, Response } from 'express';
import Settings from '../models/settingsModel';

export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const { storeName, email, phone, address, currency, taxRate } = req.body;
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings({ storeName, email, phone, address, currency, taxRate, engineerPercentage: req.body.engineerPercentage ?? 0 });
        } else {
            settings.storeName = storeName;
            settings.email = email;
            settings.phone = phone;
            settings.address = address;
            settings.currency = currency;
            settings.taxRate = taxRate;
            settings.engineerPercentage = req.body.engineerPercentage ?? 0;
        }

        await settings.save();
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};
