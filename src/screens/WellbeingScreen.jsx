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
    Star,
    Wind,
    Send,
    AlertCircle,
    ShieldCheck,
    Plus,
    Share2,
    X
} from 'lucide-react';

import Header from '../components/Header';
import PuzzleGame from '../components/PuzzleGame';
import LuckyBox from '../components/LuckyBox';
import BreathingExercise from '../components/BreathingExercise';
import { usePregnancy } from '../context/PregnancyContext';

export default function WellbeingScreen({ onBack }) {
    const {
        getBabyNames,
        suggestBabyNames,
        getLuckyBoxContent,
        getBreathingMantra,
        getCareWellnessAdvice,
        addPost,
        currentWeek
    } = usePregnancy();

    const [names, setNames] = useState([]);
    const [activeTab, setActiveTab] = useState('names'); // names, games, relationships, selfcare
    const [nameFilter, setNameFilter] = useState('all'); // all, boy, girl, twin
    const [searchQuery, setSearchQuery] = useState('');
    const [isAILoading, setIsAILoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [aiCategory, setAiCategory] = useState('عربي'); // عربي, أجنبي, شرقي
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [activeGame, setActiveGame] = useState(null); // puzzle, boxes, breathing
    const [showLuckyBox, setShowLuckyBox] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);

    const [careAdvice, setCareAdvice] = useState(null);
    const [selectedCareArea, setSelectedCareArea] = useState(null);
    const [isCareLoading, setIsCareLoading] = useState(false);
    const [followUpInput, setFollowUpInput] = useState('');
    const [conversation, setConversation] = useState([]); // Array of { role: 'user'|'ai', content: any }
    const [showShareModal, setShowShareModal] = useState(false);
    const [nameToShare, setNameToShare] = useState(null);
    const [shareMessage, setShareMessage] = useState('');
    const [isSharing, setIsSharing] = useState(false);


    useEffect(() => {
        loadNames();
    }, []);

    const loadNames = async () => {
        setIsLoading(true);
        const data = await getBabyNames();
        setNames(data);
        setIsLoading(false);
    };

    const handleShareClick = (nameObj) => {
        setNameToShare(nameObj);
        setShareMessage(`ما رأيكم في اسم "${nameObj.name}"؟ 😍\nالمعنى: ${nameObj.meaning}`);
        setShowShareModal(true);
    };

    const handleShareConfirm = async () => {
        if (!shareMessage.trim()) return;
        setIsSharing(true);
        await addPost(shareMessage);
        setIsSharing(false);
        setShowShareModal(false);
    };

    const filteredNames = names.filter(n => {
        const matchesGender = nameFilter === 'all' || n.gender === nameFilter;
        const matchesSearch = n.name.includes(searchQuery) || n.meaning.includes(searchQuery);
        return matchesGender && matchesSearch;
    });

    const handleAiSuggest = async () => {
        setIsAILoading(true);
        const gender = nameFilter === 'boy' ? 'boy' : nameFilter === 'girl' ? 'girl' : 'mixed';
        const suggestedNames = await suggestBabyNames(aiCategory, gender);
        if (suggestedNames && suggestedNames.length > 0) {
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

    const handleGetCareAdvice = async (area, userInput = null) => {
        setIsCareLoading(true);
        if (!userInput) {
            setSelectedCareArea(area);
            setConversation([]); // Clear conversation on new category
        } else {
            setConversation(prev => [...prev, { role: 'user', content: userInput }]);
        }

        const data = await getCareWellnessAdvice(area, userInput);

        if (userInput) {
            setConversation(prev => [...prev, { role: 'ai', content: data }]);
        } else {
            setCareAdvice(data);
        }

        setFollowUpInput('');
        setIsCareLoading(false);
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
                                <button onClick={() => handleShareClick(n)} className="share-btn-round">
                                    <Share2 size={16} color="var(--token-primary-pill)" />
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

    const renderGames = () => {
        if (activeGame === 'puzzle') {
            return <PuzzleGame onBack={() => setActiveGame(null)} />;
        }

        return (
            <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
                <div className="game-banner puzzle-modern" onClick={() => setActiveGame('puzzle')}>
                    <div className="flex-row align-center" style={{ gap: '16px', flex: 1 }}>
                        <div className="game-icon-square" style={{ background: '#FE9EC7' }}>
                            <Gamepad2 size={24} color="#FFF" />
                        </div>
                        <div className="flex-col">
                            <span className="game-title">لعبة التركيب (Puzzle)</span>
                            <span className="game-desc">ركبي صوراً ملهمة بهدوء</span>
                        </div>
                    </div>
                    <button className="pro-play-btn">العب الآن</button>
                </div>

                <div className="game-banner boxes-modern" onClick={() => setShowLuckyBox(true)}>
                    <div className="flex-row align-center" style={{ gap: '16px', flex: 1 }}>
                        <div className="game-icon-square" style={{ background: '#FF8F8F' }}>
                            <Sparkles size={24} color="#FFF" />
                        </div>
                        <div className="flex-col">
                            <span className="game-title">صندوق الحظ</span>
                            <span className="game-desc">رسالة ملهمة لكِ كل يوم</span>
                        </div>
                    </div>
                    <button className="pro-play-btn alt">افتحي</button>
                </div>

                <div className="game-banner breathing-modern" onClick={() => setShowBreathing(true)}>
                    <div className="flex-row align-center" style={{ gap: '16px', flex: 1 }}>
                        <div className="game-icon-square" style={{ background: '#10B981' }}>
                            <Wind size={24} color="#FFF" />
                        </div>
                        <div className="flex-col">
                            <span className="game-title">تمرين التنفس</span>
                            <span className="game-desc">3 دقائق من السكينة</span>
                        </div>
                    </div>
                    <button className="pro-play-btn green">ابدئي</button>
                </div>
            </div>
        );
    };

    const renderSelfCare = () => {
        const careAreas = [
            { id: 'skin', title: 'بشرة نضرة', icon: <Sparkles size={20} />, color: '#FE9EC7', desc: 'روتين آمن للحمل' },
            { id: 'dental', title: 'صحة الأسنان', icon: <Flower2 size={20} />, color: '#FF8F8F', desc: 'نصائح وقائية' },
            { id: 'body', title: 'عناية بالجسم', icon: <Heart size={20} />, color: '#FB7185', desc: 'مرونة وراحة' },
            { id: 'nursery', title: 'غرفة البيبي', icon: <Palette size={20} />, color: '#F472B6', desc: 'تصميم بالذكاء' }
        ];

        const activeArea = careAreas.find(a => a.id === selectedCareArea);

        return (
            <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
                <div className="care-grid">
                    {careAreas.map(area => (
                        <div
                            key={area.id}
                            className={`care-area-card ${selectedCareArea === area.id ? 'active' : ''}`}
                            onClick={() => handleGetCareAdvice(area.id)}
                        >
                            <div className="care-icon-wrap" style={{ background: area.color }}>
                                {area.icon}
                            </div>
                            <span className="care-area-title">{area.title}</span>
                            <span className="care-area-desc">{area.desc}</span>
                        </div>
                    ))}
                </div>

                {selectedCareArea && (
                    <div className="fullscreen-chat-overlay tab-content-fade-in">
                        <div className="chat-header-full flex-row align-center">
                            <button className="chat-close-btn" onClick={() => setSelectedCareArea(null)}>
                                <ChevronLeft size={24} />
                            </button>
                            <div className="flex-row align-center" style={{ gap: '10px' }}>
                                <div className="header-icon-mini" style={{ background: activeArea?.color }}>
                                    {activeArea?.icon}
                                </div>
                                <div className="flex-col">
                                    <span className="header-chat-title">{activeArea?.title}</span>
                                    <span className="header-chat-subtitle">المستشار الذكي متصل</span>
                                </div>
                            </div>
                        </div>

                        <div className="chat-messages-container flex-col">
                            {careAdvice && (
                                <div className="care-result-card-full tab-content-fade-in">
                                    {selectedCareArea === 'nursery' ? (
                                        <>
                                            <h3 className="result-title">أفكار لغرفة صغيركِ ✨</h3>
                                            <div className="nursery-ideas">
                                                {careAdvice.ideas?.map((idea, i) => (
                                                    <div key={i} className="nursery-idea-item">
                                                        <div className="flex-row justify-between align-center">
                                                            <span className="idea-theme">{idea.theme}</span>
                                                            <div className="color-dots">
                                                                {idea.colors.split('،').map((c, j) => (
                                                                    <div key={j} className="color-dot" title={c.trim()} style={{ background: c.includes('#') ? c.trim() : '#FCA5A5' }}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <h4 className="idea-title">{idea.title}</h4>
                                                        <p className="idea-furniture">🪑 {idea.furniture}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="result-title">{careAdvice.routine_title} ✨</h3>
                                            <div className="routine-steps">
                                                {careAdvice.steps?.map((step, i) => (
                                                    <div key={i} className="routine-step">
                                                        <div className="step-num">{i + 1}</div>
                                                        <div className="flex-col">
                                                            <span className="step-action">{step.action}</span>
                                                            <span className="step-benefit">{step.benefit}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex-row items-center" style={{ marginTop: '20px', gap: '8px', flexWrap: 'wrap' }}>
                                                {careAdvice.safety_note && (
                                                    <div className="safety-badge">
                                                        <ShieldCheck size={14} /> {careAdvice.safety_note}
                                                    </div>
                                                )}
                                                {careAdvice.expert_tip && (
                                                    <div className="expert-tip-badge">
                                                        <Sparkles size={14} /> {careAdvice.expert_tip}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <button
                                        className="more-ideas-btn"
                                        onClick={() => handleGetCareAdvice(selectedCareArea, "أعطني المزيد من الأفكار المتنوعة والمحترفة من فضلك")}
                                        disabled={isCareLoading}
                                    >
                                        <Plus size={16} /> أفكار إضافية
                                    </button>
                                </div>
                            )}

                            {conversation.map((msg, i) => (
                                <div key={i} className={`chat-bubble-wrap ${msg.role} tab-content-fade-in`}>
                                    {msg.role === 'user' ? (
                                        <div className="user-bubble">
                                            <p>{msg.content}</p>
                                        </div>
                                    ) : (
                                        <div className="ai-bubble-full">
                                            <div className="ai-header flex-row align-center" style={{ gap: '8px', marginBottom: '8px' }}>
                                                <div className="ai-avatar-tiny"><Sparkles size={12} /></div>
                                                <span className="ai-name-tiny">المستشار الذكي</span>
                                            </div>
                                            <p className="ai-main-resp">
                                                {msg.content?.response || msg.content?.error || (msg.content?.ideas ? "إليك بعض الأفكار الرائعة لغرفة طفلك." : "عذراً، لم أتمكن من الحصول على رد مفصل حالياً.")}
                                            </p>

                                            {msg.content?.key_tips && (
                                                <div className="ai-tips-mini flex-col">
                                                    {msg.content.key_tips.map((tip, j) => (
                                                        <div key={j} className="tip-mini-item">✨ {tip}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.content?.suggested_actions && (
                                                <div className="ai-actions-mini flex-col">
                                                    {msg.content.suggested_actions.map((act, j) => (
                                                        <div key={j} className="action-mini-item">{j + 1}. {act}</div>
                                                    ))}
                                                </div>
                                            )}

                                            {msg.content?.safety_warning && (
                                                <div className="safety-badge warning-mini">
                                                    <AlertCircle size={12} /> {msg.content.safety_warning}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isCareLoading && (
                                <div className="ai-typing-indicator flex-row align-center">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            )}
                        </div>

                        <div className="full-chat-input-container">
                            <div className="full-chat-input-wrap">
                                <input
                                    type="text"
                                    placeholder="اسألي المستشار عن روتينكِ..."
                                    value={followUpInput}
                                    onChange={(e) => setFollowUpInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && followUpInput.trim() && handleGetCareAdvice(selectedCareArea, followUpInput)}
                                />
                                <button
                                    className="send-care-btn-full"
                                    onClick={() => followUpInput.trim() && handleGetCareAdvice(selectedCareArea, followUpInput)}
                                    disabled={isCareLoading || !followUpInput.trim()}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!selectedCareArea && (
                    <div className="care-placeholder">
                        <div className="placeholder-icon">🪄</div>
                        <p>اختاري مجالاً لعرض روتين مخصص وبدء نقاش مع المستشار</p>
                    </div>
                )}
            </div>
        );
    };

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
                {activeTab === 'selfcare' && renderSelfCare()}
            </div>

            {showLuckyBox && (
                <LuckyBox
                    week={currentWeek}
                    onGetContent={getLuckyBoxContent}
                    onClose={() => setShowLuckyBox(false)}
                />
            )}

            {showShareModal && (
                <div className="share-modal-overlay tab-content-fade-in">
                    <div className="share-modal-container">
                        <div className="share-modal-header">
                            <h3>مشاركة الاسم مع المجتمعات</h3>
                            <button className="close-share-btn" onClick={() => setShowShareModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="share-modal-content">
                            <p className="share-instruction">شاركي هذا الاسم مع الأمهات الأخريات لمعرفة رأيهن!</p>
                            <div className="share-preview-card">
                                <span className={`gender-tag ${nameToShare?.gender}`}>{nameToShare?.gender === 'girl' ? 'بنت' : nameToShare?.gender === 'boy' ? 'ولد' : 'توأم'}</span>
                                <h4 className="preview-name">{nameToShare?.name}</h4>
                                <p className="preview-meaning">{nameToShare?.meaning}</p>
                            </div>
                            <textarea
                                className="share-textarea"
                                value={shareMessage}
                                onChange={(e) => setShareMessage(e.target.value)}
                                placeholder="اكتبي سؤالك هنا..."
                            ></textarea>
                            <button
                                className="confirm-share-btn"
                                onClick={handleShareConfirm}
                                disabled={isSharing}
                            >
                                {isSharing ? 'جاري النشر...' : 'نشر في المجتمع'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBreathing && (
                <BreathingExercise
                    week={currentWeek}
                    onGetMantra={getBreathingMantra}
                    onClose={() => setShowBreathing(false)}
                />
            )}

            <style>{`
                .wellbeing-container { padding-bottom: 40px; position: relative; min-height: 100vh; }
                .wellbeing-content { padding: 0 20px; }
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }

                .wellbeing-tabs {
                    display: flex; gap: 8px; overflow-x: auto;
                    margin: 20px 0; padding: 10px 20px;
                    scrollbar-width: none;
                }
                .wellbeing-tabs::-webkit-scrollbar { display: none; }
                .w-tab {
                    padding: 12px 20px; border-radius: 20px;
                    background-color: #FFF; border: 1px solid var(--border-light);
                    display: flex; align-items: center; gap: 8px;
                    white-space: nowrap; font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02);
                }
                .w-tab.active {
                    background-color: var(--token-primary-pill); color: #FFF; border-color: var(--token-primary-pill);
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
                .filter-chip.active { background: var(--token-primary-pill); color: #FFF; }

                .names-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .name-card {
                    background: #FFF; padding: 16px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                }
                .gender-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
                .gender-tag.girl { background: #FFF0F5; color: #FE9EC7; }
                .gender-tag.boy { background: #DBEAFE; color: #1E40AF; }
                .gender-tag.twin { background: #F3E8FF; color: #6B21A8; }
                .baby-name { font-size: 18px; font-weight: 700; margin: 8px 0 4px 0; }
                .name-meaning { font-size: 11px; color: var(--text-muted); line-height: 1.4; }

                .ai-suggest-banner {
                    background: linear-gradient(135deg, #FE9EC7 0%, #FF8F8F 100%);
                    padding: 20px; border-radius: 24px; color: #FFF;
                    display: flex; justify-content: space-between; align-items: center;
                    cursor: pointer; transition: transform 0.2s;
                    box-shadow: 0 8px 25px rgba(254, 158, 199, 0.25);
                }
                .ai-panel {
                    background: #FFF; border: 1px solid var(--border-light);
                    padding: 20px; border-radius: 24px; display: flex; flex-direction: column; gap: 16px;
                }
                .ai-generate-btn {
                    background: var(--token-primary-pill); color: #FFF; border: none;
                    padding: 14px; border-radius: 16px; font-weight: 700; cursor: pointer;
                }

                .share-btn-round {
                    width: 32px; height: 32px; border-radius: 50%;
                    border: 1px solid rgba(254,158,199,0.2); background: #FFF;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                    transition: all 0.2s;
                }
                .share-btn-round:hover { background: #FFF0F5; border-color: var(--token-primary-pill); }

                .game-banner {
                    background: #FFF; border: 1px solid var(--border-light);
                    padding: 20px; border-radius: 24px; display: flex; align-items: center; gap: 16px;
                    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .game-banner:hover { transform: translateY(-4px); box-shadow: 0 12px 25px rgba(0,0,0,0.06); border-color: var(--token-primary-pill); }
                .game-icon-square { width: 44px; height: 44px; border-radius: 12px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .game-title { font-size: 15px; font-weight: 800; color: #1F2937; }
                .game-desc { font-size: 12px; color: #6B7280; margin-top: 2px; }

                .pro-play-btn {
                    padding: 8px 18px; border-radius: 12px; border: 2px solid #FE9EC7;
                    background: #FFF; color: #FE9EC7; font-size: 13px; font-weight: 800;
                    cursor: pointer; transition: all 0.2s;
                }
                .pro-play-btn:hover { background: #FE9EC7; color: #FFF; }
                .pro-play-btn.alt { border-color: #FF8F8F; color: #FF8F8F; }
                .pro-play-btn.alt:hover { background: #FF8F8F; color: #FFF; }
                .pro-play-btn.green { border-color: #10B981; color: #10B981; }
                .pro-play-btn.green:hover { background: #10B981; color: #FFF; }

                /* Share Modal */
                .share-modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
                    display: flex; justify-content: center; align-items: flex-end;
                    z-index: 4000;
                }
                .share-modal-container {
                    background: #FFF; width: 100%; max-width: 500px;
                    border-radius: 30px 30px 0 0; padding: 24px;
                    animation: slideUp 0.3s ease-out;
                }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .share-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .share-modal-header h3 { font-size: 18px; font-weight: 800; color: #111827; }
                .close-share-btn { border: none; background: #F3F4F6; width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .share-instruction { font-size: 13px; color: #6B7280; margin-bottom: 16px; }
                .share-preview-card { background: #F9FAFB; padding: 16px; border-radius: 20px; border: 1px solid var(--border-light); margin-bottom: 20px; }
                .preview-name { font-size: 20px; font-weight: 800; margin: 8px 0 2px 0; }
                .preview-meaning { font-size: 12px; color: #6B7280; }
                .share-textarea { width: 100%; border: 1px solid var(--border-light); border-radius: 16px; padding: 16px; font-size: 14px; min-height: 100px; outline: none; margin-bottom: 20px; font-family: inherit; }
                .share-textarea:focus { border-color: var(--token-primary-pill); }
                .confirm-share-btn { width: 100%; background: var(--token-primary-pill); color: #FFF; border: none; padding: 16px; border-radius: 18px; font-weight: 800; cursor: pointer; }
                .confirm-share-btn:disabled { opacity: 0.7; }

                .game-banner {
                    background: #FFF; border: 1px solid var(--border-light);
                    padding: 16px; border-radius: 20px; display: flex; align-items: center; gap: 16px;
                    cursor: pointer;
                }
                .game-icon-circle { width: 48px; height: 48px; border-radius: 14px; display: flex; justify-content: center; align-items: center; }

                /* Care Section Styles */
                .care-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .care-area-card {
                    background: #FFF; padding: 14px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                    display: flex; flex-direction: column; align-items: center; text-align: center;
                    cursor: pointer; transition: all 0.2s;
                }
                .care-area-card.active { border-color: var(--token-primary-pill); background: #FFF9FC; }
                .care-icon-wrap { width: 36px; height: 36px; border-radius: 12px; display: flex; justify-content: center; align-items: center; color: #FFF; margin-bottom: 8px; }

                .care-discussion-area { gap: 16px; margin-top: 20px; }
                .care-result-card { background: #FFF; padding: 20px; border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
                .result-title { font-size: 16px; font-weight: 800; color: #1F2937; margin-bottom: 16px; text-align: center; }
                
                .routine-steps { display: flex; flex-direction: column; gap: 12px; }
                .routine-step { display: flex; gap: 12px; align-items: flex-start; }
                .step-num { width: 24px; height: 24px; border-radius: 8px; background: #FFF0F5; color: var(--token-primary-pill); display: flex; justify-content: center; align-items: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
                .step-action { font-size: 13px; font-weight: 700; color: #374151; }
                .step-benefit { font-size: 11px; color: #6B7280; line-height: 1.4; }

                .safety-badge { padding: 8px 12px; border-radius: 10px; background: #FFF1F2; border: 1px solid #FFE4E6; color: #E11D48; font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
                .expert-tip-badge { padding: 8px 12px; border-radius: 10px; background: #F0F9FF; border: 1px solid #E0F2FE; color: #0369A1; font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 6px; }

                .more-ideas-btn { width: 100%; margin-top: 20px; padding: 12px; border-radius: 16px; border: 1px dashed var(--token-primary-pill); background: transparent; color: var(--token-primary-pill); font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

                .chat-bubble-wrap { display: flex; width: 100%; margin-bottom: 8px; }
                .chat-bubble-wrap.user { justify-content: flex-end; }
                .user-bubble { background: var(--token-primary-pill); color: #FFF; padding: 12px 16px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 13px; }
                .ai-bubble { background: #FFF; border: 1px solid var(--border-light); padding: 16px; border-radius: 18px 18px 18px 4px; max-width: 90%; }
                .ai-main-resp { font-size: 13px; color: #1F2937; line-height: 1.5; margin-bottom: 10px; }
                .tip-mini-item { font-size: 12px; color: #4B5563; padding: 6px 10px; background: #F9FAFB; border-radius: 8px; margin-bottom: 4px; }

                .floating-care-input { position: fixed; bottom: 85px; left: 20px; right: 20px; background: #FFF; border-radius: 20px; padding: 8px 8px 8px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(254,158,199,0.1); z-index: 1000; }
                .floating-care-input input { flex: 1; border: none; outline: none; font-size: 14px; padding: 10px 0; }
                .send-care-btn { width: 44px; height: 44px; border-radius: 15px; background: var(--token-primary-pill); color: #FFF; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; }

                /* Fullscreen Chat Overlay Styles */
                .fullscreen-chat-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #F9FAFB;
                    z-index: 3000;
                    display: flex;
                    flex-direction: column;
                }

                .chat-header-full {
                    background: #FFF;
                    padding: 40px 20px 20px 20px;
                    border-bottom: 1px solid var(--border-light);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                    z-index: 20;
                }
                .chat-close-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: none; background: #F3F4F6;
                    display: flex; justify-content: center; align-items: center;
                    margin-left: 16px; cursor: pointer;
                }
                .header-icon-mini {
                    width: 32px; height: 32px; border-radius: 10px;
                    display: flex; justify-content: center; align-items: center; color: #FFF;
                }
                .header-chat-title { font-size: 15px; font-weight: 800; color: #111827; }
                .header-chat-subtitle { font-size: 11px; color: #10B981; font-weight: 600; margin-top: -2px; }

                .chat-messages-container {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    gap: 16px;
                    padding-bottom: 120px;
                }

                .care-result-card-full {
                    background: #FFF; padding: 20px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                    margin-bottom: 12px;
                }

                .ai-bubble-full {
                    background: #FFF;
                    border: 1px solid var(--border-light);
                    padding: 18px;
                    border-radius: 20px 20px 20px 4px;
                    width: 92%;
                }

                .full-chat-input-container {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    background: linear-gradient(0deg, #F9FAFB 70%, transparent 100%);
                    padding: 20px;
                    z-index: 30;
                }
                .full-chat-input-wrap {
                    background: #FFF;
                    border-radius: 24px;
                    padding: 8px 8px 8px 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                    border: 1px solid var(--border-light);
                }
                .full-chat-input-wrap input {
                    flex: 1; border: none; outline: none; font-size: 14px;
                    background: transparent;
                }
                .send-care-btn-full {
                    width: 48px; height: 48px; border-radius: 18px;
                    background: var(--token-primary-pill);
                    color: #FFF; border: none; cursor: pointer;
                    display: flex; justify-content: center; align-items: center;
                    transition: transform 0.2s;
                }
                .send-care-btn-full:active { transform: scale(0.95); }

                .ai-typing-indicator { gap: 4px; padding: 10px 16px; background: #FFF; border-radius: 14px; width: fit-content; border: 1px solid var(--border-light); }
                .typing-dot { width: 6px; height: 6px; background: #FE9EC7; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

                .care-placeholder { padding: 40px 20px; text-align: center; background: #F9FAFB; border: 1px dashed var(--border-light); border-radius: 28px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
            `}</style>
        </div>
    );
}

const BabyIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M4 19c0 1 1 2 2 2h12c1 0 2-1 2-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4Z" /><path d="M12 13c-3 0-5-2-5-5s2-5 5-5 5 2 5 5-2 5-5 5Z" />
    </svg>
);
