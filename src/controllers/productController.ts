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
        const productData = req.body;

        // If image was uploaded, add the URL
        if (req.file) {
            productData.imageUrl = `/uploads/products/${req.file.filename}`;
        }

        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({ message: 'Product created', productId: newProduct._id, product: newProduct });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If new image was uploaded, update the URL
        if (req.file) {
            updateData.imageUrl = `/uploads/products/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated', product: updatedProduct });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
