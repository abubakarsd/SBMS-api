import multer from 'multer';
import { GridFSBucket, MongoClient } from 'mongodb';
import path from 'path';

let gfsBucket: GridFSBucket;

// Initialize GridFS bucket
export const initGridFS = (mongoUri: string) => {
    const client = new MongoClient(mongoUri);
    client.connect().then(() => {
        const db = client.db();
        gfsBucket = new GridFSBucket(db, {
            bucketName: 'productImages'
        });
        console.log('GridFS initialized');
    }).catch(err => {
        console.error('GridFS initialization error:', err);
    });
};

// Get GridFS bucket instance
export const getGridFSBucket = () => {
    if (!gfsBucket) {
        throw new Error('GridFS not initialized');
    }
    return gfsBucket;
};

// Multer storage configuration for GridFS
const storage = multer.memoryStorage(); // Store in memory temporarily

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});
