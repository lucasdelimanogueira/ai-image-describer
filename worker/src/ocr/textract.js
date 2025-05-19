import AWS from 'aws-sdk';

const textract = new AWS.Textract({
  region: process.env.AWS_REGION
});

export const extractTextFromPdf = async (bucket, key) => {
  // Usar Textract para análise síncrona de documento simples
  // Para PDFs grandes, você pode usar análise assíncrona (startDocumentTextDetection)

  const params = {
    Document: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };

  const data = await textract.detectDocumentText(params).promise();

  // Montar texto concatenando os Blocks de tipo 'LINE'
  const lines = data.Blocks
    .filter(block => block.BlockType === 'LINE')
    .map(line => line.Text);

  return lines.join('\n');
};
