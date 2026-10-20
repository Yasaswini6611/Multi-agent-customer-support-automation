import React from 'react';
import { Mail, CheckCircle2, ShieldAlert, Clock, TrendingUp } from 'lucide-react';
import { MetricSummary } from '../types/support';

interface SummaryCardsProps {
  metrics: MetricSummary;
  onFilterClick?: (filterType: 'all' | 'auto' | 'review') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  onFilterClick,
}) => {
  const autoPercent = ((metrics.autoHandled / metrics.totalProcessed) * 100).toFixed(1);
  const reviewPercent = ((metrics.needsHumanReview / metrics.totalProcessed) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Emails Processed */}
      <div
        onClick={() => onFilterClick && onFilterClick('all')}
        className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Emails Processed
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Mail className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.totalProcessed.toLocaleString()}
          </span>
          <span className="flex items-center text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
            +14%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Total customer conversations triaged
        </p>
      </div>

      {/* 2. Auto-Handled */}
      <div
        onClick={() => onFilterClick && onFilterClick('auto')}
        className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Auto-Handled
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-blue-600 font-mono tabular-nums">
            {metrics.autoHandled.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-blue-700 font-mono">
            {autoPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Routine inquiries resolved without agent delay
        </p>
      </div>

      {/* 3. Needs Human Review */}
      <div
        onClick={() => onFilterClick && onFilterClick('review')}
        className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
            Needs Human Review
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.needsHumanReview.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-amber-700 font-mono">
            {reviewPercent}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Refunds, damaged goods & escalations
        </p>
      </div>

      {/* 4. Average Resolution Time */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Triage Time
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.avgResolutionTime}
          </span>
          <span className="text-xs font-medium text-slate-500">
            CSAT {metrics.csatScore}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Zero-delay classification & reply drafting
        </p>
      </div>
    </div>
  );
};
