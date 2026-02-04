-- Create buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-files', 'book-files', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for book-covers
CREATE POLICY "Public Access Covers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'book-covers' );

CREATE POLICY "Auth Users Upload Covers"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'book-covers' AND auth.role() = 'authenticated' );

-- Policies for book-files
CREATE POLICY "Auth Users Select Files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'book-files' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Users Upload Files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'book-files' AND auth.role() = 'authenticated' );

-- Add category column to books table if it doesn't exist
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS category TEXT;
