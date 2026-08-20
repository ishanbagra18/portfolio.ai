# Portfolio.io 🚀

A full-stack AI-powered portfolio builder that helps users create, customize, optimize, and share professional portfolio websites in minutes.

Portfolio.io allows users to select from **20 production-ready portfolio templates**, enter details manually or upload a resume for AI-powered auto-fill, generate live shareable portfolio pages with custom URL slugs, and leverage AI recruiter chatbots and job tailoring tools.

---

## ✨ Features

### 🔐 Authentication & Security

* User signup, login, and logout
* JWT-based authentication
* Supabase Auth integration
* 2FA Email OTP Verification
* Protected routes & client-side route guards
* Profile view and update (name, password)
* Secure portfolio ownership management

### 🎨 Portfolio Builder & Templates (20 Designs)

Choose from **20 distinct, handcrafted portfolio themes**:

1. **Neon Dark** — Modern dark theme featuring vibrant gradient text and clean card layouts.
2. **Bold Minimal** — Premium high-contrast black theme with massive display typography.
3. **White Elegance** — Sophisticated light theme with clean lines and generous whitespace.
4. **Blueprint Technical** — Navy schematic theme with grid paper and monospace annotations.
5. **Neo Brutalist** — Warm scrapbook theme with thick borders, hard shadows, and stickers.
6. **Editorial Gallery** — Ivory catalogue theme with display serif type and gallery plate numbers.
7. **Aurora Glass** — Frosted glassmorphism design with glowing ambient auroras.
8. **Cyberpunk Hacker** — Cybernetic terminal with neon highlights and command-line headers.
9. **Retro CRT Console** — Vintage green-on-black terminal layout with scanlines and blinking cursor.
10. **Sage Botanical** — Serene organic layout with sage green, cream tones, and smooth curves.
11. **Newspaper Chronicles** — Classic printed broadsheet theme with columnized layouts and drop caps.
12. **Constructivist Swiss** — Asymmetrical Swiss graphic layout with primary red and geometric blocks.
13. **8-Bit Arcade** — Nostalgic retro game style with pixel-art box borders and health-bar skill meters.
14. **Tactical HUD** — Technical sci-fi blueprint design with sensor grids and telemetry charts.
15. **Soft Claymorphism** — Playful 3D clay style with pastel hues, bulbous borders, and soft shadows.
16. **Vaporwave Synth** — 80s retrowave aesthetic with magenta/cyan dual glow gradients and synth grid lines.
17. **Minimalist Monolith** — Ultra-modern titanium slate layout with clean glassmorphic panels.
18. **Nordic Minimalist Light** — Serene Scandinavian design with warm beige, eggshell white, and serif type.
19. **Terminal Matrix Green** — Cyberpunk hacker terminal featuring electric emerald matrix code.
20. **Luxury Gold Velvet** — High-end obsidian theme featuring champagne gold accents and golden ambient glows.

### 🌌 3D Interactive Parallax & Visual Motion

* **Mouse 3D Parallax Tilt (`ParallaxTilt`)** — Dynamic cursor-tracking rotation and real-time light glare overlay on hero cards and elements.
* **Scroll Parallax (`ParallaxScroll`)** — Multi-speed fractional scroll-driven transforms using Framer Motion (`useScroll`, `useTransform`, `useSpring`).
* **Multi-Layer Ambient Background (`ParallaxBackground`)** — Floating glowing gradient spheres drifting at varied speeds during scroll.

### 🤖 AI-Powered Features (Google Gemini 3.6 Flash)

#### Resume AI Auto-Fill
Upload a PDF or DOCX resume and Gemini AI automatically extracts:
* Personal details & About bio
* Education
* Projects & GitHub links
* Work experience
* Certifications
* Technical skill categories

#### AI Content Enhancement ("Polish with AI")
Improves profile summaries, project descriptions, and experience bullet points using STAR methodology and professional phrasing.

