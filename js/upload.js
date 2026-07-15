// Supabase Project Details
const SUPABASE_URL = "https://kdjouagibqusxdwsebhx.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_uN83f82g2EOYny5m9ZiQAw_xKaYxAS7";

// Create Supabase Client
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("✅ Supabase Connected");
