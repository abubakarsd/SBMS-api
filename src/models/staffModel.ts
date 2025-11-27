import db from '../database/db';

export interface Employee {
    id?: number;
    user_id?: number;
    salary_type: string;
    base_salary: number;
    commission_rate: number;
    name?: string;
    role?: string;
    email?: string;
}

export const getAllEmployees = () => {
    const stmt = db.prepare(`
    SELECT e.*, u.name, u.email, u.role 
    FROM employees e 
    JOIN users u ON e.user_id = u.id
  `);
    return stmt.all();
};

export const createEmployee = (employee: Employee) => {
    // Note: User creation should happen before this and user_id passed here
    // For simplicity, we assume user exists or is created in a transaction in controller
    const { user_id, salary_type, base_salary, commission_rate } = employee;
    const stmt = db.prepare('INSERT INTO employees (user_id, salary_type, base_salary, commission_rate) VALUES (?, ?, ?, ?)');
    const info = stmt.run(user_id, salary_type, base_salary, commission_rate);
    return info.lastInsertRowid;
};
