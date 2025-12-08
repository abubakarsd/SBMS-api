import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Role from '../models/roleModel';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        // @ts-ignore
        req.user = user;
        next();
    });
};

export const checkPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // @ts-ignore
            const userRoleName = req.user?.role; // Role sent in token (e.g. from user.role)

            if (!userRoleName) {
                return res.status(403).json({ message: "Access denied. No role assigned." });
            }

            // Super Admin bypass (optional, but good for safety)
            if (userRoleName === 'Admin' || userRoleName === 'Super Admin') {
                return next();
            }

            const roleDoc = await Role.findOne({ name: userRoleName });

            if (!roleDoc) {
                return res.status(403).json({ message: `Access denied. Role '${userRoleName}' not found.` });
            }

            if (roleDoc.permissions.includes(requiredPermission) || roleDoc.permissions.includes('*')) {
                next();
            } else {
                return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action." });
            }
        } catch (error: any) {
            console.error("Permission check error:", error);
            res.status(500).json({ message: "Internal server error during permission check" });
        }
    };
};
