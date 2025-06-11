
import { useState, useEffect } from 'react';

// Define types for when Capacitor is not available
interface MockCapacitor {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
}

interface MockApp {
  addListener: (event: string, callback: any) => { remove: () => void };
  exitApp: () => void;
}

interface MockStatusBar {
  setStyle: (options: any) => void;
  setBackgroundColor: (options: any) => void;
}

interface MockKeyboard {
  hide: () => void;
}

interface MockHaptics {
  impact: (options: any) => void;
}

// Mock implementations for web environment
const mockCapacitor: MockCapacitor = {
  isNativePlatform: () => false,
  getPlatform: () => 'web'
};

const mockApp: MockApp = {
  addListener: () => ({ remove: () => {} }),
  exitApp: () => {}
};

const mockStatusBar: MockStatusBar = {
  setStyle: () => {},
  setBackgroundColor: () => {}
};

const mockKeyboard: MockKeyboard = {
  hide: () => {}
};

const mockHaptics: MockHaptics = {
  impact: () => {}
};

// Dynamically import Capacitor modules with fallbacks
let Capacitor: any = mockCapacitor;
let App: any = mockApp;
let StatusBar: any = mockStatusBar;
let Keyboard: any = mockKeyboard;
let Haptics: any = mockHaptics;
let Style: any = { Light: 'LIGHT' };
let ImpactStyle: any = { Light: 'LIGHT', Medium: 'MEDIUM', Heavy: 'HEAVY' };

// Try to import Capacitor modules if available
try {
  const capacitorCore = require('@capacitor/core');
  const capacitorApp = require('@capacitor/app');
  const capacitorStatusBar = require('@capacitor/status-bar');
  const capacitorKeyboard = require('@capacitor/keyboard');
  const capacitorHaptics = require('@capacitor/haptics');
  
  Capacitor = capacitorCore.Capacitor;
  App = capacitorApp.App;
  StatusBar = capacitorStatusBar.StatusBar;
  Style = capacitorStatusBar.Style;
  Keyboard = capacitorKeyboard.Keyboard;
  Haptics = capacitorHaptics.Haptics;
  ImpactStyle = capacitorHaptics.ImpactStyle;
} catch (error) {
  console.log('Capacitor modules not available, using web fallbacks');
}

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [appState, setAppState] = useState<'active' | 'background'>('active');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (Capacitor.isNativePlatform()) {
      // Configure status bar
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#3b82f6' });

      // Listen for app state changes
      const appStateListener = App.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
        setAppState(isActive ? 'active' : 'background');
      });

      // Handle back button on Android
      const backButtonListener = App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      return () => {
        appStateListener.remove();
        backButtonListener.remove();
      };
    }
  }, []);

  const hapticFeedback = (style: any = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style });
    }
  };

  const hideKeyboard = () => {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
  };

  const setStatusBarStyle = (style: any) => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style });
    }
  };

  return {
    isNative,
    appState,
    hapticFeedback,
    hideKeyboard,
    setStatusBarStyle,
    platform: Capacitor.getPlatform()
  };
};
