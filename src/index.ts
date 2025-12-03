import app from './app';
import dotenv from 'dotenv';
import { initDB } from './database/db';
import { initGridFS } from './middleware/upload';

dotenv.config();

// Initialize Database
initDB();

// Initialize GridFS
const MONGO_URI = process.env.MONGO_URI || '';
initGridFS(MONGO_URI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
