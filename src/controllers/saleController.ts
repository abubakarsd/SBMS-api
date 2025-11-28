import { Request, Response } from 'express';
import Sale from '../models/saleModel';
import Customer from '../models/customerModel';

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

        // Only create/update customer if phone is provided
        if (customerPhone) {
            // Try to find existing customer by phone
            customer = await Customer.findOne({ phone: customerPhone });

            if (customer) {
                // Update existing customer
                customer.name = finalCustomerName;
                customer.email = customerEmail || customer.email;
                customer.serviceType = customer.serviceType === 'Repair' ? 'Both' : 'Sale';
                customer.lastServiceDate = new Date();
                customer.totalPurchases += 1;
                await customer.save();
            } else {
                // Create new customer
                customer = new Customer({
                    name: finalCustomerName,
                    phone: customerPhone,
                    email: customerEmail,
                    serviceType: 'Sale',
                    serviceStatus: 'Completed',
                    lastServiceDate: new Date(),
                    totalPurchases: 1
                });
                await customer.save();
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
        res.status(500).json({ message: 'Error processing sale', error: error.message });
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
