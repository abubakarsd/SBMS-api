"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./database/db");
const upload_1 = require("./middleware/upload");
dotenv_1.default.config();
// Initialize Database
(0, db_1.initDB)();
// Initialize GridFS
const MONGO_URI = process.env.MONGO_URI || '';
(0, upload_1.initGridFS)(MONGO_URI);
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
