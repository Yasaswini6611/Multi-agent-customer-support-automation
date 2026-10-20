import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  CheckCircle2,
  Mail,
  AlertTriangle,
  Bot,
  MessageSquare,
  Play,
} from 'lucide-react';

interface LandingHeroProps {
  onAnalyzeClick: () => void;
  onTrySampleClick: () => void;
  onHowItWorksClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onAnalyzeClick,
  onTrySampleClick,
  onHowItWorksClick,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/90 bg-gradient-to-b from-white via-slate-50/60 to-white">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-blue-50/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-16">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Customer Support Automation</span>
          </div>

          {/* Large Bold Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Smarter Customer Support,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Powered by AI
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            Understand customer problems instantly, identify urgent issues, and generate helpful replies with AI-powered support automation.
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onAnalyzeClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Analyze a Customer Message</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onTrySampleClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-slate-400"
            >
              <Play className="w-4 h-4 text-blue-600 fill-current" />
              <span>Try a Sample Message</span>
            </button>
          </div>
        </div>

        {/* 3 Small Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-2">
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Instant Issue Analysis
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reads the message, identifies the core customer problem, and summarizes it in plain English within seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Smart Priority Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Distinguishes routine order inquiries from urgent refund demands, damaged products, and angry complaints.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2 hover:border-blue-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Human Support When Needed
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automates standard replies while alerting human supervisors whenever financial refunds or replacements are requested.
            </p>
          </div>
        </div>

        {/* Interactive Interactive Preview Card */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-900">Live Preview: Customer Query Analysis</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Sample: Broken Ceramic Mug (Order #84920)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Input Message */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2">
              <span className="font-semibold text-slate-600 uppercase tracking-wider text-[10px] block">
                Incoming Customer Message
              </span>
              <p className="text-slate-800 leading-relaxed italic">
                "Hello, I opened the package for order #84920 today and the ceramic travel mug is completely cracked down the side! Can I please get an immediate replacement or refund sent out?"
              </p>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                Customer: claire.morrison@gmail.com
              </div>
            </div>

            {/* Right: AI Output Highlights */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900 uppercase tracking-wider text-[10px]">
                  Automated Triage Diagnosis
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                  High Priority
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-xs">
                  Issue: Damaged Product upon delivery
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Human Help:</strong> Yes, requires photo verification & replacement dispatch authorization.
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Suggested reply drafted and ready.</span>
                <button
                  onClick={onTrySampleClick}
                  className="font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Test this scenario &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
