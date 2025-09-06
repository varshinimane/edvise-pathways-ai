import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context = "career_guidance" } = await req.json();

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    let systemPrompt = '';
    
    switch (context) {
      case 'quiz_analysis':
        systemPrompt = `You are an AI career advisor for EdVise, specializing in analyzing student quiz responses to provide personalized career recommendations. 

        Based on the quiz responses, provide detailed recommendations in JSON format with:
        1. career_recommendations: Array of top 3 career matches with match percentage, description, and reasoning
        2. course_recommendations: Array of relevant courses/majors
        3. skills_to_develop: Array of key skills to focus on
        4. next_steps: Array of actionable next steps

        Focus on Indian education system, engineering, medical, commerce, and emerging fields like AI/ML, data science.`;
        break;
      
      case 'scholarship_guidance':
        systemPrompt = `You are an AI scholarship advisor for EdVise. Help students find relevant scholarships based on their profile, focusing on Indian government and private scholarships. 

        Provide information about:
        - Eligibility criteria
        - Application process
        - Deadlines
        - Required documents
        - Success tips`;
        break;
      
      default:
        systemPrompt = `You are an AI career and education advisor for EdVise, helping Indian students make informed decisions about their academic and career paths.

        You specialize in:
        - Career guidance after 12th grade
        - College selection and admissions
        - Scholarship opportunities
        - Course recommendations
        - Study abroad options
        - Entrance exam preparation

        Always provide practical, actionable advice tailored to the Indian education system.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Query: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response generated from Gemini API');
    }

    return new Response(JSON.stringify({ 
      response: generatedText,
      context: context 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate AI response'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});