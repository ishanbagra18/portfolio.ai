import { describe, it, expect, vi } from 'vitest';
import { requirePlan, checkQuota, FEATURE_LIMITS } from '../middleware/entitlementMiddleware.js';

describe('Entitlement & Quota Middleware', () => {
  it('should define distinct feature limits for Free vs Pro tiers', () => {
    expect(FEATURE_LIMITS.free.ai_enhancement).toBe(10);
    expect(FEATURE_LIMITS.free.ats_scanner).toBe(3);
    expect(FEATURE_LIMITS.free.max_published_portfolios).toBe(1);

    expect(FEATURE_LIMITS.pro.ai_enhancement).toBe(Infinity);
    expect(FEATURE_LIMITS.pro.ats_scanner).toBe(Infinity);
    expect(FEATURE_LIMITS.pro.max_published_portfolios).toBe(10);
  });

  it('requirePlan should return 402 if user is on Free plan and Pro is required', async () => {
    const req = { user: { id: 'user-free-123' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    const middleware = requirePlan('pro');
    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'PRO_REQUIRED',
        upgradeUrl: '/pricing'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
