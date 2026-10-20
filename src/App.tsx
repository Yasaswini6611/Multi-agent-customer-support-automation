import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { SummaryCards } from './components/SummaryCards';
import { EmailAnalysisSection } from './components/EmailAnalysisSection';
import { HumanReviewSection } from './components/HumanReviewSection';
import { RecentActivityTable } from './components/RecentActivityTable';
import { TicketDetailModal } from './components/TicketDetailModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { INITIAL_TICKETS, INITIAL_METRICS } from './data/mockData';
import { SupportTicket, MetricSummary } from './types/support';
import { CheckCircle2, LogIn, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'review' | 'history'>('dashboard');
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [metrics, setMetrics] = useState<MetricSummary>(INITIAL_METRICS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Yasaswini Ch.',
    email: 'yasaswinichalumuru@gmail.com',
    role: 'Support Lead',
    avatarInitials: 'YC',
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pendingReviewCount = tickets.filter(
    (t) => t.analysis.needs_human && t.status !== 'resolved'
  ).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    showToast(`Signed in as ${user.email}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Successfully logged out of SupportFlow');
  };

  const handleTicketGenerated = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalProcessed: prev.totalProcessed + 1,
      autoHandled: newTicket.analysis.needs_human ? prev.autoHandled : prev.autoHandled + 1,
      needsHumanReview: newTicket.analysis.needs_human
        ? prev.needsHumanReview + 1
        : prev.needsHumanReview,
    }));
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' } : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Slim Left Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          pendingReviewCount={pendingReviewCount}
          currentUser={currentUser}
          onOpenLogin={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              pendingReviewCount={pendingReviewCount}
              currentUser={currentUser}
              onOpenLogin={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              onLogout={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          activeTab={activeTab}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onNewAnalysisClick={() => {
            setActiveTab('analysis');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
          onOpenLogin={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Guest Mode Banner when logged out */}
        {!currentUser && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You are currently viewing in <strong>Guest Mode</strong>. Sign in to your agent email account to execute supervisor actions and approvals.</span>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="ml-4 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* View: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Summary Metrics Cards */}
              <SummaryCards
                metrics={metrics}
                onFilterClick={(type) => {
                  if (type === 'review') setActiveTab('review');
                  if (type === 'auto') setActiveTab('history');
                }}
              />

              {/* Interactive Email Analysis Section */}
              <EmailAnalysisSection onTicketGenerated={handleTicketGenerated} />

              {/* Human Review Highlight Section */}
              <HumanReviewSection
                tickets={tickets}
                onResolveTicket={handleResolveTicket}
              />

              {/* Recent Activity Table */}
              <RecentActivityTable
                tickets={tickets}
                onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              />
            </div>
          )}

          {/* View: Email Analysis Only */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <EmailAnalysisSection onTicketGenerated={handleTicketGenerated} />
              <RecentActivityTable
                tickets={tickets}
                onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              />
            </div>
          )}

          {/* View: Human Review Only */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <HumanReviewSection
                tickets={tickets}
                onResolveTicket={handleResolveTicket}
              />
            </div>
          )}

          {/* View: Activity History */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <SummaryCards metrics={metrics} />
              <RecentActivityTable
                tickets={tickets}
                onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              />
            </div>
          )}
        </main>

        {/* Clean, Subtle SaaS Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">SupportFlow AI</span>
              <span>·</span>
              <span>Autonomous Customer Support Platform</span>
            </div>
            <div className="flex items-center gap-3">
              {currentUser ? (
                <span>Signed in as <strong className="font-medium text-slate-700">{currentUser.email}</strong></span>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
                >
                  Agent Sign In
                </button>
              )}
              <span>·</span>
              <span className="text-slate-400">Enterprise Edition</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Ticket Detail Inspector Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Email Login & Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        initialEmail={currentUser?.email || 'yasaswinichalumuru@gmail.com'}
      />
    </div>
  );
}
