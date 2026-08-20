import { GoogleGenAI, Type } from '@google/genai';
import { supabase } from '../config/supabase.js';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* ---------------- POLISH FORM TEXT ---------------- */
export const polishText = async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: "Text provide karna zaroori hai." });
        }

        let prompt = "";
        if (type === 'bio') {
            prompt = `You are a professional resume writer and personal branding expert. 
Improve the following bio/about summary paragraph to be more engaging, professional, and clear. 
Keep the tone confident, sophisticated, and polished. 
Avoid generic cliches. Preserve all key technical terms and facts.
Output ONLY the final polished text. Do not wrap the text in quotes, and do not add any preamble, conversational text, introduction or explanation.

Text to polish:
"${text}"`;
        } else if (type === 'project') {
            prompt = `You are a senior technical writer.
Rewrite this project description to be highly professional, impactful, and clear.
Use active verbs (e.g., Developed, Architected, Refactored, Optimised).
If possible, rephrase it to highlight the technical challenges, actions taken, and results (STAR method guidelines).
Output ONLY the final polished text. Do not wrap in quotes, do not add introductory remarks, notes, or preambles.

Text to polish:
"${text}"`;
        } else if (type === 'experience') {
            prompt = `You are a career development coach and resume expert.
Rewrite this work experience description. Make it sound professional, outcome-driven, and technical.
Start with strong action verbs. Highlight responsibilities, achievements, and impact.
Output ONLY the final polished description. Do not wrap in quotes, do not include any preamble, notes, or summaries.

Text to polish:
"${text}"`;
        } else {
            prompt = `Improve the grammar, clarity, and professionalism of the following text. 
Output ONLY the polished text without any preamble, explanation, or wrapping quotes.

Text to polish:
"${text}"`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
        });

        const polishedText = response.text ? response.text.trim() : text;

        return res.status(200).json({
            success: true,
            polishedText
        });
    } catch (err) {
        console.error("AI Polish error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to polish text using AI.",
            error: err.message
        });
    }
};

/* ---------------- CHAT WITH PORTFOLIO DATA ---------------- */
export const chatWithPortfolio = async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const { message, history } = req.body;

        if (!portfolioId || !message) {
            return res.status(400).json({ success: false, message: "Portfolio ID aur message provide karna zaroori hai." });
        }

        // Fetch full portfolio details
        const { data: personalInfo, error: piError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('id', portfolioId)
            .single();

        if (piError || !personalInfo) {
            return res.status(404).json({ success: false, message: "Portfolio data nahi mila." });
        }

        const [
            { data: techStacks },
            { data: projects },
            { data: experiences },
            { data: certifications }
        ] = await Promise.all([
            supabase.from('tech_stacks').select('*').eq('portfolio_id', portfolioId),
            supabase.from('projects').select('*').eq('portfolio_id', portfolioId),
            supabase.from('experiences').select('*').eq('portfolio_id', portfolioId),
            supabase.from('certifications').select('*').eq('portfolio_id', portfolioId)
        ]);

        const context = {
            name: personalInfo.full_name,
            title: personalInfo.main_title,
            about: personalInfo.about_paragraph,
            education: `${personalInfo.course_name} in ${personalInfo.specialization_course_name} from ${personalInfo.college_name}`,
            socials: {
                github: personalInfo.github_username,
                leetcode: personalInfo.leetcode_username,
                email: personalInfo.email_id
            },
            skills: (techStacks || []).map(s => `${s.name} (${s.category || 'General'})`),
            projects: (projects || []).map(p => ({
                name: p.project_name,
                description: p.project_desc,
                tech_stack: p.project_tech_stack,
                github: p.project_github_link
            })),
            experiences: (experiences || []).map(e => ({
                role: e.role,
                company: e.company_name,
                date: e.date_of_joining,
                work: e.work_description
            })),
            certifications: (certifications || []).map(c => ({
                name: c.certification_name,
                issuer: c.issuing_organization,
                verify_url: c.credential_url
            }))
        };

        const systemPrompt = `You are a helpful, professional AI recruitment assistant acting on behalf of ${context.name}.
Your job is to answer questions from recruiters, hiring managers, or visitors about ${context.name}'s professional background, projects, experiences, skills, and qualifications based ONLY on the portfolio data provided below.

Here is ${context.name}'s official portfolio data:
${JSON.stringify(context, null, 2)}

Rules:
1. Always be polite, professional, and highlight ${context.name}'s strengths.
2. If the user asks about a skill, project, or experience that is NOT mentioned in the data, answer honestly that it is not listed in the current profile data, but offer to highlight their related skills that ARE present.
3. Keep answers concise, readable, and structured. Use bullet points where appropriate.
4. Speak in the third person (e.g. "Ishan is a Full-Stack developer...") or as their representative assistant.
5. If the visitor asks general questions unrelated to ${context.name}'s professional portfolio or career, politely redirect them back to discussing ${context.name}'s profile.`;

        const chatContents = [];
        chatContents.push({ role: 'user', parts: [{ text: `System Instructions: ${systemPrompt}` }] });
        chatContents.push({ role: 'model', parts: [{ text: `Understood. I will act as a professional recruitment assistant representing ${context.name} and answering questions strictly based on the provided portfolio data.` }] });

        if (Array.isArray(history)) {
            history.forEach(turn => {
                chatContents.push({
                    role: turn.role === 'user' ? 'user' : 'model',
                    parts: [{ text: turn.text }]
                });
            });
        }

        chatContents.push({ role: 'user', parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: chatContents,
        });

        const reply = response.text ? response.text.trim() : "I couldn't process that question right now. Please try again.";

        return res.status(200).json({
            success: true,
            reply
        });
    } catch (err) {
        console.error("AI Chat error:", err);
        return res.status(500).json({
            success: false,
            message: "AI chat widget error.",
            error: err.message
        });
    }
};

