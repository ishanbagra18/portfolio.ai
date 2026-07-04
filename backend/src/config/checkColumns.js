import 'dotenv/config';
import { supabase } from './supabase.js';

async function check() {
  try {
    const { data, error } = await supabase.from('portfolios').select('*').limit(1);
    if (error) {
      console.error("Error fetching portfolios:", error);
    } else if (data && data.length > 0) {
      console.log("Columns in portfolios:", Object.keys(data[0]));
    } else {
      console.log("No portfolios found, columns check failed.");
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

check();
