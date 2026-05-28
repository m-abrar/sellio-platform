/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { LayoutProvider } from './context/LayoutContext';
import PropertiesPage from './pages/properties/PropertiesPage';
import CreateProperty from './pages/properties/CreateProperty';
import PropertyDetailPage from './pages/properties/PropertyDetailPage';
import ProductsPage from './pages/products/ProductsPage';
import CreateProduct from './pages/products/CreateProduct';
import ProductDetailPage from './pages/products/ProductDetailPage';
import AutosPage from './pages/autos/AutosPage';
import CreateAuto from './pages/autos/CreateAuto';
import AutoDetailPage from './pages/autos/AutoDetailPage';
import EventsPage from './pages/events/EventsPage';
import CreateEvent from './pages/events/CreateEvent';
import EventDetailPage from './pages/events/EventDetailPage';
import ServicesPage from './pages/services/ServicesPage';
import CreateService from './pages/services/CreateService';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import JobsPage from './pages/jobs/JobsPage';
import CreateJob from './pages/jobs/CreateJob';
import JobDetailPage from './pages/jobs/JobDetailPage';
import ClassifiedsPage from './pages/classifieds/ClassifiedsPage';
import CreateClassified from './pages/classifieds/CreateClassified';
import ClassifiedDetailPage from './pages/classifieds/ClassifiedDetailPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import SettingsPage from './pages/settings/SettingsPage';
import CustomersPage from './pages/customers/CustomersPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import MessagesPage from './pages/messages/MessagesPage';
import WalletPage from './pages/wallet/WalletPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import MembershipsPage from './pages/memberships/MembershipsPage';
import ActivityPage from './pages/activity/ActivityPage';
import ActivityDetailPage from './pages/activity/ActivityDetailPage';
import DashboardHome from './pages/dashboard/DashboardHome';
import NotificationsPage from './pages/notifications/NotificationsPage';
import Login from './pages/Login';
import Error404 from './pages/Error404';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { getBrandSettings } from './api/brand';

function App() {
  useEffect(() => {
    const updateHeadLink = (rel: string, href: string, type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (type) link.type = type;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    const loadBrandSettings = async () => {
      try {
        const brand = await getBrandSettings();
        if (brand) {
          if (brand.site_name) {
            document.title = `${brand.site_name} - Seller Dashboard`;
          }
          if (brand.site_favicon) {
            updateHeadLink('icon', brand.site_favicon, 'image/svg+xml');
            updateHeadLink('alternate icon', brand.site_favicon, 'image/x-icon');
          }
          if (brand.site_logo) {
            updateHeadLink('apple-touch-icon', brand.site_logo);
          }
        }
      } catch (error) {
        console.error('Failed to load dynamic brand settings:', error);
      }
    };

    loadBrandSettings();
  }, []);

  return (
    <LayoutProvider>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<Error404 />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Dashboard Group */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="properties/create" element={<CreateProperty />} />
              <Route path="properties/edit/:slug" element={<CreateProperty />} />
              <Route path="properties/view/:slug" element={<PropertyDetailPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:slug" element={<CreateProduct />} />
              <Route path="products/view/:slug" element={<ProductDetailPage />} />
              <Route path="autos" element={<AutosPage />} />
              <Route path="autos/create" element={<CreateAuto />} />
              <Route path="autos/edit/:slug" element={<CreateAuto />} />
              <Route path="autos/view/:slug" element={<AutoDetailPage />} />
              
              <Route path="events" element={<EventsPage />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="events/edit/:slug" element={<CreateEvent />} />
              <Route path="events/view/:slug" element={<EventDetailPage />} />
              
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/create" element={<CreateService />} />
              <Route path="services/edit/:slug" element={<CreateService />} />
              <Route path="services/view/:slug" element={<ServiceDetailPage />} />
              
              <Route path="joblistings" element={<JobsPage />} />
              <Route path="joblistings/create" element={<CreateJob />} />
              <Route path="joblistings/edit/:slug" element={<CreateJob />} />
              <Route path="joblistings/view/:slug" element={<JobDetailPage />} />
              
              <Route path="classifieds" element={<ClassifiedsPage />} />
              <Route path="classifieds/create" element={<CreateClassified />} />
              <Route path="classifieds/edit/:slug" element={<CreateClassified />} />
              <Route path="classifieds/view/:slug" element={<ClassifiedDetailPage />} />

              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerDetailPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="memberships" element={<MembershipsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path=":module/:type" element={<ActivityPage />} />
              <Route path=":module/:type/:id" element={<ActivityDetailPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
