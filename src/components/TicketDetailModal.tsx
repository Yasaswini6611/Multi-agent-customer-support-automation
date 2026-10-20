import React, { useState } from 'react';
import { SupportTicket } from '../types/support';
import { X, Copy, Check, ShieldAlert, CheckCircle2, User, Clock, Mail, ArrowRight } from 'lucide-react';

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ticket.suggested_reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
              {ticket.id}
            </span>
            <h2 className="text-sm font-bold text-slate-900 truncate">
              {ticket.subject}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Customer Meta */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 grid grid-cols-2 gap-3 text-slate-600">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{ticket.customer_name}</span>
              <span className="text-slate-500 font-mono text-[11px]">{ticket.customer_email}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Triage Status</span>
              <span className="mt-1 inline-flex items-center gap-1 font-semibold text-slate-900">
                {ticket.analysis.needs_human ? (
                  <span className="text-amber-700 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    Needs Human Review
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Handled by AI
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{ticket.timestamp}</span>
            </div>
          </div>

          {/* Customer Message */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-700">Customer Message:</span>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 leading-relaxed italic">
              "{ticket.message}"
            </div>
          </div>

          {/* What is the problem? */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
              What is the problem?
            </span>
            <p className="font-semibold text-slate-900 text-xs leading-relaxed">
              {ticket.analysis.problem_summary || ticket.analysis.reason}
            </p>
          </div>

          {/* AI Analysis Grid */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-700">Diagnosis Details:</span>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Category</span>
                <span className="font-semibold text-slate-900 capitalize mt-0.5 block">
                  {ticket.analysis.category.replace('_', ' ')}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Priority</span>
                <span className="font-semibold capitalize mt-0.5 block text-slate-900">
                  {ticket.analysis.priority}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Sentiment</span>
                <span className="font-semibold capitalize mt-0.5 block text-slate-900">
                  {ticket.analysis.sentiment}
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Next Step */}
          {ticket.analysis.recommended_next_step && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-blue-900 text-[11px] flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                Recommended Next Step:
              </span>
              <p className="text-blue-800 text-xs leading-relaxed">
                {ticket.analysis.recommended_next_step}
              </p>
            </div>
          )}

          {/* Suggested Reply */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Suggested Customer Reply:</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy Draft'}
              </button>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 whitespace-pre-line leading-relaxed">
              {ticket.suggested_reply}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
