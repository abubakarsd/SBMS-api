import { Request, Response } from 'express';
import Sale from '../models/saleModel';
import Customer from '../models/customerModel';
import Product from '../models/productModel';
import Notification from '../models/notificationModel';

export const processSale = async (req: Request, res: Response) => {
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

        // Create/update customer if name is provided (phone is optional)
        if (finalCustomerName && finalCustomerName !== 'Walk-in Customer') {
            if (customerPhone) {
                // If phone provided, use it as unique identifier
                customer = await Customer.findOne({ phone: customerPhone });

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
                } else {
                    // Create new customer with phone
                    customer = new Customer({
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
            } else {
                // No phone provided - try to find by name or create new
                customer = await Customer.findOne({ name: finalCustomerName, phone: { $exists: false } });

                if (customer) {
                    // Update existing customer without phone
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
                } else {
                    // Create new customer without phone
                    customer = new Customer({
                        name: finalCustomerName,
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
        }

        // Deduct inventory and check for low stock alerts
        if (saleData.products && Array.isArray(saleData.products)) {
            for (const item of saleData.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    // Deduct quantity
                    product.quantity -= item.quantity;

                    // Update status based on new quantity
                    if (product.quantity <= 0) {
                        product.status = 'Out of Stock';
                    } else if (product.quantity <= product.minQuantity) {
                        product.status = 'Low Stock';

                        // Create low stock notification
                        await Notification.create({
                            type: 'low_stock',
                            message: `${product.name} is running low. Current stock: ${product.quantity}, Alert level: ${product.minQuantity}`,
                            link: '/inventory',
                            isRead: false
                        });
                    } else {
                        product.status = 'In Stock';
                    }

                    await product.save();
                }
            }
        }

        // Create sale record
        const newSale = new Sale({
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
    } catch (error: any) {
        console.error('Sale processing error:', error);
        console.error('Request body:', JSON.stringify(req.body, null, 2));
        res.status(500).json({
            message: 'Error processing sale',
            error: error.message,
            details: error.stack
        });
    }
};

export const getSalesHistory = async (req: Request, res: Response) => {
    try {
        const sales = await Sale.find();
        res.json(sales);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};
