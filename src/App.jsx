
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";

import LoginPage from "@/pages/Auth/LoginPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import ResidentsPage from "@/pages/Residents/ResidentsPage";
import ResidentDetailPage from "@/pages/Residents/ResidentDetailPage";
import NewResidentPage from "@/pages/Residents/NewResidentPage";
import EditResidentForm from "@/pages/Residents/EditResidentForm";
import DocumentsPage from "@/pages/Documents/DocumentsPage";
import RequestCertificatePage from "@/pages/Documents/RequestCertificatePage";
import ReportsPage from "@/pages/Reports/ReportsPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import NotFound from "@/pages/NotFound";
import NewResidentForm from './NewResidentForm'
import  DocumentDetailPage from "@/pages/Residents/DocumentDetailPage";
const queryClient = new QueryClient();

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = {
    isAuthenticated: localStorage.getItem('krfs-user') ? true : false,
    isLoading: false
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// PublicRoute component for routes that should redirect to dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = {
    isAuthenticated: localStorage.getItem('krfs-user') ? true : false,
    isLoading: false
  };

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Residents Routes */}
                  <Route
                    path="/residents"
                    element={
                      <PrivateRoute>
                        <ResidentsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/NewResidentForm"
                    element={<NewResidentForm />}
                  />

                  <Route
                    path="/residents/:id"
                    element={
                      <PrivateRoute>
                        <ResidentDetailPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/residents/:id/documents/:docId"
                    element={<DocumentDetailPage />}
                  />
                  <Route
                    path="/residents/new"
                    element={
                      <PrivateRoute>
                        <NewResidentPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="residents/edit/:residentId"
                    element={
                      <PrivateRoute>
                        <EditResidentForm />
                      </PrivateRoute>
                    }
                  />

                  {/* Documents Routes */}
                  <Route
                    path="/documents"
                    element={
                      <PrivateRoute>
                        <DocumentsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/documents/request"
                    element={
                      <PrivateRoute>
                        <RequestCertificatePage />
                      </PrivateRoute>
                    }
                  />

                  {/* Reports Routes */}
                  <Route
                    path="/reports"
                    element={
                      <PrivateRoute>
                        <ReportsPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Notifications Routes */}
                  <Route
                    path="/notifications"
                    element={
                      <PrivateRoute>
                        <NotificationsPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Settings Routes */}
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <SettingsPage />
                      </PrivateRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
