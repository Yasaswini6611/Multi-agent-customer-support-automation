import { Category, Priority, Sentiment, AnalysisResult } from '../types/support';

export function analyzeEmail(message: string): AnalysisResult {
  const lower = message.toLowerCase();

  // Sentiment analysis
  let sentiment: Sentiment = 'neutral';
  let sentiment_explanation = 'The customer wrote in a calm and direct tone without strong frustration.';

  const angryWords = [
    'angry', 'furious', 'horrible', 'terrible', 'unacceptable', 'scam',
    'fraud', 'dispute', 'rip off', 'ridiculous', 'worst', 'failed',
    'demand', 'asap', 'broken', 'shattered', 'waste of money', 'lawyer'
  ];
  const positiveWords = ['thank', 'thanks', 'appreciate', 'great', 'love', 'helpful', 'awesome', 'good job'];

  if (angryWords.some(w => lower.includes(w)) || message.includes('!')) {
    sentiment = 'negative';
    sentiment_explanation = 'The customer appears frustrated or dissatisfied with their experience.';
  } else if (positiveWords.some(w => lower.includes(w))) {
    sentiment = 'positive';
    sentiment_explanation = 'The customer expressed satisfaction or appreciation in their message.';
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

  // Priority, Human Review & Plain-English Explanations
  let priority: Priority = 'medium';
  let priority_explanation = 'Standard support inquiry that should be handled during regular business hours.';
  let needs_human = false;
  let reason = '';
  let problem_summary = '';
  let recommended_next_step = '';
  let confidence = 0.96;

  if (category === 'refund') {
    priority = sentiment === 'negative' ? 'high' : 'medium';
    priority_explanation = sentiment === 'negative' 
      ? 'High priority because the customer is requesting their money back with strong urgency or payment dispute concern.'
      : 'Medium priority payment inquiry requiring review of the transaction record.';
    needs_human = true;
    problem_summary = 'The customer is requesting a financial refund or disputing a charge on their account.';
    reason = 'Refund and billing transactions involve real money and require human verification to ensure security.';
    recommended_next_step = 'A support agent should look up the order in the payment system, confirm refund eligibility, and send a personalized confirmation.';
    confidence = 0.98;
  } else if (category === 'damaged_product') {
    priority = 'high';
    priority_explanation = 'High priority because the product arrived unusable or broken, creating a negative customer delivery experience.';
    needs_human = true;
    problem_summary = 'The customer received an item that was broken, cracked, or damaged upon delivery.';
    reason = 'Damaged items require a support specialist to review photos and authorize a free replacement shipment.';
    recommended_next_step = 'Ask the customer for a photo of the damaged package, then initiate a replacement order from the warehouse.';
    confidence = 0.97;
  } else if (sentiment === 'negative' && (lower.includes('complaint') || lower.includes('dispute') || lower.includes('unacceptable') || lower.includes('lawyer'))) {
    priority = 'high';
    priority_explanation = 'High priority because the customer has expressed serious dissatisfaction that requires careful handling.';
    needs_human = true;
    problem_summary = 'The customer is submitting a formal complaint or expressing severe dissatisfaction.';
    reason = 'Escalated complaints require empathetic human communication to restore customer trust.';
    recommended_next_step = 'Assign this ticket to a senior customer support lead for a personalized, empathetic phone or email response.';
    confidence = 0.95;
  } else if (category === 'order_status') {
    const hasOrderNumber = /(?:#|order\s*(?:id|number|#)?\s*)\b[A-Za-z0-9-_]{4,15}\b/i.test(message);
    if (lower.includes('lost') || lower.includes('stolen') || lower.includes('weeks') || lower.includes('never arrived')) {
      priority = 'high';
      priority_explanation = 'High priority due to a potential delayed or missing package that has not moved for an extended time.';
      needs_human = true;
      problem_summary = 'The customer has not received their shipment and suspects the parcel may be lost in transit.';
      reason = 'Lost parcel investigations require checking courier dispatch logs directly.';
      recommended_next_step = 'Contact the delivery courier to trace the tracking number, and offer a replacement if the package cannot be found.';
      confidence = 0.94;
    } else {
      priority = 'low';
      priority_explanation = 'Routine inquiry asking for normal delivery updates.';
      needs_human = false;
      confidence = 0.99;
      if (hasOrderNumber) {
        problem_summary = 'The customer wants to know where their order is and provided their order reference number.';
        reason = 'Standard shipping status question that can be answered immediately with tracking instructions.';
        recommended_next_step = 'Send the customer their direct carrier tracking link so they can see live transit checkpoints.';
      } else {
        problem_summary = 'The customer is inquiring about their delivery date but did not include their order number.';
        reason = 'Simple inquiry where the automated reply can politely ask the customer for their order number.';
        recommended_next_step = 'Reply politely asking the customer to provide their order number so we can look up their delivery.';
      }
    }
  } else if (category === 'technical_issue') {
    priority = sentiment === 'negative' ? 'medium' : 'low';
    priority_explanation = 'Standard product feature or setup question that can be answered using product guides.';
    needs_human = false;
    problem_summary = 'The customer has a question about device setup, Bluetooth pairing, or technical specifications.';
    reason = 'The question matches standard documented product instructions and does not require private account modifications.';
    recommended_next_step = 'Provide the customer with the step-by-step setup guide or pairing instructions.';
    confidence = 0.93;
  } else {
    priority = 'low';
    priority_explanation = 'General customer message that can be handled through standard communication.';
    needs_human = false;
    problem_summary = 'The customer is sending general feedback or an inquiry about our products.';
    reason = 'General message not requiring billing access or sensitive account changes.';
    recommended_next_step = 'Send a friendly acknowledgment thanking the customer and offering further assistance.';
    confidence = 0.91;
  }

  return {
    category,
    priority,
    sentiment,
    needs_human,
    problem_summary,
    reason,
    priority_explanation,
    sentiment_explanation,
    recommended_next_step,
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
