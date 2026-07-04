import { GoogleGenAI } from '@google/genai';
import { supabase } from '../config/supabase.js';
import { condenseQuery, buildRAGPrompt } from '../ai/prompt/promptBuilder.js';
import { searchRelatedContext } from '../services/ragService.js';
import { isQdrantHealthy } from '../ai/vector/qdrantClient.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Handles conversational queries from recruiters visiting portfolios.
 * Implements conversational rephrasing, MMR vector context retrieval, and strict hallucination safeguards.
 * Automatically falls back to full profile context if the Qdrant vector database is offline.
 * 
 * POST /api/ai/chat/:portfolioId
 */
export const chatWithPortfolioRAG = async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const { message, history } = req.body;

    if (!portfolioId || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Portfolio ID aur message provide karna zaroori hai." 
      });
    }

    // 1. Fetch personal details for candidate name context
    const { data: personalInfo, error: piError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (piError || !personalInfo) {
      return res.status(404).json({ 
        success: false, 
        message: "Portfolio data nahi mila." 
      });
    }

    const candidateName = personalInfo.full_name;

    // Check if Qdrant is online and reachable
    const qdrantOnline = await isQdrantHealthy();
    let systemPrompt = "";

    if (qdrantOnline) {
      console.log(`[RAG Service] Qdrant is online. Executing vector RAG search.`);
      // 2. Condense query utilizing conversation history
      const standaloneQuery = await condenseQuery(history || [], message);

      // 3. Search and retrieve the top 5 diverse context chunks using Qdrant MMR search
      const contextChunks = await searchRelatedContext(portfolioId, standaloneQuery, 5);

      // 4. Construct the strict RAG instruction prompt
      systemPrompt = buildRAGPrompt(contextChunks, candidateName, standaloneQuery);
    } else {
      console.warn(`[RAG Service] WARNING: Qdrant is offline. Falling back to full profile database context mode.`);
      
      // Fetch complete details from Supabase database tables directly
      const [
        { data: techStacks },
        { data: projects },
        { data: experiences },
        { data: certifications }
      ] = await Promise.all([
        supabase.from('tech_stacks').select('*').eq('portfolio_id', portfolioId),
        supabase.from('projects').select('*').eq('portfolio_id', portfolioId),
        supabase.from('experiences').select('*').eq('portfolio_id', portfolioId),
        supabase.from('certifications').select('*').eq('portfolio_id', portfolioId)
      ]);

      const context = {
        name: personalInfo.full_name,
        title: personalInfo.main_title,
        about: personalInfo.about_paragraph,
        education: `${personalInfo.course_name || ''} in ${personalInfo.specialization_course_name || ''} from ${personalInfo.college_name || ''}`,
        socials: {
          github: personalInfo.github_username,
          leetcode: personalInfo.leetcode_username,
          email: personalInfo.email_id
        },
        skills: (techStacks || []).map(s => `${s.name} (${s.category || 'Skill'})`),
        projects: (projects || []).map(p => ({
          name: p.project_name,
          description: p.project_desc,
          tech_stack: p.project_tech_stack,
          github: p.project_github_link
        })),
        experiences: (experiences || []).map(e => ({
          role: e.role,
          company: e.company_name,
          date: e.date_of_joining,
          work: e.work_description
        })),
        certifications: (certifications || []).map(c => ({
          name: c.certification_name,
          issuer: c.issuing_organization,
          verify_url: c.credential_url
        }))
      };

      systemPrompt = `You are a helpful, professional AI recruitment assistant acting on behalf of ${context.name}.
Your job is to answer questions from recruiters, hiring managers, or visitors about ${context.name}'s professional background, projects, experiences, skills, and qualifications based ONLY on the portfolio data provided below.

[System Warning: Qdrant vector database is offline. Bypassing chunked RAG and evaluating on full profile context.]

Here is ${context.name}'s official portfolio data:
${JSON.stringify(context, null, 2)}

Rules:
1. Always be polite, professional, and highlight ${context.name}'s strengths.
2. If the user asks about a skill, project, or experience that is NOT mentioned in the data, answer honestly that it is not listed in the current profile data, but offer to highlight their related skills that ARE present.
3. Keep answers concise, readable, and structured. Use bullet points where appropriate.
4. Speak in the third person (e.g. "Ishan is a Full-Stack developer...") or as their representative assistant.
5. If context doesn't contain the answer, respond exactly with: "This information is not available in the portfolio."`;
    }

    // 5. Generate content using Gemini 2.5 Flash
    // We pass the full history to preserve conversational state for the generation model
    const chatContents = [];
    
    // Add RAG system guidance
    chatContents.push({ 
      role: 'user', 
      parts: [{ text: `System Instructions:\n${systemPrompt}` }] 
    });
    chatContents.push({ 
      role: 'model', 
      parts: [{ text: `Understood. I am representing ${candidateName} and will answer recruiters strictly using the provided context items.` }] 
    });

    // Map conversation history
    if (Array.isArray(history)) {
      history.forEach(turn => {
        chatContents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      });
    }

    // Add latest message
    chatContents.push({ 
      role: 'user', 
      parts: [{ text: message }] 
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatContents,
    });

    const reply = response.text ? response.text.trim() : "I couldn't process that question right now. Please try again.";

    // Return response with both "reply" and "answer" keys to support both systems
    return res.status(200).json({
      success: true,
      reply: reply,
      answer: reply
    });
  } catch (error) {
    console.error("[Chat Controller] Conversational RAG error:", error);
    
    // Handle Gemini API rate limits/quota exhausted (429) errors gracefully
    const isRateLimit = error.status === 429 || 
                        (error.message && error.message.includes('429')) || 
                        (error.message && error.message.includes('quota'));
                        
    if (isRateLimit) {
      const friendlyQuotaMsg = "Apologies! The Gemini AI API rate limit/free quota has been temporarily exceeded. Please try again in a few minutes.";
      return res.status(200).json({
        success: true,
        reply: friendlyQuotaMsg,
        answer: friendlyQuotaMsg
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI chat widget error.",
      error: error.message
    });
  }
};
