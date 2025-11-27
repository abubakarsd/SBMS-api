"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const repairController_1 = require("../controllers/repairController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateToken, repairController_1.getRepairs);
router.post('/', authMiddleware_1.authenticateToken, repairController_1.createRepair);
router.patch('/:id/status', authMiddleware_1.authenticateToken, repairController_1.updateStatus);
exports.default = router;
