
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import PaymentMethods from "./pages/PaymentMethods";
import TransactionHistory from "./pages/TransactionHistory";
import BalancePage from "./pages/BalancePage";
import VoucherPage from "./pages/VoucherPage";
import NotificationsPage from "./pages/NotificationsPage";
import ConsultationPage from "./pages/ConsultationPage";
import LegalSearchPage from "./pages/LegalSearchPage";
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import DocumentDraftingPage from "./pages/DocumentDraftingPage";
import ExplanationsPage from "./pages/ExplanationsPage";
import CollaborationPage from "./pages/CollaborationPage";
import AdvancedFeaturesPage from "./pages/AdvancedFeaturesPage";
import CaseAnalysisPage from "./pages/CaseAnalysisPage";
import OCRServicePage from "./pages/OCRServicePage";
import AILegalTools from "./pages/AILegalTools";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ServiceProviderListPage from "./pages/ServiceProviderListPage";
import ServiceProviderProfilePage from "./pages/ServiceProviderProfilePage";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [language, setLanguage] = useState<'ar' | 'en'>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/transaction-history" element={<TransactionHistory />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/voucher" element={<VoucherPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/consultation" element={<ConsultationPage />} />
              <Route path="/legal-search" element={<LegalSearchPage />} />
              <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
              <Route path="/document-drafting" element={<DocumentDraftingPage />} />
              <Route path="/explanations" element={<ExplanationsPage />} />
              <Route path="/collaboration" element={<CollaborationPage />} />
              <Route path="/advanced-features" element={<AdvancedFeaturesPage />} />
              <Route path="/case-analysis" element={<CaseAnalysisPage />} />
              <Route path="/ocr-service" element={<OCRServicePage />} />
              <Route path="/ai-legal-tools" element={<AILegalTools />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/providers" element={<ServiceProviderListPage />} />
              <Route path="/providers/:id" element={<ServiceProviderProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
