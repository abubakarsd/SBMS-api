"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesHistory = exports.processSale = void 0;
const saleModel_1 = __importDefault(require("../models/saleModel"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const processSale = async (req, res) => {
    try {
        // @ts-ignore - user is attached by middleware
        const cashier_id = req.user?.id || 'system';
        // Extract customer info from request
        const { customerName, customerPhone, customerEmail, ...saleData } = req.body;
        // Use "Walk-in Customer" as default if no name provided
        const finalCustomerName = customerName && customerName.trim() !== ''
            ? customerName
            : 'Walk-in Customer';
        let customer = null;
        // Only create/update customer if phone is provided
        if (customerPhone) {
            // Try to find existing customer by phone
            customer = await customerModel_1.default.findOne({ phone: customerPhone });
            if (customer) {
                // Update existing customer
                customer.name = finalCustomerName;
                customer.email = customerEmail || customer.email;
                customer.serviceType = customer.serviceType === 'Repair' ? 'Both' : 'Sale';
                customer.lastServiceDate = new Date();
                customer.totalPurchases += 1;
                // Update credit balance if there is outstanding debt
                if (saleData.paymentStatus === 'Unpaid' || saleData.paymentStatus === 'Partial') {
                    const debt = saleData.amountDue || (saleData.total - (saleData.amountPaid || 0));
                    if (debt > 0) {
                        customer.creditBalance = (customer.creditBalance || 0) + debt;
                    }
                }
                await customer.save();
            }
            else {
                // Create new customer
                customer = new customerModel_1.default({
                    name: finalCustomerName,
                    phone: customerPhone,
                    email: customerEmail,
                    serviceType: 'Sale',
                    serviceStatus: 'Completed',
                    lastServiceDate: new Date(),
                    totalPurchases: 1,
                    creditBalance: (saleData.paymentStatus === 'Unpaid' || saleData.paymentStatus === 'Partial')
                        ? (saleData.amountDue || (saleData.total - (saleData.amountPaid || 0)))
                        : 0
                });
                await customer.save();
            }
        }
        // Create sale record
        const newSale = new saleModel_1.default({
            ...saleData,
            cashierId: cashier_id,
            customerName: finalCustomerName,
            customerId: customer?._id
        });
        await newSale.save();
        res.status(201).json({
            message: 'Sale completed',
            saleId: newSale._id,
            customerName: finalCustomerName,
            customerCreated: !!customer
        });
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
