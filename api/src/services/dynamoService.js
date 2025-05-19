import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    ...(process.env.NODE_ENV !== 'production' && {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
});

const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE;

export const createJob = async (jobId, s3Key, status = 'PENDING') => {
  const params = {
    TableName: tableName,
    Item: {
      jobId,
      s3Key,
      status,
      createdAt: new Date().toISOString()
    }
  };

  await docClient.send(new PutCommand(params));
};

export const getJobStatus = async (jobId) => {
    const params = {
      TableName: tableName,
      Key: { jobId }
    };
  
    const { Item } = await docClient.send(new GetCommand(params));
    return Item;
};