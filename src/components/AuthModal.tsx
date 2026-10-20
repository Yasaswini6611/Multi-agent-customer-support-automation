import React, { useState } from 'react';
import { X, Headphones, Mail, Lock, Check, Eye, EyeOff, ArrowRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  initialEmail?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialEmail = 'yasaswinichalumuru@gmail.com',
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const name = email.split('@')[0].replace('.', ' ');
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      const initials = formattedName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'SC';

      onLogin({
        name: email.toLowerCase().includes('yasaswini') ? 'Yasaswini Ch.' : formattedName,
        email: email,
        role: 'Support Lead',
        avatarInitials: email.toLowerCase().includes('yasaswini') ? 'YC' : initials,
      });
      setIsLoading(false);
      onClose();
    }, 400);
  };

  const handleQuickLogin = (demoEmail: string, demoName: string, demoRole: string, demoInitials: string) => {
    setEmail(demoEmail);
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        name: demoName,
        email: demoEmail,
        role: demoRole,
        avatarInitials: demoInitials,
      });
      setIsLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Top Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                SupportFlow AI
              </span>
              <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">
                Support Workspace Login
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-xs text-slate-500">
              Access the support queue, email triage, and supervisor actions.
            </p>
          </div>

          {/* Quick Demo Login Switcher */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              1-Click Demo Accounts:
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    'yasaswinichalumuru@gmail.com',
                    'Yasaswini Ch.',
                    'Support Lead',
                    'YC'
                  )
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                    YC
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                      Yasaswini Ch.
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      yasaswinichalumuru@gmail.com
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Support Lead
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickLogin(
                    'alex.turner@supportflow.ai',
                    'Alex Turner',
                    'Tier-2 Specialist',
                    'AT'
                  )
                }
                className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-400 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                    AT
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                      Alex Turner
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      alex.turner@supportflow.ai
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Specialist
                </span>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider relative">
              Or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to SupportFlow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-center text-slate-500">
          SupportFlow AI · Single Sign-On Enabled
        </div>
      </div>
    </div>
  );
};
