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

        return () => subscription.unsubscribe();
    }, []);

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
        if (week <= 12) return 0;
        if (week >= 28) return 100;
        return ((week - 12) / (28 - 12)) * 100;
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
                .order('date', { ascending: false });
            if (error) { console.error(error); return []; }
            return data;
        },
        addMedicalRecord: async (record) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { error } = await supabase.from('medical_records').insert([{ ...record, user_id: user.id }]);
            if (error) console.error(error);
        },
        async deleteMedicalRecord(id) {
            const { error } = await supabase.from('medical_records').delete().eq('id', id);
            if (error) console.error(error);
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
