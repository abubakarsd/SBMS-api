import { Request, Response } from 'express';
import Sale from '../models/saleModel';

export const processSale = async (req: Request, res: Response) => {
    try {
        // @ts-ignore - user is attached by middleware (need to add middleware types)
        const cashier_id = req.user?.id || 'system';
        const newSale = new Sale({ ...req.body, cashierId: cashier_id });
        await newSale.save();
        res.status(201).json({ message: 'Sale completed', saleId: newSale._id });
    } catch (error: any) {
        res.status(500).json({ message: 'Error processing sale', error: error.message });
    }
};

export const getSalesHistory = async (req: Request, res: Response) => {
    try {
        const sales = await Sale.find();
        res.json(sales);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};
