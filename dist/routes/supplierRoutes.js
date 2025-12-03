"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplierController_1 = require("../controllers/supplierController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateToken, supplierController_1.getSuppliers);
router.post('/', authMiddleware_1.authenticateToken, supplierController_1.createSupplier);
router.put('/:id', authMiddleware_1.authenticateToken, supplierController_1.updateSupplier);
router.delete('/:id', authMiddleware_1.authenticateToken, supplierController_1.deleteSupplier);
exports.default = router;
