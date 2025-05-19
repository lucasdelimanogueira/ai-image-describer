import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_TABLE;

export const updateStatus = async (jobId, updates) => {
    const keys = Object.keys(updates);
    const updateExpression = 'SET ' + keys.map((key, idx) => `#key${idx} = :val${idx}`).join(', ');
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
  
    keys.forEach((key, idx) => {
      expressionAttributeNames[`#key${idx}`] = key;
      expressionAttributeValues[`:val${idx}`] = updates[key];
    });
  
    const params = {
      TableName: tableName,
      Key: { jobId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    };
  
    await docClient.send(new UpdateCommand(params));
  };
  