"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const saleModel_1 = __importDefault(require("../models/saleModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const staffModel_1 = __importDefault(require("../models/staffModel"));
const getAnalytics = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        // Get all sales
        const allSales = await saleModel_1.default.find().populate('products.product');
        // Get all products
        const products = await productModel_1.default.find();
        // Get all staff
        const staff = await staffModel_1.default.find({ status: 'Active' });
        // Filter current month sales
        const currentMonthSales = allSales.filter((sale) => {
            const saleDate = new Date(sale.orderDate);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        });
        // Calculate current month revenue
        const currentMonthRevenue = currentMonthSales.reduce((sum, sale) => {
            const amountReceived = sale.paymentStatus === 'Paid'
                ? sale.total
                : sale.paymentStatus === 'Partial'
                    ? (sale.amountPaid || 0)
                    : 0;
            return sum + amountReceived;
        }, 0);
        // Calculate current month COGS
        let currentMonthCOGS = 0;
        currentMonthSales.forEach((sale) => {
            (sale.products || []).forEach((item) => {
                const product = products.find((p) => p._id.toString() === item.product.toString());
                if (product && product.cost) {
                    currentMonthCOGS += product.cost * item.quantity;
                }
            });
        });
        // Calculate monthly staff expenses
        const monthlyStaffExpenses = staff.reduce((sum, s) => sum + (s.salary || 0), 0);
        // Calculate profits
        const currentMonthGrossProfit = currentMonthRevenue - currentMonthCOGS;
        const currentMonthNetProfit = currentMonthGrossProfit - monthlyStaffExpenses;
        // Get last 6 months data
        const last6MonthsData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const monthIdx = d.getMonth();
            const year = d.getFullYear();
            const monthSales = allSales.filter((sale) => {
                const saleDate = new Date(sale.orderDate);
                return saleDate.getMonth() === monthIdx && saleDate.getFullYear() === year;
            });
            const revenue = monthSales.reduce((sum, sale) => sum + sale.total, 0);
            let cogs = 0;
            monthSales.forEach((sale) => {
                (sale.products || []).forEach((item) => {
                    const product = products.find((p) => p._id.toString() === item.product.toString());
                    if (product && product.cost) {
                        cogs += product.cost * item.quantity;
                    }
                });
            });
            const profit = revenue - cogs - monthlyStaffExpenses;
            last6MonthsData.push({
                name: monthName,
                revenue,
                profit,
                expenses: monthlyStaffExpenses
            });
        }
        res.json({
            currentMonth: {
                revenue: currentMonthRevenue,
                cogs: currentMonthCOGS,
                grossProfit: currentMonthGrossProfit,
                staffExpenses: monthlyStaffExpenses,
                netProfit: currentMonthNetProfit
            },
            chartData: last6MonthsData,
            costBreakdown: {
                cogs: currentMonthCOGS,
                staff: monthlyStaffExpenses,
                profit: Math.max(0, currentMonthNetProfit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};
exports.getAnalytics = getAnalytics;
