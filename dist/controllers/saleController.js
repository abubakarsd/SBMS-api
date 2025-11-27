"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesHistory = exports.processSale = void 0;
const saleModel_1 = __importDefault(require("../models/saleModel"));
const processSale = async (req, res) => {
    try {
        // @ts-ignore - user is attached by middleware (need to add middleware types)
        const cashier_id = req.user?.id || 'system';
        const newSale = new saleModel_1.default({ ...req.body, cashierId: cashier_id });
        await newSale.save();
        res.status(201).json({ message: 'Sale completed', saleId: newSale._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing sale', error: error.message });
    }
};
exports.processSale = processSale;
const getSalesHistory = async (req, res) => {
    try {
        const sales = await saleModel_1.default.find();
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};
exports.getSalesHistory = getSalesHistory;
