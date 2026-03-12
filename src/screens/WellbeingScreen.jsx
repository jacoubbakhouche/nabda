import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Heart,
    Sparkles,
    Users,
    Gamepad2,
    BookOpen,
    Palette,
    Flower2,
    Search,
    Star
} from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function WellbeingScreen({ onBack }) {
    const {
        getBabyNames,
        getPostLikes,
        togglePostLike,
        getPostComments,
        addPostComment,
        suggestBabyNames
    } = usePregnancy();
    const [names, setNames] = useState([]);
    const [activeTab, setActiveTab] = useState('names'); // names, games, relationships, selfcare
    const [nameFilter, setNameFilter] = useState('all'); // all, boy, girl, twin
    const [searchQuery, setSearchQuery] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [aiCategory, setAiCategory] = useState('عربي'); // عربي, أجنبي, شرقي
    const [showAiPanel, setShowAiPanel] = useState(false);

    useEffect(() => {
        loadNames();
    }, []);

    const loadNames = async () => {
        setIsLoading(true);
        const data = await getBabyNames();
        setNames(data);
        setIsLoading(false);
    };

    const handleToggleFav = async (id, isFav) => {
        const newStatus = !isFav;
        setNames(names.map(n => n.id === id ? { ...n, is_favorite: newStatus } : n));
        await toggleFavoriteName(id, newStatus);
    };

    const filteredNames = names.filter(n => {
        const matchesGender = nameFilter === 'all' || n.gender === nameFilter;
        const matchesSearch = n.name.includes(searchQuery) || n.meaning.includes(searchQuery);
        return matchesGender && matchesSearch;
    });

    const handleAiSuggest = async () => {
        setIsAILoading(true);
        // Map current nameFilter to gender for AI
        const gender = nameFilter === 'boy' ? 'boy' : nameFilter === 'girl' ? 'girl' : 'mixed';
        const suggestedNames = await suggestBabyNames(aiCategory, gender);
        if (suggestedNames && suggestedNames.length > 0) {
            // Prepend new names with unique IDs to the current list
            const newNames = suggestedNames.map((n, i) => ({
                id: `ai-${Date.now()}-${i}`,
                ...n,
                is_favorite: false
            }));
            setNames([...newNames, ...names]);
            setShowAiPanel(false);
        }
        setIsAILoading(false);
    };

    const renderNames = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="ai-suggest-banner" onClick={() => setShowAiPanel(!showAiPanel)}>
                <div className="flex-row align-center" style={{ gap: '12px' }}>
                    <div className="ai-icon-pulse">
                        <Sparkles size={20} color="#FFF" />
                    </div>
                    <div className="flex-col">
                        <span className="ai-title">اختاري بالذكاء الاصطناعي</span>
                        <span className="ai-desc">دعينا نقترح لكِ أسماءً مميزة حسب ذوقكِ</span>
                    </div>
                </div>
                <Star size={18} color="rgba(255,255,255,0.7)" />
            </div>

            {showAiPanel && (
                <div className="ai-panel tab-content-fade-in">
                    <span className="panel-label">ما هو نوع الأسماء المفضل لديكِ؟</span>
                    <div className="ai-options">
                        {['عربي', 'أجنبي', 'شرقي'].map(cat => (
                            <button
                                key={cat}
                                className={`ai-option ${aiCategory === cat ? 'active' : ''}`}
                                onClick={() => setAiCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        className="ai-generate-btn"
                        onClick={handleAiSuggest}
                        disabled={isAILoading}
                    >
                        {isAILoading ? 'جاري التوليد...' : 'اقترحي لي أسماء'}
                    </button>
                </div>
            )}

            <div className="search-bar">
                <Search size={18} color="#999" />
                <input
                    type="text"
                    placeholder="ابحثي عن اسم أو معنى..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="gender-filters">
                <button className={`filter-chip ${nameFilter === 'all' ? 'active' : ''}`} onClick={() => setNameFilter('all')}>الكل</button>
                <button className={`filter-chip ${nameFilter === 'girl' ? 'active' : ''}`} onClick={() => setNameFilter('girl')}>بنات</button>
                <button className={`filter-chip ${nameFilter === 'boy' ? 'active' : ''}`} onClick={() => setNameFilter('boy')}>أولاد</button>
                <button className={`filter-chip ${nameFilter === 'twin' ? 'active' : ''}`} onClick={() => setNameFilter('twin')}>تواتم</button>
            </div>

            <div className="names-grid">
                {isLoading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="name-card skeleton-card">
                                <div className="flex-row justify-between align-center" style={{ marginBottom: '8px' }}>
                                    <div className="skeleton-text skeleton" style={{ width: '40px', height: '14px', borderRadius: '6px', margin: 0 }}></div>
                                    <div className="skeleton-avatar skeleton" style={{ width: '18px', height: '18px' }}></div>
                                </div>
                                <div className="skeleton-text skeleton" style={{ width: '60%', height: '24px', margin: '8px 0 12px 0' }}></div>
                                <div className="flex-col" style={{ gap: '4px' }}>
                                    <div className="skeleton-text skeleton" style={{ width: '100%', margin: 0 }}></div>
                                    <div className="skeleton-text skeleton" style={{ width: '80%', margin: 0 }}></div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    filteredNames.map(n => (
                        <div key={n.id} className="name-card">
                            <div className="flex-row justify-between align-center">
                                <span className={`gender-tag ${n.gender}`}>{n.gender === 'girl' ? 'بنت' : n.gender === 'boy' ? 'ولد' : 'توأم'}</span>
                                <button onClick={() => handleToggleFav(n.id, n.is_favorite)} className="fav-btn">
                                    <Heart size={18} fill={n.is_favorite ? "var(--token-purple-pill)" : "none"} color={n.is_favorite ? "var(--token-purple-pill)" : "#CCC"} />
                                </button>
                            </div>
                            <h3 className="baby-name">{n.name}</h3>
                            <p className="name-meaning">{n.meaning}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderGames = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="game-banner puzzle">
                <Gamepad2 size={32} color="#FFF" />
                <div className="flex-col">
                    <span className="game-title">لعبة التركيب (Puzzle)</span>
                    <span className="game-desc">ركبي صورة طفلك المستقبلي بهدوء</span>
                </div>
                <button className="play-btn-small">العب الآن</button>
            </div>
            <div className="game-banner luck">
                <Sparkles size={32} color="#FFF" />
                <div className="flex-col">
                    <span className="game-title">صندوق الحظ</span>
                    <span className="game-desc">افتحي الصندوق لتحصلي على رسالة ملهمة</span>
                </div>
                <button className="play-btn-small">افتحي</button>
            </div>
        </div>
    );

    return (
        <div className="wellbeing-container flex-col">
            <Header />
            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">رفاهية</h2>
            </div>

            <div className="wellbeing-tabs">
                <button className={`w-tab ${activeTab === 'names' ? 'active' : ''}`} onClick={() => setActiveTab('names')}>
                    <BabyIcon size={18} />
                    <span>الأسماء</span>
                </button>
                <button className={`w-tab ${activeTab === 'games' ? 'active' : ''}`} onClick={() => setActiveTab('games')}>
                    <Gamepad2 size={18} />
                    <span>ألعاب</span>
                </button>
                <button className={`w-tab ${activeTab === 'selfcare' ? 'active' : ''}`} onClick={() => setActiveTab('selfcare')}>
                    <Flower2 size={18} />
                    <span>عناية</span>
                </button>
            </div>

            <div className="wellbeing-content">
                {activeTab === 'names' && renderNames()}
                {activeTab === 'games' && renderGames()}
                {activeTab === 'selfcare' && (
                    <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
                        <div className="info-card-medical">
                            <h3 className="card-title-med"><Flower2 size={18} /> روتين العناية بالبشرة</h3>
                            <p className="med-hint">استخدمي منتجات طبيعية وخالية من الريتينول أثناء الحمل للحفاظ على توهجك بأمان.</p>
                        </div>
                        <div className="info-card-medical">
                            <h3 className="card-title-med"><Palette size={18} /> تزيين غرفة البيبي</h3>
                            <p className="med-hint">الألوان الهادئة مثل الباستيل تساعد على استرخاء طفلك ونومه بعمق.</p>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .wellbeing-container { padding-bottom: 40px; }
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }

                .wellbeing-tabs {
                    display: flex; gap: 8px; overflow-x: auto;
                    margin: 20px -20px; padding: 10px 20px;
                    scrollbar-width: none;
                }
                .wellbeing-tabs::-webkit-scrollbar { display: none; }
                .w-tab {
                    padding: 12px 20px; border-radius: 20px;
                    background-color: var(--bg-surface); border: 1px solid var(--border-light);
                    display: flex; align-items: center; gap: 8px;
                    white-space: nowrap; font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s;
                }
                .w-tab.active {
                    background-color: var(--token-purple-pill); color: #FFF; border-color: var(--token-purple-pill);
                }

                .search-bar {
                    display: flex; align-items: center; gap: 10px;
                    background: #FFF; padding: 12px 16px; border-radius: 16px;
                    border: 1px solid var(--border-light);
                }
                .search-bar input { border: none; flex: 1; outline: none; font-size: 14px; }

                .gender-filters { display: flex; gap: 8px; }
                .filter-chip {
                    padding: 8px 16px; border-radius: 12px;
                    background: #F3F4F6; border: none; font-size: 13px; font-weight: 600; cursor: pointer;
                }
                .filter-chip.active { background: var(--token-purple-pill); color: #FFF; }

                .names-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .name-card {
                    background: #FFF; padding: 16px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                }
                .gender-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
                .gender-tag.girl { background: #FCE7F3; color: #BE185D; }
                .gender-tag.boy { background: #DBEAFE; color: #1E40AF; }
                .gender-tag.twin { background: #F3E8FF; color: #6B21A8; }
                .gender-tag.mixed { background: #F3E8FF; color: #6B21A8; }
                .baby-name { font-size: 18px; font-weight: 700; margin: 8px 0 4px 0; }
                .name-meaning { font-size: 11px; color: var(--text-muted); line-height: 1.4; }
                .fav-btn { background: none; border: none; cursor: pointer; padding: 0; }

                /* AI Suggestion Styles */
                .ai-suggest-banner {
                    background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%);
                    padding: 20px; border-radius: 24px; color: #FFF;
                    display: flex; justify-content: space-between; align-items: center;
                    cursor: pointer; transition: transform 0.2s;
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.25);
                }
                .ai-suggest-banner:active { transform: scale(0.98); }
                .ai-icon-pulse {
                    width: 40px; height: 40px; border-radius: 14px;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex; justify-content: center; align-items: center;
                }
                .ai-title { font-size: 16px; font-weight: 700; }
                .ai-desc { font-size: 11px; opacity: 0.9; }

                .ai-panel {
                    background: #FFF; border: 1px solid var(--border-light);
                    padding: 20px; border-radius: 24px; display: flex; flex-direction: column; gap: 16px;
                }
                .panel-label { font-size: 14px; font-weight: 700; color: #4B5563; }
                .ai-options { display: flex; gap: 10px; }
                .ai-option {
                    flex: 1; padding: 12px; border-radius: 12px; border: 1px solid #E5E7EB;
                    background: #F9FAFB; font-weight: 600; cursor: pointer; transition: all 0.2s;
                }
                .ai-option.active {
                    background: var(--token-purple-pill); color: #FFF; border-color: var(--token-purple-pill);
                }
                .ai-generate-btn {
                    background: var(--token-purple-pill); color: #FFF; border: none;
                    padding: 14px; border-radius: 16px; font-weight: 700; cursor: pointer;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
                }
            `}</style>
        </div>
    );
}

// Minimal placeholder icons
const BabyIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M4 19c0 1 1 2 2 2h12c1 0 2-1 2-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4Z" /><path d="M12 13c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5Z" />
    </svg>
);
