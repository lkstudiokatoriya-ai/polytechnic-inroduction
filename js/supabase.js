const SUPABASE_URL = "https://kdjouagibqusxdwsebhx.supabase.co";

const SUPABASE_KEY = "sb_publishable_uN83f82g2EOYny5m9ZiQAw_xKaYxAS7";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
console.log("Supabase Connected");
console.log(supabase);
