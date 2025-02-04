/*
  # Initial Schema Setup for Store Assistant

  1. Extensions
    - Enable pgvector for vector similarity search
  
  2. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `store_id` (text, for store identification)
      - `content` (text, document content)
      - `embedding` (vector(1024), Gemini embeddings)
      - `created_at` (timestamptz)
  
  3. Functions
    - `match_documents`: Similarity search function
  
  4. Security
    - Enable RLS on documents table
    - Add policies for store-based access control
*/

-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the documents table with Gemini's 1024-dimensional vectors
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id text NOT NULL,
  content text NOT NULL,
  embedding vector(1024),
  created_at timestamptz DEFAULT now()
);

-- Create a vector index for similarity search
CREATE INDEX documents_embedding_idx ON documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their store's documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = store_id);

CREATE POLICY "Users can insert into their store"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = store_id);

-- Create similarity search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  store_id text
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  FROM documents
  WHERE 
    documents.store_id = match_documents.store_id
    AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;