/* ---------------- SMART JOB MATCH AUDIT ---------------- */
export const matchJobDescription = async (req, res) => {
    try {
        const { portfolioId } = req.params;
        const { jobDescription } = req.body;

        if (!portfolioId || !jobDescription) {
            return res.status(400).json({ success: false, message: "Portfolio ID and Job Description are required." });
        }

        // Fetch full portfolio details
        const { data: personalInfo, error: piError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('id', portfolioId)
            .single();

        if (piError || !personalInfo) {
            return res.status(404).json({ success: false, message: "Portfolio data not found." });
        }

        const [
            { data: techStacks },
            { data: projects },
            { data: experiences },
            { data: certifications }
        ] = await Promise.all([
            supabase.from('tech_stacks').select('*').eq('portfolio_id', portfolioId),
            supabase.from('projects').select('*').eq('portfolio_id', portfolioId),
            supabase.from('experiences').select('*').eq('portfolio_id', portfolioId),
            supabase.from('certifications').select('*').eq('portfolio_id', portfolioId)
        ]);

        const context = {
            name: personalInfo.full_name,
            title: personalInfo.main_title,
            about: personalInfo.about_paragraph,
            education: `${personalInfo.course_name} in ${personalInfo.specialization_course_name} from ${personalInfo.college_name}`,
            skills: (techStacks || []).map(s => `${s.name} (${s.category || 'General'})`),
            projects: (projects || []).map(p => ({
                name: p.project_name,
                description: p.project_desc,
                tech_stack: p.project_tech_stack
            })),
            experiences: (experiences || []).map(e => ({
                role: e.role,
                company: e.company_name,
                work: e.work_description
            })),
            certifications: (certifications || []).map(c => `${c.certification_name} by ${c.issuing_organization}`)
        };

        const prompt = `Analyze how well this candidate's profile matches the following Job Description (JD).
Identify match percentage, missing key skills/technologies/keywords, strengths matching the JD, and custom actionable recommendations to customize their portfolio to fit this role.

Candidate Profile Data:
${JSON.stringify(context, null, 2)}

Job Description:
"${jobDescription}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchPercentage: { type: Type.INTEGER, description: "A percentage value from 0 to 100 indicating how well the candidate profile matches the JD." },
                        missingSkills: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Key skills, technologies, or keywords present in the JD but missing from the candidate's profile." 
                        },
                        strengths: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Candidate's core strengths and matching qualifications that align perfectly with the JD." 
                        },
                        recommendations: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Actionable, concrete recommendations on how the candidate can customize their portfolio to match this JD better." 
                        }
                    },
                    required: ["matchPercentage", "missingSkills", "strengths", "recommendations"]
                }
            }
        });

        const report = JSON.parse(response.text);

        return res.status(200).json({
            success: true,
            report
        });
    } catch (err) {
        console.error("AI JD match error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to perform AI job match analysis.",
            error: err.message
        });
    }
};

/* ---------------- TAILOR PORTFOLIO FORM TO JD ---------------- */
export const tailorForm = async (req, res) => {
    try {
        const { jobDescription, currentData } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ success: false, message: "Job Description is required." });
        }

        let prompt = "";
        if (currentData) {
            prompt = `You are an expert career consultant. Tailor the candidate's existing portfolio details to match this target Job Description (JD).
Modify the language, focus, and highlighted items in their About Paragraph, project descriptions, and experience descriptions to align precisely with the keywords, tools, and goals specified in the JD.
Do NOT invent entirely new projects, jobs, or credentials. Only modify their text fields to emphasize matching qualities. Keep real names, universities, companies, project names, and links intact.

Current Candidate Data:
${JSON.stringify(currentData, null, 2)}

Target Job Description:
"${jobDescription}"`;
        } else {
            prompt = `Create a fully populated sample developer portfolio matching this target Job Description (JD).
Generate a professional summary, tech stack categories, tailored project descriptions, and experience details relevant to the JD.
Make the educational details, names, and contact items look like high-quality realistic developer samples.

Target Job Description:
"${jobDescription}"`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        personalInfo: {
                            type: Type.OBJECT,
                            properties: {
                                full_name: { type: Type.STRING },
                                main_title: { type: Type.STRING },
                                about_paragraph: { type: Type.STRING, description: "A summary tailored to highlight alignment with the JD." },
                                college_name: { type: Type.STRING },
                                course_name: { type: Type.STRING },
                                specialization_course_name: { type: Type.STRING },
                                github_username: { type: Type.STRING },
                                leetcode_username: { type: Type.STRING },
                                email_id: { type: Type.STRING },
                                resume_url: { type: Type.STRING }
                            },
                            required: ["full_name", "main_title", "about_paragraph", "college_name", "course_name", "specialization_course_name"]
                        },
                        techStacks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING, description: "Frontend, Backend, Language, Database, or Tool." }
                                },
                                required: ["name", "category"]
                            }
                        },
                        projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    project_name: { type: Type.STRING },
                                    project_desc: { type: Type.STRING, description: "A detailed project description emphasizing requirements in the JD." },
                                    project_tech_stack: { type: Type.STRING, description: "Comma-separated tools/languages." },
                                    project_github_link: { type: Type.STRING }
                                },
                                required: ["project_name", "project_desc", "project_tech_stack"]
                            }
                        },
                        experiences: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    role: { type: Type.STRING },
                                    company_name: { type: Type.STRING },
                                    date_of_joining: { type: Type.STRING },
                                    work_description: { type: Type.STRING, description: "Duties tailored to emphasize tasks or responsibilities from the JD." }
                                },
                                required: ["role", "company_name", "date_of_joining", "work_description"]
                            }
                        },
                        certifications: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    certification_name: { type: Type.STRING },
                                    issuing_organization: { type: Type.STRING },
                                    credential_url: { type: Type.STRING }
                                },
                                required: ["certification_name", "issuing_organization"]
                            }
                        }
                    },
                    required: ["personalInfo", "techStacks", "projects", "experiences", "certifications"]
                }
            }
        });

        const tailoredData = JSON.parse(response.text);

        return res.status(200).json({
            success: true,
            tailoredData
        });
    } catch (err) {
        console.error("AI tailor-form error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to auto-tailor form details.",
            error: err.message
        });
    }
};

/* ---------------- AI PORTFOLIO CRITIQUE ---------------- */
export const matchPortfolioJob = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        if (!portfolioId) {
            return res.status(400).json({ success: false, message: "Portfolio ID is required." });
        }

        // Fetch full portfolio details
        const { data: personalInfo, error: piError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('id', portfolioId)
            .single();

        if (piError || !personalInfo) {
            return res.status(404).json({ success: false, message: "Portfolio data not found." });
        }

        const [
            { data: techStacks },
            { data: projects },
            { data: experiences },
            { data: certifications }
        ] = await Promise.all([
            supabase.from('tech_stacks').select('*').eq('portfolio_id', portfolioId),
            supabase.from('projects').select('*').eq('portfolio_id', portfolioId),
            supabase.from('experiences').select('*').eq('portfolio_id', portfolioId),
            supabase.from('certifications').select('*').eq('portfolio_id', portfolioId)
        ]);

        const context = {
            name: personalInfo.full_name,
            title: personalInfo.main_title,
            about: personalInfo.about_paragraph,
            education: `${personalInfo.course_name} in ${personalInfo.specialization_course_name} from ${personalInfo.college_name}`,
            skills: (techStacks || []).map(s => `${s.name} (${s.category || 'General'})`),
            projects: (projects || []).map(p => ({
                name: p.project_name,
                description: p.project_desc,
                tech_stack: p.project_tech_stack
            })),
            experiences: (experiences || []).map(e => ({
                role: e.role,
                company: e.company_name,
                work: e.work_description
            })),
            certifications: (certifications || []).map(c => `${c.certification_name} by ${c.issuing_organization}`)
        };

        const prompt = `You are an expert tech recruiter and hiring manager. 
Analyze this candidate's portfolio data and provide a detailed, critical hiring manager critique.
Rate their portfolio profile, identify strengths, red flags, and provide highly actionable feedback to make their portfolio stand out to top tech companies.

Candidate Profile Data:
${JSON.stringify(context, null, 2)}

Provide feedback structured in JSON format.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallRating: { type: Type.INTEGER, description: "Hiring rating from 0 to 100 representing readiness for recruitment." },
                        readabilityScore: { type: Type.INTEGER, description: "Score from 0 to 100 for readability, layout structure, and brevity." },
                        visualAppealCritique: { type: Type.STRING, description: "Recruiter's visual layout critique and presentation tips." },
                        structureAndFormatting: { type: Type.STRING, description: "Critique on structure, formatting, sections, and clear logic flow." },
                        projectImpact: { type: Type.STRING, description: "Evaluation of projects impact, depth, description quality, and technical challenges." },
                        experienceRelevance: { type: Type.STRING, description: "Recruiter's rating of work history relevance, action verbs, and impact alignment." },
                        keyStrengths: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Key positive highlights that stood out to the recruiter." 
                        },
                        redFlags: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Concerns or mistakes a hiring manager would immediately note (e.g. typos, missing details, bad formatting)." 
                        },
                        actionableTips: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING }, 
                            description: "Highly specific, direct improvement steps the candidate must implement." 
                        }
                    },
                    required: [
                        "overallRating", 
                        "readabilityScore", 
                        "visualAppealCritique", 
                        "structureAndFormatting", 
                        "projectImpact", 
                        "experienceRelevance", 
                        "keyStrengths", 
                        "redFlags", 
                        "actionableTips"
                    ]
                }
            }
        });

        const critique = JSON.parse(response.text);

        return res.status(200).json({
            success: true,
            critique
        });
    } catch (err) {
        console.error("AI critique error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to perform AI portfolio critique.",
            error: err.message
        });
    }
};


