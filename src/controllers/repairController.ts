import { Request, Response } from 'express';
import Repair from '../models/repairModel';
import Customer from '../models/customerModel';
import Settings from '../models/settingsModel';

export const getRepairs = async (req: Request, res: Response) => {
    try {
        const repairs = await Repair.find().sort({ receivedDate: -1 });
        res.json(repairs);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching repairs', error: error.message });
    }
};

export const getRepairByKey = async (req: Request, res: Response) => {
    try {
        const { bookingKey } = req.params;
        const repair = await Repair.findOne({ bookingKey });
        if (!repair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json(repair);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching repair', error: error.message });
    }
};

export const createRepair = async (req: Request, res: Response) => {
    try {
        const { customerName, phone, customerEmail, ...repairData } = req.body;

        let customer = null;

        // Create or update customer for repair
        if (phone) {
            customer = await Customer.findOne({ phone });

            if (customer) {
                // Update existing customer
                customer.name = customerName || customer.name;
                customer.email = customerEmail || customer.email;
                customer.serviceType = customer.serviceType === 'Sale' ? 'Both' : 'Repair';
                customer.serviceStatus = 'Pending';
                customer.lastServiceDate = new Date();
                await customer.save();
            } else {
                // Create new customer
                customer = new Customer({
                    name: customerName,
                    phone,
                    email: customerEmail,
                    serviceType: 'Repair',
                    serviceStatus: 'Pending',
                    lastServiceDate: new Date()
                });
                await customer.save();
            }
        }

        // Calculate costs
        const { partCost = 0, laborCost = 0, discount = 0 } = repairData;
        const totalCost = (Number(partCost) + Number(laborCost)) - Number(discount);

        // Auto-assign engineer from logged-in user
        // @ts-ignore - user is attached by middleware
        const engineerId = req.user?.id;

        // Calculate commission
        let engineerCommission = 0;
        if (engineerId) {
            const settings = await Settings.findOne();
            const percentage = settings?.engineerPercentage || 0;
            engineerCommission = Number(laborCost) * (percentage / 100);
        }

        // Create repair record
        const newRepair = new Repair({
            ...repairData,
            customerName,
            phone,
            customerEmail,
            customerId: customer?._id,
            cost: totalCost, // Legacy field
            totalCost,
            engineerId, // Set the authenticated user as engineer
            engineerCommission
        });
        await newRepair.save();

        res.status(201).json({
            message: 'Repair booking created successfully',
            bookingKey: newRepair.bookingKey,
            repair: newRepair
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating repair booking', error: error.message });
    }
};

export const updateRepair = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedRepair = await Repair.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }
        res.json({ message: 'Repair updated successfully', repair: updatedRepair });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating repair', error: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, completedDate } = req.body;
        const update: any = { status };
        if (status === 'Completed' && completedDate) {
            update.completedDate = completedDate;
        }
        const updatedRepair = await Repair.findByIdAndUpdate(id, update, { new: true });
        res.json({ message: 'Status updated successfully', repair: updatedRepair });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

export const deleteRepair = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Repair.findByIdAndDelete(id);
        res.json({ message: 'Repair deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting repair', error: error.message });
    }
};
