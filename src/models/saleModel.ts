import db from '../database/db';

export interface SaleItem {
    product_id: number;
    quantity: number;
    price_at_sale: number;
}

export interface Sale {
    id?: number;
    cashier_id: number;
    total_amount: number;
    payment_method: string;
    customer_id?: number;
    items: SaleItem[];
}

export const createSale = (sale: Sale) => {
    const { cashier_id, total_amount, payment_method, customer_id, items } = sale;

    const insertSale = db.transaction(() => {
        const stmt = db.prepare('INSERT INTO sales (cashier_id, total_amount, payment_method, customer_id) VALUES (?, ?, ?, ?)');
        const info = stmt.run(cashier_id, total_amount, payment_method, customer_id);
        const saleId = info.lastInsertRowid as number;

        const itemStmt = db.prepare('INSERT INTO sale_items (sale_id, product_id, quantity, price_at_sale) VALUES (?, ?, ?, ?)');
        const updateStockStmt = db.prepare('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?');

        for (const item of items) {
            itemStmt.run(saleId, item.product_id, item.quantity, item.price_at_sale);
            updateStockStmt.run(item.quantity, item.product_id);
        }

        return saleId;
    });

    return insertSale();
};

export const getSales = () => {
    const stmt = db.prepare(`
    SELECT s.*, u.name as cashier_name 
    FROM sales s 
    LEFT JOIN users u ON s.cashier_id = u.id 
    ORDER BY s.timestamp DESC
  `);
    return stmt.all();
};
