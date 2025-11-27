import app from './app';
import dotenv from 'dotenv';
import { initDB } from './database/db';

dotenv.config();

// Initialize Database
initDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
