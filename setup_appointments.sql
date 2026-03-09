-- SQL Script to setup the Appointments table

-- 1. Drop the existing table (Warning: This will delete existing appointments)
DROP TABLE IF EXISTS public.appointments CASCADE;

-- 2. Create the appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    doctor_name TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    notes TEXT,
    notified_60m BOOLEAN DEFAULT false,
    notified_30m BOOLEAN DEFAULT false,
    notified_0m BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create Policies for appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON public.appointments
    FOR DELETE USING (auth.uid() = user_id);
