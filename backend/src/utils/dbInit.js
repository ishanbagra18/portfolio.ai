import { supabase } from '../config/supabase.js';

export async function initDatabaseTables() {
  try {
    // Check or create feature_usages mock table via Supabase RPC or check presence
    const { error: usagesErr } = await supabase.from('feature_usages').select('id').limit(1);
    if (usagesErr) {
      console.log('Notice: feature_usages table check:', usagesErr.message);
    }

    const { error: analyticsErr } = await supabase.from('portfolio_analytics').select('id').limit(1);
    if (analyticsErr) {
      console.log('Notice: portfolio_analytics table check:', analyticsErr.message);
    }

    const { error: leadsErr } = await supabase.from('chatbot_leads').select('id').limit(1);
    if (leadsErr) {
      console.log('Notice: chatbot_leads table check:', leadsErr.message);
    }

    console.log('Database initialization check complete.');
  } catch (err) {
    console.error('Error in initDatabaseTables:', err.message);
  }
}
