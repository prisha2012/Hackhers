import React, { useState } from 'react';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  sidebarItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  children,
  sidebarItems,
  activeTab,
  setActiveTab
}) => {
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#0b1b3a] dark:to-[#1a202c]">
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/70 dark:bg-black/20 backdrop-blur-md border-r border-black/10 dark:border-white/10 transform transition-transform lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 mb-1 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-[rgb(var(--color-accent))] text-slate-900'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info in sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[rgb(var(--color-accent))] to-blue-600 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="bg-white/70 dark:bg-black/20 backdrop-blur-md border-b border-black/10 dark:border-white/10 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="lg:hidden text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[rgb(var(--color-accent))] to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;