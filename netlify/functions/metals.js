/**
 * Netlify Serverless Function - Metals Price Proxy
 * Fetches gold & silver prices from gold-api.com (server-side, no CORS issues)
 * Endpoint: /.netlify/functions/metals
 */

export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // Fetch gold and silver prices in parallel
    const [goldRes, silverRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU'),
      fetch('https://api.gold-api.com/price/XAG')
    ]);

    if (!goldRes.ok || !silverRes.ok) {
      throw new Error(`API error: Gold=${goldRes.status}, Silver=${silverRes.status}`);
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    if (!goldData.price || !silverData.price) {
      throw new Error('Missing price data in API response');
    }

    const result = {
      gold: {
        price: goldData.price,
        symbol: 'XAU',
        name: 'Gold',
        updatedAt: goldData.updatedAt || new Date().toISOString()
      },
      silver: {
        price: silverData.price,
        symbol: 'XAG',
        name: 'Silver',
        updatedAt: silverData.updatedAt || new Date().toISOString()
      },
      timestamp: Date.now(),
      success: true
    };

    return new Response(JSON.stringify(result), { status: 200, headers });

  } catch (error) {
    const errorResult = {
      success: false,
      error: error.message,
      timestamp: Date.now()
    };

    return new Response(JSON.stringify(errorResult), { status: 500, headers });
  }
};
