-- Supabase Migration: 20260923000000_create_cooling_shelters.sql
-- SIH26181: SwasthyaSathi AI - Cooling Shelters & Respite Locator

-- 1. Create enum type for shelter categories
DO $$ BEGIN
    CREATE TYPE shelter_type AS ENUM ('cooling_center', 'night_shelter', 'clinic', 'phc');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create cooling_shelters table
CREATE TABLE IF NOT EXISTS public.cooling_shelters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type shelter_type NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    capacity INTEGER NULL,
    phone_number TEXT NULL,
    is_open_now BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_cooling_shelters_coords 
    ON public.cooling_shelters (latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_cooling_shelters_type 
    ON public.cooling_shelters (type);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.cooling_shelters ENABLE ROW LEVEL SECURITY;

-- 5. Public read-only access policy
DO $$ BEGIN
    CREATE POLICY "Allow public read access on cooling_shelters"
        ON public.cooling_shelters
        FOR SELECT
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 6. Seed Initial Realistic Shelter & Health Infrastructure Data (Delhi NCR, Mumbai, Bengaluru, Jaipur)
INSERT INTO public.cooling_shelters (name, type, latitude, longitude, address, capacity, phone_number, is_open_now)
VALUES
    -- Delhi NCR
    (
        'Connaught Place Heat Respite & Hydration Center',
        'cooling_center',
        28.6315,
        77.2167,
        'Palika Kendra Community Hall, Sansad Marg, New Delhi 110001',
        180,
        '+91 11 2336 0000',
        true
    ),
    (
        'Kashmere Gate DUSIB Night & Heat Shelter (Rain Basera)',
        'night_shelter',
        28.6675,
        77.2285,
        'Near Kashmere Gate ISBT, Mori Gate, Delhi 110006',
        120,
        '+91 11 2386 4500',
        true
    ),
    (
        'Dr. Ram Manohar Lohia Hospital Emergency & Heat Stroke Clinic',
        'clinic',
        28.6253,
        77.2008,
        'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
        250,
        '+91 11 2336 5525',
        true
    ),
    (
        'Aam Aadmi Mohalla Clinic & PHC - Hauz Khas',
        'phc',
        28.5494,
        77.2001,
        'Near Hauz Khas Market, New Delhi 110016',
        40,
        '+91 11 2656 1234',
        true
    ),
    (
        'Nizamuddin Rain Basera Respite Point',
        'night_shelter',
        28.5916,
        77.2490,
        'Opposite Hazrat Nizamuddin Railway Station, New Delhi 110013',
        90,
        '+91 11 2435 8899',
        true
    ),
    (
        'Primary Health Centre (PHC) - Mehrauli',
        'phc',
        28.5170,
        77.1852,
        'Kalka Das Marg, Ward No 2, Mehrauli, New Delhi 110030',
        60,
        '+91 11 2664 3456',
        true
    ),

    -- Mumbai
    (
        'Dadar Municipal Cooling Center & ORS Relief Station',
        'cooling_center',
        19.0178,
        72.8478,
        'BMC Ward Office Premises, Senapati Bapat Marg, Dadar West, Mumbai 400028',
        150,
        '+91 22 2422 1212',
        true
    ),
    (
        'CSMT BMC Night Shelter Respite Home',
        'night_shelter',
        18.9402,
        72.8356,
        'Near St. George Hospital Lane, Fort, Mumbai 400001',
        85,
        '+91 22 2262 0242',
        true
    ),
    (
        'KEM Hospital Acute Heat Management Unit',
        'clinic',
        19.0034,
        72.8427,
        'Acharya Donde Marg, Parel, Mumbai 400012',
        300,
        '+91 22 2410 7000',
        true
    ),
    (
        'Urban Health Post & PHC - Bandra West',
        'phc',
        19.0596,
        72.8295,
        'Waterfield Road, Bandra West, Mumbai 400050',
        50,
        '+91 22 2642 9876',
        true
    ),

    -- Bengaluru
    (
        'Cubbon Park Metro Heat Oasis & Hydration Booth',
        'cooling_center',
        12.9778,
        77.5990,
        'Kasturba Road, Near High Court Gate, Bengaluru 560001',
        100,
        '+91 80 2286 4433',
        true
    ),
    (
        'BBMP Night Shelter (Rain Basera) - Majestic',
        'night_shelter',
        12.9767,
        77.5713,
        'Near Sangam Theatre, Gandhinagar, Bengaluru 560009',
        110,
        '+91 80 2226 7788',
        true
    ),
    (
        'KC General Hospital Heat Stroke Respite Clinic',
        'clinic',
        12.9984,
        77.5714,
        '5th Cross Road, Malleshwaram, Bengaluru 560003',
        200,
        '+91 80 2334 1771',
        true
    ),
    (
        'Namma Clinic / PHC - Indiranagar',
        'phc',
        12.9719,
        77.6412,
        '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
        45,
        '+91 80 2521 3456',
        true
    ),

    -- Jaipur
    (
        'Ram Niwas Bagh Community Heat Respite Pavilion',
        'cooling_center',
        26.9124,
        75.8185,
        'Albert Hall Road, Ram Niwas Bagh, Jaipur 302004',
        140,
        '+91 141 261 4500',
        true
    ),
    (
        'SMS Hospital Emergency & Heat Stroke Response Ward',
        'clinic',
        26.8988,
        75.8156,
        'JLN Marg, Ashok Nagar, Jaipur 302005',
        350,
        '+91 141 256 0291',
        true
    )
ON CONFLICT DO NOTHING;
