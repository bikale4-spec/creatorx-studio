/*
# CreatorX Studio - Core Schema

1. Purpose
   Single-tenant content creator platform (no auth/sign-in). All data is shared/public
   so policies use `TO anon, authenticated` with `USING (true)`.

2. New Tables
   - `projects` — content creation projects (videos, streams, recordings)
     - id (uuid PK), title, type, status, thumbnail_url, description, metadata (jsonb), created_at, updated_at
   - `ai_results` — saved AI tool generation results
     - id (uuid PK), tool_type, topic, language, content (jsonb), created_at
   - `stream_scenes` — streaming studio scenes and their sources
     - id (uuid PK), name, is_active, sources (jsonb), created_at, updated_at
   - `avatars` — avatar studio uploads
     - id (uuid PK), name, image_url, status, created_at
   - `app_settings` — key-value app settings
     - id (uuid PK), key (unique), value (jsonb), updated_at

3. Security
   - RLS enabled on all tables.
   - All tables allow anon + authenticated full CRUD (single-tenant, intentionally public).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'video',
  status text NOT NULL DEFAULT 'draft',
  thumbnail_url text,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS ai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_type text NOT NULL,
  topic text NOT NULL,
  language text NOT NULL DEFAULT 'English',
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ai_results" ON ai_results;
CREATE POLICY "anon_select_ai_results" ON ai_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ai_results" ON ai_results;
CREATE POLICY "anon_insert_ai_results" ON ai_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ai_results" ON ai_results;
CREATE POLICY "anon_update_ai_results" ON ai_results FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ai_results" ON ai_results;
CREATE POLICY "anon_delete_ai_results" ON ai_results FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS stream_scenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stream_scenes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_stream_scenes" ON stream_scenes;
CREATE POLICY "anon_select_stream_scenes" ON stream_scenes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_stream_scenes" ON stream_scenes;
CREATE POLICY "anon_insert_stream_scenes" ON stream_scenes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_stream_scenes" ON stream_scenes;
CREATE POLICY "anon_update_stream_scenes" ON stream_scenes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_stream_scenes" ON stream_scenes;
CREATE POLICY "anon_delete_stream_scenes" ON stream_scenes FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_avatars" ON avatars;
CREATE POLICY "anon_select_avatars" ON avatars FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_avatars" ON avatars;
CREATE POLICY "anon_insert_avatars" ON avatars FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_avatars" ON avatars;
CREATE POLICY "anon_update_avatars" ON avatars FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_avatars" ON avatars;
CREATE POLICY "anon_delete_avatars" ON avatars FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
CREATE POLICY "anon_insert_app_settings" ON app_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_settings" ON app_settings;
CREATE POLICY "anon_delete_app_settings" ON app_settings FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_results_created_at ON ai_results (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stream_scenes_created_at ON stream_scenes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avatars_created_at ON avatars (created_at DESC);
