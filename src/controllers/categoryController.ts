import { Request, Response } from 'express';
import Category from '../models/categoryModel';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ message: 'Category created', category: newCategory });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
        }
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated', category: updatedCategory });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};
