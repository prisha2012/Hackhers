import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    switch (user.role) {
      case 'participant':
        return '/dashboard/participant';
      case 'organizer':
        return '/dashboard/organizer';
      case 'judge':
        return '/dashboard/judge';
      default:
        return '/dashboard/participant';
    }
  };

  return (
    <nav className="bg-black/10 dark:bg-black/20 backdrop-blur-md border-b border-black/10 dark:border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-[rgb(var(--color-accent))]" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">HackHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/events"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/events'
                  ? 'text-[rgb(var(--color-accent))]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Events
            </Link>
            <button
              onClick={toggleTheme}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden lg:inline">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardLink()}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary px-6 py-2 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="mr-3 text-gray-700 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/5 dark:bg-black/30 backdrop-blur-md border-t border-black/10 dark:border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/events"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 text-base font-medium text-[rgb(var(--color-accent))] hover:opacity-80"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;