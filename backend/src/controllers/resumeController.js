import fs from 'fs';
import mammoth from 'mammoth';
import { GoogleGenAI, Type } from '@google/genai';
import { PDFParse } from 'pdf-parse'; // v2 API: named class export, not a default function

// Dynamic AI client getter to ensure runtime process.env evaluation
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY environment variable is missing on the server. Please add GEMINI_API_KEY in your Render Environment Variables.');
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
};

// Clean error formatter
const formatErrorMessage = (error) => {
  let msg = error.message || 'An error occurred during resume processing.';
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error && parsed.error.message) {
      msg = parsed.error.message;
    }
  } catch (e) {
    // Not JSON string
  }

  if (msg.includes('PERMISSION_DENIED') || msg.includes('403') || msg.includes('denied access') || msg.includes('denied')) {
    return 'Google Gemini API Key Error: The GEMINI_API_KEY set on your Render server is invalid, revoked, or denied access by Google. Please update GEMINI_API_KEY in your Render Dashboard with a fresh key from Google AI Studio (aistudio.google.com).';
  }
  if (msg.includes('UNAVAILABLE') || msg.includes('503') || msg.includes('high demand')) {
    return 'Gemini AI service is currently experiencing high demand. Please try scanning again in a few seconds.';
  }
  if (msg.includes('Invalid PDF structure') || msg.includes('InvalidPDFException') || msg.includes('pdf-parse')) {
    return 'The uploaded PDF file is corrupt or unreadable. Please re-export or upload a valid PDF or DOCX resume.';
  }
  return msg;
};

// Robust helper to try candidate models if 503 / 404 / rate issues occur
const generateGeminiContent = async (aiIgnored, params) => {
  const ai = getAiClient();
  const modelCandidates = ['gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  let lastErr = null;
  for (const model of modelCandidates) {
    try {
      return await ai.models.generateContent({
        ...params,
        model
      });
    } catch (err) {
      lastErr = err;
      console.warn(`Model ${model} failed: (${err.message})`);
      if (err.message.includes('PERMISSION_DENIED') || err.message.includes('403') || err.message.includes('denied access')) {
        break; // Stop fallback loop immediately if API key itself is denied
      }
    }
  }
  throw lastErr;
};

// Helper to clean up uploaded file safely
const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to unlink file:', filePath, err);
    }
  }
};

// Helper to check if file is PDF or DOCX based on mimetype or filename extension
const getFileFormat = (file) => {
  const fileType = (file.mimetype || '').toLowerCase();
  const filename = (file.originalname || '').toLowerCase();

  if (fileType === 'application/pdf' || filename.endsWith('.pdf')) {
    return 'pdf';
  }
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword' ||
    fileType === 'application/x-zip-compressed' ||
    fileType === 'application/octet-stream' && (filename.endsWith('.docx') || filename.endsWith('.doc')) ||
    filename.endsWith('.docx') ||
    filename.endsWith('.doc')
  ) {
    return 'docx';
  }
  return null;
};

export const parseResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    filePath = req.file.path;
    const format = getFileFormat(req.file);
    let extractedText = '';

    if (format === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const pdfResult = await parser.getText();
      await parser.destroy();
      extractedText = pdfResult.text;
    } else if (format === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF or DOCX file.' });
    }

    // Clean up temporary file immediately after text extraction
    safeUnlink(filePath);
    filePath = null;

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ error: 'Could not extract text from the file. Please ensure it is not scanned/empty.' });
    }

    // Prompt Gemini to structure the extracted text matching your exact React State Schema
    const prompt = `Extract portfolio data from this resume text into structured JSON matching this exact schema:
    - personalInfo: full_name, email_id, age (number or null), address, main_title
    - about: about_paragraph, college_name, course_name, specialization_course_name, github_username, leetcode_username
    - projects: array of objects with { project_name, project_tech_stack, project_desc }
    - experience: array of objects with { role, company_name, date_of_joining, work_description }
    - certifications: array of objects with { certification_name, issuing_organization, credential_url }

    Resume Text:
    ${extractedText}`;

    const response = await generateGeminiContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                full_name: { type: Type.STRING },
                email_id: { type: Type.STRING },
                age: { type: Type.INTEGER },
                address: { type: Type.STRING },
                main_title: { type: Type.STRING }
              }
            },
            about: {
              type: Type.OBJECT,
              properties: {
                about_paragraph: { type: Type.STRING },
                college_name: { type: Type.STRING },
                course_name: { type: Type.STRING },
                specialization_course_name: { type: Type.STRING },
                github_username: { type: Type.STRING },
                leetcode_username: { type: Type.STRING }
              }
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  project_name: { type: Type.STRING },
                  project_tech_stack: { type: Type.STRING },
                  project_desc: { type: Type.STRING }
                }
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  company_name: { type: Type.STRING },
                  date_of_joining: { type: Type.STRING },
                  work_description: { type: Type.STRING }
                }
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
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text);
    return res.status(200).json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Error parsing resume:', error);
    const userMsg = formatErrorMessage(error);
    return res.status(500).json({ error: userMsg });
  } finally {
    safeUnlink(filePath);
  }
};







/* ---------------- ATS SCORE CHECKER ---------------- */
export const checkAtsScore = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    filePath = req.file.path;
    const format = getFileFormat(req.file);
    let extractedText = '';

    if (format === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const pdfResult = await parser.getText();
      await parser.destroy();
      extractedText = pdfResult.text;
    } else if (format === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF or DOCX file.' });
    }

    // Clean up temporary file immediately after text extraction
    safeUnlink(filePath);
    filePath = null;

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ error: 'Could not extract text from the file. Please ensure it is not an image-only PDF.' });
    }

    // Prompt Gemini for ATS Evaluation
    const prompt = `Analyze the following resume text for ATS (Applicant Tracking System) compatibility, formatting, and content quality. Provide detailed points highlighting mistakes and actionable improvements:
    1. atsScore: overall rating (integer 0-100)
    2. formattingScore: rating for layout, standard fonts, sections clarity (integer 0-100)
    3. contentScore: rating for keywords count, metrics, spelling, phrasing (integer 0-100)
    4. summary: high-level evaluation summary
    5. mistakes: list of specific errors/mistakes found (e.g. use of progress bars, multi-column layout issues, vague project summaries, missing contact details, typos, weak verbs)
    6. improvements: list of recommendations/improvements to boost score
    7. missingKeywords: list of keywords/skills that should be added to rank better in search filters

    Resume Text:
    ${extractedText}`;

    const response = await generateGeminiContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['atsScore', 'formattingScore', 'contentScore', 'summary', 'mistakes', 'improvements', 'missingKeywords'],
          properties: {
            atsScore: { type: Type.INTEGER },
            formattingScore: { type: Type.INTEGER },
            contentScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            mistakes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text);
    return res.status(200).json({ success: true, data: parsedData });

  } catch (error) {
    console.error('Error analyzing ATS score:', error);
    const userMsg = formatErrorMessage(error);
    return res.status(500).json({ error: userMsg });
  } finally {
    safeUnlink(filePath);
  }
};
