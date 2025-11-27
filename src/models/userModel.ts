import db from '../database/db';
import bcrypt from 'bcryptjs';

export interface User {
    id?: number;
    email: string;
    password?: string;
    role: string;
    name: string;
    store_id?: number;
}

export const createUser = (user: User) => {
    const { email, password, role, name, store_id } = user;
    const hashedPassword = bcrypt.hashSync(password!, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, role, name, store_id) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(email, hashedPassword, role, name, store_id);
    return info.lastInsertRowid;
};

export const findUserByEmail = (email: string) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
};

export const findUserById = (id: number) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
};
