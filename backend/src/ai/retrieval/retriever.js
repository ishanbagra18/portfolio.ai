/**
 * Computes the dot product of two vectors.
 * Assuming vectors are already normalized (magnitude = 1), dot product equals Cosine Similarity.
 * @param {number[]} a - Vector A.
 * @param {number[]} b - Vector B.
 * @returns {number} Dot product/Cosine similarity.
 */
const dotProduct = (a, b) => {
  if (a.length !== b.length) throw new Error("Vectors must have the same length.");
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
};

/**
 * Performs Maximal Marginal Relevance (MMR) selection to maximize relevance and diversity.
 * 
 * @param {Array<{id: string, vector: number[], payload: object, score: number}>} candidates - Candidate points from Qdrant.
 * @param {number[]} queryEmbedding - The embedding of the search query.
 * @param {number} topK - Number of documents to retrieve.
 * @param {number} lambda - Balance between relevance and diversity (0 to 1, default 0.5).
 * @returns {Array} List of selected documents with payloads.
 */
export const selectDiverseChunks = (candidates, queryEmbedding, topK = 5, lambda = 0.5) => {
  // 1. Filter candidates by similarity score threshold (> 0.65)
  const filteredCandidates = candidates.filter(c => c.score > 0.65);
  
  if (filteredCandidates.length === 0) return [];
  if (filteredCandidates.length <= 1) return filteredCandidates.map(c => c.payload);

  const selectedIndices = [];
  const selectedEmbeddings = [];

  // Loop to build topK selections
  const limit = Math.min(topK, filteredCandidates.length);
  
  for (let step = 0; step < limit; step++) {
    let bestScore = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < filteredCandidates.length; i++) {
      if (selectedIndices.includes(i)) continue;

      const cand = filteredCandidates[i];
      const relevance = cand.score; // similarity to query from Qdrant

      // Compute redundancy: max similarity to any already selected document
      let maxRedundancy = 0;
      if (selectedEmbeddings.length > 0) {
        maxRedundancy = Math.max(
          ...selectedEmbeddings.map(selVec => dotProduct(cand.vector, selVec))
        );
      }

      // MMR Formula
      const score = lambda * relevance - (1 - lambda) * maxRedundancy;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex !== -1) {
      selectedIndices.push(bestIndex);
      selectedEmbeddings.push(filteredCandidates[bestIndex].vector);
    }
  }

  // Return the payloads of the selected chunks
  return selectedIndices.map(idx => filteredCandidates[idx].payload);
};
