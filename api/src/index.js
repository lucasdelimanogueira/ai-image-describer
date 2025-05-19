import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
} 

const app = express();

const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigin,
}));

app.use(express.json());

app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})