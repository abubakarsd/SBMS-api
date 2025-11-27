import { Request, Response } from 'express';
import { createRepairJob, getRepairJobs, updateRepairStatus } from '../models/repairModel';

export const getRepairs = (req: Request, res: Response) => {
    try {
        const repairs = getRepairJobs();
        res.json(repairs);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching repairs', error: error.message });
    }
};

export const createRepair = (req: Request, res: Response) => {
    try {
        const jobId = createRepairJob(req.body);
        res.status(201).json({ message: 'Repair job created', jobId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating repair job', error: error.message });
    }
};

export const updateStatus = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        updateRepairStatus(Number(id), status);
        res.json({ message: 'Status updated' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
