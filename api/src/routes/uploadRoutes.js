import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// POST /upload/pdf
router.post('/pdf', upload.single('file'), uploadFile);

export default router;