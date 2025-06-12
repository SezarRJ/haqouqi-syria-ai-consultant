
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import PaymentMethodsPage from "./pages/PaymentMethods";
import TransactionHistory from "./pages/TransactionHistory";
import VoucherPage from "./pages/VoucherPage";
import BalancePage from "./pages/BalancePage";
import NotificationsPage from "./pages/NotificationsPage";
import ServiceProviderListPage from "./pages/ServiceProviderListPage";
import ServiceProviderProfilePage from "./pages/ServiceProviderProfilePage";
import ConsultationPage from "./pages/ConsultationPage";
import DocumentDraftingPage from "./pages/DocumentDraftingPage";
import CaseAnalysisPage from "./pages/CaseAnalysisPage";
import LegalSearchPage from "./pages/LegalSearchPage";
import ExplanationsPage from "./pages/ExplanationsPage";
import OCRServicePage from "./pages/OCRServicePage";
import CollaborationPage from "./pages/CollaborationPage";
import RiskAssessmentPage from "./pages/RiskAssessmentPage";
import AdvancedFeaturesPage from "./pages/AdvancedFeaturesPage";
import AILegalTools from "./pages/AILegalTools";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set initial direction based on saved language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    const language = savedLanguage || 'ar';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/voucher" element={<VoucherPage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/providers" element={<ServiceProviderListPage />} />
            <Route path="/providers/:id" element={<ServiceProviderProfilePage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/document-drafting" element={<DocumentDraftingPage />} />
            <Route path="/case-analysis" element={<CaseAnalysisPage />} />
            <Route path="/legal-search" element={<LegalSearchPage />} />
            <Route path="/explanations" element={<ExplanationsPage />} />
            <Route path="/ocr-service" element={<OCRServicePage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
            <Route path="/advanced-features" element={<AdvancedFeaturesPage />} />
            <Route path="/ai-tools" element={<AILegalTools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
