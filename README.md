# Portfolio.io 🚀

A full-stack AI-powered portfolio builder that helps users create, customize, optimize, and share professional portfolio websites in minutes.

Portfolio.io allows users to select beautiful portfolio templates, enter their details manually or upload a resume for AI-powered auto-fill, generate live portfolio pages, and use AI tools to improve their professional presence.

---

## ✨ Features

### 🔐 Authentication & User Management

* User signup, login, and logout
* JWT-based authentication
* Supabase Auth integration
* Protected routes
* Profile view and update
* Secure portfolio ownership management

### 🎨 Portfolio Builder

* Create professional portfolios with multiple templates:

  * Neon Dark
  * Bold Minimal
  * White Elegance
  * Blueprint Technical
  * Neo Brutalist
  * Editorial Gallery

* Live template preview before creation

* Add and manage:

  * Personal information
  * About section
  * Projects
  * Technical skills
  * Work experience
  * Certifications

### 🤖 AI-Powered Features

#### Resume AI Auto-Fill

Upload a PDF or DOCX resume and Gemini AI automatically extracts:

* Personal details
* Education
* Projects
* Experience
* Certifications
* Technical skills

#### AI Content Enhancement

"Polish with AI" improves:

* Profile summaries
* Project descriptions
* Experience descriptions

using professional writing techniques.

#### AI Recruiter Assistant

Each portfolio includes an AI chatbot powered by:

* Retrieval Augmented Generation (RAG)
* Qdrant vector search
* Gemini AI responses

Recruiters can ask questions about the candidate's skills, projects, and experience.

#### Smart Job Matcher

Compare a portfolio against a job description and receive:

* Match score
* Strength analysis
* Missing keywords
* Improvement suggestions

#### AI Job Tailoring

Automatically optimize portfolio content according to a target job description.

### 📄 Resume Tools

* ATS resume checker
* Formatting analysis
* Missing keyword detection
* Improvement recommendations
* PDF print-ready portfolio layouts

### 📊 Dashboard

Users can:

* View all created portfolios
* Open existing portfolios
* Delete portfolios
* Manage multiple portfolio versions

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router v6
* Tailwind CSS

## Backend

* Node.js
* Express.js
* ES Modules

## Database

* Supabase PostgreSQL

## Authentication

* Supabase Auth
* Custom JWT authentication

## Artificial Intelligence

* Google Gemini 2.5 Flash
* Gemini Embeddings

## Vector Database

* Qdrant

## File Processing

* Multer
* pdf-parse
* Mammoth DOCX parser

---

# 📁 Project Structure

```
portfolio/
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── supabase.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── portfolioRoutes.js
│   │   │   ├── resumeRoutes.js
│   │   │   └── aiRoutes.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── portfolioController.js
│   │   │   ├── resumeController.js
│   │   │   └── aiController.js
│   │   │
│   │   ├── ai/
│   │   │   ├── chunking/
│   │   │   ├── embedding/
│   │   │   ├── retrieval/
│   │   │   ├── prompt/
│   │   │   └── vector/
│   │   │
│   │   ├── chat/
│   │   ├── services/
│   │   └── index_all.js
│
└── frontend/
    └── vite-project/
        └── src/
            ├── pages/
            ├── components/
            ├── Templates/
            ├── lib/
            ├── App.jsx
            └── main.jsx
```

---

# 🌐 Application Routes

| Route                          | Purpose                   |
| ------------------------------ | ------------------------- |
| `/login`                       | User login                |
| `/register`                    | Create account            |
| `/home`                        | Dashboard landing         |
| `/profile`                     | View profile              |
| `/profile/edit`                | Update profile            |
| `/viewtemplates`               | Select portfolio template |
| `/provide-data/:templateId`    | Portfolio creation form   |
| `/my-portfolios`               | Manage portfolios         |
| `/edit-portfolio/:portfolioId` | Edit portfolio            |
| `/ats-checker`                 | Resume ATS analysis       |
| `/job-matcher/:id`             | Job matching              |
| `/portfolio/template1/:id`     | Live portfolio            |
| `/portfolio/template2/:id`     | Live portfolio            |
| `/portfolio/template3/:id`     | Live portfolio            |
| `/portfolio/template4/:id`     | Live portfolio            |
| `/portfolio/template5/:id`     | Live portfolio            |
| `/portfolio/template6/:id`     | Live portfolio            |

---

# 🔌 Backend API Overview

