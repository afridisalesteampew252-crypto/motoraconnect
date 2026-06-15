import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import CalculatorPage from './pages/CalculatorPage';
import AuctionCheckPage from './pages/AuctionCheckPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ConsultationPage from './pages/ConsultationPage';
import ContactPage from './pages/ContactPage';
import AdminLayout from './admin/AdminLayout';
import AdminGuard from './admin/AdminGuard';
import { LoginPage } from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import VehiclesAdminPage from './admin/pages/VehiclesAdminPage';
import BlogAdminPage from './admin/pages/BlogAdminPage';
import ConsultationsAdminPage from './admin/pages/ConsultationsAdminPage';
import ContactsAdminPage from './admin/pages/ContactsAdminPage';
import PaymentsAdminPage from './admin/pages/PaymentsAdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <LayoutWrapper>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/auction-check" element={<AuctionCheckPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="vehicles" element={<VehiclesAdminPage />} />
              <Route path="blog" element={<BlogAdminPage />} />
              <Route path="consultations" element={<ConsultationsAdminPage />} />
              <Route path="contacts" element={<ContactsAdminPage />} />
              <Route path="payments" element={<PaymentsAdminPage />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </div>
    </BrowserRouter>
  );
}
