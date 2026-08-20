import { supabase } from '../config/supabase.js';

// Get all template likes
export const getTemplateLikes = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('template_likes')
            .select('*');

        if (error) {
            // If table doesn't exist yet, just return empty gracefully
            if (error.code === '42P01' || error.code === 'PGRST205') {
                return res.status(200).json({ success: true, likes: [] });
            }
            throw error;
        }

        return res.status(200).json({ success: true, likes: data || [] });
    } catch (err) {
        console.error('Error fetching template likes:', err);
        return res.status(500).json({ success: false, message: 'Failed to fetch likes', error: err.message });
    }
};

// Increment or Decrement like for a template
export const likeTemplate = async (req, res) => {
    try {
        const { templateId } = req.params;
        const { action } = req.body; // 'like' or 'unlike'

        if (!templateId) {
            return res.status(400).json({ success: false, message: 'Template ID is required.' });
        }

        // First, try to get the current likes count
        const { data: existingData, error: fetchError } = await supabase
            .from('template_likes')
            .select('likes_count')
            .eq('template_id', templateId)
            .single();

        let newLikesCount = 1;

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
            // If table doesn't exist, we can't insert. Throw error to be caught by catch block.
            if (fetchError.code === '42P01' || fetchError.code === 'PGRST205') {
                 return res.status(400).json({ success: false, message: 'Table template_likes does not exist. Please run the SQL command in Supabase.' });
            }
            throw fetchError;
        }

        if (existingData) {
            if (action === 'unlike') {
                newLikesCount = Math.max(0, (existingData.likes_count || 0) - 1);
            } else {
                newLikesCount = (existingData.likes_count || 0) + 1;
            }
        }

        // Upsert the new likes count
        const { data, error: upsertError } = await supabase
            .from('template_likes')
            .upsert({ template_id: templateId, likes_count: newLikesCount })
            .select()
            .single();

        if (upsertError) {
            throw upsertError;
        }

        return res.status(200).json({ success: true, likes_count: newLikesCount });
    } catch (err) {
        console.error('Error liking template:', err);
        return res.status(500).json({ success: false, message: 'Failed to like template', error: err.message });
    }
};
