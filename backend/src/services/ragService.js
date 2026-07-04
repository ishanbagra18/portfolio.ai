import { supabase } from '../config/supabase.js';
import { chunkPortfolio } from '../ai/chunking/chunker.js';
import { getEmbedding, getEmbeddings } from '../ai/embedding/embeddingService.js';
import { upsertVectors, deleteVectors, searchVectors } from '../ai/vector/qdrantClient.js';
import { selectDiverseChunks } from '../ai/retrieval/retriever.js';

/**
 * Orchestrates full re-indexing of a portfolio's textual components into Qdrant vectors.
 * Fetches data, chunks it, generates Gemini embeddings, and upserts them.
 * 
 * @param {string} portfolioId - The UUID of the portfolio.
 */
export const indexPortfolio = async (portfolioId) => {
  try {
    console.log(`[RAG Service] Indexing portfolio lifecycle trigger: ${portfolioId}`);
    
    // 1. Fetch full data from Supabase
    const { data: personalInfo, error: piError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .single();

    if (piError || !personalInfo) {
      throw new Error(`Portfolio not found: ${piError?.message || 'Empty'}`);
    }

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

    const fullData = {
      personalInfo,
      techStacks: techStacks || [],
      projects: projects || [],
      experiences: experiences || [],
      certifications: certifications || []
    };

    // 2. Generate natural chunks
    const chunks = chunkPortfolio(fullData);
    if (chunks.length === 0) {
      console.log(`[RAG Service] No text chunks generated for portfolio: ${portfolioId}`);
      return;
    }

    // 3. Clear existing vectors for this portfolio from Qdrant first
    await deleteVectors(portfolioId);

    // 4. Generate embeddings for all chunks in batch
    const textsToEmbed = chunks.map(c => c.pageContent);
    const embeddings = await getEmbeddings(textsToEmbed);

    // 5. Build Qdrant points payload
    const points = chunks.map((chunk, idx) => ({
      vector: embeddings[idx],
      payload: {
        ...chunk.metadata,
        pageContent: chunk.pageContent
      }
    }));

    // 6. Save vectors in Qdrant
    await upsertVectors(portfolioId, points);
    console.log(`[RAG Service] Portfolio indexing completed for portfolio: ${portfolioId}`);
  } catch (error) {
    console.error(`[RAG Service] Indexing workflow failed for portfolio ${portfolioId}:`, error);
    throw error;
  }
};

/**
 * Searches and retrieves the top 5 diverse context payloads matching the query.
 * 
 * @param {string} portfolioId - The portfolio target context.
 * @param {string} queryText - Standalone condensed query string.
 * @param {number} topK - Max chunks to select (default 5).
 * @returns {Promise<Array>} List of context payloads.
 */
export const searchRelatedContext = async (portfolioId, queryText, topK = 5) => {
  try {
    // 1. Generate query embedding
    const queryEmbedding = await getEmbedding(queryText);

    // 2. Retrieve candidates from Qdrant (fetch topK * 2 to give MMR selection pool options)
    const candidates = await searchVectors(portfolioId, queryEmbedding, topK * 2);
    
    if (!candidates || candidates.length === 0) {
      return [];
    }

    // 3. Apply Cosine similarity threshold (> 0.65) and MMR diversification
    const selectedPayloads = selectDiverseChunks(candidates, queryEmbedding, topK, 0.5);
    
    return selectedPayloads;
  } catch (error) {
    console.error(`[RAG Service] Retrieval search failed for portfolio ${portfolioId}:`, error);
    return []; // Return empty context on failure rather than crashing
  }
};
