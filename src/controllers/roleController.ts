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

export const initRoles = async (req: Request, res: Response) => {
    try {
        const defaultRoles = [
            {
                name: 'Admin',
                permissions: ['*'],
                description: 'Full access to all system features'
            },
            {
                name: 'Manager',
                permissions: [
                    'manage_products',
                    'manage_sales',
                    'manage_orders',
                    'manage_customers',
                    'manage_suppliers',
                    'manage_users', // Updated from manage_staff
                    'manage_payroll',
                    'view_reports'
                ],
                description: 'Managerial access excluding global settings and dangerous deletions'
            },
            {
                name: 'Cashier',
                permissions: [
                    'manage_sales',
                    'manage_orders',
                    'manage_customers'
                ],
                description: 'Point of Sale and basic operational access'
            },
            {
                name: 'Technician',
                permissions: [
                    'manage_repairs',
                    'manage_sales'
                ],
                description: 'Access to repair module'
            }
        ];

        let created = 0;
        for (const role of defaultRoles) {
            const exists = await Role.findOne({ name: role.name });
            if (!exists) {
                await new Role(role).save();
                created++;
            }
        }

        res.json({ message: `Role initialization complete. Created ${created} new roles.` });
    } catch (error: any) {
        res.status(500).json({ message: 'Error initializing roles', error: error.message });
    }
};
