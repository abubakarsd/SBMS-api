"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePurchaseOrder = exports.updateStatus = exports.updatePurchaseOrder = exports.createPurchaseOrder = exports.getPurchaseOrders = void 0;
const purchaseOrderModel_1 = __importDefault(require("../models/purchaseOrderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const crypto_1 = __importDefault(require("crypto"));
const getPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await purchaseOrderModel_1.default.find()
            .populate('supplier', 'name')
            .populate('items.product', 'name sku')
            .sort({ orderDate: -1 });
        res.json(purchaseOrders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching purchase orders', error: error.message });
    }
};
exports.getPurchaseOrders = getPurchaseOrders;
const createPurchaseOrder = async (req, res) => {
    try {
        const poNumber = `PO-${Date.now().toString().slice(-6)}-${crypto_1.default.randomBytes(2).toString('hex').toUpperCase()}`;
        const newPO = new purchaseOrderModel_1.default({
            ...req.body,
            poNumber
        });
        await newPO.save();
        res.status(201).json(newPO);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating purchase order', error: error.message });
    }
};
exports.createPurchaseOrder = createPurchaseOrder;
const updatePurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPO = await purchaseOrderModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPO) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        res.json(updatedPO);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating purchase order', error: error.message });
    }
};
exports.updatePurchaseOrder = updatePurchaseOrder;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const po = await purchaseOrderModel_1.default.findById(id);
        if (!po) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        // If status is changing to 'Received' and it wasn't already received
        if (status === 'Received' && po.status !== 'Received') {
            // Update stock for each item
            // Update stock and cost for each item
            for (const item of po.items) {
                const product = await productModel_1.default.findById(item.product);
                if (product) {
                    const currentQty = product.quantity || 0;
                    const currentCost = product.cost || 0;
                    const newQty = item.quantity;
                    const newCost = item.unitCost;
                    // Calculate Weighted Average Cost
                    const totalValue = (currentQty * currentCost) + (newQty * newCost);
                    const totalQty = currentQty + newQty;
                    const weightedAvgCost = totalQty > 0 ? totalValue / totalQty : newCost;
                    product.quantity = totalQty;
                    product.cost = Math.round(weightedAvgCost * 100) / 100; // Round to 2 decimals
                    await product.save();
                }
            }
            po.receivedDate = new Date();
        }
        po.status = status;
        await po.save();
        res.json({ message: 'Status updated successfully', po });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
exports.updateStatus = updateStatus;
const deletePurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await purchaseOrderModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Purchase order deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting purchase order', error: error.message });
    }
};
exports.deletePurchaseOrder = deletePurchaseOrder;