/* ---------------- AI COVER LETTER GENERATOR ---------------- */
export const generateCoverLetter = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!req.file || !jobDescription) {
            return res.status(400).json({ success: false, message: "Resume file and Job Description are required." });
        }

        const extractedText = await extractTextFromFile(req.file);

        const prompt = `You are an expert career coach and professional copywriter.
Write a compelling, professional, and tailored cover letter for this candidate based on their resume data and the target Job Description (JD).
Do NOT invent entirely new projects or experiences. Use their actual resume data to demonstrate why they are a strong fit for the role.
The cover letter should be well-structured (Header, Introduction, Body Paragraphs highlighting matching skills/projects, Conclusion, and Sign-off).

Candidate Resume Text:
${extractedText}

Target Job Description:
"${jobDescription}"

Output ONLY the text of the cover letter. Do not include introductory notes or markdown code block formatting (just standard text formatting).`;

        const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await aiClient.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
        });

        const coverLetter = response.text ? response.text.trim() : "Failed to generate cover letter.";

        return res.status(200).json({
            success: true,
            coverLetter
        });
    } catch (err) {
        console.error("AI Cover Letter error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to generate cover letter.",
            error: err.message
        });
    }
};

/* ---------------- AI INTERVIEW PREP GENERATOR ---------------- */
export const generateInterviewPrep = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resume file is required." });
        }

        const extractedText = await extractTextFromFile(req.file);

        const prompt = `You are a Senior Technical Hiring Manager.
Review this candidate's resume data and the target Job Description (if provided). 
Generate a list of approximately 10 to 15 highly targeted interview questions you would ask them. 
Include a mix of behavioral questions (STAR method) and technical questions based ONLY on the projects, skills, and experiences they listed in their resume.
Do NOT provide suggested answers, only the questions and a brief reasoning for why you are asking it.

Candidate Resume Text:
${extractedText}

Target Job Description:
${jobDescription ? '"' + jobDescription + '"' : 'Not provided. Ask general questions based on their resume.'}

Output the result strictly in JSON format matching the following schema.`;

        const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await aiClient.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING, description: "Either 'Behavioral' or 'Technical'" },
                                    question: { type: Type.STRING, description: "The exact interview question." },
                                    reasoning: { type: Type.STRING, description: "Why the hiring manager is asking this based on their resume/JD." }
                                },
                                required: ["type", "question", "reasoning"]
                            }
                        }
                    },
                    required: ["questions"]
                }
            }
        });

        const prepData = JSON.parse(response.text);

        return res.status(200).json({
            success: true,
            prepData
        });
    } catch (err) {
        console.error("AI Interview Prep error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to generate interview prep.",
            error: err.message
        });
    }
};

