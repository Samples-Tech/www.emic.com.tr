import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import LaboratoryPage from './pages/LaboratoryPage';
import DocumentsPage from './pages/DocumentsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import PortalPage from './pages/PortalPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizationsPage from './pages/admin/OrganizationsPage';
import UsersPage from './pages/admin/UsersPage';
import CustomersPage from './pages/admin/CustomersPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import JobsPage from './pages/admin/JobsPage';
import AdminDocumentsPage from './pages/admin/DocumentsPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import HeroManagementPage from './pages/admin/HeroManagementPage';
import ServiceRegionsPage from './pages/admin/ServiceRegionsPage';
import LaboratoryTestsPage from './pages/admin/LaboratoryTestsPage';
import ReferencesPage from './pages/admin/ReferencesPage';
import SpecialDaysPage from './pages/admin/SpecialDaysPage';
import MediaManagementPage from './pages/admin/MediaManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import HeaderManagementPage from './pages/admin/HeaderManagementPage';
import FooterManagementPage from './pages/admin/FooterManagementPage';
import NavigationManagementPage from './pages/admin/NavigationManagementPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/laboratory" element={<Layout><LaboratoryPage /></Layout>} />
        <Route path="/documents" element={<Layout><DocumentsPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route 
          path="/portal" 
          element={
            <ProtectedRoute>
              <PortalPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/organizations" 
          element={
            <ProtectedRoute requireAdmin>
              <OrganizationsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requireAdmin>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customers" 
          element={
            <ProtectedRoute requireAdmin>
              <CustomersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute requireAdmin>
              <ProjectsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/jobs" 
          element={
            <ProtectedRoute requireAdmin>
              <JobsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/documents" 
          element={
            <ProtectedRoute requireAdmin>
              <AdminDocumentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/content" 
          element={
            <ProtectedRoute requireAdmin>
              <ContentManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hero" 
          element={
            <ProtectedRoute requireAdmin>
              <HeroManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/regions" 
          element={
            <ProtectedRoute requireAdmin>
              <ServiceRegionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/laboratory" 
          element={
            <ProtectedRoute requireAdmin>
              <LaboratoryTestsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/references" 
          element={
            <ProtectedRoute requireAdmin>
              <ReferencesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/special-days" 
          element={
            <ProtectedRoute requireAdmin>
              <SpecialDaysPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/media" 
          element={
            <ProtectedRoute requireAdmin>
              <MediaManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute requireAdmin>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/header" 
          element={
            <ProtectedRoute requireAdmin>
              <HeaderManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/footer" 
          element={
            <ProtectedRoute requireAdmin>
              <FooterManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/navigation" 
          element={
            <ProtectedRoute requireAdmin>
              <NavigationManagementPage />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;