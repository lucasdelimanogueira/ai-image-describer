import { uploadToS3 } from '../services/s3Service.js';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { key, url } = await uploadToS3(req.file);

        res.status(200).json({ message: 'File uploaded', key, url });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to upload file' });
    }
}