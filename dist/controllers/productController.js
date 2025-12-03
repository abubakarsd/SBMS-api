"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const upload_1 = require("../middleware/upload");
const stream_1 = require("stream");
const getProducts = async (req, res) => {
    try {
        const products = await productModel_1.default.find();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};
exports.getProducts = getProducts;
const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        // If image was uploaded, save to GridFS
        if (req.file) {
            const bucket = (0, upload_1.getGridFSBucket)();
            const filename = `${Date.now()}-${req.file.originalname}`;
            // Create readable stream from buffer
            const readableStream = new stream_1.Readable();
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
        const newProduct = new productModel_1.default(productData);
        await newProduct.save();
        res.status(201).json({ message: 'Product created', productId: newProduct._id, product: newProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // If new image was uploaded, save to GridFS
        if (req.file) {
            const bucket = (0, upload_1.getGridFSBucket)();
            const filename = `${Date.now()}-${req.file.originalname}`;
            // Create readable stream from buffer
            const readableStream = new stream_1.Readable();
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
        const updatedProduct = await productModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated', product: updatedProduct });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
