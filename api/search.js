export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  const N8N_URL = process.env.N8N_SEARCH_URL;
  if (!N8N_URL) {
    return res.status(500).json({ error: 'Search service not configured' });
  }

  try {
    const upstream = await fetch(`${N8N_URL}?q=${encodeURIComponent(q.trim())}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(25000),
    });

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Search service returned an error' });
    }

    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(data);
  } catch (err) {
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Search timed out — try again' : 'Search failed',
    });
  }
}
