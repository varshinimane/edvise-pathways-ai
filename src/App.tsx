import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import OfflineIndicator from "./components/OfflineIndicator";
import SuspenseLoader from "./components/SuspenseLoader";
import { lazy, Suspense, useEffect } from "react";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

// Lazy load heavy components for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const CollegesPage = lazy(() => import("./pages/CollegesPage"));
const Scholarships = lazy(() => import("./pages/Scholarships"));
const StudyMaterials = lazy(() => import("./pages/StudyMaterials"));
const Chat = lazy(() => import("./pages/Chat"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      <OfflineIndicator />
      <main className={user ? "pt-16" : ""}>
      <Routes>
          <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <Dashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <Quiz />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/colleges" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <CollegesPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scholarships" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <Scholarships />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study-materials" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <StudyMaterials />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <Chat />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <Recommendations />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <ProfileSettings />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Suspense fallback={<SuspenseLoader />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            } 
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      </main>
    </div>
  );
};

const App = () => (
    <TooltipProvider>
      <Toaster />
      <Sonner />
          <AppContent />
    </TooltipProvider>
);

export default App;
