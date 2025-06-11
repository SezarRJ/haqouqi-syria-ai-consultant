
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Pricing from '@/pages/Pricing';
import Admin from '@/pages/Admin';
import BalancePage from '@/pages/BalancePage';
import PaymentMethods from '@/pages/PaymentMethods';
import VoucherPage from '@/pages/VoucherPage';
import TransactionHistory from '@/pages/TransactionHistory';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/voucher" element={<VoucherPage />} />
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  );
}

export default App;
