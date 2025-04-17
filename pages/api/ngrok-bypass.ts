import { NextApiRequest, NextApiResponse } from 'next';
import { bypassNgrok } from '../../utils/ngrok-bypass';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ngrokUrl = 'http://aa3a-2a02-4780-12-c985-00-1.ngrok-free.app';
    const response = await bypassNgrok(ngrokUrl);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
