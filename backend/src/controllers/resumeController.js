import fs from 'fs';
import mammoth from 'mammoth';
import { GoogleGenAI, Type } from '@google/genai';
import { PDFParse } from 'pdf-parse'; // v2 API: named class export, not a default function

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
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
    let userMsg = error.message || 'Failed to process resume';
    if (userMsg.includes('PERMISSION_DENIED') || userMsg.includes('denied access') || userMsg.includes('403')) {
      userMsg = 'Google Gemini API Key Error: Your API key or Google Cloud Project has been denied access by Google. Please create a new GEMINI_API_KEY at https://aistudio.google.com and update it in your Render backend environment variables.';
    }
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
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
    let userMsg = error.message || 'Failed to analyze resume ATS score';
    if (userMsg.includes('PERMISSION_DENIED') || userMsg.includes('denied access') || userMsg.includes('403')) {
      userMsg = 'Google Gemini API Key Error: Your API key or Google Cloud Project has been denied access by Google. Please create a new GEMINI_API_KEY at https://aistudio.google.com and update it in your Render backend environment variables.';
    }
    return res.status(500).json({ error: userMsg });
  } finally {
    safeUnlink(filePath);
  }
};
