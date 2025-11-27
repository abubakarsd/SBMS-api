"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
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
        const newProduct = new productModel_1.default(req.body);
        await newProduct.save();
        res.status(201).json({ message: 'Product created', productId: newProduct._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};
exports.addProduct = addProduct;
