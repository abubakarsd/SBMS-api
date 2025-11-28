import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import saleRoutes from './routes/saleRoutes';
import repairRoutes from './routes/repairRoutes';
import staffRoutes from './routes/staffRoutes';
import payrollRoutes from './routes/payrollRoutes';
import customerRoutes from './routes/customerRoutes';
import supplierRoutes from './routes/supplierRoutes';
import purchaseOrderRoutes from './routes/purchaseOrderRoutes';

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

app.get('/', (req, res) => {
    res.json({ message: 'SBMS API is running' });
});

export default app;
