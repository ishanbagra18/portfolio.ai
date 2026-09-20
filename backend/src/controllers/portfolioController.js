import { supabase } from '../config/supabase.js';
import { indexPortfolio } from '../services/ragService.js';
import { deleteVectors } from '../ai/vector/qdrantClient.js';
import crypto from 'crypto';

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

// Helper to generate a URL-safe slug from a full name
const generateSlug = (fullName) => {
    const base = (fullName || 'portfolio')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
        .replace(/\s+/g, '-')           // spaces to hyphens
        .replace(/-+/g, '-')            // collapse multiple hyphens
        .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
        .substring(0, 40);              // limit length
    const suffix = crypto.randomBytes(4).toString('hex'); // 8 random hex chars
    return `${base}-${suffix}`;
};

// Helper to validate custom slug format
export const isValidSlug = (slug) => {
    if (!slug || typeof slug !== 'string') return false;
    const trimmed = slug.trim().toLowerCase();
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed) && trimmed.length >= 3 && trimmed.length <= 40;
};

// Exact valid columns in Supabase 'portfolios' PostgreSQL table
const VALID_PORTFOLIO_COLUMNS = new Set([
    'user_id', 'full_name', 'email_id', 'age', 'address', 'main_title',
    'college_name', 'course_name', 'specialization_course_name', 'about_paragraph',
    'github_username', 'leetcode_username', 'template_id', 'resume_url',
    'is_deployed', 'deployed_url', 'public_slug', 'is_public', 'view_count',
    'theme_mode', 'section_order', 'optional_sections', 'achievements_data',
    'publications_data', 'hackathons_data', 'open_source_data', 'volunteering_data',
    'research_data', 'education_data', 'awards_data', 'testimonials_data',
    'currently_learning', 'interests'
]);

