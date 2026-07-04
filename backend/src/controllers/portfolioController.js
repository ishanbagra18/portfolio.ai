import { supabase } from '../config/supabase.js';
import { indexPortfolio } from '../services/ragService.js';
import { deleteVectors } from '../ai/vector/qdrantClient.js';

// Helper to safely parse dates for PostgreSQL strict DATE columns
const safeDate = (val) => {
    const today = new Date().toISOString().split('T')[0];
    if (!val || String(val).trim() === '') {
        return today; // Fallback to today's date to satisfy NOT NULL constraint
    }
    const trimmed = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    const parsed = Date.parse(trimmed);
    if (isNaN(parsed)) {
        return today; // Fallback to today's date to satisfy NOT NULL constraint
    }
    return new Date(parsed).toISOString().split('T')[0];
};

/* ---------------- CREATE PORTFOLIO ---------------- */
export const createPortfolio = async (req, res) => {
    try {
        const { 
            personalInfo, 
            techStacks, 
            projects, 
            experiences, 
            certifications,
            templateId, 
            template_id 
        } = req.body;

        // 1. Validation: Kam se kam 2 projects hone chahiye
        if (!projects || projects.length < 2) {
            return res.status(400).json({ 
                success: false, 
                message: "Aapko kam se kam 2 projects add karne honge." 
            });
        }

        // 2. User ID nikaalo (JWT payload me 'sub' field hoti hai, 'id' nahi)
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId || req.headers['user-id'];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authenticated nahi hai ya User ID missing hai."
            });
        }

        // 3. Final Template ID Resolve karo
        const finalTemplateId = templateId || template_id || personalInfo?.template_id || personalInfo?.templateId || 'template1';
        console.log(`[Create Portfolio] User: ${userId} | Saving with template_id: ${finalTemplateId}`);

        // 4. Data Cleaning & User Association
        // CRITICAL FIX: personalInfo se non-DB columns ko alag nikaal diya taaki wo DB me insert na ho
        const { 
            templateId: _stripCamelCase, 
            theme_color: _stripColor, 
            theme_font: _stripFont, 
            ...restPersonalInfo 
        } = personalInfo || {};

        const cleanedPersonalInfo = { 
            ...restPersonalInfo,
            user_id: userId,
            template_id: finalTemplateId
        };

        // Agar age empty string "" hai toh use null banao
        if (cleanedPersonalInfo.age === '' || isNaN(cleanedPersonalInfo.age)) {
            cleanedPersonalInfo.age = null;
        }

        // Safety check: delete keys explicitly
        delete cleanedPersonalInfo.templateId;
        delete cleanedPersonalInfo.theme_color;
        delete cleanedPersonalInfo.theme_font;

        // 5. Personal Info insert karo aur naye Portfolio ki ID nikaalo
        const { data: portfolioData, error: portfolioError } = await supabase
            .from('portfolios')
            .insert([cleanedPersonalInfo])
            .select()
            .single();

        if (portfolioError) {
            console.error("Supabase Personal Info Error:", portfolioError);
            return res.status(400).json({
                success: false,
                message: `Personal Info save nahi hua: ${portfolioError.message}`,
                details: portfolioError.details || portfolioError.hint
            });
        }

        const newPortfolioId = portfolioData.id;

        // 6. Tech Stacks Save Karo
        if (techStacks && techStacks.length > 0) {
            const validTechs = techStacks.filter(t => t.name && String(t.name).trim() !== '');
            if (validTechs.length > 0) {
                const techData = validTechs.map(tech => ({ ...tech, portfolio_id: newPortfolioId }));
                const { error: techError } = await supabase.from('tech_stacks').insert(techData);
                if (techError) console.error("Tech Stack Error:", techError.message);
            }
        }

        // 7. Projects Save Karo
        if (projects && projects.length > 0) {
            const validProjects = projects.filter(p => 
                (p.project_name && String(p.project_name).trim() !== '') || 
                (p.project_desc && String(p.project_desc).trim() !== '')
            );
            if (validProjects.length > 0) {
                const projectData = validProjects.map(proj => ({ ...proj, portfolio_id: newPortfolioId }));
                const { error: projError } = await supabase.from('projects').insert(projectData);
                if (projError) console.error("Projects Error:", projError.message);
            }
        }

        // 8. Experiences Save Karo
        if (experiences && experiences.length > 0) {
            const validExp = experiences.filter(e => 
                (e.role && String(e.role).trim() !== '') ||
                (e.company_name && String(e.company_name).trim() !== '') ||
                (e.work_description && String(e.work_description).trim() !== '')
            );
            if (validExp.length > 0) {
                const expData = validExp.map(exp => ({ 
                    ...exp, 
                    date_of_joining: safeDate(exp.date_of_joining),
                    portfolio_id: newPortfolioId 
                }));
                const { error: expError } = await supabase.from('experiences').insert(expData);
                if (expError) console.error("Experience Error:", expError.message);
            }
        }

        // 9. Certifications Save Karo
        if (certifications && certifications.length > 0) {
            const validCerts = certifications.filter(c => 
                (c.certification_name && String(c.certification_name).trim() !== '') ||
                (c.issuing_organization && String(c.issuing_organization).trim() !== '')
            );
            if (validCerts.length > 0) {
                const certData = validCerts.map(cert => ({ ...cert, portfolio_id: newPortfolioId }));
                const { error: certError } = await supabase.from('certifications').insert(certData);
                if (certError) console.error("Certifications Error:", certError.message);
            }
        }

        // Trigger RAG indexing asynchronously
        indexPortfolio(newPortfolioId).catch(err => {
            console.error(`[RAG Service] Async indexing failed for portfolio ${newPortfolioId}:`, err);
        });

        // Success Response with ID
        res.status(201).json({
            success: true,
            message: "Portfolio successfully create ho gaya hai!",
            portfolioId: newPortfolioId,
            templateId: finalTemplateId
        });

    } catch (error) {
        console.error("Server Crash Error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Server mein kuch problem aayi hai.",
        });
    }
};

