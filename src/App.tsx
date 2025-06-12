import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import SettingsPage from '@/pages/Settings';
import AdvancedFeaturesPage from '@/pages/AdvancedFeaturesPage';
import Pricing from '@/pages/Pricing';
import BalancePage from '@/pages/BalancePage';
import VoucherPage from '@/pages/VoucherPage';
import TransactionHistory from '@/pages/TransactionHistory';
import PaymentMethodsPage from '@/pages/PaymentMethods';
import AILegalTools from '@/pages/AILegalTools';
import ConsultationPage from '@/pages/ConsultationPage';
import RiskAssessmentPage from '@/pages/RiskAssessmentPage';
import DocumentDraftingPage from '@/pages/DocumentDraftingPage';
import LegalSearchPage from '@/pages/LegalSearchPage';
import OCRServicePage from '@/pages/OCRServicePage';
import CaseAnalysisPage from '@/pages/CaseAnalysisPage';
import ExplanationsPage from '@/pages/ExplanationsPage';
import CollaborationPage from '@/pages/CollaborationPage';
import NotificationsPage from '@/pages/NotificationsPage';
import Privacy from '@/pages/Privacy';
import Auth from '@/pages/Auth';
// Import the new specific pages for service providers
import ServiceProviderListPage from '@/pages/ServiceProviderListPage'; // Renamed from ServiceProvidersPage
import ServiceProviderProfilePage from '@/pages/ServiceProviderProfilePage'; // New individual profile page

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
      // Ensure HTML dir and lang attributes are set on initial load
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    } else {
      // Set a default language if none found, and apply to HTML
      const defaultLang = 'en'; // Or 'ar' depending on your primary audience
      setLanguage(defaultLang);
      localStorage.setItem('language', defaultLang);
      document.documentElement.dir = defaultLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = defaultLang;
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageChange = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <AppSidebar
            user={user}
            language={language}
            onLanguageChange={handleLanguageChange}
          />
          <SidebarInset className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
              <Route path="/document-drafting" element={<DocumentDraftingPage />} />
              <Route path="/legal-search" element={<LegalSearchPage />} />
              <Route path="/ocr-service" element={<OCRServicePage />} />
              <Route path="/case-analysis" element={<CaseAnalysisPage />} />
              <Route path="/explanations" element={<ExplanationsPage />} />
              <Route path="/collaboration" element={<CollaborationPage />} />
              <Route path="/ai-tools" element={<AILegalTools />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/voucher" element={<VoucherPage />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/advanced-features" element={<AdvancedFeaturesPage />} />

              {/* Service Provider Routes */}
              {/* Note: /service-provider seems redundant with /providers/:id, consider if it's still needed */}
              {/* <Route path="/service-provider" element={<ServiceProviderPage />} /> */}
              <Route path="/providers" element={<ServiceProviderListPage />} /> {/* List of all providers */}
              <Route path="/providers/:id" element={<ServiceProviderProfilePage />} /> {/* Specific provider profile */}

            </Routes>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
};

export default App;
