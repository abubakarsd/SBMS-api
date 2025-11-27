import db from '../database/db';

export interface RepairJob {
    id?: number;
    customer_id?: number;
    device_model: string;
    issue_description: string;
    status: string;
    assigned_tech_id?: number;
    estimated_cost?: number;
    notes?: string;
    created_at?: string;
}

export const createRepairJob = (job: RepairJob) => {
    const { customer_id, device_model, issue_description, status, assigned_tech_id, estimated_cost, notes } = job;
    const stmt = db.prepare(`
    INSERT INTO repair_jobs (customer_id, device_model, issue_description, status, assigned_tech_id, estimated_cost, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    const info = stmt.run(customer_id, device_model, issue_description, status, assigned_tech_id, estimated_cost, notes);
    return info.lastInsertRowid;
};

export const getRepairJobs = () => {
    const stmt = db.prepare(`
    SELECT r.*, u.name as tech_name, c.name as customer_name
    FROM repair_jobs r
    LEFT JOIN users u ON r.assigned_tech_id = u.id
    LEFT JOIN customers c ON r.customer_id = c.id
    ORDER BY r.created_at DESC
  `);
    return stmt.all();
};

export const updateRepairStatus = (id: number, status: string) => {
    const stmt = db.prepare('UPDATE repair_jobs SET status = ? WHERE id = ?');
    stmt.run(status, id);
};
