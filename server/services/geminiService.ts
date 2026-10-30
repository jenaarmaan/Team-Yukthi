import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.ts';
import { logger } from '../utils/logger.ts';
import { QuestionItem } from '../repositories/types.ts';
import { RagDocumentChunk } from './ragAnalyticsService.ts';

export class GeminiService {
  private static client: GoogleGenAI | null = null;
  private static defaultModel = 'gemini-2.5-flash';

  /**
   * Initializes or returns the cached Google GenAI client.
   */
  public static getClient(): GoogleGenAI | null {
    if (this.client) return this.client;
    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      logger.warn('[GeminiService] GEMINI_API_KEY is not configured in environment.');
      return null;
    }

    try {
      this.client = new GoogleGenAI({ apiKey });
      logger.info(`[GeminiService] Initialized Google GenAI client with model: ${this.defaultModel}`);
      return this.client;
    } catch (err) {
      logger.error('[GeminiService] Failed to initialize Google GenAI client:', err);
      return null;
    }
  }

  /**
   * Checks whether the real-time Gemini API is reachable and active.
   */
  public static isAvailable(): boolean {
    const key = config.geminiApiKey || process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim().length > 0);
  }

  /**
   * Generates a conversational, role-aware, context-grounded AI chat response.
   */
  public static async generateChatResponse(params: {
    role: string;
    query: string;
    groundedContext: string;
    history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  }): Promise<string | null> {
    const ai = this.getClient();
    if (!ai) return null;

    const { role, query, groundedContext, history = [] } = params;

    const systemInstruction = `You are NIYOJAN AI, the real-time recruitment operations and intelligence assistant for the NIYOJAN autonomous campus hiring platform.
Your user has the role of "${role}".
Strict Role Boundaries:
- 'candidate': Can only view their own applications, assigned interview schedules, attendance QR instructions, standby updates, and general hiring drive criteria. NEVER expose internal HR ratings, panel interview scores of other applicants, or system administrative data.
- 'interviewer': Can view candidate profiles assigned to them, 4-tier skill verification credentials, question banks, and evaluation rubrics. NEVER expose compensation data or unverified candidate contact info.
- 'interview_coordinator': Focuses on physical venue rooms, HMAC QR check-in desk arrivals, live panel capacity, and fast standby dispatch.
- 'recruitment_manager': Focuses on drive-level funnel progression, department targets, and interviewer load balancing.
- 'hr_admin': Governs overall hiring drives, capacity thresholds, attendance policies, and absence justifications.
- 'super_admin': Full system telemetry, audit logs, and security verification.

Grounding Guidelines:
- Ground your answers strictly on the REAL-TIME NIYOJAN DATABASE FACTS provided below.
- Do not invent fictitious dates or hallucinate candidate names not present in the grounded context.
- Be concise, direct, helpful, and professional. Use formatting (bullet points, bold text) where appropriate.`;

    const recentHistoryText = history
      .slice(-6)
      .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `REAL-TIME NIYOJAN DATABASE FACTS:
${groundedContext || 'No specific records retrieved. Use general NIYOJAN recruitment operational policies.'}

CONVERSATION HISTORY:
${recentHistoryText || 'None'}

USER QUERY:
${query}

Respond authoritatively and concisely grounded in the facts above:`;

    try {
      const response = await ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          maxOutputTokens: 600
        }
      });

      const text = response.text?.trim();
      return text || null;
    } catch (err: any) {
      logger.warn(`[GeminiService] Real-time chat query failed (${err.message}). Using local grounded fallback.`);
      return null;
    }
  }

  /**
   * Generates real-time Advanced RAG analytics, synthesizing metrics and retrieved SQLite chunks.
   */
  public static async generateRagAnalytics(params: {
    query: string;
    metrics: any;
    retrievedChunks: RagDocumentChunk[];
    actorRole: string;
  }): Promise<{
    answer: string;
    insights: string[];
    recommendations: string[];
  } | null> {
    const ai = this.getClient();
    if (!ai) return null;

    const { query, metrics, retrievedChunks, actorRole } = params;

    const systemInstruction = `You are the Lead Recruitment Operations & Workforce Analytics Engine of NIYOJAN.
Your task is to analyze real-time hiring metrics and retrieved database chunks to answer analytical queries with high precision.
You must return your output strictly in valid JSON format matching this schema:
{
  "answer": "A detailed 2-3 paragraph analytical assessment addressing the user query with cited metrics",
  "insights": [
    "Key observational finding 1 with quantitative backing",
    "Key observational finding 2 with quantitative backing",
    "Key observational finding 3 with quantitative backing"
  ],
  "recommendations": [
    "Actionable tactical recommendation 1 for recruitment leaders",
    "Actionable tactical recommendation 2 for recruitment leaders",
    "Actionable tactical recommendation 3 for recruitment leaders"
  ]
}`;

    const contextSnippets = retrievedChunks
      .map((c, i) => `[Chunk ${i + 1}] Category: ${c.category.toUpperCase()} | Title: ${c.title}\n${c.content}`)
      .join('\n\n');

    const prompt = `QUERY FROM ${actorRole.toUpperCase()}:
"${query}"

PLATFORM TELEMETRY & AGGREGATE METRICS:
- Total Candidates: ${metrics.totalCandidates}
- Total Hiring Drives: ${metrics.totalDrives} (Active: ${metrics.activeDrives})
- Total Interviews Processed: ${metrics.totalInterviews}
- Candidate Attendance Rate: ${metrics.attendanceRate}%
- No-Show Vacancy Rate: ${metrics.noShowRate}%
- Offer Selection Rate: ${metrics.selectionRate}%
- Standby Recovery Fulfillment Rate: ${metrics.recoverySuccessRate}%

RETRIEVED KNOWLEDGE CHUNKS FROM SQLITE ENGINE:
${contextSnippets}

Analyze the query against the metrics and retrieved chunks. Output pure JSON without markdown code fences:`;

    try {
      const response = await ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text?.trim() || '';
      // Parse clean JSON
      const parsed = JSON.parse(rawText);
      if (parsed && typeof parsed.answer === 'string' && Array.isArray(parsed.insights)) {
        return {
          answer: parsed.answer,
          insights: parsed.insights.map((s: any) => String(s)),
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.map((s: any) => String(s)) : []
        };
      }
      return null;
    } catch (err: any) {
      logger.warn(`[GeminiService] Real-time RAG query failed (${err.message}). Using local deterministic RAG.`);
      return null;
    }
  }

  /**
   * Generates dynamic, skill-tailored interview evaluation questions via Gemini.
   */
  public static async generateQuestionSuggestions(params: {
    skills: string[];
    role: string;
    interviewRound?: string;
    targetCount?: number;
  }): Promise<QuestionItem[] | null> {
    const ai = this.getClient();
    if (!ai) return null;

    const { skills, role, interviewRound = 'Technical Round 1', targetCount = 6 } = params;

    const systemInstruction = `You are a Principal Engineering Interview Panelist for NIYOJAN.
Generate rigorous, practical, real-world interview assessment questions tailored to the candidate's verified skills and role.
Return your response strictly as a JSON array of question objects matching this schema:
[
  {
    "id": "q_gemini_1",
    "topic": "Topic Name",
    "category": "technical" | "coding" | "problem_solving" | "system_design",
    "difficulty": "entry" | "intermediate" | "advanced",
    "question": "Clear, challenging question prompt",
    "expectedKeyPoints": ["Crucial concept 1", "Crucial concept 2", "Edge case or optimization"],
    "codeSnippet": "Optional concise code snippet or null",
    "relevantSkills": ["Skill 1", "Skill 2"]
  }
]`;

    const prompt = `Generate ${targetCount} tailored interview questions for:
Candidate Role: ${role}
Interview Round: ${interviewRound}
Candidate Verified Skills: ${skills.join(', ')}

Output pure JSON array:`;

    try {
      const response = await ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text?.trim() || '';
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, idx: number) => ({
          id: item.id || `q_gemini_${Date.now()}_${idx}`,
          topic: item.topic || 'Technical Assessment',
          category: item.category || 'technical',
          difficulty: item.difficulty || 'intermediate',
          question: item.question,
          expectedKeyPoints: Array.isArray(item.expectedKeyPoints) ? item.expectedKeyPoints : ['Core conceptual understanding'],
          codeSnippet: item.codeSnippet || undefined,
          relevantSkills: Array.isArray(item.relevantSkills) ? item.relevantSkills : skills.slice(0, 2)
        }));
      }
      return null;
    } catch (err: any) {
      logger.warn(`[GeminiService] Real-time question generation failed (${err.message}). Using catalog.`);
      return null;
    }
  }
}