/* ---------------- GET ALL USER PORTFOLIOS ---------------- */
export const getAllUserPortfolios = async (req, res) => {
    try {
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId || req.headers['user-id']; 

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authenticated nahi hai ya User ID missing hai."
            });
        }

        const { data: portfolios, error } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Fetch all portfolios error:", error);
            throw error;
        }

        // Return both formats so frontend dashboard cards work seamlessly
        const formattedPortfolios = (portfolios || []).map(p => ({
            ...p,
            templateId: p.template_id || 'template1',
            template_id: p.template_id || 'template1'
        }));

        res.status(200).json({
            success: true,
            count: formattedPortfolios.length,
            data: formattedPortfolios
        });

    } catch (error) {
        console.error("Error fetching user portfolios:", error);
        res.status(500).json({
            success: false,
            message: "User ke portfolios fetch karne me problem aayi.",
            error: error.message
        });
    }
};

/* ---------------- GET SINGLE PORTFOLIO FULL DATA BY ID ---------------- */
export const getSinglePortfolioById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Portfolio ID provide karna zaroori hai."
            });
        }

        // 1. Portfolios table se Personal Info fetch karo
        const { data: personalInfo, error: portfolioError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('id', id)
            .single();

        if (portfolioError || !personalInfo) {
            return res.status(404).json({
                success: false,
                message: "Portfolio nahi mila ya ID galat hai.",
                error: portfolioError?.message
            });
        }

        // 2. Parallel me saara tech stacks, projects, experiences, certifications fetch karo
        const [
            { data: techStacks },
            { data: projects },
            { data: experiences },
            { data: certifications }
        ] = await Promise.all([
            supabase.from('tech_stacks').select('*').eq('portfolio_id', id),
            supabase.from('projects').select('*').eq('portfolio_id', id),
            supabase.from('experiences').select('*').eq('portfolio_id', id),
            supabase.from('certifications').select('*').eq('portfolio_id', id)
        ]);

        const resolvedTemplate = personalInfo.template_id || 'template1';

        // 3. Frontend format me return karo
        res.status(200).json({
            success: true,
            data: {
                personalInfo: {
                    ...personalInfo,
                    templateId: resolvedTemplate,
                    template_id: resolvedTemplate
                },
                techStacks: techStacks || [],
                projects: projects || [],
                experiences: experiences || [],
                certifications: certifications || [],
                templateId: resolvedTemplate,
                template_id: resolvedTemplate
            }
        });

    } catch (error) {
        console.error("Error fetching single portfolio:", error);
        res.status(500).json({
            success: false,
            message: "Portfolio ka poora data fetch karne me error aayi.",
            error: error.message
        });
    }
};

