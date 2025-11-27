import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel';
import Product from './models/productModel';
import Customer from './models/customerModel';
import Staff from './models/staffModel';
import Sale from './models/saleModel';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await User.deleteMany({});
        // await Product.deleteMany({});
        // await Customer.deleteMany({});
        // await Staff.deleteMany({});
        // await Sale.deleteMany({});

        // Create Admin User
        const adminEmail = 'admin@sbms.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = bcrypt.hashSync('password123', 10);
            const adminUser = new User({
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin',
                name: 'Admin User',
                store_id: 'store_1',
            });
            await adminUser.save();
            console.log('Admin user created');
        }

        // Seed Products (50+ items)
        const productCount = await Product.countDocuments();
        if (productCount < 50) {
            const products = [
                // Phones
                { name: 'iPhone 15 Pro Max', sku: 'PHONE-001', category: 'Phones', price: 650000, quantity: 12, minQuantity: 3 },
                { name: 'iPhone 15 Pro', sku: 'PHONE-002', category: 'Phones', price: 580000, quantity: 15, minQuantity: 3 },
                { name: 'iPhone 14 Pro', sku: 'PHONE-003', category: 'Phones', price: 480000, quantity: 20, minQuantity: 5 },
                { name: 'iPhone 13', sku: 'PHONE-004', category: 'Phones', price: 380000, quantity: 25, minQuantity: 5 },
                { name: 'Samsung S24 Ultra', sku: 'PHONE-005', category: 'Phones', price: 620000, quantity: 10, minQuantity: 3 },
                { name: 'Samsung S23', sku: 'PHONE-006', category: 'Phones', price: 450000, quantity: 18, minQuantity: 4 },
                { name: 'Google Pixel 8 Pro', sku: 'PHONE-007', category: 'Phones', price: 520000, quantity: 8, minQuantity: 2 },
                { name: 'OnePlus 12', sku: 'PHONE-008', category: 'Phones', price: 380000, quantity: 15, minQuantity: 3 },

                // Laptops
                { name: 'MacBook Pro 16"', sku: 'LAPTOP-001', category: 'Laptops', price: 1200000, quantity: 5, minQuantity: 2 },
                { name: 'MacBook Air M2', sku: 'LAPTOP-002', category: 'Laptops', price: 750000, quantity: 8, minQuantity: 2 },
                { name: 'Dell XPS 15', sku: 'LAPTOP-003', category: 'Laptops', price: 850000, quantity: 6, minQuantity: 2 },
                { name: 'HP Pavilion', sku: 'LAPTOP-004', category: 'Laptops', price: 420000, quantity: 12, minQuantity: 3 },
                { name: 'Lenovo ThinkPad', sku: 'LAPTOP-005', category: 'Laptops', price: 680000, quantity: 7, minQuantity: 2 },
                { name: 'ASUS ROG Gaming', sku: 'LAPTOP-006', category: 'Laptops', price: 950000, quantity: 4, minQuantity: 1 },

                // Accessories
                { name: 'AirPods Pro 2', sku: 'ACC-001', category: 'Accessories', price: 135000, quantity: 30, minQuantity: 10 },
                { name: 'AirPods 3', sku: 'ACC-002', category: 'Accessories', price: 95000, quantity: 40, minQuantity: 15 },
                { name: 'Samsung Buds Pro', sku: 'ACC-003', category: 'Accessories', price: 85000, quantity: 25, minQuantity: 10 },
                { name: 'Magic Mouse', sku: 'ACC-004', category: 'Accessories', price: 45000, quantity: 20, minQuantity: 8 },
                { name: 'Logitech MX Master', sku: 'ACC-005', category: 'Accessories', price: 52000, quantity: 15, minQuantity: 5 },
                { name: 'USB-C Cable', sku: 'ACC-006', category: 'Accessories', price: 3500, quantity: 100, minQuantity: 30 },
                { name: 'Lightning Cable', sku: 'ACC-007', category: 'Accessories', price: 3000, quantity: 120, minQuantity: 40 },
                { name: 'Phone Case (iPhone)', sku: 'ACC-008', category: 'Accessories', price: 8500, quantity: 80, minQuantity: 25 },
                { name: 'Screen Protector', sku: 'ACC-009', category: 'Accessories', price: 2500, quantity: 150, minQuantity: 50 },
                { name: 'Power Bank 20000mAh', sku: 'ACC-010', category: 'Accessories', price: 18000, quantity: 35, minQuantity: 10 },
                { name: 'Wireless Charger', sku: 'ACC-011', category: 'Accessories', price: 12000, quantity: 45, minQuantity: 15 },
                { name: 'USB-C Hub', sku: 'ACC-012', category: 'Accessories', price: 25000, quantity: 20, minQuantity: 8 },
                { name: 'Laptop Sleeve', sku: 'ACC-013', category: 'Accessories', price: 15000, quantity: 30, minQuantity: 10 },
                { name: 'Bluetooth Speaker', sku: 'ACC-014', category: 'Accessories', price: 35000, quantity: 18, minQuantity: 6 },
                { name: 'Webcam HD', sku: 'ACC-015', category: 'Accessories', price: 28000, quantity: 12, minQuantity: 4 },

                // Spare Parts
                { name: 'iPhone 14 Screen', sku: 'PART-001', category: 'Spare Parts', price: 85000, quantity: 15, minQuantity: 5 },
                { name: 'iPhone 13 Screen', sku: 'PART-002', category: 'Spare Parts', price: 75000, quantity: 20, minQuantity: 8 },
                { name: 'iPhone Battery', sku: 'PART-003', category: 'Spare Parts', price: 25000, quantity: 30, minQuantity: 10 },
                { name: 'Samsung Screen', sku: 'PART-004', category: 'Spare Parts', price: 65000, quantity: 12, minQuantity: 5 },
                { name: 'Laptop Battery', sku: 'PART-005', category: 'Spare Parts', price: 45000, quantity: 10, minQuantity: 3 },
                { name: 'Laptop Keyboard', sku: 'PART-006', category: 'Spare Parts', price: 35000, quantity: 8, minQuantity: 3 },
                { name: 'Phone Charging Port', sku: 'PART-007', category: 'Spare Parts', price: 15000, quantity: 25, minQuantity: 10 },
                { name: 'Camera Module', sku: 'PART-008', category: 'Spare Parts', price: 40000, quantity: 10, minQuantity: 4 },

                // Tablets
                { name: 'iPad Pro 12.9"', sku: 'TABLET-001', category: 'Tablets', price: 580000, quantity: 6, minQuantity: 2 },
                { name: 'iPad Air', sku: 'TABLET-002', category: 'Tablets', price: 350000, quantity: 10, minQuantity: 3 },
                { name: 'iPad Mini', sku: 'TABLET-003', category: 'Tablets', price: 280000, quantity: 8, minQuantity: 2 },
                { name: 'Samsung Tab S9', sku: 'TABLET-004', category: 'Tablets', price: 420000, quantity: 7, minQuantity: 2 },

                // Chargers
                { name: 'MacBook Charger 96W', sku: 'CHARGER-001', category: 'Accessories', price: 48000, quantity: 15, minQuantity: 5 },
                { name: 'iPhone Fast Charger', sku: 'CHARGER-002', category: 'Accessories', price: 18000, quantity: 40, minQuantity: 15 },
                { name: 'Samsung Fast Charger', sku: 'CHARGER-003', category: 'Accessories', price: 15000, quantity: 35, minQuantity: 12 },
                { name: 'Universal Adapter', sku: 'CHARGER-004', category: 'Accessories', price: 22000, quantity: 25, minQuantity: 10 },

                // Watches
                { name: 'Apple Watch Series 9', sku: 'WATCH-001', category: 'Wearables', price: 220000, quantity: 8, minQuantity: 2 },
                { name: 'Apple Watch SE', sku: 'WATCH-002', category: 'Wearables', price: 150000, quantity: 12, minQuantity: 3 },
                { name: 'Samsung Galaxy Watch', sku: 'WATCH-003', category: 'Wearables', price: 180000, quantity: 6, minQuantity: 2 },

                // Storage
                { name: 'SSD 1TB External', sku: 'STORAGE-001', category: 'Storage', price: 75000, quantity: 10, minQuantity: 3 },
                { name: 'Flash Drive 128GB', sku: 'STORAGE-002', category: 'Storage', price: 12000, quantity: 50, minQuantity: 15 },
                { name: 'Memory Card 256GB', sku: 'STORAGE-003', category: 'Storage', price: 18000, quantity: 40, minQuantity: 12 },
            ];

            await Product.insertMany(products);
            console.log(`${products.length} products seeded`);
        }

        // Seed Customers
        const customerCount = await Customer.countDocuments();
        if (customerCount < 20) {
            const customers = [
                { name: 'John Doe', email: 'john@example.com', phone: '08012345678', totalPurchases: 450000 },
                { name: 'Sarah Smith', email: 'sarah@example.com', phone: '08023456789', totalPurchases: 280000 },
                { name: 'Mike Johnson', email: 'mike@example.com', phone: '08034567890', totalPurchases: 850000 },
                { name: 'Emma Wilson', email: 'emma@example.com', phone: '08045678901', totalPurchases: 320000 },
                { name: 'David Brown', email: 'david@example.com', phone: '08056789012', totalPurchases: 590000 },
                { name: 'Lisa Anderson', email: 'lisa@example.com', phone: '08067890123', totalPurchases: 420000 },
                { name: 'James Taylor', email: 'james@example.com', phone: '08078901234', totalPurchases: 680000 },
                { name: 'Maria Garcia', email: 'maria@example.com', phone: '08089012345', totalPurchases: 350000 },
                { name: 'Robert Martinez', email: 'robert@example.com', phone: '08090123456', totalPurchases: 520000 },
                { name: 'Jennifer Lee', email: 'jennifer@example.com', phone: '08101234567', totalPurchases: 290000 },
                { name: 'Michael Chen', email: 'michael@example.com', phone: '08112345678', totalPurchases: 750000 },
                { name: 'Amanda White', email: 'amanda@example.com', phone: '08123456789', totalPurchases: 410000 },
                { name: 'Daniel Kim', email: 'daniel@example.com', phone: '08134567890', totalPurchases: 630000 },
                { name: 'Jessica Park', email: 'jessica@example.com', phone: '08145678901', totalPurchases: 380000 },
                { name: 'Christopher Wong', email: 'chris@example.com', phone: '08156789012', totalPurchases: 490000 },
                { name: 'Ashley Davis', email: 'ashley@example.com', phone: '08167890123', totalPurchases: 560000 },
                { name: 'Matthew Miller', email: 'matthew@example.com', phone: '08178901234', totalPurchases: 720000 },
                { name: 'Stephanie Moore', email: 'stephanie@example.com', phone: '08189012345', totalPurchases: 340000 },
                { name: 'Andrew Jackson', email: 'andrew@example.com', phone: '08190123456', totalPurchases: 610000 },
                { name: 'Nicole Thomas', email: 'nicole@example.com', phone: '08201234567', totalPurchases: 450000 },
            ];

            await Customer.insertMany(customers);
            console.log(`${customers.length} customers seeded`);
        }

        // Seed Staff
        const staffCount = await Staff.countDocuments();
        if (staffCount < 10) {
            const staff = [
                { name: 'Alice Manager', email: 'alice@sbms.com', phone: '08011111111', role: 'Manager', salary: 250000, paymentSchedule: 'Monthly', status: 'Active', hireDate: new Date('2023-01-15') },
                { name: 'Bob Cashier', email: 'bob@sbms.com', phone: '08022222222', role: 'Cashier', salary: 120000, paymentSchedule: 'Monthly', status: 'Active', hireDate: new Date('2023-03-20') },
                { name: 'Carol Engineer', email: 'carol@sbms.com', phone: '08033333333', role: 'Engineer', salary: 180000, paymentSchedule: 'Monthly', status: 'Active', hireDate: new Date('2023-02-10') },
                { name: 'Dave Sales', email: 'dave@sbms.com', phone: '08044444444', role: 'Sales', salary: 150000, paymentSchedule: 'Monthly', status: 'Active', hireDate: new Date('2023-04-05') },
                { name: 'Eve Support', email: 'eve@sbms.com', phone: '08055555555', role: 'Support', salary: 130000, paymentSchedule: 'Monthly', status: 'Active', hireDate: new Date('2023-05-12') },
            ];

            await Staff.insertMany(staff);
            console.log(`${staff.length} staff members seeded`);
        }

        // Seed Sales (for last 7 days)
        const salesCount = await Sale.countDocuments();
        if (salesCount < 20) {
            const today = new Date();
            const sales = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                // 3-5 sales per day
                const dailySales = Math.floor(Math.random() * 3) + 3;
                for (let j = 0; j < dailySales; j++) {
                    sales.push({
                        orderNumber: `ORD-${Date.now()}-${i}-${j}`,
                        customer: `Customer ${i * 10 + j}`,
                        orderDate: date.toISOString(),
                        items: Math.floor(Math.random() * 5) + 1,
                        total: Math.floor(Math.random() * 500000) + 50000,
                        status: 'Completed',
                        paymentStatus: Math.random() > 0.2 ? 'Paid' : 'Unpaid',
                        cashierId: 'cashier_1'
                    });
                }
            }

            await Sale.insertMany(sales);
            console.log(`${sales.length} sales seeded`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
