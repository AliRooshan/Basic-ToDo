
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdryjjgxcfmwveqhkoal.supabase.co';
const supabaseKey = 'sb_publishable_XzzvlcvHBVqWBX-Zjly2wA_vW41kllp';

export const supabase = createClient(supabaseUrl, supabaseKey);
