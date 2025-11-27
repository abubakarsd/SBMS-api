"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saleController_1 = require("../controllers/saleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticateToken, saleController_1.processSale);
router.get('/', authMiddleware_1.authenticateToken, saleController_1.getSalesHistory);
exports.default = router;
