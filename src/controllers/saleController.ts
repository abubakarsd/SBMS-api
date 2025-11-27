import { Request, Response } from 'express';
import { createSale, getSales } from '../models/saleModel';

export const processSale = (req: Request, res: Response) => {
    try {
        // @ts-ignore - user is attached by middleware (need to add middleware types)
        const cashier_id = req.user?.id || 1;
        const saleId = createSale({ ...req.body, cashier_id });
        res.status(201).json({ message: 'Sale completed', saleId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error processing sale', error: error.message });
    }
};

export const getSalesHistory = (req: Request, res: Response) => {
    try {
        const sales = getSales();
        res.json(sales);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};
