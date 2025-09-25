# Database Fix for Scholarships and College Map Issues

## 🚨 Problem
The scholarships page and college map are showing "Please check your DB" errors because the required database tables (`colleges` and `scholarships`) don't exist in your Supabase database.

## 🔍 Root Cause
The original `supabase-setup.sql` file only creates user-related tables but **does not create the content tables** that store colleges and scholarships data.

Your application expects these tables:
- `colleges` - Contains college information with location data for the map
- `scholarships` - Contains scholarship information for the scholarships page

## ✅ Solution

### Step 1: Run the Complete Database Setup
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase-complete-setup.sql`
4. Paste and run it in the SQL Editor

This will create:
- All user-related tables (profiles, quiz_responses, etc.)
- **Content tables** (colleges, scholarships)
- Sample data for testing
- Proper indexes and security policies

### Step 2: Verify Tables Exist
After running the script, check that these tables exist:
- ✅ `colleges` (with latitude/longitude for mapping)
- ✅ `scholarships` (with sample scholarship data)
- ✅ `profiles`
- ✅ `quiz_responses`
- ✅ `recommendations`

### Step 3: Test the Application
1. Visit `/scholarships` - Should now show sample scholarships
2. Visit `/colleges` - Should now show colleges on the map
3. If no data appears, check the browser console for authentication errors

## 📊 What's Included

### Sample Colleges
- IIT Delhi
- Delhi University  
- Jawaharlal Nehru University
- All with proper latitude/longitude coordinates

### Sample Scholarships
- National Scholarship Portal Merit Scholarship
- INSPIRE Scholarship
- Post Matric Scholarship SC
- Begum Hazrat Mahal National Scholarship

## 🔧 Alternative: Manual Table Creation
If you prefer to create tables manually, you can also:
1. Create the tables using the schema in `src/integrations/supabase/types.ts`
2. Insert your own data

## 🚀 Next Steps
After fixing the database:
1. The scholarships page will display actual scholarship data
2. The college map will show college markers on the map
3. Users can interact with both features properly

## 💡 Adding More Data
To add more colleges and scholarships:
1. Use the Supabase dashboard Table Editor
2. Or write INSERT statements following the same format
3. Ensure colleges have valid latitude/longitude for mapping

## 🔐 Security Notes
- User-related tables have Row Level Security (RLS) enabled
- Content tables (colleges, scholarships) are publicly readable
- Only authenticated users can access the data
- Users can only modify their own profile/quiz data

---

**Quick Test**: After running the setup, try visiting `/scholarships` and `/colleges` - both should work without "Please check your DB" errors.