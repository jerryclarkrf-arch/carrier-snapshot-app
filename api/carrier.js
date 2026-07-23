import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { dot, docket } = req.query;

  let query = supabase.from('motus_carrier').select('*');

  if (dot) {
    query = query.eq('usdot_number', dot);
  } else if (docket) {
    query = query.eq('docket_number', docket);
  } else {
    return res.status(400).json({ error: 'Provide a USDOT or Docket number' });
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}