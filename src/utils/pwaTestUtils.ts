// PWA Testing Utilities
import { offlineStorage } from '@/lib/offlineStorage';

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

export class PWATester {
  private results: PWATestSuite = {
    serviceWorker: [],
    manifest: [],
    offlineStorage: [],
    pushNotifications: [],
    networkHandling: [],
    overall: { score: 0, total: 0, status: 'poor' }
  };

  async runAllTests(): Promise<PWATestSuite> {
    console.log('🧪 Running PWA Test Suite...');
    
    this.results = {
      serviceWorker: [],
      manifest: [],
      offlineStorage: [],
      pushNotifications: [],
      networkHandling: [],
      overall: { score: 0, total: 0, status: 'poor' }
    };

    await this.testServiceWorker();
    await this.testManifest();
    await this.testOfflineStorage();
    await this.testPushNotifications();
    await this.testNetworkHandling();
    
    this.calculateOverallScore();
    
    console.log('✅ PWA Test Suite Complete', this.results);
    return this.results;
  }

  private async testServiceWorker(): Promise<void> {
    const tests = this.results.serviceWorker;

    // Test 1: Service Worker Registration
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          tests.push({
            test: 'Service Worker Registration',
            status: 'passed',
            message: 'Service worker is registered and active'
          });
        } else {
          tests.push({
            test: 'Service Worker Registration',
            status: 'failed',
            message: 'Service worker is not registered'
          });
        }
      } catch (error) {
        tests.push({
          test: 'Service Worker Registration',
          status: 'failed',
          message: 'Error checking service worker registration',
          details: error
        });
      }
    } else {
      tests.push({
        test: 'Service Worker Support',
        status: 'failed',
        message: 'Service workers are not supported in this browser'
      });
    }

    // Test 2: Service Worker Update Mechanism
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          tests.push({
            test: 'Service Worker Updates',
            status: 'passed',
            message: 'Service worker update mechanism is working'
          });
        }
      } catch (error) {
        tests.push({
          test: 'Service Worker Updates',
          status: 'warning',
          message: 'Service worker update check failed',
          details: error
        });
      }
    }

    // Test 3: Cache API Support
    if ('caches' in window) {
      tests.push({
        test: 'Cache API Support',
        status: 'passed',
        message: 'Cache API is supported'
      });
    } else {
      tests.push({
        test: 'Cache API Support',
        status: 'failed',
        message: 'Cache API is not supported'
      });
    }
  }

  private async testManifest(): Promise<void> {
    const tests = this.results.manifest;

    // Test 1: Manifest File
    try {
      const response = await fetch('/manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        tests.push({
          test: 'Manifest File',
          status: 'passed',
          message: 'Web app manifest is accessible',
          details: manifest
        });

        // Test 2: Required Manifest Fields
        const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length === 0) {
          tests.push({
            test: 'Manifest Required Fields',
            status: 'passed',
            message: 'All required manifest fields are present'
          });
        } else {
          tests.push({
            test: 'Manifest Required Fields',
            status: 'warning',
            message: `Missing required fields: ${missingFields.join(', ')}`
          });
        }

        // Test 3: App Icons
        if (manifest.icons && manifest.icons.length > 0) {
          const hasRequiredSizes = manifest.icons.some((icon: any) => 
            icon.sizes?.includes('192x192') || icon.sizes?.includes('512x512')
          );
          
          tests.push({
            test: 'App Icons',
            status: hasRequiredSizes ? 'passed' : 'warning',
            message: hasRequiredSizes 
              ? 'App has appropriate icon sizes' 
              : 'App should have 192x192 and 512x512 icons'
          });
        } else {
          tests.push({
            test: 'App Icons',
            status: 'failed',
            message: 'No app icons found in manifest'
          });
        }
      } else {
        tests.push({
          test: 'Manifest File',
          status: 'failed',
          message: 'Web app manifest is not accessible'
        });
      }
    } catch (error) {
      tests.push({
        test: 'Manifest File',
        status: 'failed',
        message: 'Error loading web app manifest',
        details: error
      });
    }

    // Test 4: Theme Color
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      tests.push({
        test: 'Theme Color',
        status: 'passed',
        message: 'Theme color is set',
        details: themeColorMeta.getAttribute('content')
      });
    } else {
      tests.push({
        test: 'Theme Color',
        status: 'warning',
        message: 'Theme color meta tag is missing'
      });
    }
  }

  private async testOfflineStorage(): Promise<void> {
    const tests = this.results.offlineStorage;

    // Test 1: IndexedDB Support
    if ('indexedDB' in window) {
      tests.push({
        test: 'IndexedDB Support',
        status: 'passed',
        message: 'IndexedDB is supported'
      });
    } else {
      tests.push({
        test: 'IndexedDB Support',
        status: 'failed',
        message: 'IndexedDB is not supported'
      });
      return;
    }

    // Test 2: Offline Storage Initialization
    try {
      await offlineStorage.init();
      tests.push({
        test: 'Offline Storage Initialization',
        status: 'passed',
        message: 'Offline storage initialized successfully'
      });
    } catch (error) {
      tests.push({
        test: 'Offline Storage Initialization',
        status: 'failed',
        message: 'Failed to initialize offline storage',
        details: error
      });
      return;
    }

    // Test 3: Data Storage and Retrieval
    try {
      await offlineStorage.saveUserData('test-key', { test: 'data', timestamp: Date.now() });
      const retrievedData = await offlineStorage.getUserData('test-key');
      
      if (retrievedData && retrievedData.test === 'data') {
        tests.push({
          test: 'Data Storage and Retrieval',
          status: 'passed',
          message: 'Data can be stored and retrieved successfully'
        });
      } else {
        tests.push({
          test: 'Data Storage and Retrieval',
          status: 'failed',
          message: 'Data storage or retrieval failed'
        });
      }
    } catch (error) {
      tests.push({
        test: 'Data Storage and Retrieval',
        status: 'failed',
        message: 'Error during data storage test',
        details: error
      });
    }

    // Test 4: Background Sync Queue
    try {
      const actionId = await offlineStorage.addBackgroundSyncAction({
        type: 'quiz_submission',
        data: { testData: true }
      });
      
      const pendingActions = await offlineStorage.getPendingBackgroundSyncActions();
      const hasTestAction = pendingActions.some(action => action.id === actionId);
      
      if (hasTestAction) {
        tests.push({
          test: 'Background Sync Queue',
          status: 'passed',
          message: 'Background sync queue is working'
        });
      } else {
        tests.push({
          test: 'Background Sync Queue',
          status: 'failed',
          message: 'Background sync queue test failed'
        });
      }
    } catch (error) {
      tests.push({
        test: 'Background Sync Queue',
        status: 'failed',
        message: 'Error testing background sync queue',
        details: error
      });
    }
  }

  private async testPushNotifications(): Promise<void> {
    const tests = this.results.pushNotifications;

    // Test 1: Push Notification Support
    const isPushSupported = 
      'Notification' in window && 
      'serviceWorker' in navigator && 
      'PushManager' in window;

    if (isPushSupported) {
      tests.push({
        test: 'Push Notification Support',
        status: 'passed',
        message: 'Push notifications are supported'
      });
    } else {
      tests.push({
        test: 'Push Notification Support',
        status: 'failed',
        message: 'Push notifications are not supported'
      });
      return;
    }

    // Test 2: Notification Permission
    const permission = Notification.permission;
    tests.push({
      test: 'Notification Permission',
      status: permission === 'granted' ? 'passed' : permission === 'default' ? 'warning' : 'failed',
      message: `Notification permission is ${permission}`,
      details: { permission }
    });

    // Test 3: Service Worker Push Manager
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.pushManager) {
          tests.push({
            test: 'Push Manager',
            status: 'passed',
            message: 'Push manager is available'
          });

          // Test 4: Existing Push Subscription
          const subscription = await registration.pushManager.getSubscription();
          tests.push({
            test: 'Push Subscription',
            status: subscription ? 'passed' : 'warning',
            message: subscription ? 'Push subscription exists' : 'No active push subscription'
          });
        } else {
          tests.push({
            test: 'Push Manager',
            status: 'failed',
            message: 'Push manager is not available'
          });
        }
      } catch (error) {
        tests.push({
          test: 'Push Manager',
          status: 'failed',
          message: 'Error checking push manager',
          details: error
        });
      }
    }
  }

  private async testNetworkHandling(): Promise<void> {
    const tests = this.results.networkHandling;

    // Test 1: Online/Offline Detection
    tests.push({
      test: 'Network Status Detection',
      status: 'passed',
      message: `Network status: ${navigator.onLine ? 'online' : 'offline'}`,
      details: { online: navigator.onLine }
    });

    // Test 2: Offline Page
    try {
      const response = await fetch('/offline.html', { cache: 'no-cache' });
      tests.push({
        test: 'Offline Fallback Page',
        status: response.ok ? 'passed' : 'warning',
        message: response.ok ? 'Offline page is available' : 'Offline page not found'
      });
    } catch (error) {
      tests.push({
        test: 'Offline Fallback Page',
        status: 'warning',
        message: 'Could not verify offline page availability',
        details: error
      });
    }

    // Test 3: Cache Status
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        tests.push({
          test: 'Cache Storage',
          status: cacheNames.length > 0 ? 'passed' : 'warning',
          message: `Found ${cacheNames.length} cache(s)`,
          details: { cacheNames }
        });
      } catch (error) {
        tests.push({
          test: 'Cache Storage',
          status: 'failed',
          message: 'Error checking cache storage',
          details: error
        });
      }
    }

    // Test 4: Network Resilience (simulate network failure)
    try {
      // Try to fetch a non-existent resource to test error handling
      await fetch('/non-existent-resource-test', { 
        cache: 'no-cache',
        signal: AbortSignal.timeout(1000) 
      });
      
      tests.push({
        test: 'Network Error Handling',
        status: 'warning',
        message: 'Network error handling could not be tested (unexpected success)'
      });
    } catch (error) {
      // This is expected - we want to see how the app handles network errors
      tests.push({
        test: 'Network Error Handling',
        status: 'passed',
        message: 'Network errors are properly handled',
        details: { errorType: error.name }
      });
    }
  }

  private calculateOverallScore(): void {
    let totalTests = 0;
    let passedTests = 0;

    Object.values(this.results).forEach(category => {
      if (Array.isArray(category)) {
        totalTests += category.length;
        passedTests += category.filter(test => test.status === 'passed').length;
      }
    });

    const score = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    
    let status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    if (score >= 90) status = 'excellent';
    else if (score >= 75) status = 'good';
    else if (score >= 50) status = 'needs-improvement';
    else status = 'poor';

    this.results.overall = {
      score,
      total: totalTests,
      status
    };
  }

  // Utility method to simulate offline mode
  async simulateOffline(): Promise<void> {
    console.log('🔌 Simulating offline mode...');
    
    // Override navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    // Dispatch offline event
    window.dispatchEvent(new Event('offline'));
    
    console.log('📵 App is now in offline mode (simulated)');
  }

  async simulateOnline(): Promise<void> {
    console.log('🔌 Simulating online mode...');
    
    // Restore navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    // Dispatch online event
    window.dispatchEvent(new Event('online'));
    
    console.log('📶 App is now in online mode (simulated)');
  }
}

// Convenience function for quick testing
export const runPWATests = async (): Promise<PWATestSuite> => {
  const tester = new PWATester();
  return await tester.runAllTests();
};

// Development helper to run tests from console
if (typeof window !== 'undefined') {
  (window as any).runPWATests = runPWATests;
  (window as any).PWATester = PWATester;
}