
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';

interface PWAInstallerProps {
  language: 'ar' | 'en';
}

export const PWAInstaller: React.FC<PWAInstallerProps> = ({ language }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const texts = {
    ar: {
      install: 'تثبيت التطبيق',
      installDesc: 'ثبت التطبيق على جهازك للوصول السريع',
      installButton: 'تثبيت الآن',
      dismiss: 'تجاهل',
      installed: 'تم التثبيت بنجاح'
    },
    en: {
      install: 'Install App',
      installDesc: 'Install the app on your device for quick access',
      installButton: 'Install Now',
      dismiss: 'Dismiss',
      installed: 'Successfully Installed'
    }
  };

  const t = texts[language];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.navigator && 'standalone' in window.navigator) {
      setIsInstalled((window.navigator as any).standalone);
    } else if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
            <Smartphone className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 text-sm mb-1">
              {t.install}
            </h3>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              {t.installDesc}
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1 mobile-touch"
              >
                <Download className="h-4 w-4 mr-1" />
                {t.installButton}
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="outline"
                size="sm"
                className="mobile-touch"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
