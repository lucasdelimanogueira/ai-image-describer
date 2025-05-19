import { describeImage } from '../vision/openai.js';
import { updateStatus } from '../utils/dynamoService.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const processImageHandler = async ({ s3Bucket, s3Key, jobId }) => {
  try {
    await updateStatus(jobId, { status: 'PROCESSING' });

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: s3Bucket,
        Key: s3Key
      }),
      { expiresIn: 900 }
    );

    console.log('Calling describeImage with URL:', signedUrl);
    const description = await describeImage(signedUrl);
    console.log('Received description:', description);

    await updateStatus(jobId, {
      status: 'COMPLETED',
      description,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in processImageHandler:', error);
    await updateStatus(jobId, {
      status: 'FAILED',
      processedAt: new Date().toISOString()
    });
  }
};
