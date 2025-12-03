"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Get image by filename
router.get('/:filename', async (req, res) => {
    try {
        const bucket = (0, upload_1.getGridFSBucket)();
        const filename = req.params.filename;
        // Find the file
        const files = await bucket.find({ filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }
        // Set content type
        const file = files[0];
        const contentType = file.metadata?.contentType || 'image/jpeg';
        res.set('Content-Type', contentType);
        // Stream the file
        const downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);
        downloadStream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(404).json({ message: 'Error streaming image' });
        });
    }
    catch (error) {
        console.error('Image retrieval error:', error);
        res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
});
exports.default = router;
