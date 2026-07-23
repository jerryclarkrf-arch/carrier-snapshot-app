export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  // 1. Sanitize Environment Variables
  const rawUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

  // Remove trailing slashes if present
  const supabaseUrl = rawUrl.replace(/\/+$|\s+/g, '');

  // 2. Explicit Environment Variable Check
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Missing Vercel Environment Variables',
      details: {
        has_url: Boolean(supabaseUrl),
        has_key: Boolean(supabaseKey)
      }
    });
  }

  try {
    const searchTerm = encodeURIComponent(q.trim());
    const isNumeric = /^\d+$/.test(q.trim());

    // 3. Build PostgREST Filter
    const orFilter = isNumeric
      ? `usdot_number.eq.${searchTerm},docket_number.ilike.*${searchTerm}*`
      : `legal_name.ilike.*${searchTerm}*,dba_name.ilike.*${searchTerm}*,docket_number.ilike.*${searchTerm}*`;

    const fetchUrl = `${supabaseUrl}/rest/v1/motus_carrier?select=usdot_number,docket_number,legal_name,dba_name,op_auth_type,op_auth_status,last_updated&or=(${orFilter})&limit=100`;

    // 4. Native Fetch Request
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Supabase Rejected Query', 
        status: response.status,
        details: responseText 
      });
    }

    const data = JSON.parse(responseText);
    return res.status(200).json(data || []);

  } catch (err) {
    return res.status(500).json({ 
      error: 'Runtime Exception', 
      message: err.message,
      stack: err.stack 
    });
  }
}