import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GeminiResponse {
  response: string;
  context: string;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callGeminiAPI = async (
    message: string, 
    context: 'career_guidance' | 'quiz_analysis' | 'scholarship_guidance' = 'career_guidance'
  ): Promise<GeminiResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('gemini-chat', {
        body: { message, context }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      console.error('Gemini API error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    callGeminiAPI,
    isLoading,
    error
  };
};