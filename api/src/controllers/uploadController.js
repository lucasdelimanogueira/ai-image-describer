import { uploadToS3 } from '../services/s3Service.js';
import { sendMessageToQueue } from '../services/sqsService.js';
import { v4 as uuidv4 } from 'uuid';
import { createJob } from '../services/dynamoService.js';


export const uploadFile = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
      // 1. upload to s3
      const { key, url } = await uploadToS3(req.file);
  
      // 2. create a unique job id
      const jobId = uuidv4();
  
      // 3. save status in dyanmodb
      await createJob(jobId, key);
  
      // 4. send message to queue to be further processed
      await sendMessageToQueue({
        jobId,
        s3Bucket: process.env.S3_BUCKET,
        s3Key: key
      });
  
      // 5. return job id and file url to frontend
      res.status(200).json({ message: 'File uploaded and job queued', jobId, key, url });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  };