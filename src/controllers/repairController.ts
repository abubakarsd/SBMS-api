import { Request, Response } from 'express';
import Repair from '../models/repairModel';

export const getRepairs = async (req: Request, res: Response) => {
    try {
        const repairs = await Repair.find();
        res.json(repairs);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching repairs', error: error.message });
    }
};

export const createRepair = async (req: Request, res: Response) => {
    try {
        const newRepair = new Repair(req.body);
        await newRepair.save();
        res.status(201).json({ message: 'Repair job created', jobId: newRepair._id });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating repair job', error: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Repair.findByIdAndUpdate(id, { status });
        res.json({ message: 'Status updated' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
