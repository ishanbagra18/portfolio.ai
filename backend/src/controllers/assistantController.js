import { GoogleGenAI } from '@google/genai';
import { supabase } from '../config/supabase.js';

// Product Help Q&A Index
const PRODUCT_HELP_DOCS = `
PRODUCT HELP KNOWLEDGE BASE (Portfolio.ai):

1. PUBLISHING & UNPUBLISHING:
- How to publish: Go to "My Portfolios", toggle the "Public/Private" switch to ON (Public), or click "Publish" in the Editor top bar.
- Custom link: Click "Custom Link" or "Edit ✏" next to your public URL in "My Portfolios" to create a custom handle (e.g., portfolio.ai/p/alex-dev).

2. THEME & SECTIONS:
- Theme toggle: Use the sun/moon icon in the top right navbar to toggle Light/Dark mode.
- Reordering sections: In the Portfolio Editor (/edit-portfolio/:id), click "Section Manager" to drag and reorder sections (Projects, Experience, Skills, Education, etc.).

3. CAREER TOOLS & PRO FEATURES:
- AI Cover Letter Generator (/career-tools/cover-letter): Paste a job description and select your portfolio to generate a tailored cover letter.
- AI Mock Interview (/career-tools/interview/:id): Practice real-time technical interview questions with instant scoring.
- ATS Resume Checker (/ats-checker): Upload your resume to calculate your match score against job descriptions.
- Job Application Tracker (/applications): Kanban board to track job applications across Wishlist, Applied, Interviewing, and Offered stages.
- Recruiter Analytics (/analytics/:id): Track visitor views, traffic referrers, and recruiter chatbot queries.
- Recruiter Changelog: Publish candidate updates (new projects, certifications, stack upgrades) for recruiters.

4. PLANS & PRICING:
- Free Plan: 1 published portfolio, standard templates, 10 AI credits/month, "Built with Portfolio.io" badge.
- Pro Plan ($12/month or $96/year): Unlimited portfolios, all 20+ premium templates, 500 AI credits/month, custom domains, Recruiter Analytics, Job Tracker, AI Cover Letters, Mock Interviews, and Hide "Built with Portfolio.io" badge option.
`;

const TOOL_DECLARATIONS = [{
  functionDeclarations: [
    {
      name: "navigate",
      description: "Navigate user to a specific page in the app",
      parameters: {
        type: "object",
        properties: {
          page: {
            type: "string",
            enum: ["home", "templates", "my_portfolios", "ats_checker", "career_tools", "profile", "billing", "pricing", "job_tracker", "cover_letter", "interview"]
          }
        },
        required: ["page"]
      }
    },
    {
      name: "list_portfolios",
      description: "List all portfolios owned by the logged-in user"
    },
    {
      name: "open_editor",
      description: "Open the editor for a specific portfolio",
      parameters: {
        type: "object",
        properties: {
          portfolioId: { type: "string" }
        },
        required: ["portfolioId"]
      }
    },
    {
      name: "set_theme",
      description: "Switch app appearance between light and dark mode",
      parameters: {
        type: "object",
        properties: {
          mode: { type: "string", enum: ["light", "dark"] }
        },
        required: ["mode"]
      }
    },
    {
      name: "update_setting",
      description: "Update a portfolio setting like hide_badge or is_published",
      parameters: {
        type: "object",
        properties: {
          portfolioId: { type: "string" },
          setting: { type: "string", enum: ["hide_badge", "is_published"] },
          value: { type: "boolean" }
        },
        required: ["portfolioId", "setting", "value"]
      }
    },
    {
      name: "get_entitlements",
      description: "Check user's current plan, AI credits remaining, and feature limits"
    },
    {
      name: "spotlight_element",
      description: "Highlight a UI element on screen for the user",
      parameters: {
        type: "object",
        properties: {
          elementId: {
            type: "string",
            enum: ["theme-toggle", "nav-my-portfolios", "nav-templates", "create-portfolio-btn", "share-btn", "edit-portfolio-btn", "save-portfolio-btn", "privacy-link-btn", "built-with-badge"]
          }
        },
        required: ["elementId"]
      }
    }
  ]
}];

