-- Complete Supabase Database Setup Script
-- Run this in your Supabase SQL Editor to create ALL necessary tables
-- This includes both user-related tables and content tables (colleges, scholarships)

-- ========================================
-- USER-RELATED TABLES
-- ========================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  location TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create colleges_viewed table to track which colleges users have viewed
CREATE TABLE IF NOT EXISTS colleges_viewed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID,
  college_name TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table to track user applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID,
  college_name TEXT,
  application_type TEXT, -- 'college', 'scholarship', etc.
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_responses table to store user quiz answers
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  responses JSONB NOT NULL, -- Store quiz answers as JSON
  language TEXT DEFAULT 'en',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recommendations table to store AI-generated recommendations
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_recommendations JSONB NOT NULL, -- Store career recommendations as JSON
  course_recommendations JSONB, -- Store course recommendations as JSON
  college_recommendations TEXT[], -- Store college recommendations as array
  scholarship_matches TEXT[], -- Store scholarship matches as array
  quiz_response_id UUID REFERENCES quiz_responses(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CONTENT TABLES (COLLEGES & SCHOLARSHIPS)
-- ========================================

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  location TEXT NOT NULL, -- Full address
  latitude DECIMAL(10, 8), -- For mapping
  longitude DECIMAL(11, 8), -- For mapping
  college_type TEXT, -- 'Government', 'Private', 'Deemed', etc.
  affiliation TEXT, -- University affiliation
  establishment_year INTEGER,
  accreditation TEXT, -- NAAC, NBA, etc.
  nirf_ranking INTEGER, -- NIRF ranking
  ranking INTEGER, -- General ranking
  courses_offered TEXT[], -- Array of courses
  facilities TEXT[], -- Array of facilities
  fees_range TEXT, -- Fee structure
  website_url TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- Government body, organization, etc.
  category TEXT, -- 'Merit-based', 'Need-based', 'Research', etc.
  description TEXT,
  amount DECIMAL(15, 2), -- Scholarship amount
  eligibility_criteria TEXT[], -- Array of eligibility criteria
  education_level TEXT, -- 'Undergraduate', 'Postgraduate', 'Doctoral', etc.
  caste_category TEXT[], -- SC, ST, OBC, General, etc.
  gender_specific TEXT, -- 'Male', 'Female', 'All'
  income_limit DECIMAL(15, 2), -- Family income limit
  state_specific TEXT, -- State restriction if any
  application_deadline DATE,
  application_url TEXT,
  documents_required TEXT[], -- Required documents
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on user-related tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Content tables don't need RLS as they're public data
-- colleges and scholarships tables are accessible to all authenticated users

-- ========================================
-- RLS POLICIES FOR USER-RELATED TABLES
-- ========================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Colleges viewed policies
CREATE POLICY "Users can view their own college views" ON colleges_viewed
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own college views" ON colleges_viewed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz responses policies
CREATE POLICY "Users can view their own quiz responses" ON quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz responses" ON quiz_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recommendations policies
CREATE POLICY "Users can view their own recommendations" ON recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations" ON recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User-related table indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_colleges_viewed_user_id ON colleges_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);

-- Content table indexes
CREATE INDEX IF NOT EXISTS idx_colleges_state_city ON colleges(state, city);
CREATE INDEX IF NOT EXISTS idx_colleges_college_type ON colleges(college_type);
CREATE INDEX IF NOT EXISTS idx_colleges_latitude_longitude ON colleges(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_education_level ON scholarships(education_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarships_application_deadline ON scholarships(application_deadline);

-- ========================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ========================================

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample colleges (few examples to test the system)
INSERT INTO colleges (
  name, city, state, location, latitude, longitude, college_type, 
  affiliation, establishment_year, nirf_ranking, courses_offered, 
  facilities, fees_range, website_url, email, phone
) VALUES 
(
  'Indian Institute of Technology Delhi',
  'New Delhi',
  'Delhi',
  'Hauz Khas, New Delhi, Delhi 110016',
  28.5456, 77.1929,
  'Government',
  'Autonomous',
  1961,
  2,
  ARRAY['B.Tech', 'M.Tech', 'PhD', 'MBA'],
  ARRAY['Library', 'Hostel', 'Labs', 'Sports Complex', 'Wi-Fi'],
  '2-10 Lakhs',
  'https://www.iitd.ac.in',
  'webmaster@admin.iitd.ac.in',
  '011-2659-1000'
),
(
  'Delhi University',
  'New Delhi',
  'Delhi',
  'University Rd, University Enclave, New Delhi, Delhi 110007',
  28.6886, 77.2096,
  'Government',
  'Central University',
  1922,
  13,
  ARRAY['BA', 'BSc', 'BCom', 'MA', 'MSc', 'PhD'],
  ARRAY['Library', 'Multiple Colleges', 'Research Centers', 'Sports'],
  '10,000-50,000',
  'https://www.du.ac.in',
  'info@du.ac.in',
  '011-2766-7049'
),
(
  'Jawaharlal Nehru University',
  'New Delhi',
  'Delhi',
  'New Mehrauli Rd, JNU Ring Rd, New Delhi, Delhi 110067',
  28.5386, 77.1666,
  'Government',
  'Central University',
  1969,
  3,
  ARRAY['BA', 'MA', 'MPhil', 'PhD', 'International Studies'],
  ARRAY['Library', 'Hostel', 'Research Centers', 'Cultural Centers'],
  '5,000-25,000',
  'https://www.jnu.ac.in',
  'info@jnu.ac.in',
  '011-2670-4000'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample scholarships
INSERT INTO scholarships (
  name, provider, category, description, amount, eligibility_criteria,
  education_level, caste_category, gender_specific, income_limit,
  application_deadline, application_url, documents_required, is_active
) VALUES
(
  'National Scholarship Portal Merit Scholarship',
  'Government of India',
  'Merit-based',
  'Merit-based scholarship for students from economically weaker sections',
  50000,
  ARRAY['Class 12 marks above 75%', 'Family income below 6 lakh per annum'],
  'Undergraduate',
  ARRAY['General', 'OBC', 'SC', 'ST'],
  'All',
  600000,
  '2024-12-31',
  'https://scholarships.gov.in',
  ARRAY['Income Certificate', 'Caste Certificate', 'Mark Sheet', 'Bank Details'],
  true
),
(
  'INSPIRE Scholarship',
  'Department of Science and Technology',
  'Merit-based',
  'Scholarship for students pursuing science courses',
  80000,
  ARRAY['Top 1% in Class 12 Science', 'Admission to science course'],
  'Undergraduate',
  ARRAY['General', 'OBC', 'SC', 'ST'],
  'All',
  NULL,
  '2024-11-30',
  'https://online-inspire.gov.in',
  ARRAY['Class 12 Certificate', 'Admission Letter', 'Bank Details'],
  true
),
(
  'Post Matric Scholarship SC',
  'Ministry of Social Justice',
  'Need-based',
  'Post-matric scholarship for SC students',
  30000,
  ARRAY['Scheduled Caste certificate', 'Family income below 2.5 lakh'],
  'Undergraduate',
  ARRAY['SC'],
  'All',
  250000,
  '2024-10-15',
  'https://scholarships.gov.in',
  ARRAY['SC Certificate', 'Income Certificate', 'Bank Details', 'Admission Letter'],
  true
),
(
  'Begum Hazrat Mahal National Scholarship',
  'Maulana Azad Education Foundation',
  'Merit-cum-Need',
  'Scholarship for minority community girl students',
  60000,
  ARRAY['Minority community', 'Girl students only', 'Merit based'],
  'Undergraduate',
  ARRAY['Minority'],
  'Female',
  200000,
  '2024-09-30',
  'https://maef.nic.in',
  ARRAY['Minority Certificate', 'Income Certificate', 'Mark Sheet', 'Bank Details'],
  true
)
ON CONFLICT (id) DO NOTHING;

-- Display completion message
SELECT 'Database setup completed successfully! Tables created: profiles, colleges_viewed, applications, quiz_responses, recommendations, colleges, scholarships' as message;