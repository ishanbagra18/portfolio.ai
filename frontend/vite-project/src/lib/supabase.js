import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vlmeaczuzowpluqnfclv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_tW49B5d4ncbkadUfuWAWVw_ZyOIVOZL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
