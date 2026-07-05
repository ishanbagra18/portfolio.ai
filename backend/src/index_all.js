import 'dotenv/config';
import { supabase } from './config/supabase.js';
import { indexPortfolio } from './services/ragService.js';

async function syncAll() {
  try {
    console.log("Fetching all portfolios from Supabase...");
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id');

    if (error) {
      throw error;
    }

    console.log(`Found ${portfolios.length} portfolios to index.`);
    for (const portfolio of portfolios) {
      console.log(`Indexing portfolio ${portfolio.id}...`);
      await indexPortfolio(portfolio.id);
    }
    console.log("All portfolios have been successfully indexed to Qdrant!");
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

syncAll();
