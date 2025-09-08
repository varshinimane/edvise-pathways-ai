# Database Setup Instructions

To enable quiz data storage and recommendations, you need to run the SQL commands in your Supabase database.

## Steps:

1. **Go to your Supabase Dashboard**
   - Open your Supabase project
   - Navigate to the SQL Editor

2. **Run the Database Setup**
   - Copy the contents of `supabase-setup.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the commands

3. **Verify Tables Created**
   The following tables should be created:
   - `quiz_responses` - Stores user quiz answers
   - `recommendations` - Stores AI-generated recommendations
   - `profiles` - User profiles
   - `colleges_viewed` - Tracks viewed colleges
   - `applications` - Tracks applications

## What This Enables:

✅ **Quiz Data Storage**: User quiz responses are saved to the database
✅ **Recommendations Generation**: AI generates personalized career recommendations
✅ **Recommendations Display**: The recommendations page shows actual data
✅ **User Privacy**: Row Level Security ensures users only see their own data

## Testing the Flow:

1. Take the career quiz at `/quiz`
2. Complete all questions
3. View your recommendations at `/recommendations`
4. The page should now show your actual career recommendations instead of "No Recommendations Yet"

## Troubleshooting:

If you see "No Recommendations Yet" after taking the quiz:
- Check the browser console for any errors
- Verify the database tables were created successfully
- Ensure your Supabase connection is working
- Check that the user is properly authenticated
