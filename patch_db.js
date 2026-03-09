import fs from 'fs';

const filePath = './src/context/PregnancyContext.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace getMedicalRecords
content = content.replace(
/getMedicalRecords:\s*async\s*\(\)\s*=>\s*\{[\s\S]*?return\s+data;\s*\}/,
`getMedicalRecords: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data, error } = await supabase
                .from('medical_records')
                .select('*')
                .eq('user_id', user.id)
                .order('analysis_date', { ascending: false });
            if (error) { console.error(error); return []; }
            
            // Map DB schema to Frontend Schema
            return data.map(dbRec => ({
                id: dbRec.id,
                title: dbRec.file_name || 'سجل طبي',
                record_type: dbRec.file_type || 'فحص',
                date: dbRec.analysis_date,
                value: dbRec.test_results?.value || '',
                notes: dbRec.summary_text_ar || '',
                measurements: dbRec.test_results?.measurements || {},
                file_url: dbRec.file_url
            }));
        }`
);

// Replace addMedicalRecord
content = content.replace(
/addMedicalRecord:\s*async\s*\(record\)\s*=>\s*\{[\s\S]*?if\s*\(error\)\s*console\.error\(error\);\s*\}/,
`addMedicalRecord: async (record) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            
            // Map Frontend Schema to DB Schema
            const dbRecord = {
                user_id: user.id,
                file_name: record.title || '',
                file_type: record.record_type || 'فحص',
                analysis_date: record.date || null,
                summary_text_ar: record.notes || '',
                test_results: { value: record.value, measurements: record.measurements },
                file_url: record.file_url || null
            };
            
            const { error } = await supabase.from('medical_records').insert([dbRecord]);
            if (error) console.error("Error adding medical record:", error);
        }`
);

fs.writeFileSync(filePath, content);
