import { processImageHandler } from './handlers/processImage.js';

export const handler = async (event) => {
  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      await processImageHandler(body);
    } catch (err) {
      console.error('Image processing error:', err);
    }
  }
};
