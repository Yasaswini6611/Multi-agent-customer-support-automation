import React, { useState, useRef, useEffect } from 'react';
import { Headphones, Sparkles, LogOut, User, Settings, ChevronDown, LogIn, Menu, X, ArrowRight } from 'lucide-react';
import { UserProfile } from './AuthModal';

interface TopNavProps {
  onHomeClick: () => void;
  onAnalyzeClick: () => void;
  onHowItWorksClick: () => void;
  onGetStartedClick: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  activeSection: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  onHomeClick,
  onAnalyzeClick,
  onHowItWorksClick,
  onGetStartedClick,
  currentUser,
  onOpenLogin,
  onLogout,
  activeSection,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand: SupportFlow AI in top-left with simple professional logo */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-2.5 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight block">
              SupportFlow AI
            </span>
            <span className="text-[10px] text-slate-400 font-medium block -mt-1">
              Customer Support Automation
            </span>
          </div>
        </button>

        {/* Minimal Navigation Bar: Home, Analyze Message, How It Works */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <button
            onClick={onHomeClick}
            className={`hover:text-blue-600 transition-colors cursor-pointer ${
              activeSection === 'home' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={onAnalyzeClick}
            className={`hover:text-blue-600 transition-colors cursor-pointer ${
              activeSection === 'analyze' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            Analyze Message
          </button>
          <button
            onClick={onHowItWorksClick}
            className={`hover:text-blue-600 transition-colors cursor-pointer ${
              activeSection === 'how-it-works' ? 'text-blue-600 font-bold' : ''
            }`}
          >
            How It Works
          </button>
        </nav>

        {/* Right Action Zone: Sign In & Prominent "Get Started" Button */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-slate-100">
                  {currentUser.avatarInitials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs animate-fadeIn">
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

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
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
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onGetStartedClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onGetStartedClick}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 bg-white">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onHomeClick();
            }}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onAnalyzeClick();
            }}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
          >
            Analyze Message
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onHowItWorksClick();
            }}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
          >
            How It Works
          </button>
          <div className="pt-2 border-t border-slate-100">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left py-2 text-xs font-semibold text-rose-600"
              >
                Log Out ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full text-left py-2 text-xs font-semibold text-blue-600"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
