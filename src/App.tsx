import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import OfflineIndicator from "./components/OfflineIndicator";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import CollegesPage from "./pages/CollegesPage";
import Scholarships from "./pages/Scholarships";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import Recommendations from "./pages/Recommendations";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";

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
          <Route 
            path="/dashboard" 
            element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz" 
            element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/colleges" 
            element={
          <ProtectedRoute>
            <CollegesPage />
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/scholarships" 
            element={
          <ProtectedRoute>
            <Scholarships />
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
          <AdminRoute>
            <AdminDashboard />
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
