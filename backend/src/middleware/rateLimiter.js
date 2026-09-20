import rateLimit from 'express-rate-limit';

/**
 * AI Per-User Rate Limiter & Usage Cap
 * Strictly enforces limits based on authenticated User ID (req.user.sub / req.user.id).
 * Default: 20 requests per 15 minutes per user.
 */
export const aiUserRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AI_WINDOW_MS || '900000', 10), // 15 minutes
  limit: (req) => parseInt(process.env.RATE_LIMIT_AI_MAX || '20', 10), // Max requests per window per user
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    // Prefer authenticated user ID so limits apply per user account regardless of IP
    return req.user?.sub || req.user?.id || req.ip || 'anonymous';
  },
  handler: (req, res, _next, options) => {
    const windowMins = Math.ceil(options.windowMs / 60000);
    const limitVal = typeof options.limit === 'function' ? options.limit(req) : options.limit;
    return res.status(429).json({
      success: false,
      error: 'AI Usage Limit Exceeded',
      message: `You have reached your AI usage limit (${limitVal} requests per ${windowMins} minutes). Please wait before making more AI requests or upgrade to a Pro plan.`,
      retryAfterMinutes: windowMins
    });
  }
});

/**
 * Public Chatbot Widget Rate Limiter
 * Limits incoming AI chat interactions on public portfolio widgets.
 * Default: 15 requests per 15 minutes per visitor/portfolio.
 */
export const publicChatRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_CHAT_WINDOW_MS || '900000', 10), // 15 minutes
  limit: (req) => parseInt(process.env.RATE_LIMIT_CHAT_MAX || '15', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    const portfolioId = req.params.portfolioId || '';
    return req.user?.sub || `chat_${portfolioId}_${req.ip || 'anon'}`;
  },
  handler: (req, res, _next, options) => {
    const windowMins = Math.ceil(options.windowMs / 60000);
    return res.status(429).json({
      success: false,
      error: 'Chat Rate Limit Exceeded',
      message: `Too many chat messages. Please wait ${windowMins} minutes before sending another message.`,
      retryAfterMinutes: windowMins
    });
  }
});

/**
 * OTP & 2FA Email Dispatch Rate Limiter
 * Prevents spamming 2FA emails or signup requests.
 * Default: 5 requests per 15 minutes per email/IP.
 */
export const otpEmailRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_OTP_WINDOW_MS || '900000', 10), // 15 minutes
  limit: (req) => parseInt(process.env.RATE_LIMIT_OTP_MAX || '5', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : '';
    return email ? `otp_email_${email}` : `otp_ip_${req.ip || 'anon'}`;
  },
  handler: (req, res, _next, options) => {
    const windowMins = Math.ceil(options.windowMs / 60000);
    return res.status(429).json({
      success: false,
      error: 'OTP Request Limit Exceeded',
      message: `Too many OTP email requests. Please wait ${windowMins} minutes before requesting another code.`,
      retryAfterMinutes: windowMins
    });
  }
});

/**
 * OTP Verification Brute-Force Rate Limiter
 * Prevents brute-forcing 6-digit OTP codes.
 * Default: 5 verification attempts per 10 minutes per email.
 */
export const otpVerifyRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_OTP_VERIFY_WINDOW_MS || '600000', 10), // 10 minutes
  limit: (req) => parseInt(process.env.RATE_LIMIT_OTP_VERIFY_MAX || '5', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => {
    const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : '';
    return email ? `verify_email_${email}` : `verify_ip_${req.ip || 'anon'}`;
  },
  handler: (req, res, _next, options) => {
    const windowMins = Math.ceil(options.windowMs / 60000);
    return res.status(429).json({
      success: false,
      error: 'Too Many Verification Attempts',
      message: `Too many invalid OTP verification attempts. Please wait ${windowMins} minutes before trying again.`,
      retryAfterMinutes: windowMins
    });
  }
});

/**
 * General Authentication Endpoint Rate Limiter
 * Prevents brute-force signup/login attacks.
 * Default: 10 attempts per 15 minutes per IP.
 */
export const authGeneralRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000', 10), // 15 minutes
  limit: (req) => parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => req.ip || 'anon',
  handler: (req, res, _next, options) => {
    const windowMins = Math.ceil(options.windowMs / 60000);
    return res.status(429).json({
      success: false,
      error: 'Auth Rate Limit Exceeded',
      message: `Too many login or signup attempts. Please wait ${windowMins} minutes before trying again.`,
      retryAfterMinutes: windowMins
    });
  }
});
