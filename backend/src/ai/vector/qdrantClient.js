import { QdrantClient } from '@qdrant/js-client-rest';
import crypto from 'crypto';

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'portfolios';

console.log(`[Qdrant Client] Initializing Qdrant connection at: ${qdrantUrl}`);
const client = new QdrantClient({ url: qdrantUrl });

/**
 * Checks if Qdrant server is reachable.
 * @returns {Promise<boolean>} True if reachable, false otherwise.
 */
export const isQdrantHealthy = async () => {
  try {
    await client.getCollections();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Ensures the default portfolios collection exists in Qdrant.
 */
export const initCollection = async () => {
  try {
    const collectionsResponse = await client.getCollections();
    const collectionExists = collectionsResponse.collections.some(
      c => c.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      console.log(`[Qdrant Client] Collection '${COLLECTION_NAME}' not found. Creating it...`);
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 3072, // Google gemini-embedding-2 output dimension
          distance: 'Cosine',
        },
      });
      console.log(`[Qdrant Client] Collection '${COLLECTION_NAME}' created successfully.`);
    }
  } catch (error) {
    console.error("[Qdrant Client] Failed to initialize Qdrant collection:", error.message);
    console.warn("[Qdrant Client] Ensure that Qdrant is running locally at", qdrantUrl);
    throw error;
  }
};

/**
 * Upsert chunks/documents into Qdrant vector database.
 * @param {string} portfolioId - The portfolio ID.
 * @param {Array<{vector: number[], payload: object}>} points - Chunks with embeddings and metadata.
 */
export const upsertVectors = async (portfolioId, points) => {
  await initCollection();
  
  if (!points || points.length === 0) return;

  const qdrantPoints = points.map(pt => {
    // Generate a secure UUID from chunkId or random UUID
    const pointId = crypto.randomUUID();
    return {
      id: pointId,
      vector: pt.vector,
      payload: {
        ...pt.payload,
        portfolioId, // guarantee portfolioId matches in payload filter
      }
    };
  });

  try {
    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points: qdrantPoints,
    });
    console.log(`[Qdrant Client] Successfully upserted ${points.length} vectors for portfolio: ${portfolioId}`);
  } catch (error) {
    console.error(`[Qdrant Client] Failed to upsert vectors for portfolio ${portfolioId}:`, error);
    throw error;
  }
};

/**
 * Deletes all vectors belonging to a specific portfolioId.
 * @param {string} portfolioId - The UUID of the portfolio to clear.
 */
export const deleteVectors = async (portfolioId) => {
  await initCollection();
  
  try {
    await client.delete(COLLECTION_NAME, {
      filter: {
        must: [
          {
            key: 'portfolioId',
            match: { value: portfolioId },
          },
        ],
      },
    });
    console.log(`[Qdrant Client] Cleared existing vectors for portfolio: ${portfolioId}`);
  } catch (error) {
    console.error(`[Qdrant Client] Failed to delete vectors for portfolio ${portfolioId}:`, error);
    throw error;
  }
};

/**
 * Searches Qdrant for vectors matching the query vector filter-constrained to a portfolioId.
 * Returns both metadata payload AND embeddings for MMR calculations.
 * @param {string} portfolioId - The target portfolio context ID.
 * @param {number[]} queryEmbedding - The embedding vector of the search query.
 * @param {number} limit - Maximum candidate hits to fetch before MMR filters.
 * @returns {Promise<Array>} Array of hit objects with vectors and payloads.
 */
export const searchVectors = async (portfolioId, queryEmbedding, limit = 10) => {
  await initCollection();

  try {
    const results = await client.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      filter: {
        must: [
          {
            key: 'portfolioId',
            match: { value: portfolioId },
          },
        ],
      },
      limit: limit,
      with_payload: true,
      with_vector: true,
    });
    return results;
  } catch (error) {
    console.error(`[Qdrant Client] Search failed for portfolio ${portfolioId}:`, error);
    throw error;
  }
};
