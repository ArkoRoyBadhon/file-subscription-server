import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and public anon key
const supabaseUrl = 'https://hukuhycxdawrdndljnnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1a3VoeWN4ZGF3cmRuZGxqbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2Njg1NzcsImV4cCI6MjA0MDI0NDU3N30.ZYCZst_WCmziAKWowZx60vNFx6egAamPwJ3xpFs1bcs';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