/* ---------------- AUTOMATED COLD EMAIL PITCH GENERATOR ---------------- */
export const generateColdEmail = async (req, res) => {
    try {
        const { portfolioId, jobDescription, companyName, recipientName, tone, candidateData } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ success: false, message: "Job Description is required." });
        }

        let context = candidateData || {};

        // If portfolioId is provided, pull real candidate details from Supabase
        if (portfolioId) {
            const { data: personalInfo } = await supabase
                .from('portfolios')
                .select('*')
                .eq('id', portfolioId)
                .single();

            if (personalInfo) {
                const [
                    { data: techStacks },
                    { data: projects },
                    { data: experiences }
                ] = await Promise.all([
                    supabase.from('tech_stacks').select('*').eq('portfolio_id', portfolioId),
                    supabase.from('projects').select('*').eq('portfolio_id', portfolioId),
                    supabase.from('experiences').select('*').eq('portfolio_id', portfolioId)
                ]);

                context = {
                    name: personalInfo.full_name,
                    email: personalInfo.email_id,
                    title: personalInfo.main_title,
                    about: personalInfo.about_paragraph,
                    github: personalInfo.github_username,
                    slug: personalInfo.slug,
                    portfolioId: personalInfo.id,
                    skills: (techStacks || []).map(s => s.name),
                    projects: (projects || []).map(p => ({
                        name: p.project_name,
                        description: p.project_desc,
                        tech: p.project_tech_stack
                    })),
                    experiences: (experiences || []).map(e => ({
                        role: e.role,
                        company: e.company_name,
                        work: e.work_description
                    }))
                };
            }
        }

        const targetCompany = companyName || "Target Company";
        const hrName = recipientName || "Hiring Manager";
        const emailTone = tone || "confident";

        const prompt = `You are an elite career strategist and high-converting cold email outreach expert.
Generate a compelling, highly personalized cold pitch email and formal cover letter directed at the hiring manager or recruiter for ${targetCompany}.

Candidate Profile:
${JSON.stringify(context, null, 2)}

Target Company: ${targetCompany}
Recipient: ${hrName}
Desired Tone: ${emailTone}

Job Description / Requirements:
"${jobDescription}"

Instructions:
1. Generate 3 catchy, professional, non-spammy subject line options.
2. Generate a pitch email body tailored specifically to the candidate's matching projects/skills and the target company's needs.
3. Include a bulleted section highlighting 2-3 specific portfolio accomplishments that directly address the job requirements.
4. Include a clean call to action to discuss the role or review the candidate's live portfolio.
5. Generate a formal cover letter version as well.

Output strictly in JSON format matching the schema.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subjectOptions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "3 compelling subject lines tailored to the role and company."
                        },
                        emailBody: {
                            type: Type.STRING,
                            description: "Full text of the tailored cold email pitch."
                        },
                        coverLetter: {
                            type: Type.STRING,
                            description: "Formal cover letter version."
                        },
                        matchedPoints: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Key matching highlights between candidate portfolio and JD."
                        }
                    },
                    required: ["subjectOptions", "emailBody", "coverLetter", "matchedPoints"]
                }
            }
        });

        const generatedData = JSON.parse(response.text);

        return res.status(200).json({
            success: true,
            data: generatedData
        });
    } catch (err) {
        console.error("Generate Cold Email error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to generate cold email pitch.",
            error: err.message
        });
    }
};

/* ---------------- SEND COLD EMAIL TO HR VIA NODEMAILER ---------------- */
let transporterInstance = null;
async function getMailTransporter() {
  if (!transporterInstance) {
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      transporterInstance = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }
  return transporterInstance;
}

export const sendColdEmail = async (req, res) => {
    try {
        const { recipientEmail, subject, body, candidateName, candidateEmail } = req.body;

        if (!recipientEmail || !subject || !body) {
            return res.status(400).json({ success: false, message: "Recipient Email, Subject, and Email Body are required." });
        }

        const mailer = await getMailTransporter();
        const senderName = candidateName || "Applicant";
        const senderEmail = candidateEmail || process.env.SMTP_EMAIL || "applicant@portfolio.io";

        const formattedHtml = `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 32px 24px; background-color: #0b0f17; color: #f1f5f9; border-radius: 16px; border: 1px solid #1e293b; line-height: 1.6;">
              <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 24px;">
                <span style="font-size: 11px; font-weight: 800; color: #a855f7; text-transform: uppercase; letter-spacing: 2px;">Cold Pitch Outreach</span>
                <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 6px 0 0 0;">${subject}</h2>
              </div>
              <div style="white-space: pre-wrap; font-size: 15px; color: #cbd5e1;">