export const chatAssistant = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.sub || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { message, history = [], currentRoute = '/home', confirmAction = null } = req.body;
    if (!message && !confirmAction) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    // Handle Confirmed Actions directly if client confirmed a pending action
    if (confirmAction) {
      const { name, args } = confirmAction;
      if (name === 'update_setting') {
        const { portfolioId, setting, value } = args;
        const column = setting === 'is_published' ? 'is_public' : setting;
        const { error } = await supabase
          .from('portfolios')
          .update({ [column]: value })
          .eq('id', portfolioId)
          .eq('user_id', userId);

        if (error) {
          return res.status(500).json({ success: false, message: "Failed to update setting." });
        }
        return res.status(200).json({
          success: true,
          text: `Setting updated! '${setting}' is now set to ${value}.`,
          action: { name: 'update_setting', args }
        });
      }
    }

    // Fetch user details for entitlement checks
    const { data: userRecord } = await supabase
      .from('users')
      .select('plan, email, full_name')
      .eq('id', userId)
      .single();

    const plan = userRecord?.plan || 'free';

    // Format chat history (capped at 10 items)
    const recentHistory = history.slice(-10);
    const contents = recentHistory.map(h => ({
      role: h.role === 'model' || h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content || h.text || '' }]
    }));

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemPrompt = `
You are Portfolio Copilot, the AI Assistant built into Portfolio.ai.
You help logged-in users manage their portfolios, change settings, navigate the app, and answer product questions.
User ID: ${userId}
User Plan: ${plan.toUpperCase()}
Current Page: ${currentRoute}

Rules:
1. Always be concise, helpful, and friendly.
2. If the user asks to navigate, switch theme, list portfolios, open editor, spotlight a UI element, or change settings, use the available function tools.
3. For "hide_badge" setting: if user plan is "FREE", do NOT hide badge; explain that Pro ($12/mo) is required and offer a upgrade link.
4. For unpublishing ("is_published" = false), the backend will signal confirmation.
5. Use the Product Help Knowledge Base below to answer any "how-to" or feature questions accurately.

${PRODUCT_HELP_DOCS}
`;

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY environment variable is missing on the server. Please add GEMINI_API_KEY in your Render Dashboard."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini with tools
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        tools: TOOL_DECLARATIONS
      }
    });

    const functionCalls = response.functionCalls;
    let replyText = response.text || '';
    let clientAction = null;
    let needsConfirmation = false;
    let confirmationPayload = null;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const { name, args } = call;

      // Handle Tools
      if (name === 'navigate' || name === 'open_editor' || name === 'set_theme' || name === 'spotlight_element') {
        clientAction = { name, args };
        if (!replyText) {
          if (name === 'navigate') replyText = `Navigating to ${args.page}...`;
          if (name === 'open_editor') replyText = `Opening portfolio editor...`;
          if (name === 'set_theme') replyText = `Switching theme to ${args.mode} mode.`;
          if (name === 'spotlight_element') replyText = `Here it is! Pointing out the requested control.`;
        }
      } else if (name === 'get_entitlements') {
        const quotaInfo = plan === 'pro'
          ? "Pro Plan ($12/mo): Unlimited portfolios, 500 AI credits/month."
          : "Free Plan: 1 published portfolio, 10 AI credits/month.";
        replyText = `You are currently on the **${plan.toUpperCase()}** plan. ${quotaInfo}`;
        clientAction = { name: 'get_entitlements', args: { plan } };
      } else if (name === 'list_portfolios') {
        const { data: portfolios } = await supabase
          .from('portfolios')
          .select('id, full_name, is_public, public_slug')
          .eq('user_id', userId);

        if (!portfolios || portfolios.length === 0) {
          replyText = "You don't have any created portfolios yet. Click **+ Create New** to get started!";
        } else {
          const listText = portfolios.map(p => `• **${p.full_name || 'Untitled'}** (ID: ${p.id}) - ${p.is_public ? '🟢 Public' : '🔒 Private'}`).join('\n');
          replyText = `Here are your portfolios:\n${listText}`;
          clientAction = { name: 'list_portfolios', args: { portfolios } };
        }
      } else if (name === 'update_setting') {
        const { portfolioId, setting, value } = args;

        if (setting === 'hide_badge' && plan !== 'pro') {
          replyText = "Hiding the **'Built with Portfolio.io'** badge is a **Pro** feature. Upgrade to Pro ($12/mo) to unlock clean custom branding!";
          clientAction = { name: 'requires_upgrade', args: { feature: 'hide_badge' } };
        } else if (setting === 'is_published' && value === false) {
          // Unpublishing requires explicit user confirmation card
          needsConfirmation = true;
          confirmationPayload = {
            name,
            args,
            prompt: `Are you sure you want to make this portfolio private (unpublish)?`
          };
          replyText = `Making portfolio private requires confirmation. Please confirm below:`;
        } else {
          // Perform database update
          const column = setting === 'is_published' ? 'is_public' : setting;
          let targetId = portfolioId;

          // If no portfolioId provided, fetch user's first portfolio
          if (!targetId) {
            const { data: firstP } = await supabase.from('portfolios').select('id').eq('user_id', userId).limit(1).single();
            if (firstP) targetId = firstP.id;
          }

          if (targetId) {
            await supabase.from('portfolios').update({ [column]: value }).eq('id', targetId).eq('user_id', userId);
            replyText = `Updated setting: **${setting}** set to **${value}**.`;
            clientAction = { name: 'update_setting', args: { portfolioId: targetId, setting, value } };
          } else {
            replyText = "Could not find portfolio to update.";
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      text: replyText || "How else can I assist you with your portfolio?",
      action: clientAction,
      needsConfirmation,
      confirmationPayload
    });

  } catch (err) {
    console.error("Copilot Assistant error:", err);
    return res.status(500).json({
      success: false,
      message: "Assistant service encountered an error.",
      error: err.message
    });
  }
};
