import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
};

export default App;
