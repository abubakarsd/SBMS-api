import { Request, Response } from 'express';
import PurchaseOrder from '../models/purchaseOrderModel';
import Product from '../models/productModel';
import crypto from 'crypto';

export const getPurchaseOrders = async (req: Request, res: Response) => {
    try {
        const purchaseOrders = await PurchaseOrder.find()
            .populate('supplier', 'name')
            .populate('items.product', 'name sku')
            .sort({ orderDate: -1 });
        res.json(purchaseOrders);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching purchase orders', error: error.message });
    }
};

export const createPurchaseOrder = async (req: Request, res: Response) => {
    try {
        const poNumber = `PO-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
        const newPO = new PurchaseOrder({
            ...req.body,
            poNumber
        });
        await newPO.save();
        res.status(201).json(newPO);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating purchase order', error: error.message });
    }
};

export const updatePurchaseOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedPO = await PurchaseOrder.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPO) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }
        res.json(updatedPO);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating purchase order', error: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const po = await PurchaseOrder.findById(id);
        if (!po) {
            return res.status(404).json({ message: 'Purchase order not found' });
        }

        // If status is changing to 'Received' and it wasn't already received
        if (status === 'Received' && po.status !== 'Received') {
            // Update stock for each item
            // Update stock and cost for each item
            for (const item of po.items) {
                const product = await Product.findById(item.product);
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
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

export const deletePurchaseOrder = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await PurchaseOrder.findByIdAndDelete(id);
        res.json({ message: 'Purchase order deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting purchase order', error: error.message });
    }
};
