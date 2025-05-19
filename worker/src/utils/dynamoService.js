import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const tableName = process.env.DYNAMODB_TABLE;

export const updateStatus = async (jobId, updates) => {
  const params = {
    TableName: tableName,
    Key: { jobId },
    UpdateExpression: 'set #st = :s, extractedText = :text, processedAt = :p',
    ExpressionAttributeNames: {
      '#st': 'status'
    },
    ExpressionAttributeValues: {
      ':s': updates.status,
      ':text': updates.extractedText || null,
      ':p': updates.processedAt || null
    }
  };

  await dynamoDb.update(params).promise();
};