${body}
              </div>
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
                Sent via Portfolio.io AI Cold Outreach Engine &bull; Candidate Reply-To: ${senderEmail}
              </div>
            </div>
        `;

        const mailOptions = {
            from: `"${senderName}" <${process.env.SMTP_EMAIL || 'no-reply@portfolio.io'}>`,
            replyTo: senderEmail,
            to: recipientEmail,
            subject: subject,
            text: body,
            html: formattedHtml
        };

        const info = await mailer.sendMail(mailOptions);

        let previewUrl = null;
        if (!process.env.SMTP_EMAIL && nodemailer.getTestMessageUrl(info)) {
            previewUrl = nodemailer.getTestMessageUrl(info);
            console.log("------------------------------------------");
            console.log("Cold Email Sent via Ethereal Test Account! Preview: %s", previewUrl);
            console.log("------------------------------------------");
        }

        return res.status(200).json({
            success: true,
            message: `Cold email sent successfully to ${recipientEmail}!`,
            previewUrl
        });
    } catch (err) {
        console.error("Send Cold Email error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to send cold email to HR.",
            error: err.message
        });
    }
};

/* ---------------- AUTOMATED HR & RECRUITER EMAIL DISCOVERY ENGINE ---------------- */
export const findHREmail = async (req, res) => {
    try {
        const { companyName, domain } = req.body;

        if (!companyName && !domain) {
            return res.status(400).json({ success: false, message: "Company Name or Domain is required." });
        }

        // Clean company name and derive clean domain
        let targetCompany = (companyName || '').trim();
        let targetDomain = (domain || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

        if (!targetDomain && targetCompany) {
            // Normalize company name into clean domain pattern (e.g. "Stripe" -> "stripe.com")
            const cleanName = targetCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
            targetDomain = `${cleanName}.com`;
        }

        // Generate corporate hiring patterns
        const patternEmails = [
            `careers@${targetDomain}`,
            `recruiting@${targetDomain}`,
            `hr@${targetDomain}`,
            `talent@${targetDomain}`,
            `hiring@${targetDomain}`,
            `jobs@${targetDomain}`
        ];

        // Ask Gemini 3.6 Flash for corporate recruiter contacts & lead discovery
        const prompt = `You are a corporate intelligence and recruitment lead discovery assistant.