#### AI Recruiter Assistant
Floating chatbot widget embedded on each portfolio powered by:
* Retrieval Augmented Generation (RAG)
* Qdrant vector database similarity search
* Gemini AI response synthesis

Recruiters can ask questions about the candidate's skills, experience, and project architecture in real-time.

#### Smart Job Matcher
Compare a portfolio against a target job description to receive:
* Match percentage score
* Strengths breakdown
* Missing skills & keywords
* Actionable improvement recommendations

#### AI Job Tailoring
Automatically optimize portfolio content matching a target Job Description.

#### ✉️ Automated Cold Email Pitch & HR Outreach Suite
* Generate tailored pitch emails & formal cover letters directed at hiring managers based on candidate portfolio highlights and pasted Job Descriptions/URLs.
* **Automated HR & Recruiter Email Discovery Engine**: Automatically resolves company web domains and discovers HR & talent acquisition emails (`POST /api/ai/find-hr-email`) without manual searching.
* Select between 3 high-converting AI-generated subject lines.
* Choose tone style (*Confident, Direct, Enthusiastic, Formal*).
* Direct Nodemailer SMTP email dispatch to HR email address, with fallback clipboard & mailto app generators.

### 🔗 Public Sharing & Custom URL Slugs

* Create custom shareable portfolio URLs (e.g. `/p/john-doe-fullstack`)
* Public portfolio view accessible without authentication (`PublicPortfolio`)
* Template like and popularity counter system

### 📄 Resume & Career Tools

* Resume ATS scanner & score analyzer
* Formatting & keyword check
* GitHub Activity commit heatmap (`GitHubActivity`)
* PDF print-ready export configuration for one-click downloading

---

# 🛠️ Tech Stack

## Frontend
* **React.js (Vite)**
* **React Router v7**
* **Framer Motion & GSAP** (Animations & Parallax)
* **Tailwind CSS**
* **Lucide Icons & Fontsource**

## Backend
* **Node.js**
* **Express.js (ES Modules)**

## Database & Vector Storage
* **Supabase PostgreSQL**
* **Qdrant Vector Database** (RAG embeddings search)

## Authentication
* **Supabase Auth**
* **Custom JWT (jsonwebtoken)**
* **2FA Email OTP Verification**

## Artificial Intelligence & PDF Processing
* **Google Gemini 3.6 Flash** (@google/genai & LangChain)
* **pdf-parse v2** (PDF text extraction)
* **Mammoth** (DOCX text extraction)

---

# 🌐 Application Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Root redirect | Auto |
| `/login` | User login | Public |
| `/register` | Create account | Public |
| `/home` | Dashboard & Landing | Protected |
| `/profile` | View profile | Protected |
| `/profile/edit` | Edit profile | Protected |
| `/viewtemplates` | Template selection gallery (20 templates) | Protected |
| `/my-portfolios` | Portfolio dashboard | Protected |
| `/provide-data/:templateId` | Portfolio creation form | Protected |
| `/edit-portfolio/:portfolioId` | Edit existing portfolio | Protected |
| `/ats-checker` | Resume ATS scanner | Protected |
| `/career-tools` | Career tools & resume upload | Protected |
| `/portfolio-matcher/:id` | Smart job matcher | Protected |
| `/p/:slug` | Public live portfolio view | Public |
| `/portfolio/template1/:id?` to `/portfolio/template20/:id?` | Live & preview portfolio renderers | Protected |

---

# 🚀 Running Locally

## 1. Start Qdrant Vector DB
```bash
docker run -d -p 6333:6333 -p 6334:6334 -v qdrant_storage:/qdrant/storage qdrant/qdrant
```

## 2. Start Backend Server
```bash
cd backend
npm install
node src/server.js
```
Backend runs at `http://localhost:5000`

## 3. Index Portfolios to Qdrant (RAG Setup)
```bash
cd backend
node src/index_all.js
```

## 4. Start Frontend
```bash
cd frontend/vite-project
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

# 📄 License

Educational and personal use.
