import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      console.log('🔄 Starting auth callback process...');
      
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Log all parameters for debugging
      console.log('📋 URL params:', Object.fromEntries(urlParams));
      console.log('📋 Hash params:', Object.fromEntries(hashParams));
      
      const accessToken = urlParams.get('access_token') || hashParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
      const type = urlParams.get('type') || hashParams.get('type');
      const error = urlParams.get('error') || hashParams.get('error');
      const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

      // Handle errors first
      if (error) {
        console.error('❌ Auth callback error:', error, errorDescription);
        setStatus('error');
        setMessage(errorDescription || 'An error occurred during email verification.');
        return;
      }

      // Handle successful verification with tokens
      if (accessToken && refreshToken) {
        console.log('✅ Tokens found, setting session...', { type });
        
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('❌ Error setting session:', sessionError);
          setStatus('error');
          setMessage('Failed to verify email. Please try again.');
        } else {
          console.log('✅ Session set successfully:', data.user?.email);
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to dashboard...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        }
      } else {
        // Check if we already have a session
        console.log('🔍 No tokens found, checking existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Existing session found:', session.user.email);
          setStatus('success');
          setMessage('Already signed in! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
        } else {
          console.log('❌ No tokens and no session found');
          setStatus('error');
          setMessage('Email verification link is invalid or expired. Please try signing up again.');
        }
      }
    } catch (error) {
      console.error('❌ Auth callback error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-foreground">EdVise</span>
          </div>
        </div>

        <Card className="card-gradient border-border p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-accent mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="flex justify-center space-x-3">
                <Button onClick={() => navigate('/')} className="bg-accent hover:bg-accent/90">
                  Go to Home
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Back to Login
                </Button>
                <Button onClick={() => navigate('/')} className="bg-accent hover:bg-accent/90">
                  Go to Home
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;