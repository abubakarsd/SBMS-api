import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import saleRoutes from './routes/saleRoutes';
import repairRoutes from './routes/repairRoutes';
import staffRoutes from './routes/staffRoutes';
import payrollRoutes from './routes/payrollRoutes';
import customerRoutes from './routes/customerRoutes';
import supplierRoutes from './routes/supplierRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';
import settingsRoutes from './routes/settingsRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import brandRoutes from './routes/brandRoutes';
import roleRoutes from './routes/roleRoutes';
import imageRoutes from './routes/imageRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/repairs', repairRoutes);
app.use('/staff', staffRoutes);
app.use('/payroll', payrollRoutes);
app.use('/customers', customerRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/purchase-orders', purchaseOrderRoutes);
app.use('/settings', settingsRoutes);
app.use('/notifications', notificationRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/roles', roleRoutes);
app.use('/images', imageRoutes);
app.use('/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'SBMS API is running' });
});

export default app;
