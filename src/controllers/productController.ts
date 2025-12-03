import { Request, Response } from 'express';
import Product from '../models/productModel';
import { getGridFSBucket } from '../middleware/upload';
import { Readable } from 'stream';

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

        // If image was uploaded, save to GridFS
        if (req.file) {
            const bucket = getGridFSBucket();
            const filename = `${Date.now()}-${req.file.originalname}`;

            // Create readable stream from buffer
            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);

            // Upload to GridFS
            const uploadStream = bucket.openUploadStream(filename, {
                metadata: { contentType: req.file.mimetype }
            });

            await new Promise((resolve, reject) => {
                readableStream.pipe(uploadStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });

            productData.imageUrl = `/images/${filename}`;
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

        // If new image was uploaded, save to GridFS
        if (req.file) {
            const bucket = getGridFSBucket();
            const filename = `${Date.now()}-${req.file.originalname}`;

            // Create readable stream from buffer
            const readableStream = new Readable();
            readableStream.push(req.file.buffer);
            readableStream.push(null);

            // Upload to GridFS
            const uploadStream = bucket.openUploadStream(filename, {
                metadata: { contentType: req.file.mimetype }
            });

            await new Promise((resolve, reject) => {
                readableStream.pipe(uploadStream)
                    .on('finish', resolve)
                    .on('error', reject);
            });

            updateData.imageUrl = `/images/${filename}`;
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
