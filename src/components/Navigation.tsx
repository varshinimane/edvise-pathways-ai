import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Brain, 
  MapPin, 
  Award, 
  MessageCircle, 
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Career Quiz', path: '/quiz', icon: Brain },
    { name: 'Recommendations', path: '/recommendations', icon: Brain },
    { name: 'Colleges', path: '/colleges', icon: MapPin },
    { name: 'Scholarships', path: '/scholarships', icon: Award },
    { name: 'Study Materials', path: '/study-materials', icon: BookOpen },
    { name: 'Chat', path: '/chat', icon: MessageCircle }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-card/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EdVise</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0.5 ml-6">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"} 
                  size="sm"
                  className={`text-xs font-medium transition-all duration-200 px-2 py-1 ${
                    isActive(item.path) 
                      ? "bg-primary text-primary-foreground shadow-medium" 
                      : "hover:bg-secondary/60"
                  }`}
                >
                  <item.icon className="h-3 w-3 mr-1" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* User Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-medium z-50">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-start mt-2">
                        <Settings className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "ghost"} 
                    className={`w-full justify-start ${
                      isActive(item.path) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary/60"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;