For the company "${targetCompany || targetDomain}" (Domain: ${targetDomain}), identify their official HR/Talent Acquisition email contact address patterns, likely HR recipient titles, and primary contact emails.

Company Name: ${targetCompany || targetDomain}
Inferred Domain: ${targetDomain}

Output strictly in JSON format matching the schema.`;

        let aiDiscovered = null;
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            hrTitle: { 
                                type: Type.STRING, 
                                description: "Suggested hiring manager title e.g. 'Stripe Talent Acquisition Team' or 'Head of Recruiting'." 
                            },
                            primaryEmail: { 
                                type: Type.STRING, 
                                description: "Best HR / Careers / Talent acquisition email address for this company." 
                            },
                            discoveredEmails: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "List of 3 to 5 candidate HR and hiring manager email addresses."
                            }
                        },
                        required: ["hrTitle", "primaryEmail", "discoveredEmails"]
                    }
                }
            });

            aiDiscovered = JSON.parse(response.text);
        } catch (aiErr) {
            console.warn("AI HR Email Discovery fallback:", aiErr.message);
        }

        // Merge AI discovered emails with corporate pattern emails without duplicates
        const allDiscovered = new Set();
        if (aiDiscovered?.primaryEmail) allDiscovered.add(aiDiscovered.primaryEmail.toLowerCase());
        if (Array.isArray(aiDiscovered?.discoveredEmails)) {
            aiDiscovered.discoveredEmails.forEach(e => allDiscovered.add(e.toLowerCase()));
        }
        patternEmails.forEach(e => allDiscovered.add(e.toLowerCase()));

        const alternateEmails = Array.from(allDiscovered);
        const primaryEmail = aiDiscovered?.primaryEmail || alternateEmails[0];
        const hrTitle = aiDiscovered?.hrTitle || `${targetCompany || 'Company'} Talent Acquisition Team`;

        return res.status(200).json({
            success: true,
            data: {
                companyName: targetCompany || targetDomain,
                domain: targetDomain,
                primaryEmail,
                hrTitle,
                alternateEmails
            }
        });
    } catch (err) {
        console.error("Find HR Email Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to discover HR email addresses.",
            error: err.message
        });
    }
};
