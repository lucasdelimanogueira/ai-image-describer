import { getJobStatus } from '../services/dynamoService.js';

export const getJobStatusHandler = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await getJobStatus(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error('Error getting job status:', err);
    res.status(500).json({ error: 'Failed to get job status' });
  }
};
