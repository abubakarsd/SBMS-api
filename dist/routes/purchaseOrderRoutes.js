"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseOrderController_1 = require("../controllers/purchaseOrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateToken, purchaseOrderController_1.getPurchaseOrders);
router.post('/', authMiddleware_1.authenticateToken, purchaseOrderController_1.createPurchaseOrder);
router.put('/:id', authMiddleware_1.authenticateToken, purchaseOrderController_1.updatePurchaseOrder);
router.patch('/:id/status', authMiddleware_1.authenticateToken, purchaseOrderController_1.updateStatus);
router.delete('/:id', authMiddleware_1.authenticateToken, purchaseOrderController_1.deletePurchaseOrder);
exports.default = router;
