import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import { LayoutProvider } from './context/LayoutContext';
import PropertiesPage from './pages/properties/PropertiesPage';
import CreateProperty from './pages/properties/CreateProperty';
import ProductsPage from './pages/products/ProductsPage';
import CreateProduct from './pages/products/CreateProduct';
import DashboardHome from './pages/dashboard/DashboardHome';
import Login from './pages/Login';
import Error404 from './pages/Error404';
import { Toaster } from 'sonner';

// --- AUTH GUARD ---
const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
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
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:slug" element={<CreateProduct />} />
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