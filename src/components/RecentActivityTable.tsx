import React, { useState } from 'react';
import { SupportTicket } from '../types/support';
import { Search, Filter, CheckCircle2, ShieldAlert, Clock, ArrowRight, Eye, Download } from 'lucide-react';

interface RecentActivityTableProps {
  tickets: SupportTicket[];
  onSelectTicket?: (ticket: SupportTicket) => void;
}

export const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  tickets,
  onSelectTicket,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'auto' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    if (filterMode === 'auto' && ticket.analysis.needs_human) return false;
    if (filterMode === 'review' && !ticket.analysis.needs_human) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEmail = ticket.customer_email.toLowerCase().includes(q);
      const matchName = ticket.customer_name.toLowerCase().includes(q);
      const matchSubject = ticket.subject.toLowerCase().includes(q);
      const matchMessage = ticket.message.toLowerCase().includes(q);
      const matchCategory = ticket.analysis.category.toLowerCase().includes(q);
      return matchEmail || matchName || matchSubject || matchMessage || matchCategory;
    }
    return true;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'refund':
        return 'Refund & Payment';
      case 'damaged_product':
        return 'Damaged Product';
      case 'order_status':
        return 'Order Status';
      case 'technical_issue':
        return 'Technical Support';
      default:
        return 'General Inquiry';
    }
  };

  return (
    <section className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recent Activity & Triage Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed of ingested customer support emails and autonomous triage actions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({tickets.length})
            </button>
            <button
              onClick={() => setFilterMode('auto')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'auto'
                  ? 'bg-blue-50 text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Auto-Handled
            </button>
            <button
              onClick={() => setFilterMode('review')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterMode === 'review'
                  ? 'bg-amber-50 text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Review
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search email, category, query..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Main SaaS Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer Email</th>
                <th className="py-3 px-4 min-w-[200px]">Subject & Snippet</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No activity logs match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket && onSelectTicket(ticket)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Ticket ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600 whitespace-nowrap">
                      {ticket.id}
                    </td>

                    {/* Customer Email */}
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      <div>{ticket.customer_name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{ticket.customer_email}</div>
                    </td>

                    {/* Subject / Snippet */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{ticket.subject}</div>
                      <div className="text-slate-500 text-[11px] truncate">{ticket.message}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {getCategoryLabel(ticket.analysis.category)}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap font-semibold capitalize">
                      <span
                        className={
                          ticket.analysis.priority === 'high'
                            ? 'text-rose-600'
                            : ticket.analysis.priority === 'medium'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }
                      >
                        {ticket.analysis.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {ticket.analysis.needs_human ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          Needs Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          Auto-Handled
                        </span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] tabular-nums whitespace-nowrap">
                      {ticket.timestamp}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket && onSelectTicket(ticket);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
