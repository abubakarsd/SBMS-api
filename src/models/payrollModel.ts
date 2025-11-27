import db from '../database/db';

export const generatePayrollRun = (periodStart: string, periodEnd: string) => {
    // 1. Get all employees
    const employees = db.prepare('SELECT * FROM employees').all() as any[];

    // 2. Calculate payout for each employee
    const items = employees.map(emp => {
        let amount = emp.base_salary;
        const breakdown = { base: emp.base_salary, commission: 0 };

        // Calculate commission (Mock: 10% of random sales for now, real implementation would query sales table)
        if (emp.commission_rate > 0) {
            // TODO: Query actual sales by this user in the period
            const commission = 0; // Placeholder
            amount += commission;
            breakdown.commission = commission;
        }

        return {
            employee_id: emp.id,
            amount,
            breakdown: JSON.stringify(breakdown)
        };
    });

    const totalPayout = items.reduce((sum, item) => sum + item.amount, 0);

    // 3. Create Payroll Run
    const runInfo = db.prepare('INSERT INTO payroll_runs (period_start, period_end, total_payout) VALUES (?, ?, ?)')
        .run(periodStart, periodEnd, totalPayout);
    const runId = runInfo.lastInsertRowid;

    // 4. Create Payroll Items
    const itemStmt = db.prepare('INSERT INTO payroll_items (payroll_run_id, employee_id, amount, breakdown) VALUES (?, ?, ?, ?)');
    items.forEach(item => {
        itemStmt.run(runId, item.employee_id, item.amount, item.breakdown);
    });

    return runId;
};

export const getPayrollHistory = () => {
    return db.prepare('SELECT * FROM payroll_runs ORDER BY created_at DESC').all();
};
