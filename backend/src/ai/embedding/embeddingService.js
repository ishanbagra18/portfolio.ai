import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates an embedding vector for a single text using gemini-embedding-2.
 * @param {string} text - The input string to embed.
 * @returns {Promise<number[]>} Embedding vector (3072 dimensions).
 */
export const getEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error("Text parameter must be a non-empty string.");
  }
  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-2',
      contents: text.trim(),
    });
    
    if (!response || !response.embeddings || !response.embeddings[0] || !response.embeddings[0].values) {
      throw new Error("Invalid response structure from Gemini Embedding API.");
    }
    
    return response.embeddings[0].values;
  } catch (error) {
    console.error("[Embedding Service] Error generating embedding:", error);
    throw error;
  }
};

/**
 * Generates embeddings for an array of texts utilizing batch requests for quota optimization.
 * @param {string[]} texts - Array of input strings.
 * @returns {Promise<number[][]>} Array of embedding vectors (3072 dimensions).
 */
export const getEmbeddings = async (texts) => {
  if (!Array.isArray(texts)) {
    throw new Error("Texts parameter must be an array of strings.");
  }
  
  // Clean texts and fallback empty strings to a placeholder to ensure same array size
  const cleanTexts = texts.map(t => (typeof t === 'string' && t.trim()) ? t.trim() : 'N/A');
  if (cleanTexts.length === 0) return [];
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:batchEmbedContents?key=${process.env.GEMINI_API_KEY || ''}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: cleanTexts.map(text => ({
          model: 'models/gemini-embedding-2',
          content: { parts: [{ text }] }
        }))
      })
    });
    
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data || !data.embeddings) {
      throw new Error("Invalid response structure from Gemini Batch Embedding REST API.");
    }
    
    return data.embeddings.map(e => e.values);
  } catch (error) {
    console.warn("[Embedding Service] REST batch embedding failed, attempting individual fallbacks:", error.message);
    const promises = cleanTexts.map(text => getEmbedding(text));
    return await Promise.all(promises);
  }
};
