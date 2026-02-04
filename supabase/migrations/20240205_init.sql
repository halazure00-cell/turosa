-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT,
    description TEXT,
    pdf_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

-- Discussions Table
CREATE TABLE IF NOT EXISTS public.discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, updated_at)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Public read access
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles
    FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Books RLS Policies
-- Public read access
CREATE POLICY "Books are viewable by everyone"
    ON public.books
    FOR SELECT
    USING (true);

-- Authenticated users can insert books
CREATE POLICY "Authenticated users can insert books"
    ON public.books
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Chapters RLS Policies
-- Public read access
CREATE POLICY "Chapters are viewable by everyone"
    ON public.chapters
    FOR SELECT
    USING (true);

-- User Progress RLS Policies
-- Users can only read their own progress
CREATE POLICY "Users can view own progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Discussions RLS Policies
-- Public read access
CREATE POLICY "Discussions are viewable by everyone"
    ON public.discussions
    FOR SELECT
    USING (true);

-- Authenticated users can insert discussions
CREATE POLICY "Authenticated users can insert discussions"
    ON public.discussions
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- INDEXES (for performance)
-- =====================================================

-- Create indexes for foreign keys and frequently queried columns
CREATE INDEX IF NOT EXISTS idx_books_uploader_id ON public.books(uploader_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_chapter_id ON public.user_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_discussions_book_id ON public.discussions(book_id);
CREATE INDEX IF NOT EXISTS idx_discussions_user_id ON public.discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_parent_id ON public.discussions(parent_id);
