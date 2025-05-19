import { extractTextFromPdf } from '../ocr/textract.js';
import { updateStatus } from '../utils/dynamoService.js';

export const processPdfHandler = async ({ s3Bucket, s3Key, jobId }) => {
  // Atualiza status: processamento iniciado
  await updateStatus(jobId, { status: 'PROCESSING' });

  // Extrai texto do PDF via Textract
  const extractedText = await extractTextFromPdf(s3Bucket, s3Key);

  // Aqui você pode parsear o texto para extrair informações específicas (nome, data, etc)
  // Por simplicidade, vamos salvar o texto inteiro no DynamoDB
  await updateStatus(jobId, {
    status: 'COMPLETED',
    extractedText,
    processedAt: new Date().toISOString()
  });
};
