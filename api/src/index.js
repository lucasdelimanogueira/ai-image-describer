import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}  

const app = express();
app.use(express.json());

app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
})