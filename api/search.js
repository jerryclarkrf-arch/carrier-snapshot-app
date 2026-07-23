export default async function handler(req, res) {
  // 1. CORS & Method Check
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const searchTerm = encodeURIComponent(q.trim());
  const isNumeric = /^\d+$/.test(q.trim());

  // 2. Get environment variables directly
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables in Vercel');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. Build the Supabase REST API filter
    let orFilter;
    if (isNumeric) {
      // Numerical input: search exact USDOT or partial Docket number
      orFilter = `usdot_number.eq.${searchTerm},docket_number.ilike.*${searchTerm}*`;
    } else {
      // Text input: search Company Name, DBA, or Docket with prefix
      orFilter = `legal_name.ilike.*${searchTerm}*,dba_name.ilike.*${searchTerm}*,docket_number.ilike.*${searchTerm}*`;
    }

    // 4. Construct the direct REST API URL
    const fetchUrl = `${supabaseUrl}/rest/v1/motus_carrier?select=usdot_number,docket_number,legal_name,dba_name,op_auth_type,op_auth_status,last_updated&or=(${orFilter})&limit=100`;

    // 5. Execute native fetch
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('Supabase query failed:', errData);
      return res.status(response.status).json({ error: 'Database lookup failed' });
    }

    const data = await response.json();
    return res.status(200).json(data || []);

  } catch (err) {
    console.error('Server execution error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}