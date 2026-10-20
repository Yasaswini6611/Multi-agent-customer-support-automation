import React from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStartedClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStartedClick }) => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Enter a Customer Message',
      description:
        'Paste any customer email, feedback message, or inquiry into the message form, or pick from our realistic ready-to-test scenarios.',
      icon: Mail,
      iconColor: 'bg-blue-50 text-blue-600',
    },
    {
      step: 'Step 2',
      title: 'Analyze the Issue',
      description:
        'The system analyzes the problem, classifies category and priority, evaluates customer sentiment, and checks if a human supervisor must review.',
      icon: Sparkles,
      iconColor: 'bg-indigo-50 text-indigo-600',
    },
    {
      step: 'Step 3',
      title: 'Get Recommended Actions',
      description:
        'Review a plain-English problem summary, actionable next steps for your team, and a polite, ready-to-use customer reply with 1-click copy.',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-slate-50/50 border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How SupportFlow AI Works
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Designed so any customer support team member or supervisor can understand customer needs and respond with confidence.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs relative flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl ${item.iconColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                  <span>Fast, verified, reliable</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center pt-2">
          <button
            onClick={onGetStartedClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <span>Try It Yourself Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
