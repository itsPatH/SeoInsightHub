// This file is needed for Vercel serverless functions
import { createServer } from 'http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

// Ensure routes are registered
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Pass the request to the Express app
  return new Promise((resolve, reject) => {
    const server = createServer(app);
    app(req, res);
    res.on('finish', resolve);
    res.on('error', reject);
  });
}