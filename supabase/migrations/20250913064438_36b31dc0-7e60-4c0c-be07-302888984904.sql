-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.get_personalized_recommendations(input_user_id UUID)
RETURNS TABLE (
  recommendation_type TEXT,
  recommendation_data JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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