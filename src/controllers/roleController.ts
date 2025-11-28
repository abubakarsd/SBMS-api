import { Request, Response } from 'express';
import Role from '../models/roleModel';

export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json({ message: 'Role created', role: newRole });
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Role name already exists' });
        }
        res.status(500).json({ message: 'Error creating role', error: error.message });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedRole = await Role.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json({ message: 'Role updated', role: updatedRole });
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedRole = await Role.findByIdAndDelete(id);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json({ message: 'Role deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting role', error: error.message });
    }
};
