
import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-3-pro-preview';

export class ComplaintResolverService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private async callGemini(prompt: string, thinkingBudget = 4000) {
    const response = await this.ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.1,
        thinkingConfig: { thinkingBudget }
      }
    });
    return response.text || "No response received.";
  }

  async runCategorizer(complaints: string): Promise<string> {
    const prompt = `
Phase 1: Complaint Categorization
Role: Autonomous Categorizer Agent

Instructions:
Understand the nature of each complaint.
Assign one primary category per complaint.
Use concise, business-relevant labels (Billing, Technical Issue, Service Delay, Product Defect, Account / Access, Policy / Refund, Customer Experience).

Output Format:
CATEGORIZATION:
Complaint ID/Brief Title → Category

Input:
${complaints}
`;
    return this.callGemini(prompt);
  }

  async runPrioritizer(complaints: string, categorization: string): Promise<string> {
    const prompt = `
Phase 2: Priority Assessment
Role: Autonomous Prioritizer Agent

Input:
Complaints: ${complaints}
Categorization: ${categorization}

Instructions:
Determine urgency and business impact.
Assign a priority level: Low / Medium / High / Critical.
Base priority on: Customer impact, Reputational risk, Time sensitivity, Legal or financial exposure.

Output Format:
PRIORITIZATION:
Complaint ID → Priority Level
`;
    return this.callGemini(prompt);
  }

  async runDrafter(complaints: string, priority: string): Promise<string> {
    const prompt = `
Phase 3: Response Drafting
Role: Professional Communications Agent

Input:
Complaints: ${complaints}
Priority Data: ${priority}

Instructions:
Create clear, empathetic, and professional response templates.
Tailor tone to the complaint’s severity. Do not overpromise.

Output Format:
RESPONSE_TEMPLATES:
Complaint ID →
<draft response>
`;
    return this.callGemini(prompt);
  }

  async runPlanner(complaints: string, drafterOutput: string, priority: string): Promise<string> {
    const prompt = `
Phase 4: Recommended Next Actions
Role: Operations Strategy Agent

Input:
Complaints: ${complaints}
Drafts: ${drafterOutput}
Priority: ${priority}

Instructions:
Suggest operational follow-ups beyond the response.
Recommend concrete next steps (Escalation, Refund processing, Technical investigation, Follow-up timeline).
Align actions with priority level.

Output Format:
RECOMMENDED_ACTIONS:
Complaint ID → Action plan
`;
    return this.callGemini(prompt);
  }

  async runEvaluator(allPrevious: string): Promise<string> {
    const prompt = `
Phase 5 & 6: Urgency Re-evaluation & Internal State Management
Role: Risk Management & State Compliance Agent

Input:
Context of all previous phases:
${allPrevious}

Instructions:
1. Reassess urgency after drafting responses (Reduced, Unchanged, Increased).
2. Maintain a persistent state of High/Critical complaints.

Output Format:
URGENCY_REEVALUATION:
Complaint ID → Updated urgency + justification

HIGH_PRIORITY_STATE:
- Complaint ID:
  Category:
  Current Urgency:
  Pending Actions:
`;
    return this.callGemini(prompt, 8000);
  }
}
