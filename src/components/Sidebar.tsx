import React from 'react';
import {
  LayoutDashboard,
  MailCheck,
  ShieldAlert,
  History,
  Headphones,
  CheckCircle2,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react';
import { UserProfile } from './AuthModal';

interface SidebarProps {
  activeTab: 'dashboard' | 'analysis' | 'review' | 'history';
  setActiveTab: (tab: 'dashboard' | 'analysis' | 'review' | 'history') => void;
  pendingReviewCount: number;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingReviewCount,
  currentUser,
  onOpenLogin,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'analysis' as const,
      label: 'Email Analysis',
      icon: MailCheck,
      badge: 'Live',
    },
    {
      id: 'review' as const,
      label: 'Human Review',
      icon: ShieldAlert,
      badge: pendingReviewCount > 0 ? String(pendingReviewCount) : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'history' as const,
      label: 'History & Logs',
      icon: History,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none">
      {/* Brand & Workspace */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight block">
                SupportFlow AI
              </span>
              <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">
                Enterprise Support Ops
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Capabilities Card */}
        <div className="p-3 mx-3 mt-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Triage Active</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Automating routine queries with instant responses and routing refund disputes to human agents.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Triage accuracy: 99.2%</span>
          </div>
        </div>
      </div>

      {/* User Profile, Login / Logout Actions */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Subtle Demo Mode pill */}
        <div className="bg-slate-100/90 text-slate-600 text-[11px] px-2.5 py-1 rounded-md text-center font-medium border border-slate-200/60">
          Demo Mode · Simulated Results
        </div>

        {currentUser ? (
          /* Logged In User State */
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {currentUser.avatarInitials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate block">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 truncate block font-mono">
                  {currentUser.email}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Log Out of SupportFlow"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Logged Out State */
          <div className="pt-1">
            <button
              onClick={onOpenLogin}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Email</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
