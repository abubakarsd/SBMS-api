"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.getGridFSBucket = exports.initGridFS = void 0;
const multer_1 = __importDefault(require("multer"));
const mongodb_1 = require("mongodb");
const path_1 = __importDefault(require("path"));
let gfsBucket;
// Initialize GridFS bucket
const initGridFS = (mongoUri) => {
    const client = new mongodb_1.MongoClient(mongoUri);
    client.connect().then(() => {
        const db = client.db();
        gfsBucket = new mongodb_1.GridFSBucket(db, {
            bucketName: 'productImages'
        });
        console.log('GridFS initialized');
    }).catch(err => {
        console.error('GridFS initialization error:', err);
    });
};
exports.initGridFS = initGridFS;
// Get GridFS bucket instance
const getGridFSBucket = () => {
    if (!gfsBucket) {
        throw new Error('GridFS not initialized');
    }
    return gfsBucket;
};
exports.getGridFSBucket = getGridFSBucket;
// Multer storage configuration for GridFS
const storage = multer_1.default.memoryStorage(); // Store in memory temporarily
// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