Base URL:

```
http://localhost:5000
```

## Authentication

### Register

```
POST /api/auth/signup
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}
```

---

### Login

```
POST /api/auth/login
```

Returns JWT token.

---

### Get Profile

```
GET /api/auth/profile
```

Requires:

```
Authorization: Bearer TOKEN
```

---

## Portfolio APIs

### Create Portfolio

```
POST /api/portfolio/create
```

Creates a complete portfolio with:

* Personal information
* Projects
* Skills
* Experience
* Certifications

### Get User Portfolios

```
GET /api/portfolio/my-portfolios
```

### Get Portfolio

```
GET /api/portfolio/:id
```

### Update Portfolio

```
PUT /api/portfolio/:id
```

### Delete Portfolio

```
DELETE /api/portfolio/:id
```

---

## Resume APIs

### AI Resume Auto Fill

```
POST /api/resume/autofill
```

Accepts:

* PDF
* DOCX

Returns structured portfolio data.

### ATS Resume Checker

```
POST /api/resume/ats-check
```

Returns:

* ATS score
* Formatting score
* Missing keywords
* Suggestions

---

## AI APIs

### AI Text Polish

```
POST /api/ai/polish
```

Improves:

* About section
* Projects
* Experience

### Recruiter Chatbot

```
POST /api/ai/chat/:portfolioId
```

Uses:

* Qdrant vector search
* Gemini AI
* Portfolio context

### Job Matching

```
POST /api/ai/match-job/:portfolioId
```

### Job Tailoring

```
POST /api/ai/tailor-form
```

---

# 🗄️ Database Schema

## portfolios

Stores main portfolio information.

Fields:

```
id
user_id
full_name
email_id
main_title
college_name
course_name
about_paragraph
github_username
leetcode_username
template_id
created_at
```

---

## projects

Stores project information.

```
id
portfolio_id
project_name
project_desc
project_tech_stack
project_github_link
```

---

## tech_stacks

```
id
portfolio_id
name
category
```

---

## experiences

```
id
portfolio_id
role
company_name
date_of_joining
work_description
```

---

## certifications

```
id
portfolio_id
certification_name
issuing_organization
credential_url
```

---

# 🔑 Environment Variables

## Backend `.env`

```env
PORT=5000

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=

QDRANT_URL=http://localhost:6333
```

---

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

# 🚀 Running Locally

## 1. Start Qdrant

Using Docker:

```bash
docker run -d \
-p 6333:6333 \
-p 6334:6334 \
-v qdrant_storage:/qdrant/storage \
qdrant/qdrant
```

---

## 2. Install Backend

```bash
cd backend

npm install
```

Start server:

```bash
node src/server.js
```

Backend runs:

```
http://localhost:5000
```

---

## 3. Index Existing Portfolios

```bash
cd backend

node src/index_all.js
```

This creates vector embeddings inside Qdrant.

---

## 4. Install Frontend

```bash
cd frontend/vite-project

npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs:

```
http://localhost:5173
```

---

# 🔄 Main User Flow

## Create Portfolio

```
Login
 ↓
Explore Templates
 ↓
Choose Template
 ↓
Upload Resume (optional)
 ↓
AI extracts information
 ↓
Edit portfolio details
 ↓
Generate Portfolio
 ↓
Share portfolio link
```

---

## Recruiter Experience

```
Open Portfolio
 ↓
View candidate information
 ↓
Ask AI Assistant questions
 ↓
Compare with job requirements
 ↓
Evaluate candidate
```

---

# 🧠 AI Architecture

```
Portfolio Data
      |
      ↓
Text Chunking
      |
      ↓
Gemini Embeddings
      |
      ↓
Qdrant Vector Database
      |
      ↓
Semantic Retrieval
      |
      ↓
Gemini Response Generation
      |
      ↓
Recruiter Chatbot
```

---

# 🔒 Security

Implemented:

* JWT protected routes
* Portfolio ownership verification
* Supabase authentication
* Secure API middleware
* Protected dashboard access

---

# 📌 Future Improvements

Possible enhancements:

* Public portfolio URLs
* Custom domains
* More templates
* Portfolio analytics
* AI interview preparation
* GitHub automatic project import
* LinkedIn profile import

---

# 👨‍💻 Author

Built as an AI-powered portfolio creation platform using modern full-stack technologies.

---

# 📄 License

This project is available for educational and personal use.

```
```
