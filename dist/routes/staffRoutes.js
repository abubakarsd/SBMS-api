"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffController_1 = require("../controllers/staffController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateToken, staffController_1.getStaff);
router.post('/', authMiddleware_1.authenticateToken, staffController_1.addStaff);
router.put('/:id', authMiddleware_1.authenticateToken, staffController_1.updateStaff);
router.delete('/:id', authMiddleware_1.authenticateToken, staffController_1.deleteStaff);
exports.default = router;
