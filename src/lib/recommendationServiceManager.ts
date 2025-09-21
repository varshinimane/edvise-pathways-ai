// Service manager to handle AI vs rule-based recommendation selection
import { generateAIRecommendations } from './aiRecommendationEngine';
import { generateOfflineRecommendations } from './offlineRecommendationEngine';

interface QuizResponse {
  questionId: string;
  answer: string;
  category: string;
}

interface RecommendationResult {
  summary: string;
  strengths: string[];
  work_style: string;
  career_recommendations: any[];
  course_recommendations?: string[];
  recommendation_type: 'AI' | 'Rule-based';
  processing_time: number;
}

export class RecommendationServiceManager {
  private static instance: RecommendationServiceManager;
  
  public static getInstance(): RecommendationServiceManager {
    if (!RecommendationServiceManager.instance) {
      RecommendationServiceManager.instance = new RecommendationServiceManager();
    }
    return RecommendationServiceManager.instance;
  }
  
  /**
   * Main method to get recommendations - chooses between AI or rule-based
   */
  async getRecommendations(
    quizData: QuizResponse[],
    forceOffline: boolean = false
  ): Promise<RecommendationResult> {
    const startTime = Date.now();
    
    // Check if we should use AI recommendations
    const shouldUseAI = this.shouldUseAIRecommendations(forceOffline);
    
    console.log(`Using ${shouldUseAI ? 'AI' : 'Rule-based'} recommendations`);
    
    try {
      let result;
      
      if (shouldUseAI) {
        // Try AI recommendations with fallback
        result = await this.getAIRecommendationsWithFallback(quizData);
      } else {
        // Use rule-based recommendations directly
        result = await this.getRuleBasedRecommendations(quizData);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        ...result,
        processing_time: processingTime
      };
    } catch (error) {
      console.error('Recommendation service error:', error);
      // Ultimate fallback to rule-based
      const fallbackResult = await this.getRuleBasedRecommendations(quizData);
      const processingTime = Date.now() - startTime;
      
      return {
        ...fallbackResult,
        processing_time: processingTime
      };
    }
  }
  
  /**
   * Determines whether to use AI recommendations based on various factors
   */
  private shouldUseAIRecommendations(forceOffline: boolean): boolean {
    // If forced offline, always use rule-based
    if (forceOffline) {
      return false;
    }
    
    // Check network connectivity
    if (!navigator.onLine) {
      console.log('Offline mode detected - using rule-based recommendations');
      return false;
    }
    
    // Check if user has explicitly disabled AI recommendations (could be a setting)
    const userPreference = this.getUserPreference();
    if (userPreference === 'rule-based') {
      console.log('User preference set to rule-based');
      return false;
    }
    
    // Check if we have API access/quota (in production, check API limits)
    if (!this.hasAIServiceAccess()) {
      console.log('AI service not accessible - fallback to rule-based');
      return false;
    }
    
    return true;
  }
  
  /**
   * Try AI recommendations with automatic fallback to rule-based
   */
  private async getAIRecommendationsWithFallback(quizData: QuizResponse[]): Promise<{
    summary: string;
    strengths: string[];
    work_style: string;
    career_recommendations: any[];
    course_recommendations?: string[];
    recommendation_type: 'AI' | 'Rule-based';
  }> {
    try {
      console.log('Attempting AI recommendations...');
      
      // Set a timeout for AI recommendations
      const aiResult = await Promise.race([
        generateAIRecommendations(quizData),
        this.createTimeoutPromise(10000) // 10 second timeout
      ]);
      
      console.log('AI recommendations generated successfully');
      return {
        ...aiResult,
        recommendation_type: 'AI' as const
      };
      
    } catch (error) {
      console.warn('AI recommendation failed, falling back to rule-based:', error);
      
      // Fallback to rule-based
      const ruleBasedResult = generateOfflineRecommendations(quizData);
      return {
        ...ruleBasedResult,
        recommendation_type: 'Rule-based' as const
      };
    }
  }
  
  /**
   * Get rule-based recommendations
   */
  private async getRuleBasedRecommendations(quizData: QuizResponse[]): Promise<{
    summary: string;
    strengths: string[];
    work_style: string;
    career_recommendations: any[];
    course_recommendations?: string[];
    recommendation_type: 'AI' | 'Rule-based';
  }> {
    console.log('Using rule-based recommendations');
    const result = generateOfflineRecommendations(quizData);
    
    return {
      ...result,
      recommendation_type: 'Rule-based' as const
    };
  }
  
  /**
   * Create a timeout promise for AI service calls
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('AI service timeout')), timeout);
    });
  }
  
  /**
   * Check user preference for recommendation type
   * In production, this would read from user settings/localStorage
   */
  private getUserPreference(): 'AI' | 'rule-based' | null {
    try {
      const preference = localStorage.getItem('recommendation_preference');
      return preference as 'AI' | 'rule-based' | null;
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Set user preference for recommendation type
   */
  public setUserPreference(preference: 'AI' | 'rule-based'): void {
    try {
      localStorage.setItem('recommendation_preference', preference);
      console.log(`User preference set to: ${preference}`);
    } catch (error) {
      console.warn('Failed to save user preference:', error);
    }
  }
  
  /**
   * Check if AI service is accessible
   * In production, this would check API keys, quotas, service health, etc.
   */
  private hasAIServiceAccess(): boolean {
    // For now, we'll simulate AI service availability
    // In production, you would:
    // 1. Check if API keys are configured
    // 2. Check API quotas/limits
    // 3. Perform a health check on the AI service
    // 4. Check user's subscription status
    
    // Simulate AI service being available 90% of the time
    // In production, this would be actual service checks
    const isServiceHealthy = Math.random() > 0.1; // 90% availability
    
    // Check if we have required environment variables (API keys)
    // const hasApiKey = !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY;
    
    return isServiceHealthy; // && hasApiKey in production
  }
  
  /**
   * Get service health status
   */
  public async getServiceHealth(): Promise<{
    aiAvailable: boolean;
    ruleBasedAvailable: boolean;
    currentMode: 'AI' | 'Rule-based';
    networkStatus: boolean;
  }> {
    const networkStatus = navigator.onLine;
    const aiAvailable = networkStatus && this.hasAIServiceAccess();
    const ruleBasedAvailable = true; // Always available
    const currentMode = this.shouldUseAIRecommendations(false) ? 'AI' : 'Rule-based';
    
    return {
      aiAvailable,
      ruleBasedAvailable,
      currentMode,
      networkStatus
    };
  }
  
  /**
   * Force refresh of service status
   */
  public refreshServiceStatus(): void {
    console.log('Refreshing recommendation service status...');
    // In production, this would refresh API connection status, check quotas, etc.
  }
  
  /**
   * Get recommendation quality metrics
   */
  public getQualityMetrics(): {
    aiAccuracy: number;
    ruleBasedAccuracy: number;
    userSatisfaction: number;
  } {
    // In production, these would come from analytics/feedback data
    return {
      aiAccuracy: 0.92, // 92% accuracy
      ruleBasedAccuracy: 0.85, // 85% accuracy  
      userSatisfaction: 0.88 // 88% user satisfaction
    };
  }
}

// Export singleton instance
export const recommendationManager = RecommendationServiceManager.getInstance();

// Export convenience function
export async function getSmartRecommendations(
  quizData: QuizResponse[],
  options: { forceOffline?: boolean } = {}
): Promise<RecommendationResult> {
  return await recommendationManager.getRecommendations(quizData, options.forceOffline);
}