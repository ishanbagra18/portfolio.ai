-- No table setup is required for auth now.
-- The backend uses Supabase Auth users directly via:
-- 1) supabase.auth.admin.createUser (signup)
-- 2) supabase.auth.signInWithPassword (login)
-- 3) supabase.auth.admin.getUserById (me)


-- 1. MAIN PORTFOLIO TABLE (Personal Info, About Me, & Coding Profiles)
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- Supabase Auth se link karne ke liye (agar authentication use kar rhe ho)
    
    -- Personal Information
    full_name TEXT NOT NULL,
    email_id TEXT NOT NULL,
    age INT,
    address TEXT,
    main_title TEXT, -- e.g., 'Backend Developer', 'MERN Stack Developer'
    
    -- About Me
    college_name TEXT, -- e.g., 'Indian Institute of Information Technology, Kota'
    course_name TEXT,  -- e.g., 'B.Tech'
    specialization_course_name TEXT, -- e.g., 'Computer Science'
    about_paragraph TEXT, -- Aapki hackathons aur baki details ka paragraph
    
    -- Coding Profiles
    -- Backend mein sirf username save karenge, frontend par aap directly URL mein inject kar sakte hain
    github_username TEXT,
    leetcode_username TEXT,
    
    -- Public Portfolio & Analytics
    public_slug TEXT UNIQUE,
    is_public BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug ON portfolios(public_slug);

-- 2. TECH STACK TABLE (Languages & Tools)
CREATE TABLE tech_stacks (
    id SERIAL PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., 'C++', 'Go', 'React', 'MongoDB'
    category TEXT,      -- Optional: 'language' ya 'tool' distinguish karne ke liye
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL, 
    project_desc TEXT,          -- Naya column add kiya gaya hai
    project_tech_stack TEXT[],  
    project_image TEXT,         
    project_github_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CERTIFICATIONS TABLE (Optional Section)
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    issuing_organization TEXT,
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- MIGRATION: Run this if the tables already exist
-- ========================================================
-- ALTER TABLE portfolios
--   ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE,
--   ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
--   ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
--
-- CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug ON portfolios(public_slug);