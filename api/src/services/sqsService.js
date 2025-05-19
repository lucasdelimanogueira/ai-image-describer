import AWS from 'aws-sdk';

const sqs = new AWS.SQS({
    region: process.env.AWS_REGION,
    ...(process.env.NODE_ENV !== 'production' && {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
});  

const queueUrl = process.env.SQS_QUEUE_URL;

export const sendMessageToQueue = async (messageBody) => {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody)
  };

  await sqs.sendMessage(params).promise();
};