"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brandController_1 = require("../controllers/brandController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateToken, brandController_1.getBrands);
router.post('/', authMiddleware_1.authenticateToken, brandController_1.createBrand);
router.put('/:id', authMiddleware_1.authenticateToken, brandController_1.updateBrand);
router.delete('/:id', authMiddleware_1.authenticateToken, brandController_1.deleteBrand);
exports.default = router;
