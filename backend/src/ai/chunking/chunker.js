/**
 * Standardizes raw portfolio data and splits it into semantic, standalone textual chunks.
 * Standardizes chunk payloads to a generic Document interface.
 * 
 * @param {object} portfolioData - Full portfolio details fetched from backend logic.
 * @returns {Array<{pageContent: string, metadata: object}>} Structured generic Document chunks.
 */
export const chunkPortfolio = (portfolioData) => {
  const { personalInfo, techStacks, projects, experiences, certifications } = portfolioData;
  const portfolioId = personalInfo?.id || portfolioData?.id;
  const userId = personalInfo?.user_id;
  const templateId = personalInfo?.template_id || personalInfo?.templateId;
  const createdAt = personalInfo?.created_at;

  const documents = [];

  // Helper to generate consistent metadata
  const makeMetadata = (section, title, extra = {}) => ({
    portfolioId,
    userId,
    section,
    title,
    templateId,
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...extra
  });

  const candidateName = personalInfo?.full_name || "The Candidate";

  // 1. About Chunk
  if (personalInfo?.about_paragraph) {
    const aboutContent = `Candidate Profile - About ${candidateName}:
Professional Title/Role: ${personalInfo.main_title || 'Software Engineer'}
About Summary: ${personalInfo.about_paragraph}
Education & Studies: ${personalInfo.course_name || ''} in ${personalInfo.specialization_course_name || ''} from ${personalInfo.college_name || ''}
Contact Details: Email: ${personalInfo.email_id || ''}, Location: ${personalInfo.address || ''}
Online Profiles: GitHub: ${personalInfo.github_username || ''}, LeetCode: ${personalInfo.leetcode_username || ''}`;

    documents.push({
      pageContent: aboutContent,
      metadata: makeMetadata('about', `About ${candidateName}`, { chunkId: 'about-summary' })
    });
  }

  // 2. Skills Chunk
  if (techStacks && techStacks.length > 0) {
    const skillsList = techStacks.map(s => `- ${s.name} (${s.category || 'Skill'})`).join('\n');
    const skillsContent = `Candidate Technical Skills & Stack of ${candidateName}:
Below are the languages, frameworks, databases, and tools the candidate has experience with:
${skillsList}`;

    documents.push({
      pageContent: skillsContent,
      metadata: makeMetadata('skills', `Skills & Tech Stack`, { chunkId: 'skills-list' })
    });
  }

  // 3. Projects Chunks (One chunk per project)
  if (projects && projects.length > 0) {
    projects.forEach((proj, idx) => {
      if (proj.project_name) {
        const techString = Array.isArray(proj.project_tech_stack) 
          ? proj.project_tech_stack.join(', ') 
          : (proj.project_tech_stack || '');
        const projectContent = `Candidate Project Developed by ${candidateName}:
Project Title: ${proj.project_name}
Project Description: ${proj.project_desc}
Technologies and Stack Used: ${techString}
Project Links/Source Code: ${proj.project_github_link || 'Not specified'}`;

        documents.push({
          pageContent: projectContent,
          metadata: makeMetadata('project', `Project: ${proj.project_name}`, {
            projectName: proj.project_name,
            chunkId: `project-${idx}`
          })
        });
      }
    });
  }

  // 4. Experiences Chunks (One chunk per experience)
  if (experiences && experiences.length > 0) {
    experiences.forEach((exp, idx) => {
      if (exp.company_name) {
        const experienceContent = `Candidate Work Experience of ${candidateName}:
Role/Job Title: ${exp.role} at ${exp.company_name}
Date of Joining/Duration: Joined on ${exp.date_of_joining}
Job Responsibilities & Accomplishments: ${exp.work_description}`;

        documents.push({
          pageContent: experienceContent,
          metadata: makeMetadata('experience', `Work Experience: ${exp.company_name}`, {
            experienceName: exp.company_name,
            chunkId: `experience-${idx}`
          })
        });
      }
    });
  }

  // 5. Certifications Chunk
  if (certifications && certifications.length > 0) {
    const certList = certifications.map(c => `- ${c.certification_name} issued by ${c.issuing_organization} (Link: ${c.credential_url || 'N/A'})`).join('\n');
    const certificationsContent = `Candidate Professional Certifications of ${candidateName}:
Below are the certifications and credentials earned by the candidate:
${certList}`;

    documents.push({
      pageContent: certificationsContent,
      metadata: makeMetadata('certifications', `Certifications & Badges`, { chunkId: 'certifications-list' })
    });
  }

  return documents;
};
