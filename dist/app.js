"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
const repairRoutes_1 = __importDefault(require("./routes/repairRoutes"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
const payrollRoutes_1 = __importDefault(require("./routes/payrollRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/products', productRoutes_1.default);
app.use('/sales', saleRoutes_1.default);
app.use('/repairs', repairRoutes_1.default);
app.use('/staff', staffRoutes_1.default);
app.use('/payroll', payrollRoutes_1.default);
app.use('/customers', customerRoutes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'SBMS API is running' });
});
exports.default = app;
