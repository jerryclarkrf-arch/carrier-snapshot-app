-- ═══════════════════════════════════════════════════════════════════
-- Carrier Snapshot — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. User profiles (extends built-in auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  tier        TEXT        NOT NULL DEFAULT 'free',  -- 'free' | 'pro'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. Carrier cache (builds your historical dataset automatically) ──
CREATE TABLE IF NOT EXISTS public.carrier_cache (
  dot_number    TEXT        PRIMARY KEY,
  legal_name    TEXT,
  dba_name      TEXT,
  status_code   TEXT,           -- 'A' | 'I'
  phy_city      TEXT,
  phy_state     TEXT,
  phy_zip       TEXT,
  power_units   INTEGER,
  total_drivers INTEGER,
  safety_rating TEXT,
  allowed_to_operate BOOLEAN,
  full_data     JSONB,          -- complete API response stored for future use
  lookup_count  INTEGER     NOT NULL DEFAULT 1,
  first_seen    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_fetched  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Search history (analytics + re-surfacing popular searches) ────
CREATE TABLE IF NOT EXISTS public.search_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  query       TEXT        NOT NULL,
  result_count INTEGER,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. Row Level Security ────────────────────────────────────────────

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carrier_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_log    ENABLE ROW LEVEL SECURITY;

-- profiles: users can only read/update their own row
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- carrier_cache: anyone can read (drives the public snapshot data)
CREATE POLICY "Public read carrier cache"
  ON public.carrier_cache FOR SELECT
  USING (true);

-- carrier_cache: only service role can write (done from API functions)
CREATE POLICY "Service role write carrier cache"
  ON public.carrier_cache FOR ALL
  USING (auth.role() = 'service_role');

-- search_log: users see only their own logs
CREATE POLICY "Users read own search log"
  ON public.search_log FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone insert search log"
  ON public.search_log FOR INSERT
  WITH CHECK (true);

-- ── 5. Useful indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS carrier_cache_state_idx  ON public.carrier_cache (phy_state);
CREATE INDEX IF NOT EXISTS carrier_cache_status_idx ON public.carrier_cache (status_code);
CREATE INDEX IF NOT EXISTS carrier_cache_name_idx   ON public.carrier_cache USING gin (to_tsvector('english', legal_name));
CREATE INDEX IF NOT EXISTS search_log_created_idx   ON public.search_log (created_at DESC);
