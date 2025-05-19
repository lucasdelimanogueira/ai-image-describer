import express from 'express';
import upload from '../utils/multerConfig.js';
import { uploadFile } from '../controllers/uploadController.js';
import { getJobStatusHandler } from '../controllers/statusController.js';

const router = express.Router();

// POST /upload/image
router.post('/image', upload.single('file'), uploadFile);

// rota GET /upload/status/:jobId
router.get('/status/:jobId', getJobStatusHandler);

export default router;