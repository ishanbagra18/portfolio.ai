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
    
    -- New Optional Sections (JSONB Arrays for flexible list data)
    achievements_data JSONB DEFAULT '[]'::jsonb,
    publications_data JSONB DEFAULT '[]'::jsonb,
    hackathons_data JSONB DEFAULT '[]'::jsonb,
    open_source_data JSONB DEFAULT '[]'::jsonb,
    volunteering_data JSONB DEFAULT '[]'::jsonb,
    research_data JSONB DEFAULT '[]'::jsonb,
    education_data JSONB DEFAULT '[]'::jsonb,
    awards_data JSONB DEFAULT '[]'::jsonb,
    testimonials_data JSONB DEFAULT '[]'::jsonb,
    -- Dynamic Sections & Customization
    section_order JSONB DEFAULT '["about", "projects", "experiences", "tech_stacks", "certifications", "blog_posts", "case_studies", "testimonials_data"]'::jsonb,
    section_visibility JSONB DEFAULT '{}'::jsonb,
    theme_settings JSONB DEFAULT '{}'::jsonb,
    blog_posts JSONB DEFAULT '[]'::jsonb,
    case_studies JSONB DEFAULT '[]'::jsonb,
    
    -- Custom Domains & Private Access Control
    custom_domain TEXT UNIQUE,
    is_password_protected BOOLEAN DEFAULT false,
    access_passcode TEXT,
    link_expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_public_slug ON portfolios(public_slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_custom_domain ON portfolios(custom_domain);

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

-- 5. PORTFOLIO VERSIONS TABLE (Snapshot history & Undo/Restore)
CREATE TABLE portfolio_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    version_name TEXT NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- MIGRATION: Run this if the tables already exist
-- ========================================================
-- ALTER TABLE portfolios
--   ADD COLUMN IF NOT EXISTS section_order JSONB DEFAULT '["about", "projects", "experiences", "tech_stacks", "certifications", "blog_posts", "case_studies", "testimonials_data"]'::jsonb,
--   ADD COLUMN IF NOT EXISTS section_visibility JSONB DEFAULT '{}'::jsonb,
--   ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{}'::jsonb,
--   ADD COLUMN IF NOT EXISTS blog_posts JSONB DEFAULT '[]'::jsonb,
--   ADD COLUMN IF NOT EXISTS case_studies JSONB DEFAULT '[]'::jsonb,
--   ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE,
--   ADD COLUMN IF NOT EXISTS is_password_protected BOOLEAN DEFAULT false,
--   ADD COLUMN IF NOT EXISTS access_passcode TEXT,
--   ADD COLUMN IF NOT EXISTS link_expires_at TIMESTAMP WITH TIME ZONE;
--
-- CREATE INDEX IF NOT EXISTS idx_portfolios_custom_domain ON portfolios(custom_domain);