import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useEntitlements() {
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState({
    plan: 'free',
    isPro: false,
    usages: {
      resume_autofill: { used: 0, limit: 1, remaining: 1 },
      ai_enhancement: { used: 0, limit: 10, remaining: 10 },
      job_matcher: { used: 0, limit: 2, remaining: 2 },
      ats_scanner: { used: 0, limit: 3, remaining: 3 },
      chatbot_msg: { used: 0, limit: 25, remaining: 25 },
      max_published_portfolios: { used: 0, limit: 1, remaining: 1 }
    }
  });

  const fetchEntitlements = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || 'guest';

      const response = await fetch(`${API_BASE_URL}/api/billing/entitlements?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setEntitlements(data);
      }
    } catch (err) {
      console.error('Error fetching entitlements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  const canUseFeature = useCallback((feature) => {
    if (entitlements.isPro || entitlements.plan === 'pro') return true;
    const usage = entitlements.usages?.[feature];
    if (!usage) return true;
    if (usage.limit === Infinity) return true;
    return (usage.used < usage.limit);
  }, [entitlements]);

  return {
    ...entitlements,
    loading,
    canUseFeature,
    refetchEntitlements: fetchEntitlements
  };
}
