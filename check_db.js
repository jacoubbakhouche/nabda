import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read from .env
const envPath = path.resolve('.env');
const envFile = fs.readFileSync(envPath, 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: recordsData, error: recordsError } = await supabase.from('medical_records').select('*').limit(1);
  console.log('medical_records columns:', recordsData ? Object.keys(recordsData[0] || {}) : recordsError);

  const { data: filesData, error: filesError } = await supabase.from('medical_files').select('*').limit(1);
  console.log('medical_files columns:', filesData ? Object.keys(filesData[0] || {}) : filesError);
}

check();
