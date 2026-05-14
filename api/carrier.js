const FMCSA_BASE = 'https://mobile.fmcsa.dot.gov/qc/services/carriers';
const SOCRATA_URL = 'https://data.transportation.gov/resource/az4n-8mr2.json';

async function fmcsa(path, key) {
  try {
    const r = await fetch(`${FMCSA_BASE}${path}?webKey=${key}`, {
      signal: AbortSignal.timeout(12000),
    });
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

async function getSocrata(dot) {
  try {
    const r = await fetch(`${SOCRATA_URL}?dot_number=${dot}&$limit=1`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const rows = await r.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { dot } = req.query;
  if (!dot || !/^\d{1,8}$/.test(dot.trim())) {
    return res.status(400).json({ error: 'Valid DOT number required' });
  }

  const FMCSA_KEY = process.env.FMCSA_KEY;
  if (!FMCSA_KEY) {
    return res.status(500).json({ error: 'FMCSA API not configured' });
  }

  const d = dot.trim();

  const [main, basics, cargo, ops, dockets, authority, oos, socrata, insurance] = await Promise.all([
    fmcsa(`/${d}`, FMCSA_KEY),
    fmcsa(`/${d}/basics`, FMCSA_KEY),
    fmcsa(`/${d}/cargo-carried`, FMCSA_KEY),
    fmcsa(`/${d}/operation-classification`, FMCSA_KEY),
    fmcsa(`/${d}/docket-numbers`, FMCSA_KEY),
    fmcsa(`/${d}/authority`, FMCSA_KEY),
    fmcsa(`/${d}/oos`, FMCSA_KEY),
    getSocrata(d),
    fmcsa(`/${d}/insurance`, FMCSA_KEY),
  ]);

  if (!main || !main.content) {
    return res.status(404).json({ error: `No carrier found for DOT# ${d}` });
  }

  // Cache for 1 hour at CDN edge, revalidate in background
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  return res.status(200).json({ main, basics, cargo, ops, dockets, authority, oos, socrata, insurance });
}
