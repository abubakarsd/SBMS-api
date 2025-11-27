import db, { initDB } from './database/db';
import { createUser } from './models/userModel';

const seed = () => {
    initDB();

    // Create Store
    const storeStmt = db.prepare('INSERT INTO stores (name, currency, address) VALUES (?, ?, ?)');
    const storeInfo = storeStmt.run('Main Store', 'USD', '123 Tech Street');
    const storeId = storeInfo.lastInsertRowid as number;

    // Create Admin User
    try {
        createUser({
            email: 'admin@sbms.com',
            password: 'password123',
            role: 'ADMIN',
            name: 'Admin User',
            store_id: storeId,
        });
        console.log('Admin user created');
    } catch (e) {
        console.log('Admin user already exists');
    }

    // Create Categories
    const catStmt = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    catStmt.run('Laptops');
    catStmt.run('Accessories');
    catStmt.run('Services');

    console.log('Seeding completed');
};

seed();