/* ---------------- UPDATE PORTFOLIO ---------------- */
export const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

        if (!id) {
            return res.status(400).json({ success: false, message: "Portfolio ID provide karna zaroori hai." });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "User authenticated nahi hai." });
        }

        // 1. Ownership verify karo
        const { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, user_id, template_id')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ success: false, message: "Portfolio nahi mila ya ID galat hai." });
        }
        if (existing.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Aap iss portfolio ko update karne ke authorized nahi hain." });
        }

        const { personalInfo, techStacks, projects, experiences, certifications, templateId, template_id } = req.body;

        // 2. Validation
        if (projects && projects.length < 2) {
            return res.status(400).json({ success: false, message: "Kam se kam 2 projects hone chahiye." });
        }

        // 3. personalInfo update — ONLY send known safe columns
        // DB se aaye personalInfo me id, created_at, user_id, portfolio_id jaisi fields hoti hain
        // jo .update() me nahi jaani chahiye — isliye sirf allowed fields pick karo
        if (personalInfo) {
            const finalTemplateId = templateId || template_id || personalInfo.template_id || personalInfo.templateId || existing.template_id || 'template1';

            const safePersonalInfo = {
                full_name:                   personalInfo.full_name                   ?? null,
                email_id:                    personalInfo.email_id                    ?? null,
                age:                         (personalInfo.age === '' || personalInfo.age == null || isNaN(Number(personalInfo.age))) ? null : Number(personalInfo.age),
                address:                     personalInfo.address                     ?? null,
                main_title:                  personalInfo.main_title                  ?? null,
                college_name:                personalInfo.college_name                ?? null,
                course_name:                 personalInfo.course_name                 ?? null,
                specialization_course_name:  personalInfo.specialization_course_name  ?? null,
                about_paragraph:             personalInfo.about_paragraph             ?? null,
                github_username:             personalInfo.github_username             ?? null,
                leetcode_username:           personalInfo.leetcode_username           ?? null,
                template_id:                 finalTemplateId,
                user_id:                     userId,
                resume_url:                  personalInfo.resume_url                  ?? null
            };

            console.log(`[Update Portfolio] id=${id} | Updating personalInfo with keys:`, Object.keys(safePersonalInfo));

            const { error: updateError } = await supabase
                .from('portfolios')
                .update(safePersonalInfo)
                .eq('id', id);

            if (updateError) {
                console.error('[Update Portfolio] personalInfo update failed:', updateError);
                return res.status(400).json({
                    success: false,
                    message: `Personal info update nahi hua: ${updateError.message}`
                });
            }
            console.log('[Update Portfolio] personalInfo updated successfully.');
        }

        // 4. Related tables: delete all old records first, then insert fresh
        const { error: delError } = await supabase.rpc === undefined
            ? { error: null } : { error: null }; // placeholder — actual deletes below

        const deleteResults = await Promise.allSettled([
            supabase.from('tech_stacks').delete().eq('portfolio_id', id),
            supabase.from('projects').delete().eq('portfolio_id', id),
            supabase.from('experiences').delete().eq('portfolio_id', id),
            supabase.from('certifications').delete().eq('portfolio_id', id)
        ]);
        deleteResults.forEach((r, i) => {
            if (r.status === 'rejected' || r.value?.error) {
                console.warn(`[Update Portfolio] Delete step ${i} had issue:`, r.value?.error?.message || r.reason);
            }
        });
        console.log('[Update Portfolio] Old related records deleted.');

        // 5. Insert fresh records — strip id and portfolio_id from any DB-fetched objects
        //    so Supabase auto-generates fresh primary keys
        const strip = ({ id: _id, portfolio_id: _pid, created_at: _ca, updated_at: _ua, ...rest }) => rest;

        const insertPromises = [];

        if (techStacks && techStacks.length > 0) {
            const valid = techStacks.filter(t => t.name && String(t.name).trim() !== '');
            if (valid.length > 0) {
                const rows = valid.map(t => ({ ...strip(t), portfolio_id: id }));
                console.log(`[Update Portfolio] Inserting ${rows.length} tech stacks`);
                insertPromises.push(
                    supabase.from('tech_stacks').insert(rows).then(r => {
                        if (r.error) console.error('[Update Portfolio] tech_stacks insert error:', r.error.message);
                        else console.log('[Update Portfolio] tech_stacks inserted OK');
                    })
                );
            }
        }

        if (projects && projects.length > 0) {
            const valid = projects.filter(p => 
                (p.project_name && String(p.project_name).trim() !== '') ||
                (p.project_desc && String(p.project_desc).trim() !== '')
            );
            if (valid.length > 0) {
                const rows = valid.map(p => {
                    const clean = strip(p);
                    // Normalise tech stack: always store as array
                    if (typeof clean.project_tech_stack === 'string') {
                        clean.project_tech_stack = clean.project_tech_stack
                            .split(',').map(s => s.trim()).filter(Boolean);
                    }
                    return { ...clean, portfolio_id: id };
                });
                console.log(`[Update Portfolio] Inserting ${rows.length} projects`);
                insertPromises.push(
                    supabase.from('projects').insert(rows).then(r => {
                        if (r.error) console.error('[Update Portfolio] projects insert error:', r.error.message);
                        else console.log('[Update Portfolio] projects inserted OK');
                    })
                );
            }
        }

        if (experiences && experiences.length > 0) {
            const valid = experiences.filter(e => 
                (e.role && String(e.role).trim() !== '') ||
                (e.company_name && String(e.company_name).trim() !== '') ||
                (e.work_description && String(e.work_description).trim() !== '')
            );
            if (valid.length > 0) {
                const rows = valid.map(e => ({ 
                    ...strip(e), 
                    date_of_joining: safeDate(e.date_of_joining),
                    portfolio_id: id 
                }));
                console.log(`[Update Portfolio] Inserting ${rows.length} experiences`);
                insertPromises.push(
                    supabase.from('experiences').insert(rows).then(r => {
                        if (r.error) console.error('[Update Portfolio] experiences insert error:', r.error.message);
                        else console.log('[Update Portfolio] experiences inserted OK');
                    })
                );
            }
        }

        if (certifications && certifications.length > 0) {
            const valid = certifications.filter(c => 
                (c.certification_name && String(c.certification_name).trim() !== '') ||
                (c.issuing_organization && String(c.issuing_organization).trim() !== '')
            );
            if (valid.length > 0) {
                const rows = valid.map(c => ({ ...strip(c), portfolio_id: id }));
                console.log(`[Update Portfolio] Inserting ${rows.length} certifications`);
                insertPromises.push(
                    supabase.from('certifications').insert(rows).then(r => {
                        if (r.error) console.error('[Update Portfolio] certifications insert error:', r.error.message);
                        else console.log('[Update Portfolio] certifications inserted OK');
                    })
                );
            }
        }

        await Promise.all(insertPromises);
        console.log('[Update Portfolio] All inserts done. Update complete.');

        // Trigger RAG re-indexing asynchronously on update
        indexPortfolio(id).catch(err => {
            console.error(`[RAG Service] Async re-indexing failed for portfolio ${id}:`, err);
        });

        res.status(200).json({
            success: true,
            message: "Portfolio successfully update ho gaya.",
            portfolioId: id
        });

    } catch (error) {
        console.error("Update portfolio error:", error);
        res.status(500).json({
            success: false,
            message: "Portfolio update karte waqt server me problem aayi.",
            error: error.message
        });
    }
};

