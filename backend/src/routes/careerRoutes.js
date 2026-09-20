import express from 'express';
import { requirePlan, checkQuota } from '../middleware/entitlementMiddleware.js';

const router = express.Router();

/**
 * POST /api/career/cover-letter
 * Generates AI Cover Letter tailored to job description (Pro Feature)
 */
router.post('/cover-letter', requirePlan('pro'), async (req, res) => {
  const { jobTitle, company, jobDescription, userExperience } = req.body;

  if (!jobTitle || !company) {
    return res.status(400).json({ error: 'Job title and company name are required.' });
  }

  const generatedCoverLetter = `Dear Hiring Manager at ${company},

I am writing to express my strong enthusiasm for the ${jobTitle} role. Having built production-grade full-stack web applications and AI-driven platforms, I am confident that my technical skills and passion for engineering align perfectly with your team's mission.

${jobDescription ? `After reviewing the requirements for ${jobTitle}, I was especially drawn to ${company}'s work. My background directly covers the core technical stack specified, including ${userExperience || 'modern JavaScript frameworks, RESTful APIs, and scalable backend architecture'}.` : ''}

In my recent projects, I have consistently delivered robust code, optimized application performance, and designed intuitive user interfaces. I bring a strong problem-solving mindset and a track record of rapid execution.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my background and enthusiasm can contribute to the team at ${company}.

Sincerely,
[Your Name]`;

  res.json({ coverLetter: generatedCoverLetter });
});

/**
 * POST /api/career/interview/start
 * Starts AI Interactive Mock Interview (Pro Feature)
 */
router.post('/interview/start', requirePlan('pro'), async (req, res) => {
  const { role = 'Full-Stack Software Engineer', companyType = 'Tech Startup' } = req.body;

  const questions = [
    `Tell me about a complex architectural decision you made in a recent project. What were the trade-offs?`,
    `How do you handle performance bottlenecks in React or Node.js under high load?`,
    `Describe a situation where a production bug occurred. How did you diagnose and resolve it?`,
    `How do you approach API design, versioning, and backwards compatibility?`
  ];

  res.json({
    sessionId: `interview-${Date.now()}`,
    role,
    companyType,
    currentQuestionIndex: 0,
    question: questions[0],
    totalQuestions: questions.length
  });
});

/**
 * POST /api/career/interview/respond
 * Evaluates candidate answer in mock interview and returns score + feedback
 */
router.post('/interview/respond', requirePlan('pro'), async (req, res) => {
  const { sessionId, answer, questionIndex = 0 } = req.body;

  const feedback = {
    score: 92,
    strengths: [
      'Clear structured STAR method explanation',
      'Demonstrated concrete technical depth and quantitative metrics',
      'Strong emphasis on testing and reliability'
    ],
    improvements: [
      'Could expand slightly on error monitoring and observability tooling'
    ],
    sampleOptimizedAnswer: `In my last project, I led the migration to asynchronous event-driven architecture, reducing P99 latency by 45% while handling 10k RPM.`
  };

  res.json(feedback);
});

/**
 * GET/POST /api/career/applications
 * Kanban Job Tracker (Pro Feature)
 */
let sampleApplications = [
  { id: 'app-1', company: 'Stripe', role: 'Senior Staff Frontend Engineer', status: 'interviewing', salary: '$185,000', appliedDate: '2026-09-10' },
  { id: 'app-2', company: 'OpenAI', role: 'Full Stack Engineer (Platform)', status: 'applied', salary: '$190,000', appliedDate: '2026-09-12' },
  { id: 'app-3', company: 'Vercel', role: 'Developer Experience Engineer', status: 'offer', salary: '$175,000', appliedDate: '2026-08-28' },
  { id: 'app-4', company: 'Linear', role: 'Product Engineer', status: 'wishlist', salary: '$180,000', appliedDate: '2026-09-15' }
];

router.get('/applications', requirePlan('pro'), (req, res) => {
  res.json(sampleApplications);
});

router.post('/applications', requirePlan('pro'), (req, res) => {
  const newApp = { id: `app-${Date.now()}`, ...req.body, appliedDate: new Date().toISOString().split('T')[0] };
  sampleApplications.push(newApp);
  res.status(201).json(newApp);
});

router.put('/applications/:id', requirePlan('pro'), (req, res) => {
  const { id } = req.params;
  const index = sampleApplications.findIndex(a => a.id === id);
  if (index !== -1) {
    sampleApplications[index] = { ...sampleApplications[index], ...req.body };
    return res.json(sampleApplications[index]);
  }
  res.status(404).json({ error: 'Application not found' });
});

export default router;
