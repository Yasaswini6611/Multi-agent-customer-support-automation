import React, { useState } from 'react';
import { SupportTicket } from '../types/support';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  DollarSign,
  Package,
  MessageSquare,
  Check,
  Filter,
} from 'lucide-react';

interface HumanReviewSectionProps {
  tickets: SupportTicket[];
  onResolveTicket?: (ticketId: string) => void;
}

export const HumanReviewSection: React.FC<HumanReviewSectionProps> = ({
  tickets,
  onResolveTicket,
}) => {
  const reviewTickets = tickets.filter((t) => t.analysis.needs_human);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    reviewTickets[0]?.id || ''
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [resolvedIds, setResolvedIds] = useState<Record<string, boolean>>({});
  const [agentNote, setAgentNote] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredTickets = reviewTickets.filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.analysis.category === categoryFilter;
  });

  const activeTicket =
    reviewTickets.find((t) => t.id === selectedTicketId) ||
    filteredTickets[0] ||
    reviewTickets[0];

  const handleAction = (actionName: string) => {
    if (!activeTicket) return;
    setActionFeedback(`${actionName} applied to ${activeTicket.id}`);
    setResolvedIds((prev) => ({ ...prev, [activeTicket.id]: true }));
    if (onResolveTicket) {
      onResolveTicket(activeTicket.id);
    }
    setTimeout(() => {
      setActionFeedback(null);
    }, 3000);
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Human Review Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cases routed to human supervisors for refund verification, damaged merchandise claims, and sensitive customer disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>{reviewTickets.filter((t) => !resolvedIds[t.id]).length} Escalations Pending Review</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-xs overflow-x-auto">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-blue-50 text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Review Cases ({reviewTickets.length})
        </button>
        <button
          onClick={() => setCategoryFilter('refund')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            categoryFilter === 'refund'
              ? 'bg-amber-50 text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Refunds & Charges ({reviewTickets.filter((t) => t.analysis.category === 'refund').length})
        </button>
        <button
          onClick={() => setCategoryFilter('damaged_product')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            categoryFilter === 'damaged_product'
              ? 'bg-rose-50 text-rose-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Damaged Products ({reviewTickets.filter((t) => t.analysis.category === 'damaged_product').length})
        </button>
      </div>

      {/* 2-Column Review Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredTickets.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              No tickets pending review in this category.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              const isResolved = resolvedIds[ticket.id];
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-900 truncate">
                      {ticket.customer_name}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                      {ticket.timestamp}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                    {ticket.subject}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                    {ticket.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize text-slate-700">
                        {ticket.analysis.category.replace('_', ' ')}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-bold text-rose-600 capitalize">
                        {ticket.analysis.priority} Priority
                      </span>
                    </div>

                    {isResolved ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Resolved
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        Action Required
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Ticket Inspector & Action Center */}
        <div className="lg:col-span-7">
          {activeTicket ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
              {/* Ticket Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600">
                      {activeTicket.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeTicket.subject}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    From: <strong className="font-normal text-slate-800">{activeTicket.customer_name}</strong> ({activeTicket.customer_email})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    High Priority Escalation
                  </span>
                </div>
              </div>

              {/* Customer Message Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700">
                  Customer Inquiry:
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-800 leading-relaxed">
                  "{activeTicket.message}"
                </div>
              </div>

              {/* AI Triage Diagnosis */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Escalation Reason</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {activeTicket.analysis.reason}
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800 font-medium">
                  Financial Guardrail Enforced: Direct automated refunds are disabled to protect customer security.
                </div>
              </div>

              {/* Action Center */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Supervisor Resolution Actions:
                </span>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleAction('Refund Approval')}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Approve & Issue Refund
                  </button>

                  <button
                    onClick={() => handleAction('Replacement Authorization')}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    Authorize Replacement
                  </button>

                  <button
                    onClick={() => handleAction('Agent Assignment')}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    Assign to Specialist
                  </button>
                </div>

                {/* Feedback Toast */}
                {actionFeedback && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{actionFeedback}</span>
                  </div>
                )}
              </div>

              {/* Suggested Reply Review */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block">
                  Suggested Supervisor Reply Draft:
                </span>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {activeTicket.suggested_reply}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
              Select an escalated ticket from the left queue to review and authorize actions.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
