import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
    console.log('Testing Supabase Connection & Tables...\\n');
    const tables = [
        'profiles',
        'appointments',
        'medical_records',
        'posts',
        'comments',
        'likes',
        'messages',
        'user_notes'
    ];

    for (const table of tables) {
        console.log(`Checking table: ${table}...`);
        const { data, error } = await supabase.from(table).select('*').limit(1);

        if (error) {
            if (error.code === '42P01') {
                console.error(`❌ Table '${table}' DOES NOT EXIST.`);
            } else {
                console.warn(`⚠️ Table '${table}' exists but returned an error: ${error.message}`);
            }
        } else {
            console.log(`✅ Table '${table}' is ready and connected.`);
        }
    }
}

verifyTables();
