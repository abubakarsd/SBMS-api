import db from '../database/db';

export interface Product {
    id?: number;
    name: string;
    sku?: string;
    image_url?: string;
    price: number;
    cost_price?: number;
    stock_quantity: number;
    category_id?: number;
    low_stock_threshold?: number;
}

export const getAllProducts = () => {
    const stmt = db.prepare('SELECT * FROM products');
    return stmt.all() as Product[];
};

export const createProduct = (product: Product) => {
    const { name, sku, image_url, price, cost_price, stock_quantity, category_id, low_stock_threshold } = product;
    const stmt = db.prepare(`
    INSERT INTO products (name, sku, image_url, price, cost_price, stock_quantity, category_id, low_stock_threshold)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
    const info = stmt.run(name, sku, image_url, price, cost_price, stock_quantity, category_id, low_stock_threshold);
    return info.lastInsertRowid;
};

export const updateProductStock = (id: number, quantity: number) => {
    const stmt = db.prepare('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?');
    stmt.run(quantity, id);
};
