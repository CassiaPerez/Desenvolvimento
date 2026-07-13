/*
# Create projects table

1. New Tables
- `projects`
  - `id` (uuid, primary key)
  - `code` (text, not null) - project identifier code
  - `name` (text, not null) - project display name
  - `description` (text, nullable)
  - `sector` (text, not null) - business sector
  - `technologies` (text[], default empty) - list of tech used
  - `status` (text, not null) - project status enum value
  - `progress` (integer, default 0) - completion percentage
  - `updated_at` (timestamptz) - last update timestamp
  - `team` (jsonb, default empty array) - array of team member objects
  - `url` (text, nullable) - project URL

2. Security
- Enable RLS on `projects`.
- Allow anon + authenticated full CRUD (single-tenant, no auth required).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name text NOT NULL,
  description text,
  sector text NOT NULL DEFAULT 'Geral',
  technologies text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Pendente',
  progress integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  team jsonb NOT NULL DEFAULT '[]',
  url text
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
