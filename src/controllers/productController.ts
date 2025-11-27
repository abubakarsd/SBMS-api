import { Request, Response } from 'express';
import { getAllProducts, createProduct } from '../models/productModel';

export const getProducts = (req: Request, res: Response) => {
    try {
        const products = getAllProducts();
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export const addProduct = (req: Request, res: Response) => {
    try {
        const productId = createProduct(req.body);
        res.status(201).json({ message: 'Product created', productId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
