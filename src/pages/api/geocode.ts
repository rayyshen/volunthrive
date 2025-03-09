import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key is not configured');
    }
    
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
}
