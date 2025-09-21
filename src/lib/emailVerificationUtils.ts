// Email verification utilities and debugging helpers
import { supabase } from '@/integrations/supabase/client';
import { getSiteUrl, getEmailRedirectUrl, logSiteConfig } from './siteConfig';

export interface VerificationStatus {
  isConfigured: boolean;
  siteUrl: string;
  redirectUrl: string;
  supabaseUrl: string;
  issues: string[];
}

/**
 * Check if email verification is properly configured
 */
export const checkEmailVerificationConfig = (): VerificationStatus => {
  const issues: string[] = [];
  const siteUrl = getSiteUrl();
  const redirectUrl = getEmailRedirectUrl('/auth/callback');
  const supabaseUrl = supabase.supabaseUrl;

  // Check if site URL is configured
  if (siteUrl === 'http://localhost:8080' && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    issues.push('Site URL is using fallback localhost but app is not running on localhost');
  }

  // Check if redirect URL is valid
  try {
    new URL(redirectUrl);
  } catch {
    issues.push('Invalid redirect URL format');
  }

  // Check if Supabase is configured
  if (!supabaseUrl) {
    issues.push('Supabase URL is not configured');
  }

  // Check environment variables
  if (!import.meta.env.VITE_SUPABASE_URL) {
    issues.push('VITE_SUPABASE_URL environment variable is missing');
  }

  if (!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    issues.push('VITE_SUPABASE_PUBLISHABLE_KEY environment variable is missing');
  }

  return {
    isConfigured: issues.length === 0,
    siteUrl,
    redirectUrl,
    supabaseUrl,
    issues,
  };
};

/**
 * Log comprehensive email verification status
 */
export const logEmailVerificationStatus = (): void => {
  console.group('📧 Email Verification Status');
  
  const status = checkEmailVerificationConfig();
  
  logSiteConfig();
  
  console.log('🔧 Configuration Status:', status.isConfigured ? '✅ OK' : '❌ Issues Found');
  console.log('🌐 Site URL:', status.siteUrl);
  console.log('🔄 Redirect URL:', status.redirectUrl);
  console.log('🗄️ Supabase URL:', status.supabaseUrl);
  
  if (status.issues.length > 0) {
    console.group('⚠️ Issues Found:');
    status.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
};

/**
 * Test email verification flow (for development)
 */
export const testEmailVerificationFlow = async (email: string): Promise<boolean> => {
  try {
    console.log('🧪 Testing email verification flow for:', email);
    
    const redirectUrl = getEmailRedirectUrl('/auth/callback');
    console.log('📍 Using redirect URL:', redirectUrl);
    
    // This would normally trigger an email, so only use in development
    if (!import.meta.env.DEV) {
      console.warn('⚠️ Email verification test should only be run in development');
      return false;
    }
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) {
      console.error('❌ Test failed:', error);
      return false;
    }
    
    console.log('✅ Test email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
};

/**
 * Resend verification email for current user
 */
export const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No user found' };
    }
    
    if (user.email_confirmed_at) {
      return { success: false, error: 'Email is already verified' };
    }
    
    const redirectUrl = getEmailRedirectUrl('/auth/callback');
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email!,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    console.log('📧 Verification email resent to:', user.email);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

/**
 * Get user's email verification status
 */
export const getUserVerificationStatus = async (): Promise<{
  isSignedIn: boolean;
  isVerified: boolean;
  email?: string;
  userId?: string;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    return {
      isSignedIn: !!user,
      isVerified: !!user?.email_confirmed_at,
      email: user?.email,
      userId: user?.id,
    };
  } catch (error) {
    console.error('Error getting user verification status:', error);
    return {
      isSignedIn: false,
      isVerified: false,
    };
  }
};