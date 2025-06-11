
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
      const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
        setAppState(isActive ? 'active' : 'background');
      });

      // Handle back button on Android
      const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
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

  const hapticFeedback = (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style });
    }
  };

  const hideKeyboard = () => {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
  };

  const setStatusBarStyle = (style: Style) => {
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
