-- Supabase SQL Schema for ClawClip Entity Graph
-- Run this in the Supabase SQL Editor

-- 1. Define the Types of Entities (Nodes) in our Graph
CREATE TYPE entity_type AS ENUM (
  'team', 
  'human', 
  'agent', 
  'target', 
  'project', 
  'facility', 
  'directory_contact', 
  'memory', 
  'artifact', 
  'event'
);

-- 2. Nodes Table (Centralized Entities)
-- We use a single Nodes table with a JSONB metadata column to allow flexible data storage
-- while keeping the graph structure strictly relational.
-- The ID should match the Firebase document ID for 1:1 parity where applicable.
CREATE TABLE nodes (
  id VARCHAR PRIMARY KEY,
  type entity_type NOT NULL,
  company_id VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Edges Table (The Bi-Directional Graph Links)
CREATE TABLE edges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id VARCHAR NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_id VARCHAR NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  relationship_type VARCHAR NOT NULL, -- e.g., 'assigned_to', 'blocks', 'depends_on', 'owns'
  company_id VARCHAR NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Prevent exact duplicate links
  UNIQUE(source_id, target_id, relationship_type)
);

-- 4. Performance Indexes for Fast Graph Traversal
CREATE INDEX idx_edges_source ON edges(source_id);
CREATE INDEX idx_edges_target ON edges(target_id);
CREATE INDEX idx_nodes_company ON nodes(company_id);
CREATE INDEX idx_edges_company ON edges(company_id);

-- 5. Row Level Security (RLS) setup (Optional but recommended)
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

-- If using service_role key from the backend, it will bypass these policies.
-- If querying from the frontend with anon key, we can create policies based on custom JWTs,
-- but for now, we'll allow read access if needed or rely on the backend bridge.
CREATE POLICY "Allow public read for company (if using anon key)"
  ON nodes FOR SELECT
  USING (true); -- Modify this to restrict based on user's company_id JWT claim later

CREATE POLICY "Allow public read for company edges"
  ON edges FOR SELECT
  USING (true);
