import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, Sparkles, LogOut, User, Settings, Check, ChevronDown, LogIn } from 'lucide-react';
import { UserProfile } from './AuthModal';

interface TopNavProps {
  onToggleMobileMenu: () => void;
  activeTab: string;
  onNewAnalysisClick: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleMobileMenu,
  activeTab,
  onNewAnalysisClick,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Operations Dashboard';
      case 'analysis':
        return 'Email Analysis & Response Assistant';
      case 'review':
        return 'Human Review Escalations';
      case 'history':
        return 'Activity History & Resolution Logs';
      default:
        return 'Dashboard';
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-900 hidden sm:inline">SupportFlow AI</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-600 font-medium">{getTabTitle(activeTab)}</span>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets, customers, or categories (e.g. refund, order #)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications & User Dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewAnalysisClick}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span> Email Analysis
        </button>

        <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

        {/* Notifications */}
        <button
          title="Notifications"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
        </button>

        {/* Auth State: Logged In vs Logged Out */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-slate-100">
                {currentUser.avatarInitials}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-fadeIn">
                {/* Profile Header */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-1.5 inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {currentUser.role}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <div className="px-4 py-2 text-slate-600 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Support Lead Workspace</span>
                  </div>
                  <div className="px-4 py-2 text-slate-600 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Workspace Settings</span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
