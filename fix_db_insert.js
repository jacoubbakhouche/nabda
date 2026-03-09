import fs from 'fs';

let ctxPath = './src/context/PregnancyContext.jsx';
let ctxContent = fs.readFileSync(ctxPath, 'utf8');

// Replace uploadMedicalFile
ctxContent = ctxContent.replace(
/uploadMedicalFile:\s*async\s*\(file,\s*path\)\s*=>\s*\{[\s\S]*?return\s+data\.publicUrl;\s*\}/,
`uploadMedicalFile: async (file, path) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            const fileExt = file.name.split('.').pop();
            const fileName = \`\${Math.random()}.\${fileExt}\`;
            const filePath = \`\${user.id}/\${path}/\${fileName}\`;
            const { error: uploadError } = await supabase.storage.from('medical_files').upload(filePath, file);
            if (uploadError) {
                console.error('Upload Error:', uploadError);
                return null;
            }
            const { data } = supabase.storage.from('medical_files').getPublicUrl(filePath);
            return {
                url: data.publicUrl,
                path: filePath,
                name: file.name,
                type: file.type,
                size: file.size
            };
        }`
);

// Replace addMedicalRecord
ctxContent = ctxContent.replace(
/addMedicalRecord:\s*async\s*\(record\)\s*=>\s*\{[\s\S]*?if\s*\(error\)\s*console\.error\("Error adding medical record:",\s*error\);\s*\}/,
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
                file_url: record.fileInfo ? record.fileInfo.url : (record.file_url || null)
            };
            
            const { data: insertedRecords, error } = await supabase.from('medical_records').insert([dbRecord]).select();
            if (error) {
                console.error("Error adding medical record:", error);
                return;
            }

            // Also insert into medical_files DB table if file exists
            if (record.fileInfo && insertedRecords && insertedRecords[0]) {
                const newRecordId = insertedRecords[0].id;
                const dbFile = {
                    user_id: user.id,
                    record_id: newRecordId,
                    file_name: record.fileInfo.name,
                    file_path: record.fileInfo.path,
                    file_type: record.fileInfo.type,
                    file_size: record.fileInfo.size,
                    is_sensitive: true
                };
                const { error: fileError } = await supabase.from('medical_files').insert([dbFile]);
                if (fileError) console.error("Error inserting into medical_files table:", fileError);
            }
        }`
);

fs.writeFileSync(ctxPath, ctxContent);

let screenPath = './src/screens/MedicalRecordsScreen.jsx';
let screenContent = fs.readFileSync(screenPath, 'utf8');

screenContent = screenContent.replace(
/let\s+finalFileUrl\s*=\s*null;[\s\S]*?\}\s*const\s+dataToSave\s*=\s*\{[\s\S]*?file_url:\s*finalFileUrl\s*\};/m,
`let fileInfo = null;
        if (selectedFile) {
            fileInfo = await uploadMedicalFile(selectedFile, newRecord.record_type === 'إيكو' ? 'echography' : 'documents');
        }

        const dataToSave = {
            record_type: newRecord.record_type,
            title: newRecord.title || getTranslatedType(newRecord.record_type),
            date: newRecord.date,
            value: newRecord.value,
            notes: newRecord.notes,
            measurements: newRecord.measurements,
            file_url: fileInfo ? fileInfo.url : null,
            fileInfo: fileInfo
        };`
);

fs.writeFileSync(screenPath, screenContent);
