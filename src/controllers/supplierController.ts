import { Request, Response } from 'express';
import Supplier from '../models/supplierModel';

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.json(suppliers);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
};

export const createSupplier = async (req: Request, res: Response) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating supplier', error: error.message });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(updatedSupplier);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Supplier.findByIdAndDelete(id);
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
};
