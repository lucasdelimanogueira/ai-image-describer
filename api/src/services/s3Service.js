import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import path from 'path';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  ...(process.env.NODE_ENV !== 'production' && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

const bucket = process.env.S3_BUCKET;

const mimeToExtension = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'application/pdf': '.pdf',
};

export const uploadToS3 = async (file) => {
  const ext = mimeToExtension[file.mimetype] || '';
  const key = `uploads/${Date.now()}-${randomUUID()}${ext}`;

  const params = {
    Bucket: bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.putObject(params).promise();

  return {
    key,
    url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
