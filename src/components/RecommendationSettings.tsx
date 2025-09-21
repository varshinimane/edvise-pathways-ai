import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Zap, 
  Wrench, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertCircle,
  Info,
  Cpu
} from 'lucide-react';
import { recommendationManager } from '@/lib/recommendationServiceManager';

interface RecommendationSettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const RecommendationSettings: React.FC<RecommendationSettingsProps> = ({ 
  isOpen = false, 
  onClose 
}) => {
  const [preference, setPreference] = useState<'AI' | 'rule-based' | null>(null);
  const [serviceHealth, setServiceHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentSettings();
    checkServiceHealth();
  }, []);

  const loadCurrentSettings = () => {
    try {
      const savedPreference = localStorage.getItem('recommendation_preference');
      setPreference(savedPreference as 'AI' | 'rule-based' | null);
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }
  };

  const checkServiceHealth = async () => {
    try {
      setIsLoading(true);
      const health = await recommendationManager.getServiceHealth();
      setServiceHealth(health);
    } catch (error) {
      console.error('Failed to check service health:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (newPreference: 'AI' | 'rule-based') => {
    setPreference(newPreference);
    recommendationManager.setUserPreference(newPreference);
  };

  const resetToAuto = () => {
    setPreference(null);
    try {
      localStorage.removeItem('recommendation_preference');
    } catch (error) {
      console.warn('Failed to clear preference:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-gradient border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Recommendation Settings</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Service Status */}
          {!isLoading && serviceHealth && (
            <Card className="bg-secondary/20 border-border/50 p-4 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Service Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network Status</span>
                  <div className="flex items-center space-x-1">
                    {serviceHealth.networkStatus ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Offline</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Service</span>
                  <div className="flex items-center space-x-1">
                    {serviceHealth.aiAvailable ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rule-Based Service</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Available</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Mode</span>
                  <Badge variant={serviceHealth.currentMode === 'AI' ? 'default' : 'secondary'}>
                    {serviceHealth.currentMode}
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          {/* Recommendation Preference */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Choose Your Recommendation Style</h3>
            
            {/* Auto Mode */}
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                preference === null 
                  ? 'bg-primary/20 border-primary' 
                  : 'bg-secondary/20 border-border/50 hover:bg-secondary/30'
              }`}
              onClick={resetToAuto}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-foreground">Smart Auto Mode</h4>
                    <Badge variant="outline" className="text-xs">Recommended</Badge>
                  </div>
                  {preference === null && <CheckCircle className="h-5 w-5 text-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically uses AI when online for enhanced personalization, falls back to 
                  rule-based when offline. Best of both worlds with intelligent switching.
                </p>
              </div>
            </Card>

            {/* AI Mode */}
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                preference === 'AI' 
                  ? 'bg-blue-500/20 border-blue-500' 
                  : 'bg-secondary/20 border-border/50 hover:bg-secondary/30'
              } ${!serviceHealth?.aiAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => serviceHealth?.aiAvailable && handlePreferenceChange('AI')}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold text-foreground">AI-Powered Only</h4>
                    {!serviceHealth?.aiAvailable && (
                      <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                    )}
                  </div>
                  {preference === 'AI' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Always use advanced AI analysis for highly personalized and nuanced career 
                  recommendations. Requires internet connection.
                </p>
              </div>
            </Card>

            {/* Rule-Based Mode */}
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                preference === 'rule-based' 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-secondary/20 border-border/50 hover:bg-secondary/30'
              }`}
              onClick={() => handlePreferenceChange('rule-based')}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Wrench className="h-5 w-5 text-green-500" />
                    <h4 className="font-semibold text-foreground">Rule-Based Only</h4>
                    <Badge variant="secondary" className="text-xs">Always Available</Badge>
                  </div>
                  {preference === 'rule-based' && <CheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  Use reliable, expert-crafted algorithms for consistent career recommendations. 
                  Works offline and provides fast, dependable results.
                </p>
              </div>
            </Card>
          </div>

          {/* Comparison */}
          <Card className="bg-secondary/20 border-border/50 p-4 mt-6">
            <h4 className="font-semibold text-foreground mb-3">Quick Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-blue-600 mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  AI-Powered
                </h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• More personalized insights</li>
                  <li>• Advanced pattern recognition</li>
                  <li>• Contextual understanding</li>
                  <li>• Requires internet connection</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-600 mb-2 flex items-center">
                  <Wrench className="h-4 w-4 mr-1" />
                  Rule-Based
                </h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Consistent and reliable</li>
                  <li>• Expert-crafted logic</li>
                  <li>• Works offline</li>
                  <li>• Fast processing</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Done
            </Button>
            <Button onClick={checkServiceHealth} disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Refresh Status'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecommendationSettings;