import { supabase } from '../config/supabase.js';

export const FEATURE_LIMITS = {
  free: {
    resume_autofill: 1,
    ai_enhancement: 10,
    job_matcher: 2,
    ats_scanner: 3,
    chatbot_msg: 25,
    max_published_portfolios: 1
  },
  pro: {
    resume_autofill: Infinity,
    ai_enhancement: Infinity,
    job_matcher: Infinity,
    ats_scanner: Infinity,
    chatbot_msg: Infinity,
    max_published_portfolios: 10
  }
};

/**
 * Returns current YYYY-MM string for monthly quota tracking
 */
export function getCurrentMonthKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Fetches user profile plan ('free' or 'pro')
 */
export async function getUserPlan(userId) {
  if (!userId) return 'free';
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single();

    if (error || !profile) return 'free';
    return profile.plan || 'free';
  } catch (err) {
    console.error('Error fetching user plan:', err);
    return 'free';
  }
}

/**
 * Gets feature usage for current month
 */
export async function getFeatureUsage(userId, feature) {
  if (!userId) return 0;
  const monthKey = getCurrentMonthKey();
  try {
    const { data, error } = await supabase
      .from('feature_usages')
      .select('count')
      .eq('user_id', userId)
      .eq('feature', feature)
      .eq('month_year', monthKey)
      .single();

    if (error || !data) return 0;
    return data.count || 0;
  } catch (err) {
    return 0;
  }
}

/**
 * Increments feature usage for current month
 */
export async function incrementFeatureUsage(userId, feature) {
  if (!userId) return;
  const monthKey = getCurrentMonthKey();
  try {
    const currentCount = await getFeatureUsage(userId, feature);
    const { error } = await supabase
      .from('feature_usages')
      .upsert(
        {
          user_id: userId,
          feature,
          month_year: monthKey,
          count: currentCount + 1,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,feature,month_year' }
      );
    if (error) console.error('Error incrementing feature usage:', error);
  } catch (err) {
    console.error('Error in incrementFeatureUsage:', err);
  }
}

/**
 * Returns full entitlements summary for a user
 */
export async function getUserEntitlements(userId) {
  const plan = await getUserPlan(userId);
  const monthKey = getCurrentMonthKey();
  const isPro = plan === 'pro';

  const usagePromises = Object.keys(FEATURE_LIMITS.free).map(async (feature) => {
    const count = await getFeatureUsage(userId, feature);
    const limit = FEATURE_LIMITS[plan][feature] ?? Infinity;
    return {
      feature,
      used: count,
      limit,
      remaining: limit === Infinity ? 'unlimited' : Math.max(0, limit - count)
    };
  });

  const usagesArray = await Promise.all(usagePromises);
  const usageMap = {};
  usagesArray.forEach(u => {
    usageMap[u.feature] = u;
  });

  return {
    userId,
    plan,
    isPro,
    monthKey,
    usages: usageMap
  };
}

/**
 * Middleware: Requires Pro plan to proceed
 */
export const requirePlan = (requiredPlan = 'pro') => {
  return async (req, res, next) => {
    const userId = req.user?.id || req.body?.userId;
    const plan = await getUserPlan(userId);

    if (plan === requiredPlan || plan === 'pro') {
      return next();
    }

    return res.status(402).json({
      error: `${requiredPlan.toUpperCase()} plan required`,
      code: 'PRO_REQUIRED',
      requiredPlan,
      currentPlan: plan,
      upgradeUrl: '/pricing'
    });
  };
};

/**
 * Middleware: Enforces monthly quota limits for specific features
 */
export const checkQuota = (feature) => {
  return async (req, res, next) => {
    const userId = req.user?.id || req.body?.userId;
    const plan = await getUserPlan(userId);

    if (plan === 'pro') {
      return next();
    }

    const limit = FEATURE_LIMITS.free[feature] ?? Infinity;
    const currentCount = await getFeatureUsage(userId, feature);

    if (currentCount >= limit) {
      return res.status(402).json({
        error: `Monthly quota reached for ${feature}`,
        code: 'QUOTA_EXCEEDED',
        feature,
        limit,
        currentCount,
        upgradeUrl: '/pricing'
      });
    }

    // Attach feature increment helper to req so route handler can call it after success
    req.incrementQuota = () => incrementFeatureUsage(userId, feature);
    next();
  };
};
