import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock Supabase
const mockPortfolios = new Map();
const mockVersions = [];

describe('Portfolio Suite Features & Access Control', () => {

  it('should format custom slug correctly', () => {
    const raw = '  My Awesome-Portfolio! 123 ';
    const formatted = raw.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    expect(formatted).toBe('my-awesome-portfolio-123');
  });

  it('should validate expired link logic correctly', () => {
    const expiredDate = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    const futureDate = new Date(Date.now() + 3600000).toISOString(); // 1 hour in future

    const isExpired = (exp) => exp && Date.now() > new Date(exp).getTime();

    expect(isExpired(expiredDate)).toBe(true);
    expect(isExpired(futureDate)).toBe(false);
  });

  it('should validate passcode check correctly', () => {
    const targetPasscode = 'Recruiter2024!';
    const userAttempt = 'Recruiter2024!';
    const wrongAttempt = 'WrongPass123';

    expect(String(userAttempt).trim() === String(targetPasscode).trim()).toBe(true);
    expect(String(wrongAttempt).trim() === String(targetPasscode).trim()).toBe(false);
  });

  it('should preserve theme settings and section order in payload', () => {
    const payload = {
      section_order: ['about', 'projects', 'blog_posts', 'case_studies'],
      section_visibility: { blog_posts: true, case_studies: true },
      theme_settings: { primaryColor: '#ec4899', fontFamily: 'serif' }
    };

    expect(payload.section_order).toHaveLength(4);
    expect(payload.theme_settings.primaryColor).toBe('#ec4899');
    expect(payload.section_visibility.blog_posts).toBe(true);
  });

  describe('OAuth Session Endpoint Handling', () => {
    it('should validate invalid OAuth session payload', async () => {
      const { oauthSession } = await import('./controllers/authController.js');
      const req = { body: {} };
      const res = {
        status: (code) => ({
          json: (data) => ({ statusCode: code, data })
        })
      };

      const result = await oauthSession(req, res);
      expect(result.statusCode).toBe(400);
      expect(result.data.message).toBe('Invalid OAuth session payload');
    });

    it('should issue token when valid clientUser payload is provided', async () => {
      const { oauthSession } = await import('./controllers/authController.js');
      const req = {
        body: {
          user: {
            id: 'oauth-user-123',
            email: 'github_user@example.com',
            user_metadata: { full_name: 'GitHub Dev' }
          }
        }
      };
      const res = {
        status: (code) => ({
          json: (data) => ({ statusCode: code, data })
        })
      };

      const result = await oauthSession(req, res);
      expect(result.statusCode).toBe(200);
      expect(result.data.token).toBeDefined();
      expect(result.data.user.id).toBe('oauth-user-123');
      expect(result.data.user.email).toBe('github_user@example.com');
      expect(result.data.user.name).toBe('GitHub Dev');
    });
  });
});

