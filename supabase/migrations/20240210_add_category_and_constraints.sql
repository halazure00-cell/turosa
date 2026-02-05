-- Add category field to books table if not exists
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for category for better query performance
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);

-- Add updated_at field to books for tracking changes
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on books update
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add constraint to ensure order_index is unique per book
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_chapter_order_per_book'
    ) THEN
        ALTER TABLE public.chapters
        ADD CONSTRAINT unique_chapter_order_per_book 
        UNIQUE (book_id, order_index);
    END IF;
END $$;
