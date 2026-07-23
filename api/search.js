import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // CORS & Method Check
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { q } = req.query;

  if (!q || typeof q !== 'string' || !q.trim()) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const searchTerm = q.trim();
  const isNumeric = /^\d+$/.test(searchTerm);

  try {
    let query = supabase
      .from('motus_carrier')
      .select(`
        usdot_number,
        docket_number,
        legal_name,
        dba_name,
        op_auth_type,
        op_auth_status,
        bus_city,
        bus_state_code,
        bus_telno,
        last_updated
      `)
      .limit(100);

    if (isNumeric) {
      // Numerical input: search exact USDOT or partial Docket number
      query = query.or(`usdot_number.eq.${searchTerm},docket_number.ilike.%${searchTerm}%`);
    } else {
      // Text input: search Company Name, DBA, or Docket with prefix (e.g. MC123456)
      query = query.or(`legal_name.ilike.%${searchTerm}%,dba_name.ilike.%${searchTerm}%,docket_number.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase execution error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || []);
  } catch (err) {
    console.error('Server error during carrier lookup:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}