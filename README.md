# Portfolio.io

**An AI-powered portfolio builder for creating, optimizing, and sharing professional portfolio websites in minutes.**

Portfolio.io helps users go from resume to live, shareable portfolio — with AI-assisted content generation, a recruiter-facing chatbot, job-match scoring, and automated outreach tooling built in.

[![License](https://img.shields.io/badge/license-Educational%20%2F%20Personal-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18-green)]()
[![React](https://img.shields.io/badge/react-18-61DAFB)]()

[Live Demo](#) · [Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Routes](#application-routes) · [License](#license)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [Portfolio Builder & Templates](#portfolio-builder--templates-20-designs)
  - [Interactive Motion & Parallax](#interactive-motion--parallax)
  - [AI-Powered Tools](#ai-powered-tools)
  - [Public Sharing](#public-sharing--custom-url-slugs)
  - [Resume & Career Tools](#resume--career-tools)
- [Tech Stack](#tech-stack)
- [Application Routes](#application-routes)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Portfolio.io is a full-stack platform for job seekers who want a polished web presence without the design or engineering overhead. Users can enter their details manually or upload a resume for AI-powered auto-fill, choose from a library of production-ready templates, and publish a live portfolio behind a custom URL — complete with an embedded AI chatbot that can answer recruiter questions on their behalf.

Beyond the builder itself, the platform includes a suite of career tools: an ATS resume scanner, a job-match analyzer, AI-driven content tailoring, and an automated cold-email/HR-outreach engine — positioning it as an end-to-end job search companion rather than a static site generator.



---

## Features

### Authentication & Security

- Email/password signup, login, and logout
- JWT-based authentication
- Supabase Auth integration
- Two-factor authentication via email OTP
- Protected routes and client-side route guards
- Profile management (name, password updates)
- Ownership-scoped access control for portfolios

### Portfolio Builder & Templates (20 Designs)

A library of 20 handcrafted themes spanning a wide range of visual styles — from minimal and editorial to cyberpunk and retro-arcade:

| Template | Style Summary |
|---|---|
| Neon Dark | Dark theme with vibrant gradient text and clean card layouts |
| Bold Minimal | High-contrast black theme with large display typography |
| White Elegance | Light theme with clean lines and generous whitespace |
| Blueprint Technical | Navy schematic theme with grid paper and monospace annotations |
| Neo Brutalist | Scrapbook-inspired theme with thick borders and hard shadows |
| Editorial Gallery | Ivory catalogue theme with display serif type |
| Aurora Glass | Glassmorphism design with ambient glow effects |
| Cyberpunk Hacker | Terminal-inspired theme with neon highlights |
| Retro CRT Console | Green-on-black terminal layout with scanline effects |
| Sage Botanical | Organic layout with sage green and cream tones |
| Newspaper Chronicles | Broadsheet-style theme with columns and drop caps |
| Constructivist Swiss | Asymmetrical layout with primary red and geometric blocks |
| 8-Bit Arcade | Pixel-art theme with retro game-inspired UI elements |
| Tactical HUD | Sci-fi blueprint design with sensor grids and telemetry charts |
| Soft Claymorphism | 3D clay-style theme with pastel tones and soft shadows |
| Vaporwave Synth | 80s retrowave aesthetic with dual-tone glow gradients |
| Minimalist Monolith | Titanium slate layout with glassmorphic panels |
| Nordic Minimalist Light | Scandinavian-inspired theme with warm neutrals |
| Terminal Matrix Green | Hacker terminal theme with matrix-style code effects |
| Luxury Gold Velvet | Obsidian theme with champagne gold accents |

### Interactive Motion & Parallax

- **Mouse Parallax Tilt** — cursor-tracking rotation with real-time light glare on hero elements
- **Scroll Parallax** — multi-speed, scroll-driven transforms built with Framer Motion (`useScroll`, `useTransform`, `useSpring`)
- **Ambient Background Layers** — floating gradient elements with variable drift speed on scroll

### AI-Powered Tools

Built on Google Gemini, with retrieval-augmented generation for context-aware responses.

- **Resume Auto-Fill** — upload a PDF or DOCX resume and automatically extract personal details, education, projects, work experience, certifications, and skills
- **Content Enhancement** — refines summaries, project descriptions, and experience bullets using the STAR methodology
- **AI Recruiter Assistant** — an embedded chatbot per portfolio, powered by RAG over a Qdrant vector store, that answers recruiter questions about a candidate's background in real time
- **Smart Job Matcher** — compares a portfolio against a target job description and returns a match score, strengths, missing keywords, and improvement recommendations
- **AI Job Tailoring** — adapts portfolio content to align with a specific job description
- **Cold Email & HR Outreach Suite**
  - Generates tailored pitch emails and cover letters from portfolio highlights and a job description
  - Automated HR/recruiter email discovery via company domain resolution
  - Multiple AI-generated subject line options and selectable tone (Confident, Direct, Enthusiastic, Formal)
  - Direct SMTP dispatch via Nodemailer, with clipboard and `mailto` fallbacks

### Public Sharing & Custom URL Slugs

- Custom shareable portfolio URLs (e.g. `/p/john-doe-fullstack`)
- Public portfolio view, accessible without authentication
- Template popularity tracking via a like/view counter

### Resume & Career Tools

- ATS resume scanner with formatting and keyword analysis
- GitHub activity heatmap for showcasing contribution history
- Print-ready PDF export for one-click downloads

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router v7
- Framer Motion & GSAP for animation and parallax
- Tailwind CSS
- Lucide Icons, Fontsource

**Backend**
- Node.js
- Express.js (ES Modules)

**Database & Vector Storage**
- Supabase (PostgreSQL)
- Qdrant (vector database for RAG embeddings)

**Authentication**
- Supabase Auth
- Custom JWT (`jsonwebtoken`)
- Email OTP-based 2FA

**AI & Document Processing**
- Google Gemini (via `@google/genai` and LangChain)
- `pdf-parse` for PDF text extraction
- Mammoth for DOCX text extraction

---

## Application Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Root redirect | Auto |
| `/login` | User login | Public |
| `/register` | Create account | Public |
| `/home` | Dashboard & landing | Protected |
| `/profile` | View profile | Protected |
| `/profile/edit` | Edit profile | Protected |
| `/viewtemplates` | Template gallery (20 templates) | Protected |
| `/my-portfolios` | Portfolio dashboard | Protected |
| `/provide-data/:templateId` | Portfolio creation form | Protected |
| `/edit-portfolio/:portfolioId` | Edit existing portfolio | Protected |
| `/ats-checker` | Resume ATS scanner | Protected |
| `/career-tools` | Career tools & resume upload | Protected |
| `/portfolio-matcher/:id` | Smart job matcher | Protected |
| `/p/:slug` | Public live portfolio view | Public |
| `/portfolio/template1/:id?` – `/portfolio/template20/:id?` | Live & preview portfolio renderers | Protected |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for running Qdrant locally)
- A Supabase project (PostgreSQL + Auth)
- A Google Gemini API key

### Installation

**1. Start the Qdrant vector database**

```bash
docker run -d -p 6333:6333 -p 6334:6334 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

**2. Start the backend server**

```bash
cd backend
npm install
node src/server.js
```

The backend runs at `http://localhost:5000`.

**3. Index portfolios to Qdrant (RAG setup)**

```bash
cd backend
node src/index_all.js
```

**4. Start the frontend**

```bash
cd frontend/vite-project
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

> ℹ️ Both the backend and frontend expect environment variables for Supabase, Qdrant, Gemini, and SMTP credentials. Copy `.env.example` to `.env` in each directory and populate the required keys before starting the app.

---

## Roadmap

- [ ] Automated test coverage (unit + integration)
- [ ] CI pipeline for linting and tests
- [ ] Dockerized local development (single `docker-compose up`)
- [ ] Rate limiting on AI and email-dispatch endpoints

---

## License

Educational and personal use.
