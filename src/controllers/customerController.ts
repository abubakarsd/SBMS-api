import { Request, Response } from 'express';
import Customer from '../models/customerModel';

export const getCustomers = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

export const addCustomer = async (req: Request, res: Response) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json({ message: 'Customer added', customer: newCustomer });
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding customer', error: error.message });
    }
};

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: 'Customer updated', customer: updatedCustomer });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

export const deleteCustomer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Customer.findByIdAndDelete(id);
        res.json({ message: 'Customer deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};
