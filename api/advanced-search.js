const SOCRATA_BASE = 'https://data.transportation.gov/resource/az4n-8mr2.json';

function esc(val) {
  return val.toString().replace(/'/g, "''");
}

function toYYYYMMDD(dateStr) {
  return dateStr.replace(/-/g, '');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = req.query;
  const conditions = [];

  // ── Identification ────────────────────────────────────────────────
  if (q.dot)  conditions.push(`dot_number = '${esc(q.dot.trim())}'`);
  if (q.mc)   conditions.push(`docket1 = '${esc(q.mc.trim())}'`);
  if (q.name) conditions.push(`upper(legal_name) like upper('%${esc(q.name.trim())}%')`);

  // ── Location ──────────────────────────────────────────────────────
  if (q.state) conditions.push(`upper(phy_state) = '${esc(q.state.trim().toUpperCase())}'`);
  if (q.city)  conditions.push(`upper(phy_city) like upper('%${esc(q.city.trim())}%')`);
  if (q.zip)   conditions.push(`phy_zip = '${esc(q.zip.trim())}'`);

  // ── DOT / Company Status ──────────────────────────────────────────
  if (q.status) conditions.push(`status_code = '${esc(q.status)}'`);

  // ── Added Date range (Socrata stores dates as YYYYMMDD text strings) ──
  if (q.date_from) conditions.push(`add_date >= '${toYYYYMMDD(q.date_from)}'`);
  if (q.date_to)   conditions.push(`add_date <= '${toYYYYMMDD(q.date_to)}'`);

  // ── Fleet Size ────────────────────────────────────────────────────
  if (q.min_units && !isNaN(q.min_units))
    conditions.push(`total_power_units >= ${parseInt(q.min_units)}`);
  if (q.max_units && !isNaN(q.max_units))
    conditions.push(`total_power_units <= ${parseInt(q.max_units)}`);
  if (q.min_drivers && !isNaN(q.min_drivers))
    conditions.push(`total_drivers >= ${parseInt(q.min_drivers)}`);
  if (q.max_drivers && !isNaN(q.max_drivers))
    conditions.push(`total_drivers <= ${parseInt(q.max_drivers)}`);

  // ── Safety & Operations ───────────────────────────────────────────
  if (q.safety_rating) conditions.push(`safety_rtng = '${esc(q.safety_rating)}'`);
  if (q.carrier_op)    conditions.push(`carrier_operation = '${esc(q.carrier_op)}'`);

  // ── Entity Type ───────────────────────────────────────────────────
  if (q.entity_type) {
    const types = q.entity_type.split(',').map(t => t.trim());
    const typeConds = [];
    if (types.includes('C'))  typeConds.push(`carship = 'C'`);
    if (types.includes('B'))  typeConds.push(`carship = 'B'`);
    if (types.includes('S'))  typeConds.push(`carship = 'S'`);
    if (types.includes('FF')) typeConds.push(`(docket1prefix = 'FF' OR docket2prefix = 'FF')`);
    if (typeConds.length === 1) conditions.push(typeConds[0]);
    else if (typeConds.length > 1) conditions.push(`(${typeConds.join(' OR ')})`);
  }

  // ── Authority Status ──────────────────────────────────────────────
  if (q.authority) {
    switch (q.authority) {
      case 'active_mc':     conditions.push(`docket1prefix = 'MC' AND docket1_status_code = 'A'`); break;
      case 'active_broker': conditions.push(`carship = 'B' AND docket1_status_code = 'A'`); break;
      case 'active_ff':     conditions.push(`docket1prefix = 'FF' AND docket1_status_code = 'A'`); break;
      case 'active_any':    conditions.push(`docket1_status_code = 'A'`); break;
      case 'pending_mc':    conditions.push(`docket1prefix = 'MC' AND status_code = 'P'`); break;
      case 'pending_any':   conditions.push(`status_code = 'P'`); break;
      case 'revoked_mc':    conditions.push(`docket1prefix = 'MC' AND docket1_status_code = 'I'`); break;
      case 'revoked_any':   conditions.push(`docket1_status_code = 'I'`); break;
      case 'prior_revoke':  conditions.push(`prior_revoke_flag = 'Y'`); break;
    }
  }

  if (conditions.length === 0) {
    return res.status(400).json({ error: 'At least one filter is required.' });
  }

  const whereClause = conditions.join(' AND ');
  const order  = (q.date_from || q.date_to) ? 'add_date DESC' : 'legal_name ASC';
  const limit  = 250;
  const page   = Math.max(0, parseInt(q.page) || 0);
  const offset = page * limit;

  // Run data + count queries in parallel
  const dataParams = new URLSearchParams({
    $where:  whereClause,
    $limit:  String(limit),
    $offset: String(offset),
    $order:  order,
  });
  const countParams = new URLSearchParams({
    $where:  whereClause,
    $select: 'count(*) as total',
    $limit:  '1',
  });

  try {
    const [dataRes, countRes] = await Promise.all([
      fetch(`${SOCRATA_BASE}?${dataParams}`,  { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(25000) }),
      fetch(`${SOCRATA_BASE}?${countParams}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) }),
    ]);

    if (!dataRes.ok) throw new Error(`Socrata returned ${dataRes.status}`);

    const data  = await dataRes.json();
    const countData = countRes.ok ? await countRes.json() : [];
    const total = parseInt(countData[0]?.total) || data.length;

    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    return res.status(200).json({ results: data, total, page, limit });
  } catch (err) {
    const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Search timed out — try fewer filters.' : 'Advanced search failed. Please try again.',
    });
  }
}
