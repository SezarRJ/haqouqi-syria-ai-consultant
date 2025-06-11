import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import PaymentMethods from "./pages/PaymentMethods";
import VoucherPage from "./pages/VoucherPage";
import TransactionHistory from "./pages/TransactionHistory";
import BalancePage from "./pages/BalancePage";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);

  // Check initial auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setInitialAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!initialAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/voucher" element={<VoucherPage />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
