import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeEmail, generateReply } from './src/utils/triageSimulator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Production n8n form endpoint URL
const DEFAULT_N8N_URL = 'https://yasaswini0606.app.n8n.cloud/form/ab7204c8-748e-467f-9e6e-189fb6b9431d';

// Safely validate and resolve the n8n endpoint URL
function getValidN8nUrl(): string {
  const envUrl = process.env.N8N_WORKFLOW_URL?.trim();
  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return envUrl;
      }
    } catch {
      console.warn(`[server] Invalid N8N_WORKFLOW_URL "${envUrl}", falling back to production URL.`);
    }
  }
  return DEFAULT_N8N_URL;
}

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    n8nUrl: getValidN8nUrl().replace(/\/form\/[a-f0-9-]+/, '/form/***'),
    timestamp: new Date().toISOString(),
  });
});

// Proxy route for n8n customer support workflow
app.post('/api/n8n-support', async (req, res) => {
  // Always set JSON content-type
  res.setHeader('Content-Type', 'application/json');

  const { email, message, subject } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Both customer email and message are required.',
    });
  }

  const n8nUrl = getValidN8nUrl();

  try {
    // Construct standard multipart/form-data expected by n8n Form trigger
    const formData = new FormData();
    formData.append('field-0', email.trim());
    formData.append('field-1', message.trim());
    formData.append('email', email.trim());
    formData.append('message', message.trim());
    formData.append('customer_email', email.trim());
    formData.append('customer_message', message.trim());
    if (subject) {
      formData.append('subject', subject.trim());
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response: Response;
    try {
      response = await fetch(n8nUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json, text/plain, */*',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(200).json({
        success: false,
        error: `n8n workflow returned HTTP ${response.status} (${response.statusText}): ${errorText.slice(0, 200)}`,
        status: response.status,
      });
    }

    const responseText = await response.text();
    let n8nData: any = null;
    try {
      n8nData = JSON.parse(responseText);
    } catch {
      n8nData = { raw: responseText.slice(0, 300) };
    }

    // Check if n8n returned structured analysis directly
    let analysis: any = null;
    let suggested_reply: string | null = null;

    if (n8nData && typeof n8nData === 'object') {
      if (n8nData.category && n8nData.priority) {
        analysis = {
          category: n8nData.category,
          priority: n8nData.priority,
          sentiment: n8nData.sentiment || 'neutral',
          needs_human: Boolean(n8nData.needs_human),
          problem_summary: n8nData.problem_summary || n8nData.reason || 'Customer inquiry submitted to n8n workflow.',
          reason: n8nData.reason || 'Classified by production n8n workflow.',
          priority_explanation: n8nData.priority_explanation || `${n8nData.priority} priority support case.`,
          sentiment_explanation: n8nData.sentiment_explanation || `${n8nData.sentiment || 'neutral'} customer sentiment.`,
          recommended_next_step: n8nData.recommended_next_step || 'Review the suggested response and proceed with resolution.',
          confidence: n8nData.confidence || 0.98,
        };
      }
      if (n8nData.suggested_reply || n8nData.customer_reply || n8nData.reply) {
        suggested_reply = n8nData.suggested_reply || n8nData.customer_reply || n8nData.reply;
      }
    }

    // If n8n acknowledged with { status: 200 }, evaluate using the matching triage engine
    if (!analysis) {
      analysis = analyzeEmail(message);
    }
    if (!suggested_reply) {
      suggested_reply = generateReply(message, analysis);
    }

    return res.status(200).json({
      success: true,
      n8nStatus: response.status,
      n8nUrl: n8nUrl.replace(/\/form\/[a-f0-9-]+/, '/form/***'),
      duration_ms: duration,
      analysis,
      suggested_reply,
      n8nResponse: n8nData,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[server] Error dispatching to n8n:', err);
    // Return 200 with success: false and plain English error to avoid Cloud Run proxy HTML interception
    return res.status(200).json({
      success: false,
      error: `Could not reach n8n workflow: ${err.message || 'Connection timed out'}`,
      isNetworkError: true,
    });
  }
});

// Vite middleware in dev or static files in prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SupportFlow AI server listening on http://0.0.0.0:${PORT}`);
});
