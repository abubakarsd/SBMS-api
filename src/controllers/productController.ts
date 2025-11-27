import { Request, Response } from 'express';
import Product from '../models/productModel';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export const addProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product created', productId: newProduct._id });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
