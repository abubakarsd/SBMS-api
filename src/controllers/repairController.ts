import { Request, Response } from 'express';
import Repair from '../models/repairModel';

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
        const newRepair = new Repair(req.body);
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
