-- Add additional personalization fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN IF NOT EXISTS class_level TEXT,
ADD COLUMN IF NOT EXISTS academic_interests TEXT[],
ADD COLUMN IF NOT EXISTS preferred_subjects TEXT[],
ADD COLUMN IF NOT EXISTS career_goals TEXT[],
ADD COLUMN IF NOT EXISTS learning_style TEXT,
ADD COLUMN IF NOT EXISTS stream TEXT CHECK (stream IN ('science', 'commerce', 'arts', 'vocational'));

-- Create user_timeline_subscriptions table for timeline notifications
CREATE TABLE IF NOT EXISTS public.user_timeline_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notification_preferences JSONB NOT NULL DEFAULT '{"push": true, "email": true, "sms": false, "reminder_days": [7, 1]}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_timeline_subscriptions
ALTER TABLE public.user_timeline_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_timeline_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_timeline_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.user_timeline_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_timeline_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" 
ON public.user_timeline_subscriptions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on user_timeline_subscriptions
CREATE TRIGGER update_user_timeline_subscriptions_updated_at
BEFORE UPDATE ON public.user_timeline_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to get personalized recommendations
CREATE OR REPLACE FUNCTION public.get_personalized_recommendations(input_user_id UUID)
RETURNS TABLE (
  recommendation_type TEXT,
  recommendation_data JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile 
  FROM public.profiles 
  WHERE user_id = input_user_id;
  
  -- Return personalized college recommendations based on location
  IF user_profile.location IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      'nearby_colleges'::TEXT,
      jsonb_build_object(
        'colleges', 
        jsonb_agg(
          jsonb_build_object(
            'name', c.name,
            'location', c.location,
            'courses_offered', c.courses_offered,
            'fees_range', c.fees_range
          )
        )
      )
    FROM public.colleges c 
    WHERE c.state = (
      SELECT SPLIT_PART(user_profile.location, ',', -1)
    )
    LIMIT 10;
  END IF;
  
  -- Return scholarship recommendations
  RETURN QUERY
  SELECT 
    'scholarships'::TEXT,
    jsonb_build_object(
      'scholarships',
      jsonb_agg(
        jsonb_build_object(
          'name', s.name,
          'provider', s.provider,
          'amount', s.amount,
          'eligibility_criteria', s.eligibility_criteria
        )
      )
    )
  FROM public.scholarships s 
  WHERE s.is_active = true
  LIMIT 5;
  
  RETURN;
END;
$$;