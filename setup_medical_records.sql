-- SQL Script to setup the Medical Records section
-- Run this in your Supabase SQL Editor

-- 1. Create the medical_records table
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT,
    file_type TEXT,
    analysis_date DATE,
    summary_text_ar TEXT,
    test_results JSONB,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the medical_files table
CREATE TABLE IF NOT EXISTS public.medical_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    record_id UUID REFERENCES public.medical_records(id) ON DELETE CASCADE,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT,
    file_size BIGINT,
    is_sensitive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_files ENABLE ROW LEVEL SECURITY;

-- Create Policies for medical_records
CREATE POLICY "Users can view own medical records" ON public.medical_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical records" ON public.medical_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical records" ON public.medical_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical records" ON public.medical_records
    FOR DELETE USING (auth.uid() = user_id);

-- Create Policies for medical_files
CREATE POLICY "Users can view own medical files metadata" ON public.medical_files
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical files metadata" ON public.medical_files
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical files metadata" ON public.medical_files
    FOR DELETE USING (auth.uid() = user_id);

-- 3. Create Storage Bucket for medical_files
-- Note: You also need to create a bucket named 'medical_files' in the Storage section and make it public.
-- Or run this if your Postgres role has permissions:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('medical_files', 'medical_files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for medical_files bucket
CREATE POLICY "Users can upload medical files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'medical_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their medical files" ON storage.objects
    FOR SELECT USING (bucket_id = 'medical_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their medical files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'medical_files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their medical files" ON storage.objects
    FOR DELETE USING (bucket_id = 'medical_files' AND auth.uid()::text = (storage.foldername(name))[1]);
