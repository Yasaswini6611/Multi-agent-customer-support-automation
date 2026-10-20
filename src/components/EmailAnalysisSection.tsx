import React, { useState } from 'react';
import { SAMPLE_EMAILS, SampleEmail } from '../data/mockData';
import { analyzeEmail, generateReply } from '../utils/triageSimulator';
import { SupportTicket, AnalysisResult } from '../types/support';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Edit3,
} from 'lucide-react';

interface EmailAnalysisSectionProps {
  onTicketGenerated?: (ticket: SupportTicket) => void;
}

export const EmailAnalysisSection: React.FC<EmailAnalysisSectionProps> = ({
  onTicketGenerated,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_EMAILS[0].id);
  const [customerEmail, setCustomerEmail] = useState<string>(SAMPLE_EMAILS[0].customer_email);
  const [customerMessage, setCustomerMessage] = useState<string>(SAMPLE_EMAILS[0].message);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() =>
    analyzeEmail(SAMPLE_EMAILS[0].message)
  );
  const [suggestedReply, setSuggestedReply] = useState<string>(() =>
    generateReply(SAMPLE_EMAILS[0].message, analyzeEmail(SAMPLE_EMAILS[0].message))
  );

  const [isEditingReply, setIsEditingReply] = useState<boolean>(false);
  const [editedReply, setEditedReply] = useState<string>(suggestedReply);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSelectSample = (sample: SampleEmail) => {
    setSelectedSampleId(sample.id);
    setCustomerEmail(sample.customer_email);
    setCustomerMessage(sample.message);
    setIsSent(false);

    // Auto-analyze selected sample
    const result = analyzeEmail(sample.message);
    const reply = generateReply(sample.message, result);
    setAnalysisResult(result);
    setSuggestedReply(reply);
    setEditedReply(reply);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerMessage.trim()) return;

    setIsAnalyzing(true);
    setIsSent(false);

    setTimeout(() => {
      const result = analyzeEmail(customerMessage);
      const reply = generateReply(customerMessage, result);
      setAnalysisResult(result);
      setSuggestedReply(reply);
      setEditedReply(reply);
      setIsAnalyzing(false);

      if (onTicketGenerated) {
        const newTicket: SupportTicket = {
          id: `SF-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_name: customerEmail.split('@')[0].replace('.', ' '),
          customer_email: customerEmail,
          subject: 'Customer Inbound Inquiry',
          message: customerMessage,
          timestamp: 'Just now',
          status: result.needs_human ? 'needs_review' : 'auto_resolved',
          assigned_to: result.needs_human ? 'Tier-2 Support Desk' : 'SupportFlow AI Agent',
          analysis: result,
          suggested_reply: reply,
        };
        onTicketGenerated(newTicket);
      }
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedReply);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    setIsSent(true);
  };

  const handleClear = () => {
    setCustomerEmail('');
    setCustomerMessage('');
    setSelectedSampleId('');
    setAnalysisResult(null);
    setSuggestedReply('');
    setEditedReply('');
    setIsSent(false);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'refund':
        return 'Refund & Payment';
      case 'damaged_product':
        return 'Damaged Product';
      case 'order_status':
        return 'Order Status & Tracking';
      case 'technical_issue':
        return 'Technical Support';
      default:
        return 'General Inquiry';
    }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Email Triage & Suggested Reply
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how incoming customer emails are analyzed for category, priority, sentiment, and human escalation.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
          Simulated Customer Query Assistant
        </div>
      </div>

      {/* Preset Sample Email Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Quick-Select Sample Customer Scenarios:
          </label>
          <span className="text-xs text-slate-400">Click any scenario to populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SAMPLE_EMAILS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 text-slate-900 ring-1 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold truncate text-slate-900">
                  {sample.label}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span>{sample.tag}</span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      sample.expectedRoute === 'Human Review'
                        ? 'text-amber-700 font-medium'
                        : 'text-blue-600 font-medium'
                    }
                  >
                    {sample.expectedRoute}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Core Layout: Form on Left, Output & Suggested Reply on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Customer Message Input
            </h3>
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </button>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Email Address
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Email Message
              </label>
              <textarea
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                rows={7}
                placeholder="Paste or type customer email message here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white leading-relaxed resize-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !customerMessage.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing message...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Email & Generate Reply</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Analysis Panel & Suggested Reply */}
        <div className="lg:col-span-7 space-y-5">
          {analysisResult ? (
            <>
              {/* Analysis Result Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      AI Triage Analysis
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time intent, urgency, and routing assessment
                    </p>
                  </div>
                  <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2.5 py-1 rounded-md">
                    {(analysisResult.confidence * 100).toFixed(0)}% Confidence
                  </div>
                </div>

                {/* 4 Metadata Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Category */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Category
                    </span>
                    <span className="text-xs font-bold text-slate-900 mt-1 block">
                      {getCategoryLabel(analysisResult.category)}
                    </span>
                  </div>

                  {/* Priority */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Priority
                    </span>
                    <span
                      className={`text-xs font-bold mt-1 block capitalize ${
                        analysisResult.priority === 'high'
                          ? 'text-rose-600'
                          : analysisResult.priority === 'medium'
                          ? 'text-amber-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {analysisResult.priority}
                    </span>
                  </div>

                  {/* Sentiment */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Sentiment
                    </span>
                    <span
                      className={`text-xs font-bold mt-1 block capitalize ${
                        analysisResult.sentiment === 'negative'
                          ? 'text-rose-600'
                          : analysisResult.sentiment === 'positive'
                          ? 'text-emerald-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {analysisResult.sentiment}
                    </span>
                  </div>

                  {/* Human Review Status */}
                  <div
                    className={`border rounded-lg p-3 ${
                      analysisResult.needs_human
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Human Review
                    </span>
                    <span
                      className={`text-xs font-bold mt-1 block ${
                        analysisResult.needs_human ? 'text-amber-800' : 'text-emerald-800'
                      }`}
                    >
                      {analysisResult.needs_human ? 'Required' : 'Auto-Handled'}
                    </span>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3.5">
                  <span className="text-xs font-semibold text-slate-700 block mb-1">
                    Triage Reasoning:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {analysisResult.reason}
                  </p>
                </div>
              </div>

              {/* Suggested Reply Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Suggested Customer Reply
                    </h3>
                    <p className="text-xs text-slate-500">
                      {analysisResult.needs_human
                        ? 'Escalation acknowledgment prepared for human review'
                        : 'Auto-composed reply ready for customer dispatch'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingReply(!isEditingReply)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingReply ? 'Done Editing' : 'Edit'}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Reply Body */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
                  <div className="text-xs text-slate-500 pb-2 border-b border-slate-200/60 flex items-center justify-between">
                    <span>To: <strong className="text-slate-800 font-normal">{customerEmail || 'customer@example.com'}</strong></span>
                    <span className="text-[11px] text-slate-400">Subject: Re: Support Inquiry</span>
                  </div>

                  {isEditingReply ? (
                    <textarea
                      value={editedReply}
                      onChange={(e) => setEditedReply(e.target.value)}
                      rows={6}
                      className="w-full bg-white border border-blue-400 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 leading-relaxed resize-none"
                    />
                  ) : (
                    <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                      {editedReply}
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-500">
                    {analysisResult.needs_human
                      ? 'Requires human supervisor review before sending.'
                      : 'Verified response adheres to support guardrails.'}
                  </div>

                  <button
                    onClick={handleSendSimulated}
                    disabled={isSent}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reply Dispatched (Demo)</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
              Select a sample email or enter a customer message on the left to see instant triage and suggested reply.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
