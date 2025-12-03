import { Request, Response } from 'express';
import Sale from '../models/saleModel';
import Product from '../models/productModel';
import Staff from '../models/staffModel';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Get all sales
        const allSales = await Sale.find().populate('products.product');

        // Get all products
        const products = await Product.find();

        // Get all staff
        const staff = await Staff.find({ status: 'Active' });

        // Filter current month sales
        const currentMonthSales = allSales.filter((sale: any) => {
            const saleDate = new Date(sale.orderDate);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        });

        // Calculate current month revenue
        const currentMonthRevenue = currentMonthSales.reduce((sum: number, sale: any) => {
            const amountReceived = sale.paymentStatus === 'Paid'
                ? sale.total
                : sale.paymentStatus === 'Partial'
                    ? (sale.amountPaid || 0)
                    : 0;
            return sum + amountReceived;
        }, 0);

        // Calculate current month COGS
        let currentMonthCOGS = 0;
        currentMonthSales.forEach((sale: any) => {
            (sale.products || []).forEach((item: any) => {
                const product = products.find((p: any) => p._id.toString() === item.product.toString());
                if (product && product.cost) {
                    currentMonthCOGS += product.cost * item.quantity;
                }
            });
        });

        // Calculate monthly staff expenses
        const monthlyStaffExpenses = staff.reduce((sum: number, s: any) => sum + (s.salary || 0), 0);

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

            const monthSales = allSales.filter((sale: any) => {
                const saleDate = new Date(sale.orderDate);
                return saleDate.getMonth() === monthIdx && saleDate.getFullYear() === year;
            });

            const revenue = monthSales.reduce((sum: number, sale: any) => sum + sale.total, 0);

            let cogs = 0;
            monthSales.forEach((sale: any) => {
                (sale.products || []).forEach((item: any) => {
                    const product = products.find((p: any) => p._id.toString() === item.product.toString());
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
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};
