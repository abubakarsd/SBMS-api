"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoles = void 0;
const roleModel_1 = __importDefault(require("../models/roleModel"));
const getRoles = async (req, res) => {
    try {
        const roles = await roleModel_1.default.find();
        res.json(roles);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};
exports.getRoles = getRoles;
const createRole = async (req, res) => {
    try {
        const newRole = new roleModel_1.default(req.body);
        await newRole.save();
        res.status(201).json({ message: 'Role created', role: newRole });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Role name already exists' });
        }
        res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRole = await roleModel_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json({ message: 'Role updated', role: updatedRole });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRole = await roleModel_1.default.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json({ message: 'Role deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};
exports.deleteRole = deleteRole;
