import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { calculatePregnancyAge, getAdviceIndex, getFetusImageIndex } from '../utils/pregnancyUtils';

const PregnancyContext = createContext();

export const PregnancyProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [userName, setUserName] = useState("ماما");
    const [pregnancyDetails, setPregnancyDetails] = useState({
        lmpDate: null,
        eddDate: null,
        isFirstPregnancy: null,
        previousBirths: 0,
        height: '',
        weight: '',
        medicalConditions: []
    });

    // App view states
    const [currentWeek, setCurrentWeek] = useState(1);
    const [completedWeeks, setCompletedWeeks] = useState(0);
    const [remainingWeeks, setRemainingWeeks] = useState(40);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    const generateWeekDays = () => {
        const today = new Date();
        const currentDay = today.getDay(); // 0 is Sunday
        const days = [];
        const arabicDays = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - currentDay + i);
            days.push({ day: arabicDays[i], date: d.getDate(), isToday: d.getDate() === today.getDate() });
        }
        return days;
    };

    const weekDates = generateWeekDays();
    const currentMonth = new Date().toLocaleDateString('ar-EG', { month: 'long' });

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
            setIsLoading(false);
        });

        // Auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSession(session);
        });

        // Request Notification permission
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        return () => subscription.unsubscribe();
    }, []);

    // Check for upcoming appointments periodically
    useEffect(() => {
        if (!isAuthenticated) return;

        const checkAppointments = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', user.id);

            if (error || !data) return;

            const now = new Date();
            data.forEach(appt => {
                if (appt.date && appt.time) {
                    const apptDateTime = new Date(`${appt.date}T${appt.time}`);
                    // If appointment is within the next 60 minutes
                    const diffMs = apptDateTime - now;
                    const diffMinutes = Math.floor(diffMs / 60000);

                    // Alert exactly at 60 mins before or 30 mins before or 0 mins
                    if (diffMinutes === 60 || diffMinutes === 30 || (diffMinutes <= 0 && diffMinutes > -5)) {
                        let columnName = '';
                        if (diffMinutes === 60) columnName = 'notified_60m';
                        else if (diffMinutes === 30) columnName = 'notified_30m';
                        else columnName = 'notified_0m';

                        // Check if we already alerted for this from the DB
                        if (!appt[columnName]) {
                            // Optimistically mark as true locally to avoid double triggers while DB updates
                            appt[columnName] = true;

                            // Update DB
                            supabase.from('appointments')
                                .update({ [columnName]: true })
                                .eq('id', appt.id)
                                .then();

                            if ('Notification' in window && Notification.permission === 'granted') {
                                new Notification("تذكير بموعد", {
                                    body: `لديك موعد: ${appt.title} ${appt.doctor_name ? `مع د. ${appt.doctor_name}` : ''} ${diffMinutes > 0 ? 'بعد ' + diffMinutes + ' دقيقة' : 'الآن!'}`,
                                    icon: '/icon-512x512.png'
                                });
                            } else {
                                // Fallback
                                alert(`تذكير بموعد: ${appt.title} ${diffMinutes > 0 ? 'بعد ' + diffMinutes + ' دقيقة' : 'الآن!'}`);
                            }
                        }
                    }
                }
            });
        };

        // Check initially and then every minute
        checkAppointments();
        const intervalId = setInterval(checkAppointments, 60000);

        return () => clearInterval(intervalId);
    }, [isAuthenticated]);

    const handleSession = async (session) => {
        if (session && session.user) {
            setIsAuthenticated(true);
            const metadata = session.user.user_metadata || {};

            if (metadata.isOnboarded) {
                // Fetch core data from the 'profiles' table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                const dbLmpDate = profile?.lmp_date;
                const dbEddDate = profile?.due_date;
                const dbName = profile?.name || metadata.name || "ماما";

                setIsOnboarded(true);
                setUserName(dbName);

                setPregnancyDetails({
                    lmpDate: dbLmpDate || metadata.lmpDate || null,
                    eddDate: dbEddDate || metadata.eddDate || null,
                    isFirstPregnancy: metadata.isFirstPregnancy !== undefined ? metadata.isFirstPregnancy : null,
                    previousBirths: metadata.previousBirths || 0,
                    height: metadata.height || '',
                    weight: metadata.weight || '',
                    medicalConditions: metadata.medicalConditions || []
                });

                const lmpToUse = dbLmpDate || metadata.lmpDate;
                if (lmpToUse) {
                    const age = calculatePregnancyAge(lmpToUse);
                    setCompletedWeeks(age.completedWeeks);
                    setCurrentWeek(age.currentWeek);
                    setRemainingWeeks(Math.max(0, 40 - age.completedWeeks));
                }
            } else {
                setIsOnboarded(false);
            }
        } else {
            setIsAuthenticated(false);
            setIsOnboarded(false);
            setUserName("ماما");
            setPregnancyDetails({
                lmpDate: null,
                eddDate: null,
                isFirstPregnancy: null,
                previousBirths: 0,
                height: '',
                weight: '',
                medicalConditions: []
            });
            setCurrentWeek(1);
            setCompletedWeeks(0);
            setRemainingWeeks(40);
        }
    };

    const getTimelinePercentage = (week) => {
        if (week <= 1) return 0;
        if (week >= 40) return 100;
        return ((week - 1) / (40 - 1)) * 100;
    }

    const getDynamicStats = () => {
        const baseHeartRate = 80;
        const basePh = 5.0;
        return {
            heartRate: baseHeartRate + (selectedDay % 10),
            ph: (basePh + (selectedDay % 5) * 0.1).toFixed(1)
        };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const completeOnboarding = async (details) => {
        // Update local state immediately for better UX
        setPregnancyDetails(details);
        if (details.name) setUserName(details.name);
        setIsOnboarded(true);

        let lmpDateIso = null;
        let eddDateIso = null;

        if (details.lmpDate) {
            const lmp = new Date(details.lmpDate);
            lmpDateIso = lmp.toISOString();

            const age = calculatePregnancyAge(details.lmpDate);
            setCompletedWeeks(age.completedWeeks);
            setCurrentWeek(age.currentWeek);
            setRemainingWeeks(Math.max(0, 40 - age.completedWeeks));

            if (details.eddDate) {
                const edd = new Date(details.eddDate);
                eddDateIso = edd.toISOString();
            }
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Upsert basic info into the 'profiles' db table
            await supabase.from('profiles').upsert({
                id: user.id,
                name: details.name || null,
                lmp_date: lmpDateIso,
                due_date: eddDateIso,
                pregnancy_status: 'حامل',
                calculation_method: 'تاريخ الدورة',
                updated_at: new Date().toISOString()
            });

            // Persist rest of the form to User Metadata
            await supabase.auth.updateUser({
                data: {
                    isOnboarded: true,
                    language: details.language,
                    isFirstPregnancy: details.isFirstPregnancy,
                    previousBirths: details.previousBirths,
                    height: details.height,
                    weight: details.weight,
                    medicalConditions: details.medicalConditions,
                    // keep backups in metadata
                    name: details.name,
                    lmpDate: details.lmpDate,
                    eddDate: details.eddDate
                }
            });
        }
    };

    const value = {
        isLoading,
        isAuthenticated,
        isOnboarded,
        logout,
        completeOnboarding,
        userName,
        setUserName: async (newName) => {
            setUserName(newName);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.auth.updateUser({ data: { name: newName } });
                await supabase.from('profiles').update({ name: newName }).eq('id', user.id);
            }
        },
        pregnancyDetails,
        setPregnancyDetails,
        currentWeek,
        setCurrentWeek,
        completedWeeks,
        remainingWeeks,
        selectedDay,
        setSelectedDay,
        weekDates,
        currentMonth,
        getTimelinePercentage,
        dynamicStats: getDynamicStats(),
        fetusIndex: getFetusImageIndex(currentWeek),
        adviceIndex: getAdviceIndex(currentWeek),

        // --- NEW CATEGORY DATA METHODS ---

        // Appointments
        getAppointments: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: true });
            if (error) { console.error(error); return []; }
            return data;
        },
        addAppointment: async (appointment) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('appointments').insert([{ ...appointment, user_id: user.id }]);
            if (error) console.error(error);
        },
        deleteAppointment: async (id) => {
            const { error } = await supabase.from('appointments').delete().eq('id', id);
            if (error) console.error(error);
        },

        // Birth Prep Checklist
        getBirthChecklist: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data, error } = await supabase
                .from('birth_prep_checklist')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            // If empty, initialize with defaults
            if (!error && (!data || data.length === 0)) {
                const defaults = [
                    { item_text: 'هوية وطنية / جواز سفر / الملف الطبي', category: 'وثائق وإداريات', user_id: user.id },
                    { item_text: 'عقد الازدياد / الدفتر العائلي', category: 'وثائق وإداريات', user_id: user.id },
                    { item_text: 'ملابس مريحة وفضفاضة', category: 'حقيبة الأم', user_id: user.id },
                    { item_text: 'مستلزمات النظافة الشخصية', category: 'حقيبة الأم', user_id: user.id },
                    { item_text: 'ملابس المولود (3 أطقم)', category: 'حقيبة المولود', user_id: user.id },
                    { item_text: 'حفاظات ومناديل مبللة للطفل', category: 'حقيبة المولود', user_id: user.id },
                    { item_text: 'شاحن هاتف / كاميرا', category: 'حقيبة الأم', user_id: user.id }
                ];
                const { data: newData } = await supabase.from('birth_prep_checklist').insert(defaults).select();
                return newData || [];
            }
            return data || [];
        },
        toggleChecklistItem: async (id, isCompleted) => {
            const { error } = await supabase
                .from('birth_prep_checklist')
                .update({ is_completed: isCompleted })
                .eq('id', id);
            if (error) console.error(error);
        },

        // Medical Records
        getMedicalRecords: async () => {
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
        },
        addMedicalRecord: async (record) => {
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
        },
        async deleteMedicalRecord(id) {
            const { error } = await supabase.from('medical_records').delete().eq('id', id);
            if (error) console.error(error);
        },
        uploadMedicalFile: async (file, path) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${path}/${fileName}`;
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
        },

        // Wellbeing: Baby Names
        getBabyNames: async () => {
            try {
                const { data, error } = await supabase
                    .from('baby_names')
                    .select('*')
                    .order('name', { ascending: true });

                if (error || !data || data.length === 0) {
                    throw new Error("Table missing or empty");
                }
                return data;
            } catch (err) {
                // Return static fallback list if table doesn't exist
                return [
                    { id: '1', name: 'مريم', meaning: 'السيدة العظيمة', gender: 'girl', is_favorite: false },
                    { id: '2', name: 'عمر', meaning: 'الحياة الطويلة', gender: 'boy', is_favorite: false },
                    { id: '3', name: 'ليان', meaning: 'الرخاء والنعومة', gender: 'girl', is_favorite: false },
                    { id: '4', name: 'يوسف', meaning: 'يزيد وينمو', gender: 'boy', is_favorite: false },
                    { id: '5', name: 'نور', meaning: 'الضياء والسناء', gender: 'girl', is_favorite: false },
                    { id: '6', name: 'زين', meaning: 'الجمال والكمال', gender: 'boy', is_favorite: false },
                    { id: '7', name: 'سارة', meaning: 'الأميرة والمسرة', gender: 'girl', is_favorite: false },
                    { id: '8', name: 'حمزة', meaning: 'الأسد والشدة', gender: 'boy', is_favorite: false }
                ];
            }
        },
        toggleFavoriteName: async (id, isFavorite) => {
            const { error } = await supabase.from('baby_names').update({ is_favorite: isFavorite }).eq('id', id);
            if (error) console.error(error);
        },

        // Stories / Posts
        getPosts: async () => {
            try {
                // First try with join
                const { data, error } = await supabase
                    .from('posts')
                    .select(`
                        id,
                        content,
                        created_at,
                        user_id,
                        profiles (name)
                    `)
                    .order('created_at', { ascending: false });

                if (error) {
                    // Fallback: fetch without join if relationship missing
                    const { data: simpleData, error: simpleError } = await supabase
                        .from('posts')
                        .select('id, content, created_at, user_id')
                        .order('created_at', { ascending: false });

                    if (simpleError) return [];

                    // Fetch names manually
                    const userIds = [...new Set(simpleData.map(p => p.user_id))];
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('id, name')
                        .in('id', userIds);

                    const profileMap = (profileData || []).reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {});

                    return simpleData.map(post => ({
                        id: post.id,
                        author: profileMap[post.user_id] || "ماما",
                        text: post.content,
                        time: new Date(post.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
                    }));
                }

                return data.map(post => ({
                    id: post.id,
                    author: post.profiles?.name || "ماما",
                    text: post.content,
                    time: new Date(post.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })
                }));
            } catch (err) {
                return [];
            }
        },
        addPost: async (content) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('posts').insert([{ content, user_id: user.id }]);
            if (error) console.error("Add Post Error:", error);
        },

        // Post Interactions: Likes
        getPostLikes: async (postId) => {
            const { data, error, count } = await supabase
                .from('likes')
                .select('*', { count: 'exact' })
                .eq('post_id', postId);

            if (error) return { count: 0, isLiked: false };

            const { data: { user } } = await supabase.auth.getUser();
            const isLiked = user ? data.some(l => l.user_id === user.id) : false;

            return { count: count || 0, isLiked };
        },
        togglePostLike: async (postId, isLiked) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (isLiked) {
                await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
            } else {
                await supabase.from('likes').insert([{ post_id: postId, user_id: user.id }]);
            }
        },

        // Post Interactions: Comments
        getPostComments: async (postId) => {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    id,
                    content,
                    created_at,
                    user_id,
                    profiles (name)
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) return [];
            return data.map(c => ({
                id: c.id,
                author: c.profiles?.name || "ماما",
                text: c.content,
                time: new Date(c.created_at).toLocaleDateString('ar-EG')
            }));
        },
        addPostComment: async (postId, content) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('comments').insert([{
                post_id: postId,
                user_id: user.id,
                content
            }]);
            if (error) console.error("Add Comment Error:", error);
        },

        // Journal / Experience
        getJournalEntries: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data, error } = await supabase
                .from('journal_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) {
                // Return empty if table missing instead of crashing
                return [];
            }
            return data;
        },
        addJournalEntry: async (entry) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('journal_entries').insert([{ ...entry, user_id: user.id }]);
            if (error) console.error(error);
        },

        // Postpartum / Baby Care
        getFeedingLogs: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];
            const { data, error } = await supabase
                .from('feeding_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('start_time', { ascending: false });
            if (error) {
                return [];
            }
            return data;
        },
        addFeedingLog: async (log) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('feeding_logs').insert([{ ...log, user_id: user.id }]);
            if (error) console.error(error);
        },

        // AI Analysis (Groq via Supabase Edge Functions)
        invokeAIAnalysis: async (week) => {
            try {
                const { data, error } = await supabase.functions.invoke('get-ai-advice', {
                    body: { week }
                });
                if (error) throw error;
                return data;
            } catch (err) {
                console.error("AI Analysis Error:", err);
                // Fallback structured data if AI fails or function not deployed
                return {
                    fetus: {
                        height: "غير متوفر",
                        weight: "غير متوفر",
                        developments: ["جاري تحميل البيانات..."],
                        nutrition: "تناولي وجبات متوازنة."
                    },
                    mother: {
                        symptoms: [{ title: "تغيرات عامة", status: "طبيعي", manage: "استمري في الراحة." }]
                    }
                };
            }
        },
        analyzeMedicalRecord: async (record) => {
            try {
                const { data, error } = await supabase.functions.invoke('analyze-medical-record', {
                    body: { record }
                });
                if (error) throw error;
                return data.analysis;
            } catch (err) {
                console.error("Medical Record Analysis Error:", err);
                return "عذراً، تعذر تحليل السجل الطبي حالياً. يرجى استشارة طبيبك.";
            }
        },
        suggestBabyNames: async (category, gender) => {
            try {
                const { data, error } = await supabase.functions.invoke('suggest-baby-names', {
                    body: { category, gender }
                });
                if (error) throw error;
                return data.names;
            } catch (err) {
                console.error("Suggest Baby Names Error:", err);
                return [];
            }
        }
    };

    return (
        <PregnancyContext.Provider value={value}>
            {children}
        </PregnancyContext.Provider>
    );
};

export const usePregnancy = () => {
    const context = useContext(PregnancyContext);
    if (!context) {
        throw new Error('usePregnancy must be used within a PregnancyProvider');
    }
    return context;
};
