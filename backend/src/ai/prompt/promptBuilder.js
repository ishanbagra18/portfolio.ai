import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Rewrites a user's conversational message into a standalone search query using chat history context.
 * 
 * @param {Array<{role: string, text: string}>} history - Past chat exchanges.
 * @param {string} latestMessage - Current recruiter question.
 * @returns {Promise<string>} Standalone search query.
 */
export const condenseQuery = async (history, latestMessage) => {
  if (!history || history.length === 0) {
    return latestMessage;
  }

  const historyText = history
    .map(turn => `${turn.role === 'user' ? 'Recruiter' : 'Assistant'}: ${turn.text}`)
    .join('\n');

  const prompt = `Given the following conversation history between a Recruiter and an Assistant, and a new question from the Recruiter, rewrite the new question into a standalone, context-independent query that can be used for search engines. Do not answer the question or write any conversational replies, just return the raw rewritten search query text.

Conversation History:
${historyText}

New Question:
${latestMessage}

Rewritten Standalone Query:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const condensed = response.text ? response.text.trim() : latestMessage;
    console.log(`[Prompt Builder] Condensed Query: "${latestMessage}" -> "${condensed}"`);
    return condensed;
  } catch (error) {
    console.error("[Prompt Builder] Query condensing failed. Falling back to latest query.", error);
    return latestMessage;
  }
};

/**
 * Builds the strict instruction prompt combining context chunks, candidate name, and the question.
 * 
 * @param {Array<{pageContent: string, section: string, title: string}>} contextChunks - Retrieved vector documents.
 * @param {string} candidateName - Candidate full name.
 * @param {string} question - The user query.
 * @returns {string} Fully formulated prompt text.
 */
export const buildRAGPrompt = (contextChunks, candidateName, question) => {
  const contextText = contextChunks
    .map((chunk, idx) => `[Context Item ${idx + 1}] (Section: ${chunk.section || 'General'}, Title: ${chunk.title || 'Untitled'})
${chunk.pageContent}`)
    .join('\n\n');

  return `You are a professional AI recruiter assistant representing ${candidateName}.
Your objective is to answer recruiter or visitor questions about ${candidateName}'s professional background using ONLY the provided context items below.

Here is the retrieved candidate portfolio context:
=========================================
${contextText || "No context items available."}
=========================================

Rules:
1. You can ONLY answer using the facts and information provided in the context items above.
2. If the context items do not contain enough information to answer the question, or if the answer is not present, you MUST reply exactly with: "This information is not available in the portfolio."
3. Never invent projects, experience, achievements, education, dates, or skills. Do not assume or infer details not explicitly stated.
4. If multiple context items mention the same topic, merge them naturally and professionally.
5. Keep your answer professional, concise, and structured. Use bullet points when appropriate.
6. Speak in the third person (e.g. "Ishan has experience in...") or as an assistant representative.

Question:
${question}

Answer:`;
};
