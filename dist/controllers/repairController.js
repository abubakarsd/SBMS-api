"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createRepair = exports.getRepairs = void 0;
const repairModel_1 = __importDefault(require("../models/repairModel"));
const getRepairs = async (req, res) => {
    try {
        const repairs = await repairModel_1.default.find();
        res.json(repairs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching repairs', error: error.message });
    }
};
exports.getRepairs = getRepairs;
const createRepair = async (req, res) => {
    try {
        const newRepair = new repairModel_1.default(req.body);
        await newRepair.save();
        res.status(201).json({ message: 'Repair job created', jobId: newRepair._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating repair job', error: error.message });
    }
};
exports.createRepair = createRepair;
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await repairModel_1.default.findByIdAndUpdate(id, { status });
        res.json({ message: 'Status updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};
exports.updateStatus = updateStatus;
