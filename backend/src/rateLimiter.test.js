import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { requireAuth } from './middleware/auth.js';
import { aiUserRateLimiter, otpEmailRateLimiter, otpVerifyRateLimiter } from './middleware/rateLimiter.js';

process.env.JWT_SECRET = 'test-secret-key-12345';
process.env.RATE_LIMIT_AI_MAX = '3'; // Set low limit for testing
process.env.RATE_LIMIT_OTP_MAX = '2'; // Set low limit for testing

function createTestApp() {
  const app = express();
  app.use(express.json());

  // Dummy AI route
  app.post('/api/ai/polish', requireAuth, aiUserRateLimiter, (req, res) => {
    res.json({ success: true, message: 'Polished text', user: req.user.sub });
  });

  // Dummy OTP route
  app.post('/api/auth/login', otpEmailRateLimiter, (req, res) => {
    res.json({ success: true, message: 'OTP Sent' });
  });

  return app;
}

describe('Rate Limiter Middleware', () => {
  let app;
  let user1Token;
  let user2Token;

  beforeEach(() => {
    app = createTestApp();
    user1Token = jwt.sign({ sub: 'user-111-aaa', email: 'user1@example.com' }, process.env.JWT_SECRET);
    user2Token = jwt.sign({ sub: 'user-222-bbb', email: 'user2@example.com' }, process.env.JWT_SECRET);
  });

  it('should allow requests within limit for authenticated User 1', async () => {
    const res = await request(app)
      .post('/api/ai/polish')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'Hello world' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should enforce per-user AI limit when User 1 exceeds max quota', async () => {
    // Send requests up to limit
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/ai/polish')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ text: 'Hello' });
    }

    // 4th request should be blocked with 429
    const res = await request(app)
      .post('/api/ai/polish')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ text: 'Hello' });

    expect(res.status).toBe(429);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('AI Usage Limit Exceeded');
  });

  it('should track rate limits independently for different user IDs', async () => {
    // Exceed limit for User 1
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post('/api/ai/polish')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ text: 'User 1 request' });
    }

    // User 2 should STILL be allowed
    const resUser2 = await request(app)
      .post('/api/ai/polish')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ text: 'User 2 request' });

    expect(resUser2.status).toBe(200);
    expect(resUser2.body.user).toBe('user-222-bbb');
  });

  it('should enforce OTP email rate limits per email', async () => {
    // Send 2 OTP requests
    await request(app).post('/api/auth/login').send({ email: 'spammer@example.com', password: '123' });
    await request(app).post('/api/auth/login').send({ email: 'spammer@example.com', password: '123' });

    // 3rd OTP request should be blocked
    const res = await request(app).post('/api/auth/login').send({ email: 'spammer@example.com', password: '123' });
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('OTP Request Limit Exceeded');
  });
});
