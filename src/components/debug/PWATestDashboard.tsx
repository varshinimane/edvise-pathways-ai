import React, { useState, useEffect } from 'react';
import { PWATester, runPWATests } from '@/utils/pwaTestUtils';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  WifiOff, 
  Wifi,
  Monitor
} from 'lucide-react';

interface TestResult {
  test: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
}

interface PWATestSuite {
  serviceWorker: TestResult[];
  manifest: TestResult[];
  offlineStorage: TestResult[];
  pushNotifications: TestResult[];
  networkHandling: TestResult[];
  overall: {
    score: number;
    total: number;
    status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  };
}

export const PWATestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<PWATestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('overall');
  const [tester] = useState(() => new PWATester());

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await runPWATests();
      setTestResults(results);
    } catch (error) {
      console.error('Error running PWA tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const simulateOffline = async () => {
    await tester.simulateOffline();
    // Re-run tests after simulating offline
    setTimeout(runTests, 1000);
  };

  const simulateOnline = async () => {
    await tester.simulateOnline();
    // Re-run tests after simulating online
    setTimeout(runTests, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const categories = [
    { key: 'overall', label: 'Overall Score', icon: Monitor },
    { key: 'serviceWorker', label: 'Service Worker', icon: RefreshCw },
    { key: 'manifest', label: 'Web Manifest', icon: Monitor },
    { key: 'offlineStorage', label: 'Offline Storage', icon: Monitor },
    { key: 'pushNotifications', label: 'Push Notifications', icon: Monitor },
    { key: 'networkHandling', label: 'Network Handling', icon: Wifi }
  ];

  const renderTestResults = (tests: TestResult[]) => {
    if (!tests || tests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No test results available
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tests.map((test, index) => (
          <div 
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border bg-white"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getStatusIcon(test.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{test.test}</div>
              <div className="text-sm text-gray-600 mt-1">{test.message}</div>
              {test.details && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverallScore = () => {
    if (!testResults) return null;

    const { overall } = testResults;
    
    return (
      <div className="text-center py-8">
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 ${getScoreColor(overall.status)}`}>
          <div className="text-4xl font-bold">{overall.score}%</div>
          <div>
            <div className="font-semibold text-lg capitalize">{overall.status.replace('-', ' ')}</div>
            <div className="text-sm opacity-75">{overall.score} of {overall.total} tests passed</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {categories.slice(1).map(category => {
            const tests = testResults[category.key as keyof typeof testResults] as TestResult[];
            if (!Array.isArray(tests)) return null;
            
            const passed = tests.filter(t => t.status === 'passed').length;
            const total = tests.length;
            const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
            
            return (
              <div 
                key={category.key}
                className="p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedCategory(category.key)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="w-4 h-4 text-gray-600" />
                  <div className="text-sm font-medium text-gray-900">{category.label}</div>
                </div>
                <div className="text-xl font-bold text-gray-900">{percentage}%</div>
                <div className="text-xs text-gray-500">{passed}/{total} passed</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PWA Test Dashboard</h1>
        <p className="text-gray-600">
          Test and validate your Progressive Web App implementation
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isRunning ? 'Running Tests...' : 'Run PWA Tests'}
        </button>
        
        <button
          onClick={simulateOffline}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <WifiOff className="w-4 h-4" />
          Simulate Offline
        </button>
        
        <button
          onClick={simulateOnline}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Wifi className="w-4 h-4" />
          Simulate Online
        </button>
      </div>

      {testResults && (
        <>
          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* Test Results */}
          <div className="bg-gray-50 rounded-lg p-6">
            {selectedCategory === 'overall' ? (
              renderOverallScore()
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {categories.find(c => c.key === selectedCategory)?.label} Tests
                </h2>
                {renderTestResults(testResults[selectedCategory as keyof typeof testResults] as TestResult[])}
              </>
            )}
          </div>
        </>
      )}

      {!testResults && !isRunning && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Test</h3>
          <p className="text-gray-600 mb-4">
            Run the PWA test suite to check your app's offline capabilities, manifest, 
            service worker, and more.
          </p>
          <button
            onClick={runTests}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Play className="w-5 h-5" />
            Start Testing
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How to Use</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Run PWA Tests" to validate your app's PWA implementation</li>
          <li>• Use "Simulate Offline/Online" to test network state handling</li>
          <li>• Check different categories to see detailed test results</li>
          <li>• Open browser dev tools console for additional logging</li>
          <li>• Access from console: <code className="bg-blue-100 px-1 rounded">runPWATests()</code></li>
        </ul>
      </div>
    </div>
  );
};

// Development helper - only show in development
export const PWATestDashboardRoute: React.FC = () => {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">PWA Test Dashboard</h2>
        <p className="text-gray-600">Only available in development mode</p>
      </div>
    );
  }

  return <PWATestDashboard />;
};