// Helper to filter and map personalInfo payload to ONLY existing Supabase DB columns
const buildSafePortfolioObject = (personalInfo = {}, finalTemplateId, userId) => {
    let themeModeVal = personalInfo.theme_mode ?? null;
    if (!themeModeVal && personalInfo.theme_settings) {
        themeModeVal = typeof personalInfo.theme_settings === 'string'
            ? personalInfo.theme_settings
            : JSON.stringify(personalInfo.theme_settings);
    }

    let optionalSectionsVal = personalInfo.optional_sections ?? personalInfo.section_visibility ?? null;

    const candidate = {
        user_id:                    userId,
        full_name:                  personalInfo.full_name                  ?? null,
        email_id:                   personalInfo.email_id                   ?? null,
        age:                        (personalInfo.age === '' || personalInfo.age == null || isNaN(Number(personalInfo.age))) ? null : Number(personalInfo.age),
        address:                    personalInfo.address                    ?? null,
        main_title:                 personalInfo.main_title                 ?? null,
        college_name:               personalInfo.college_name               ?? null,
        course_name:                personalInfo.course_name                ?? null,
        specialization_course_name: personalInfo.specialization_course_name ?? null,
        about_paragraph:            personalInfo.about_paragraph            ?? null,
        github_username:            personalInfo.github_username            ?? null,
        leetcode_username:          personalInfo.leetcode_username          ?? null,
        template_id:                finalTemplateId,
        resume_url:                 personalInfo.resume_url                 ?? null,
        is_deployed:                personalInfo.is_deployed                ?? false,
        deployed_url:               personalInfo.deployed_url               ?? null,
        public_slug:                personalInfo.public_slug                ?? null,
        is_public:                  personalInfo.is_public                  ?? false,
        view_count:                 personalInfo.view_count                 ?? 0,
        theme_mode:                 themeModeVal,
        section_order:              personalInfo.section_order              ?? null,
        optional_sections:         optionalSectionsVal,
        achievements_data:          personalInfo.achievements_data          ?? null,
        publications_data:          personalInfo.publications_data          ?? null,
        hackathons_data:            personalInfo.hackathons_data            ?? null,
        open_source_data:           personalInfo.open_source_data           ?? null,
        volunteering_data:          personalInfo.volunteering_data          ?? null,
        research_data:              personalInfo.research_data              ?? null,
        education_data:             personalInfo.education_data             ?? null,
        awards_data:                personalInfo.awards_data                ?? null,
        testimonials_data:          personalInfo.testimonials_data          ?? null,
        currently_learning:         personalInfo.currently_learning         ?? null,
        interests:                  personalInfo.interests                  ?? null
    };

    const sanitized = {};
    for (const [key, val] of Object.entries(candidate)) {
        if (VALID_PORTFOLIO_COLUMNS.has(key)) {
            sanitized[key] = val;
        }
    }
    return sanitized;
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

        // Generate or validate public slug
        let publicSlug = generateSlug(restPersonalInfo.full_name);
        if (restPersonalInfo.public_slug) {
            const candidate = String(restPersonalInfo.public_slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
            if (isValidSlug(candidate)) {
                // Check if candidate is already taken
                const { data: existingSlug } = await supabase.from('portfolios').select('id').eq('public_slug', candidate);
                if (!existingSlug || existingSlug.length === 0) {
                    publicSlug = candidate;
                }
            }
        }

        const cleanedPersonalInfo = buildSafePortfolioObject({
            ...restPersonalInfo,
            public_slug: publicSlug
        }, finalTemplateId, userId);

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

        let themeSettings = personalInfo.theme_settings || {};
        if (!personalInfo.theme_settings && personalInfo.theme_mode) {
            try {
                themeSettings = typeof personalInfo.theme_mode === 'string'
                    ? JSON.parse(personalInfo.theme_mode)
                    : personalInfo.theme_mode;
            } catch (e) {
                themeSettings = {};
            }
        }
        const sectionVisibility = personalInfo.section_visibility || personalInfo.optional_sections || {};

        // 3. Frontend format me return karo
        res.status(200).json({
            success: true,
            data: {
                personalInfo: {
                    ...personalInfo,
                    theme_settings: themeSettings,
                    section_visibility: sectionVisibility,
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
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId || req.headers['user-id'];

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
        if (existing.user_id && existing.user_id !== userId) {
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

            const safePersonalInfo = buildSafePortfolioObject(personalInfo, finalTemplateId, userId);

            if (personalInfo.public_slug) {
                const candidate = String(personalInfo.public_slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
                if (isValidSlug(candidate)) {
                    const { data: conflict } = await supabase.from('portfolios').select('id').eq('public_slug', candidate).neq('id', id);
                    if (!conflict || conflict.length === 0) {
                        safePersonalInfo.public_slug = candidate;
                    }
                }
            }

            console.log(`[Update Portfolio] id=${id} | Updating personalInfo with keys:`, Object.keys(safePersonalInfo));

            // FIX 1: added .select('id') so we can detect "0 rows updated" (RLS / wrong key)
            const { data: updatedRows, error: updateError } = await supabase
                .from('portfolios')
                .update(safePersonalInfo)
                .eq('id', id)
                .select('id');

            if (updateError) {
                console.error('[Update Portfolio] personalInfo update failed:', updateError);
                return res.status(400).json({
                    success: false,
                    message: `Personal info update nahi hua: ${updateError.message}`
                });
            }

            // FIX 1: Supabase reports a write blocked by RLS as success with no rows
            if (!updatedRows || updatedRows.length === 0) {
                console.error('[Update Portfolio] personalInfo update affected 0 rows (RLS policy / anon key?)');
                return res.status(500).json({
                    success: false,
                    message: "Portfolio update nahi hua: koi row update nahi hui. Supabase RLS ya service-role key check karo."
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

        // FIX 2: if any delete failed, stop here instead of inserting on top of the old rows
        if (deleteResults.some(r => r.status === 'rejected' || r.value?.error)) {
            return res.status(500).json({
                success: false,
                message: "Purane related records delete nahi hue, isliye update rok diya gaya. Server logs check karo."
            });
        }
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
                        if (r.error) {
                            console.error('[Update Portfolio] tech_stacks insert error:', r.error.message);
                            // FIX 3: throw so the catch block returns a 500 instead of a fake success
                            throw new Error(`tech_stacks insert error: ${r.error.message}`);
                        }
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
                        if (r.error) {
                            console.error('[Update Portfolio] projects insert error:', r.error.message);
                            // FIX 3: throw so the catch block returns a 500 instead of a fake success
                            throw new Error(`projects insert error: ${r.error.message}`);
                        }
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
                        if (r.error) {
                            console.error('[Update Portfolio] experiences insert error:', r.error.message);
                            // FIX 3: throw so the catch block returns a 500 instead of a fake success
                            throw new Error(`experiences insert error: ${r.error.message}`);
                        }
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
                        if (r.error) {
                            console.error('[Update Portfolio] certifications insert error:', r.error.message);
                            // FIX 3: throw so the catch block returns a 500 instead of a fake success
                            throw new Error(`certifications insert error: ${r.error.message}`);
                        }
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

/* ---------------- GET PUBLIC PORTFOLIO BY SLUG (No Auth) ---------------- */
export const getPublicPortfolio = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Portfolio slug is required."
            });
        }

        // 1. Find portfolio by slug OR custom_domain AND check it's public
        let { data: personalInfo, error: portfolioError } = await supabase
            .from('portfolios')
            .select('*')
            .or(`public_slug.eq.${slug},custom_domain.eq.${slug}`)
            .eq('is_public', true)
            .single();

        if (portfolioError || !personalInfo) {
            return res.status(404).json({
                success: false,
                message: "Portfolio not found or is not public."
            });
        }

        // Check Link Expiration
        if (personalInfo.link_expires_at) {
            const expTime = new Date(personalInfo.link_expires_at).getTime();
            if (Date.now() > expTime) {
                return res.status(410).json({
                    success: false,
                    isExpired: true,
                    message: "This private portfolio link has expired."
                });
            }
        }

        // Check Password Protection
        const providedPasscode = req.headers['x-portfolio-passcode'] || req.query.passcode;
        if (personalInfo.is_password_protected && personalInfo.access_passcode) {
            if (!providedPasscode || String(providedPasscode).trim() !== String(personalInfo.access_passcode).trim()) {
                return res.status(200).json({
                    success: false,
                    isProtected: true,
                    message: "Passcode required to view this portfolio."
                });
            }
        }

        const portfolioId = personalInfo.id;

        // 2. Increment view count (fire-and-forget, don't block response)
        supabase
            .from('portfolios')
            .update({ view_count: (personalInfo.view_count || 0) + 1 })
            .eq('id', portfolioId)
            .then(({ error }) => {
                if (error) console.error('[View Count] Increment failed:', error.message);
            });

        // 3. Fetch all related data in parallel
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

        const resolvedTemplate = personalInfo.template_id || 'template1';

        // 4. Return full portfolio data
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
        console.error("Error fetching public portfolio:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the public portfolio.",
            error: error.message
        });
    }
};

/* ---------------- TOGGLE PUBLIC STATUS ---------------- */
export const togglePublicStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

        if (!id) {
            return res.status(400).json({ success: false, message: "Portfolio ID is required." });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

        // 1. Verify ownership
        const { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, user_id, is_public, public_slug, full_name')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ success: false, message: "Portfolio not found." });
        }
        if (existing.user_id !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to modify this portfolio." });
        }

        // 2. Toggle is_public
        const newPublicStatus = !existing.is_public;
        const updateData = { is_public: newPublicStatus };

        // If making public for the first time and no slug exists, generate one
        if (newPublicStatus && !existing.public_slug) {
            updateData.public_slug = generateSlug(existing.full_name);
        }

        const { data: updated, error: updateError } = await supabase
            .from('portfolios')
            .update(updateData)
            .eq('id', id)
            .select('is_public, public_slug, view_count')
            .single();

        if (updateError) {
            console.error('[Toggle Public] Update failed:', updateError);
            return res.status(400).json({
                success: false,
                message: `Failed to update public status: ${updateError.message}`
            });
        }

        console.log(`[Toggle Public] Portfolio ${id} is now ${newPublicStatus ? 'PUBLIC' : 'PRIVATE'}`);

        res.status(200).json({
            success: true,
            message: newPublicStatus ? "Portfolio is now public!" : "Portfolio is now private.",
            data: {
                is_public: updated.is_public,
                public_slug: updated.public_slug,
                view_count: updated.view_count
            }
        });

    } catch (error) {
        console.error("Toggle public status error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while toggling public status.",
            error: error.message
        });
    }
};

/* ---------------- CHECK SLUG AVAILABILITY ---------------- */
export const checkSlugAvailability = async (req, res) => {
    try {
        const { slug } = req.params;
        const { currentPortfolioId } = req.query;

        if (!slug) {
            return res.status(400).json({
                success: false,
                available: false,
                message: "Slug parameter is required."
            });
        }

        const normalizedSlug = String(slug).toLowerCase().trim();

        // 1. Format validation
        if (!isValidSlug(normalizedSlug)) {
            return res.status(400).json({
                success: false,
                available: false,
                message: "Invalid slug format. Use 3-40 lowercase letters, numbers, and hyphens (e.g. 'john-doe')."
            });
        }

        // 2. Query Supabase
        let query = supabase
            .from('portfolios')
            .select('id')
            .eq('public_slug', normalizedSlug);

        if (currentPortfolioId) {
            query = query.neq('id', currentPortfolioId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Check Slug] Supabase query error:', error);
            return res.status(500).json({
                success: false,
                available: false,
                message: "Error checking slug availability."
            });
        }

        const isTaken = data && data.length > 0;

        return res.status(200).json({
            success: true,
            available: !isTaken,
            slug: normalizedSlug,
            message: isTaken ? "Link is already taken. Please choose another one." : "Link is available!"
        });

    } catch (error) {
        console.error("Check slug error:", error);
        return res.status(500).json({
            success: false,
            available: false,
            message: "Server error while checking slug availability.",
            error: error.message
        });
    }
};

/* ---------------- UPDATE CUSTOM SLUG ---------------- */
export const updateCustomSlug = async (req, res) => {
    try {
        const { id } = req.params;
        const { slug } = req.body;
        const userId = req.user?.sub || req.user?.id || req.user?._id || req.user?.userId;

        if (!id) {
            return res.status(400).json({ success: false, message: "Portfolio ID is required." });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        if (!slug) {
            return res.status(400).json({ success: false, message: "Custom slug is required." });
        }

        const normalizedSlug = String(slug)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        if (!isValidSlug(normalizedSlug)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slug format. Must be 3-40 characters using lowercase letters, numbers, and hyphens."
            });
        }

        // 1. Verify portfolio ownership
        const { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, user_id, public_slug')
            .eq('id', id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({ success: false, message: "Portfolio not found." });
        }
        if (existing.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to modify this portfolio." });
        }

        // 2. Check if slug is taken by another portfolio
        const { data: conflict, error: conflictError } = await supabase
            .from('portfolios')
            .select('id')
            .eq('public_slug', normalizedSlug)
            .neq('id', id);

        if (conflictError) {
            return res.status(500).json({ success: false, message: "Failed to verify slug availability." });
        }

        if (conflict && conflict.length > 0) {
            return res.status(409).json({ success: false, message: `The link '/p/${normalizedSlug}' is already taken by another portfolio.` });
        }

        // 3. Update public_slug in DB
        const { data: updated, error: updateError } = await supabase
            .from('portfolios')
            .update({ public_slug: normalizedSlug })
            .eq('id', id)
            .select('id, public_slug, is_public')
            .single();

        if (updateError) {
            console.error('[Update Custom Slug] Error:', updateError);
            return res.status(400).json({ success: false, message: `Failed to update link: ${updateError.message}` });
        }

        return res.status(200).json({
            success: true,
            message: "Personalized portfolio link updated successfully!",
            data: updated
        });

    } catch (error) {
        console.error("Update custom slug error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating custom link.",
            error: error.message
        });
    }
};

/* ---------------- VERIFY PUBLIC PASSCODE ---------------- */
export const verifyPublicPasscode = async (req, res) => {
    try {
        const { slug } = req.params;
        const { passcode } = req.body;

        if (!slug || !passcode) {
            return res.status(400).json({ success: false, message: "Slug and passcode are required." });
        }

        const { data: personalInfo, error } = await supabase
            .from('portfolios')
            .select('*')
            .or(`public_slug.eq.${slug},custom_domain.eq.${slug}`)
            .eq('is_public', true)
            .single();

        if (error || !personalInfo) {
            return res.status(404).json({ success: false, message: "Portfolio not found." });
        }

        if (personalInfo.link_expires_at && Date.now() > new Date(personalInfo.link_expires_at).getTime()) {
            return res.status(410).json({ success: false, isExpired: true, message: "This private link has expired." });
        }

        if (String(personalInfo.access_passcode).trim() !== String(passcode).trim()) {
            return res.status(401).json({ success: false, message: "Incorrect passcode. Please try again." });
        }

        const [
            { data: techStacks },
            { data: projects },
            { data: experiences },
            { data: certifications }
        ] = await Promise.all([
            supabase.from('tech_stacks').select('*').eq('portfolio_id', personalInfo.id),
            supabase.from('projects').select('*').eq('portfolio_id', personalInfo.id),
            supabase.from('experiences').select('*').eq('portfolio_id', personalInfo.id),
            supabase.from('certifications').select('*').eq('portfolio_id', personalInfo.id)
        ]);

        const resolvedTemplate = personalInfo.template_id || 'template1';

        return res.status(200).json({
            success: true,
            data: {
                personalInfo: { ...personalInfo, templateId: resolvedTemplate, template_id: resolvedTemplate },
                techStacks: techStacks || [],
                projects: projects || [],
                experiences: experiences || [],
                certifications: certifications || [],
                templateId: resolvedTemplate,
                template_id: resolvedTemplate
            }
        });
    } catch (err) {
        console.error("Verify passcode error:", err);
        return res.status(500).json({ success: false, message: "Server error while verifying passcode." });
    }
};

/* ---------------- VERSION HISTORY CONTROLLERS ---------------- */
export const savePortfolioVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const { versionName } = req.body;
        const userId = req.user?.sub || req.user?.id;

        if (!id || !versionName) {
            return res.status(400).json({ success: false, message: "Portfolio ID and version name are required." });
        }

        // Fetch full portfolio snapshot
        const { data: personalInfo } = await supabase.from('portfolios').select('*').eq('id', id).single();
        if (!personalInfo || personalInfo.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

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

        const snapshotData = {
            personalInfo,
            techStacks: techStacks || [],
            projects: projects || [],
            experiences: experiences || [],
            certifications: certifications || []
        };

        const { data: ver, error } = await supabase.from('portfolio_versions').insert([{
            portfolio_id: id,
            version_name: versionName,
            snapshot_data: snapshotData
        }]).select().single();

        if (error) throw error;

        return res.status(201).json({ success: true, message: "Version snapshot saved.", data: ver });
    } catch (err) {
        console.error("Save version error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getPortfolioVersions = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.sub || req.user?.id;

        const { data: portfolio } = await supabase.from('portfolios').select('user_id').eq('id', id).single();
        if (!portfolio || portfolio.user_id !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const { data: versions, error } = await supabase
            .from('portfolio_versions')
            .select('id, version_name, created_at')
            .eq('portfolio_id', id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json({ success: true, data: versions || [] });
    } catch (err) {
        console.error("Get versions error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const restorePortfolioVersion = async (req, res) => {
    try {
        const { id, versionId } = req.params;
        const userId = req.user?.sub || req.user?.id;

        const { data: ver, error } = await supabase
            .from('portfolio_versions')
            .select('*')
            .eq('id', versionId)
            .eq('portfolio_id', id)
            .single();

        if (error || !ver) {
            return res.status(404).json({ success: false, message: "Version snapshot not found." });
        }

        const snapshot = ver.snapshot_data;
        if (!snapshot || !snapshot.personalInfo) {
            return res.status(400).json({ success: false, message: "Invalid snapshot data." });
        }

        // Re-use update portfolio logic
        req.body = snapshot;
        return updatePortfolio(req, res);
    } catch (err) {
        console.error("Restore version error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

/* ---------------- DYNAMIC OPEN GRAPH (OG) IMAGE GENERATOR ---------------- */
export const generateOgImage = async (req, res) => {
    try {
        const { identifier } = req.params;
        if (!identifier) {
            return res.status(400).send('Missing identifier');
        }

        // Query by ID or public slug
        let query = supabase.from('portfolios').select('*');
        if (identifier.includes('-')) {
            query = query.eq('public_slug', identifier);
        } else {
            query = query.eq('id', identifier);
        }

        const { data, error } = await query.single();
        const p = data || {};

        const name = p.full_name || 'Developer Profile';
        const title = p.main_title || 'Software Engineer';
        const template = (p.template_id || 'Template 1').toUpperCase();
        const college = p.college_name || 'Computer Science';

        // Escape XML characters for safe SVG rendering
        const escapeXml = (unsafe) => String(unsafe || '').replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });

        const safeName = escapeXml(name);
        const safeTitle = escapeXml(title);
        const safeTemplate = escapeXml(template);
        const safeCollege = escapeXml(college);

        const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#09090b"/>
  <circle cx="1000" cy="150" r="300" fill="#8b5cf6" fill-opacity="0.25" filter="blur(100px)"/>
  <circle cx="200" cy="500" r="350" fill="#ec4899" fill-opacity="0.2" filter="blur(120px)"/>
  
  <!-- Outer Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="32" stroke="white" stroke-opacity="0.15" stroke-width="2" fill="none"/>
  
  <!-- Badge -->
  <rect x="80" y="80" width="220" height="40" rx="20" fill="white" fill-opacity="0.08" stroke="white" stroke-opacity="0.15"/>
  <text x="190" y="105" fill="#f472b6" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="2">OFFICIAL PORTFOLIO</text>
  
  <!-- Title & Name -->
  <text x="80" y="240" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">${safeName}</text>
  <text x="80" y="310" fill="#c084fc" font-family="Inter, sans-serif" font-size="32" font-weight="700">${safeTitle}</text>
  
  <text x="80" y="365" fill="#a1a1aa" font-family="Inter, sans-serif" font-size="20">${safeCollege}</text>
  
  <!-- Template Pill -->
  <rect x="80" y="450" width="180" height="44" rx="14" fill="#8b5cf6" fill-opacity="0.2" stroke="#8b5cf6" stroke-opacity="0.4"/>
  <text x="170" y="477" fill="#e9d5ff" font-family="Inter, sans-serif" font-size="14" font-weight="700" text-anchor="middle">${safeTemplate}</text>
  
  <!-- Footer Brand -->
  <text x="1120" y="540" fill="#ffffff" fill-opacity="0.4" font-family="Space Grotesk, sans-serif" font-size="20" font-weight="900" text-anchor="end">PORTFOLIO.IO</text>
</svg>
        `.trim();

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(svg);
    } catch (err) {
        console.error("Generate OG image error:", err);
        return res.status(500).send("Error generating OG image");
    }
};



