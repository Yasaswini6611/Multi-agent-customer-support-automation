import { Category, Priority, Sentiment, AnalysisResult } from '../types/support';

export function analyzeEmail(message: string): AnalysisResult {
  const lower = message.toLowerCase();

  // Sentiment analysis
  let sentiment: Sentiment = 'neutral';
  const angryWords = [
    'angry', 'furious', 'horrible', 'terrible', 'unacceptable', 'scam',
    'fraud', 'dispute', 'rip off', 'ridiculous', 'worst', 'failed',
    'demand', 'asap', 'broken', 'shattered', 'waste of money', 'lawyer'
  ];
  const positiveWords = ['thank', 'thanks', 'appreciate', 'great', 'love', 'helpful', 'awesome', 'good job'];

  if (angryWords.some(w => lower.includes(w)) || message.includes('!')) {
    sentiment = 'negative';
  } else if (positiveWords.some(w => lower.includes(w))) {
    sentiment = 'positive';
  }

  // Category detection
  let category: Category = 'other';
  if (
    lower.includes('refund') ||
    lower.includes('money back') ||
    lower.includes('charged twice') ||
    lower.includes('billing') ||
    lower.includes('reimburse') ||
    lower.includes('charge')
  ) {
    category = 'refund';
  } else if (
    lower.includes('damaged') ||
    lower.includes('broken') ||
    lower.includes('shattered') ||
    lower.includes('cracked') ||
    lower.includes('defective') ||
    lower.includes('dented') ||
    lower.includes('scratch')
  ) {
    category = 'damaged_product';
  } else if (
    lower.includes('order') ||
    lower.includes('tracking') ||
    lower.includes('delivery') ||
    lower.includes('shipped') ||
    lower.includes('where is my') ||
    lower.includes('transit') ||
    lower.includes('package') ||
    lower.includes('courier')
  ) {
    category = 'order_status';
  } else if (
    lower.includes('bluetooth') ||
    lower.includes('setup') ||
    lower.includes('connect') ||
    lower.includes('error') ||
    lower.includes('firmware') ||
    lower.includes('battery') ||
    lower.includes('manual') ||
    lower.includes('compatible') ||
    lower.includes('pairing') ||
    lower.includes('specification')
  ) {
    category = 'technical_issue';
  }

  // Priority & Human Review requirement
  let priority: Priority = 'medium';
  let needs_human = false;
  let reason = '';
  let confidence = 0.96;

  if (category === 'refund') {
    priority = sentiment === 'negative' ? 'high' : 'medium';
    needs_human = true;
    reason = 'Refund & payment transactions require manual financial authorization to protect against unauthorized debits.';
    confidence = 0.98;
  } else if (category === 'damaged_product') {
    priority = 'high';
    needs_human = true;
    reason = 'Physical damage claim requires visual photo verification and warehouse replacement dispatch authorization.';
    confidence = 0.97;
  } else if (sentiment === 'negative' && (lower.includes('complaint') || lower.includes('dispute') || lower.includes('unacceptable') || lower.includes('lawyer'))) {
    priority = 'high';
    needs_human = true;
    reason = 'Customer expresses heightened frustration requiring senior human representative attention and de-escalation.';
    confidence = 0.95;
  } else if (category === 'order_status') {
    const hasOrderNumber = /(?:#|order\s*(?:id|number|#)?\s*)\b[A-Za-z0-9-_]{4,15}\b/i.test(message);
    if (lower.includes('lost') || lower.includes('stolen') || lower.includes('weeks') || lower.includes('never arrived')) {
      priority = 'high';
      needs_human = true;
      reason = 'Potential lost package claim requiring carrier escalation and warehouse tracking investigation.';
      confidence = 0.94;
    } else {
      priority = 'low';
      needs_human = false;
      confidence = 0.99;
      if (hasOrderNumber) {
        reason = 'Standard order query with order identifier provided. Automated reply guides the customer to live parcel telemetry.';
      } else {
        reason = 'Routine inquiry with missing order number. Automated assistant prompts customer for order ID without escalating.';
      }
    }
  } else if (category === 'technical_issue') {
    priority = sentiment === 'negative' ? 'medium' : 'low';
    needs_human = false;
    reason = 'Technical hardware inquiry matching documented product specifications and troubleshooting procedures.';
    confidence = 0.93;
  } else {
    priority = 'low';
    needs_human = false;
    reason = 'Standard informational inquiry with zero billing or inventory modification requirements.';
    confidence = 0.91;
  }

  return {
    category,
    priority,
    sentiment,
    needs_human,
    reason,
    confidence,
  };
}

export function generateReply(message: string, analysis: AnalysisResult): string {
  const lower = message.toLowerCase();
  const hasOrderMatch = message.match(/(?:#|order\s*(?:id|number|#)?\s*)([A-Za-z0-9-_]{4,15})/i);
  const orderNumber = hasOrderMatch ? hasOrderMatch[0] : null;

  if (analysis.needs_human) {
    if (analysis.category === 'refund') {
      return `Dear Customer,\n\nThank you for reaching out regarding your purchase${orderNumber ? ` (${orderNumber})` : ''}. We have received your refund request and a member of our billing specialist team has been assigned to verify the transaction details. You will receive an update from our team within 1 business day.\n\nThank you for your patience,\nSupportFlow Customer Care`;
    }
    if (analysis.category === 'damaged_product') {
      return `Dear Customer,\n\nWe are sincerely sorry to hear that your item arrived damaged. A customer support supervisor has opened an escalation ticket for your case${orderNumber ? ` (${orderNumber})` : ''}. To help us process an immediate replacement, please reply directly with a quick photo of the packaging and the damaged item.\n\nBest regards,\nSupportFlow Customer Care`;
    }
    return `Dear Customer,\n\nThank you for contacting us. Your message has been escalated directly to a human support specialist for personalized review. We are looking into your case and will respond promptly.\n\nBest regards,\nSupportFlow Customer Care`;
  }

  if (analysis.category === 'order_status') {
    if (orderNumber) {
      return `Dear Customer,\n\nThank you for checking in on your order ${orderNumber}. Your package is in transit with our fulfillment carrier. You can view the live carrier checkpoint telemetry anytime via your order status link. If you need any additional delivery assistance, our team is right here to help.\n\nBest regards,\nSupportFlow Customer Care`;
    }
    return `Dear Customer,\n\nWe would be delighted to look up the status of your order right away. Could you please reply with your 6-digit order number or confirmation email? As soon as you provide it, we will pull up your tracking details immediately.\n\nBest regards,\nSupportFlow Customer Care`;
  }

  if (analysis.category === 'technical_issue') {
    if (lower.includes('bluetooth') || lower.includes('pairing') || lower.includes('connect')) {
      return `Dear Customer,\n\nOur device supports multipoint Bluetooth 5.2 connectivity and can remember connection profiles for up to two active host devices. To pair a second device, press and hold the center pairing button for 3 seconds until the LED pulses white. Let us know if you need any additional setup guidance.\n\nBest regards,\nSupportFlow Technical Team`;
    }
    return `Dear Customer,\n\nFor optimal setup and compatibility, please verify that your unit is powered using the included USB-C cable and updated to firmware v2.4. You can also view our quick video onboarding guide in the documentation portal.\n\nBest regards,\nSupportFlow Technical Team`;
  }

  return `Dear Customer,\n\nThank you for reaching out to SupportFlow. We have received your message and are happy to assist. Please reply with any relevant account details or product questions so we can assist you right away.\n\nBest regards,\nSupportFlow Customer Care`;
}
