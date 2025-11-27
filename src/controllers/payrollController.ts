import { Request, Response } from 'express';
import { generatePayrollRun, getPayrollHistory } from '../models/payrollModel';

export const createPayroll = (req: Request, res: Response) => {
    try {
        const { periodStart, periodEnd } = req.body;
        const runId = generatePayrollRun(periodStart, periodEnd);
        res.status(201).json({ message: 'Payroll generated', runId });
    } catch (error: any) {
        res.status(500).json({ message: 'Error generating payroll', error: error.message });
    }
};

export const getPayroll = (req: Request, res: Response) => {
    try {
        const history = getPayrollHistory();
        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching payroll history', error: error.message });
    }
};
