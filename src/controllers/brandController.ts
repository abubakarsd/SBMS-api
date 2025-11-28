import { Request, Response } from 'express';
import Brand from '../models/brandModel';

export const getBrands = async (req: Request, res: Response) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching brands', error: error.message });
    }
};

export const createBrand = async (req: Request, res: Response) => {
    try {
        const newBrand = new Brand(req.body);
        await newBrand.save();
        res.status(201).json({ message: 'Brand created', brand: newBrand });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Brand name already exists' });
        }
        res.status(500).json({ message: 'Error creating brand', error: error.message });
    }
};

export const updateBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ message: 'Brand updated', brand: updatedBrand });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating brand', error: error.message });
    }
};

export const deleteBrand = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBrand = await Brand.findByIdAndDelete(id);
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ message: 'Brand deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting brand', error: error.message });
    }
};
