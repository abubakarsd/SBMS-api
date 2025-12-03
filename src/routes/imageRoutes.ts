import express, { Request, Response } from 'express';
import { getGridFSBucket } from '../middleware/upload';
import { Readable } from 'stream';

const router = express.Router();

// Get image by filename
router.get('/:filename', async (req: Request, res: Response) => {
    try {
        const bucket = getGridFSBucket();
        const filename = req.params.filename;

        // Find the file
        const files = await bucket.find({ filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Set content type
        const file = files[0] as any;
        const contentType = file.metadata?.contentType || 'image/jpeg';
        res.set('Content-Type', contentType);

        // Stream the file
        const downloadStream = bucket.openDownloadStreamByName(filename);
        downloadStream.pipe(res);

        downloadStream.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(404).json({ message: 'Error streaming image' });
        });
    } catch (error: any) {
        console.error('Image retrieval error:', error);
        res.status(500).json({ message: 'Error retrieving image', error: error.message });
    }
});

export default router;
