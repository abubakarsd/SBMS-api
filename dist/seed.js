"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("./models/userModel"));
const productModel_1 = __importDefault(require("./models/productModel"));
dotenv_1.default.config();
const seed = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        // Create Admin User
        const adminEmail = 'admin@sbms.com';
        const existingAdmin = await userModel_1.default.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = bcryptjs_1.default.hashSync('password123', 10);
            const adminUser = new userModel_1.default({
                email: adminEmail,
                password: hashedPassword,
                role: 'Admin',
                name: 'Admin User',
                store_id: 'store_1', // Mock store ID
            });
            await adminUser.save();
            console.log('Admin user created');
        }
        else {
            console.log('Admin user already exists');
        }
        // Seed some products if needed
        const productCount = await productModel_1.default.countDocuments();
        if (productCount === 0) {
            await productModel_1.default.insertMany([
                { name: 'Laptop', sku: 'LAP-001', category: 'Electronics', price: 1000, quantity: 10, minQuantity: 2, status: 'In Stock' },
                { name: 'Mouse', sku: 'ACC-001', category: 'Accessories', price: 20, quantity: 50, minQuantity: 5, status: 'In Stock' }
            ]);
            console.log('Products seeded');
        }
        console.log('Seeding completed');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seed();
