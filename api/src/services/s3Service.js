import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const bucket = process.env.S3_BUCKET;

export const uploadToS3 = async (file) => {
    const key = `uploads/${Date.now()}-${randomUUID()}.pdf`;

    const params = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    await s3.putObject(params).promise();

    return {
        key,
        url: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };
};