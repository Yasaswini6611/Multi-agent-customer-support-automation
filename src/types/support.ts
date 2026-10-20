export type Category = 'refund' | 'damaged_product' | 'order_status' | 'technical_issue' | 'other';
export type Priority = 'low' | 'medium' | 'high';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type TicketStatus = 'auto_resolved' | 'needs_review' | 'in_progress' | 'resolved';

export interface AnalysisResult {
  category: Category;
  priority: Priority;
  sentiment: Sentiment;
  needs_human: boolean;
  problem_summary: string;
  reason: string;
  priority_explanation: string;
  sentiment_explanation: string;
  recommended_next_step: string;
  confidence: number;
}

export interface SupportTicket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  timestamp: string;
  analysis: AnalysisResult;
  suggested_reply: string;
  status: TicketStatus;
  assigned_to?: string;
  resolution_date?: string;
  order_id?: string;
}

export interface MetricSummary {
  totalProcessed: number;
  autoHandled: number;
  needsHumanReview: number;
  avgResolutionTime: string;
  csatScore: number;
}