/* ---------------- DELETE PORTFOLIO ---------------- */

export const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Portfolio ID provide karna zaroori hai."
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authenticated nahi hai."
            });
        }

        // 1. Pehle verify karo ki portfolio is user ka hi hai (ownership check)
        const { data: portfolio, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, user_id')
            .eq('id', id)
            .single();

        if (fetchError || !portfolio) {
            return res.status(404).json({
                success: false,
                message: "Portfolio nahi mila ya ID galat hai."
            });
        }

        if (portfolio.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Aap iss portfolio ko delete karne ke authorized nahi hain."
            });
        }

        // 2. Related records delete karo (tech_stacks, projects, experiences, certifications)
        await Promise.all([
            supabase.from('tech_stacks').delete().eq('portfolio_id', id),
            supabase.from('projects').delete().eq('portfolio_id', id),
            supabase.from('experiences').delete().eq('portfolio_id', id),
            supabase.from('certifications').delete().eq('portfolio_id', id)
        ]);

        // 3. Main portfolio record delete karo
        const { error: deleteError } = await supabase
            .from('portfolios')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error("Portfolio delete error:", deleteError);
            return res.status(500).json({
                success: false,
                message: "Portfolio delete karne me problem aayi.",
                error: deleteError.message
            });
        }

        // Trigger vector deletion from Qdrant asynchronously
        deleteVectors(id).catch(err => {
            console.error(`[Qdrant Client] Async vector delete failed for portfolio ${id}:`, err);
        });

        res.status(200).json({
            success: true,
            message: "Portfolio successfully delete ho gaya."
        });

    } catch (error) {
        console.error("Delete portfolio error:", error);
        res.status(500).json({
            success: false,
            message: "Server me kuch problem aayi portfolio delete karte waqt.",
            error: error.message
        });
    }
};







