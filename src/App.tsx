import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { LandingHero } from './components/LandingHero';
import { HowItWorks } from './components/HowItWorks';
import { EmailAnalysisSection } from './components/EmailAnalysisSection';
import { RecentActivityTable } from './components/RecentActivityTable';
import { TicketDetailModal } from './components/TicketDetailModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { INITIAL_TICKETS, INITIAL_METRICS, SAMPLE_EMAILS } from './data/mockData';
import { SupportTicket, MetricSummary } from './types/support';
import { CheckCircle2, Headphones, Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [metrics, setMetrics] = useState<MetricSummary>(INITIAL_METRICS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'analyze' | 'how-it-works'>('home');
  const [triggerSampleLoad, setTriggerSampleLoad] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: 'Yasaswini Ch.',
    email: 'yasaswinichalumuru@gmail.com',
    role: 'Support Lead',
    avatarInitials: 'YC',
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    showToast('Successfully logged out of SupportFlow AI');
  };

  const scrollToAnalyze = () => {
    setActiveSection('analyze');
    const el = document.getElementById('analyze-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHowItWorks = () => {
    setActiveSection('how-it-works');
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHome = () => {
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrySample = () => {
    setTriggerSampleLoad(prev => !prev);
    scrollToAnalyze();
    showToast('Loaded sample: Damaged Ceramic Mug inquiry');
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
    showToast('Customer query analyzed successfully');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNav
        activeSection={activeSection}
        onHomeClick={scrollToHome}
        onAnalyzeClick={scrollToAnalyze}
        onHowItWorksClick={scrollToHowItWorks}
        onGetStartedClick={scrollToAnalyze}
        currentUser={currentUser}
        onOpenLogin={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page Content (Logical Top-to-Bottom Flow) */}
      <main className="flex-1 space-y-0">
        {/* 1. Landing Hero Section */}
        <LandingHero
          onAnalyzeClick={scrollToAnalyze}
          onTrySampleClick={handleTrySample}
          onHowItWorksClick={scrollToHowItWorks}
        />

        {/* 2. How It Works Section (3 Simple Steps) */}
        <HowItWorks onGetStartedClick={scrollToAnalyze} />

        {/* 3. Interactive Analysis Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          <EmailAnalysisSection
            onTicketGenerated={handleTicketGenerated}
            triggerSampleLoad={triggerSampleLoad}
          />

          {/* 4. Recent Analyzed Tickets Log */}
          <div className="pt-8 border-t border-slate-200">
            <RecentActivityTable
              tickets={tickets}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          </div>
        </div>
      </main>

      {/* Clean, Trustworthy SaaS Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">SupportFlow AI</span>
              <span className="text-slate-400 text-[11px] block">
                Smarter Customer Support, Powered by AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-600 font-medium">
            <button onClick={scrollToHome} className="hover:text-blue-600 cursor-pointer">
              Home
            </button>
            <button onClick={scrollToAnalyze} className="hover:text-blue-600 cursor-pointer">
              Analyze Message
            </button>
            <button onClick={scrollToHowItWorks} className="hover:text-blue-600 cursor-pointer">
              How It Works
            </button>
          </div>

          <div className="text-slate-400 text-center sm:text-right">
            <span>Production n8n Customer Support Integration Enabled</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        initialEmail={currentUser?.email || 'yasaswinichalumuru@gmail.com'}
      />
    </div>
  );
}
