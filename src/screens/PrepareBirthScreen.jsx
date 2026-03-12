import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    CheckCircle2,
    Circle,
    ShoppingBag,
    Luggage,
    ClipboardList,
    Clock,
    Info,
    Zap,
    Timer,
    Baby,
    Smile,
    CheckSquare,
    Square,
    Sparkles,
    Send,
    Loader2
} from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function PrepareBirthScreen({ onBack }) {
    const {
        pregnancyDetails,
        currentWeek,
        getBirthChecklist,
        toggleChecklistItem,
        invokeAIAnalysis
    } = usePregnancy();

    const [checklist, setChecklist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // info, prep, day, bag

    // AI State
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Accurate Countdown logic
    const calculateRemainingDays = () => {
        if (pregnancyDetails.eddDate) {
            const edd = new Date(pregnancyDetails.eddDate);
            const today = new Date();
            const diffTime = edd - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
        }
        // Fallback to week-based calculation
        return (40 - currentWeek) * 7;
    };

    const daysRemaining = calculateRemainingDays();

    useEffect(() => {
        loadChecklist();
    }, []);

    const loadChecklist = async () => {
        setLoading(true);
        const data = await getBirthChecklist();
        setChecklist(data || []);
        setLoading(false);
    };

    const handleToggle = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        setChecklist(checklist.map(item => item.id === id ? { ...item, is_completed: newStatus } : item));
        if (toggleChecklistItem) await toggleChecklistItem(id, newStatus);
    };

    const handleAskAi = async () => {
        if (!aiQuestion.trim()) return;
        setIsAiLoading(true);
        try {
            // Reusing invokeAIAnalysis with a custom prompt hint
            const response = await invokeAIAnalysis(`سوال حول الولادة: ${aiQuestion}. ركز على مراحل الولادة، الطلق، أو الاستعداد للمستشفى.`);
            // Assuming the function returns a predictable structure or we handle the text
            setAiResponse(response.mother?.symptoms?.[0]?.manage || "عذراً، لم أستطع تحليل سؤالك بدقة. يرجى استشارة طبيبك.");
        } catch (err) {
            setAiResponse("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
        }
        setIsAiLoading(false);
    };

    const renderCountdown = () => (
        <div className="countdown-section">
            <div className="countdown-card">
                <div className="flex-row justify-between align-center">
                    <div className="flex-col">
                        <span className="countdown-label">الوقت المتبقي للقاء طفلك</span>
                        <div className="flex-row align-end" style={{ gap: '8px', marginTop: '4px' }}>
                            <span className="countdown-value">{daysRemaining}</span>
                            <span className="countdown-unit">يوم تقريباً</span>
                        </div>
                    </div>
                    <div className="countdown-icon-bg">
                        <Clock size={32} color="#FFF" />
                    </div>
                </div>
                <div className="countdown-progress-bar">
                    <div className="countdown-fill" style={{ width: `${Math.min(100, (currentWeek / 40) * 100)}%` }}></div>
                </div>
                <p className="countdown-footer">✨ أنت الآن في الأسبوع {currentWeek} من رحلتك</p>
            </div>
        </div>
    );

    const renderUnderstandingBirth = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            {/* AI Assistant Section */}
            <div className="ai-assistant-card">
                <div className="ai-header">
                    <Sparkles size={18} color="var(--token-purple-pill)" />
                    <span>اسألي النبظة عن الولادة</span>
                </div>
                <div className="ai-input-wrapper">
                    <input
                        type="text"
                        placeholder="مثال: كيف أعرف أن الطلق حقيقي؟"
                        value={aiQuestion}
                        onChange={(e) => setAiQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskAi()}
                    />
                    <button onClick={handleAskAi} disabled={isAiLoading}>
                        {isAiLoading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
                {aiResponse && (
                    <div className="ai-response-box slide-down">
                        <p>{aiResponse}</p>
                    </div>
                )}
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med"><Zap size={18} /> الحقيقي vs الطلق الكاذب</h3>
                <div className="comparison-grid">
                    <div className="comp-item false">
                        <strong>الطلق الكاذب (براكستون هيكس)</strong>
                        <p>غير منتظم، يتلاشى مع المشي أو تغيير الوضعية، الألم يتركز في أسفل البطن.</p>
                    </div>
                    <div className="comp-item true">
                        <strong>الطلق الحقيقي</strong>
                        <p>منتظم ويزداد حدة وتقارباً مع الوقت، لا يتوقف بالحركة، يبدأ من الظهر ويلف للبطن.</p>
                    </div>
                </div>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med"><Info size={18} /> متى تتوجّهين للمستشفى؟</h3>
                <ul className="med-list">
                    <li>عندما يكون الطلق كل 5 دقائق ومنتظماً لمدة ساعة.</li>
                    <li>نزول "ماء الراس" (حتى لو لم يوجد ألم).</li>
                    <li>حدوث نزيف دموي مفاجئ.</li>
                    <li>انخفاض واضح في حركة الجنين.</li>
                </ul>
            </div>
        </div>
    );

    const renderPreparation = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="prep-video-placeholder">
                <div className="play-hint">
                    <Timer size={40} color="var(--token-purple-pill)" />
                    <span>تمارين التنفس المهدئة</span>
                </div>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med"><Smile size={18} /> توكيدات إيجابية</h3>
                <div className="affirmations-scroll">
                    <div className="affirm-bubble">"جسمي قوي ومصمم لهذه اللحظة"</div>
                    <div className="affirm-bubble">"كل انقباضة تقربني أكثر من طفلي"</div>
                    <div className="affirm-bubble">"أنا أتنفس بهدوء وأثق في قدرتي"</div>
                </div>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med">وضعيات تسكين الألم</h3>
                <div className="stages-flow">
                    <div className="stage-step">المشي الخفيف يساعد على نزول الجنين.</div>
                    <div className="stage-step">الجلوس على كرة الولادة يفتح الحوض.</div>
                    <div className="stage-step">تطبيق كمادات دافئة أسفل الظهر.</div>
                </div>
            </div>
        </div>
    );

    const renderBirthDay = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="info-card-medical">
                <h3 className="card-title-med"><Baby size={18} /> أنواع الولادة</h3>
                <div className="flex-col" style={{ gap: '12px' }}>
                    <div className="type-row">
                        <strong>الولادة الطبيعية:</strong> خيار آمن وتعافي أسرع عادة.
                    </div>
                    <div className="type-row">
                        <strong>الولادة القيصرية:</strong> إجراء جراحي مخطط له أو طارئ لضمان سلامتكما.
                    </div>
                </div>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med">الإجراءات الطبية الشائعة</h3>
                <div className="procedure-grid">
                    <div className="proc-tag">الفحص المهبلي (TV)</div>
                    <div className="proc-tag">تخطيط قلب الجنين (ERCF)</div>
                    <div className="proc-tag">تحاليل الدم (Bilan)</div>
                </div>
                <p className="med-hint">تذكري أن هذه الإجراءات تهدف للاطمئنان على استقرار حالتك وحالة طفلك.</p>
            </div>
        </div>
    );

    const renderBag = () => {
        const categories = [...new Set(checklist.map(i => i.category || 'أخرى'))];
        const completedCount = checklist.filter(i => i.is_completed).length;
        const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

        return (
            <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
                <div className="progress-card-mini">
                    <div className="flex-row justify-between align-center">
                        <span className="prog-label">تجهيز الحقيبة</span>
                        <span className="prog-val">{Math.round(progress)}%</span>
                    </div>
                    <div className="prog-bar">
                        <div className="prog-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {loading ? (
                    <>
                        <div className="bag-section mb-3">
                            <div className="skeleton-text skeleton" style={{ width: '30%', height: '16px', marginBottom: '12px', borderRadius: '4px' }}></div>
                            <div className="bag-items-list">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bag-item-row skeleton-card" style={{ padding: '14px 18px', margin: 0, borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none', borderRadius: 0 }}>
                                        <div className="skeleton-avatar skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-text skeleton" style={{ width: '60%', margin: 0 }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bag-section">
                            <div className="skeleton-text skeleton" style={{ width: '40%', height: '16px', marginBottom: '12px', borderRadius: '4px' }}></div>
                            <div className="bag-items-list">
                                {[1, 2].map(i => (
                                    <div key={i} className="bag-item-row skeleton-card" style={{ padding: '14px 18px', margin: 0, borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none', borderRadius: 0 }}>
                                        <div className="skeleton-avatar skeleton" style={{ width: '20px', height: '20px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-text skeleton" style={{ width: '50%', margin: 0 }}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    categories.map(cat => (
                        <div key={cat} className="bag-section">
                            <h4 className="bag-cat-title">{cat}</h4>
                            <div className="bag-items-list">
                                {checklist.filter(i => (i.category || 'أخرى') === cat).map(item => (
                                    <div
                                        key={item.id}
                                        className={`bag-item-row ${item.is_completed ? 'checked' : ''}`}
                                        onClick={() => handleToggle(item.id, item.is_completed)}
                                    >
                                        {item.is_completed ? <CheckSquare size={20} color="var(--token-purple-pill)" /> : <Square size={20} color="#CCC" />}
                                        <span>{item.item_text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <div className="prepare-screen-container flex-col">
            <Header />

            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">استعدي للولادة</h2>
            </div>

            {renderCountdown()}

            {/* Main Tabs */}
            <div className="prep-tabs-nav">
                <button className={`p-tab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>فهم الولادة</button>
                <button className={`p-tab ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>التحضير</button>
                <button className={`p-tab ${activeTab === 'day' ? 'active' : ''}`} onClick={() => setActiveTab('day')}>يوم اللقاء</button>
                <button className={`p-tab ${activeTab === 'bag' ? 'active' : ''}`} onClick={() => setActiveTab('bag')}>حقيبة الولادة</button>
            </div>

            <div className="prep-content-area">
                {activeTab === 'info' && renderUnderstandingBirth()}
                {activeTab === 'prep' && renderPreparation()}
                {activeTab === 'day' && renderBirthDay()}
                {activeTab === 'bag' && renderBag()}
            </div>

            <style>{`
                .prepare-screen-container { padding-bottom: 40px; }
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }

                /* Countdown */
                .countdown-card {
                    background: linear-gradient(135deg, var(--token-purple-pill) 0%, #8B5CF6 100%);
                    padding: 24px; border-radius: 24px; color: #FFF; 
                    box-shadow: 0 10px 30px rgba(168, 116, 246, 0.2);
                    margin-top: 10px;
                }
                .countdown-label { font-size: 13px; font-weight: 500; opacity: 0.9; }
                .countdown-value { font-size: 42px; font-weight: 800; line-height: 1; }
                .countdown-unit { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
                .countdown-icon-bg {
                    width: 56px; height: 56px; border-radius: 16px;
                    background: rgba(255,255,255,0.2);
                    display: flex; justify-content: center; align-items: center;
                }
                .countdown-progress-bar {
                    height: 8px; background: rgba(255,255,255,0.2);
                    border-radius: 4px; margin-top: 20px; overflow: hidden;
                }
                .countdown-fill { height: 100%; background: #FFF; transition: width 1s ease; }
                .countdown-footer { font-size: 12px; margin-top: 12px; opacity: 0.8; font-weight: 500; }

                /* Nav Tabs */
                .prep-tabs-nav {
                    display: flex; gap: 8px; overflow-x: auto;
                    margin: 20px -20px 0 -20px; padding: 10px 20px;
                    scrollbar-width: none;
                }
                .prep-tabs-nav::-webkit-scrollbar { display: none; }
                .p-tab {
                    padding: 10px 18px; border-radius: 20px;
                    background-color: var(--bg-surface); border: 1px solid var(--border-light);
                    white-space: nowrap; font-size: 13px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s;
                }
                .p-tab.active {
                    background-color: var(--token-purple-pill); color: #FFF; border-color: var(--token-purple-pill);
                }

                /* AI Assistant */
                .ai-assistant-card {
                    background-color: #F8F6FC; border: 1px solid var(--token-purple-light);
                    border-radius: 24px; padding: 20px; margin-bottom: 10px;
                }
                .ai-header { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: #1C1C1E; margin-bottom: 12px; }
                .ai-input-wrapper { display: flex; gap: 8px; background: #FFF; padding: 6px; border-radius: 16px; border: 1px solid var(--border-light); }
                .ai-input-wrapper input { border: none; flex: 1; padding: 8px 12px; outline: none; font-size: 13px; }
                .ai-input-wrapper button { width: 40px; height: 40px; border-radius: 12px; background: var(--token-purple-pill); border: none; color: #FFF; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .ai-input-wrapper button:disabled { opacity: 0.6; }
                .ai-response-box { margin-top: 16px; padding: 16px; background: #FFF; border-radius: 16px; border: 1px solid var(--border-light); font-size: 13px; color: #444; line-height: 1.6; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* Cards */
                .info-card-medical {
                    background-color: #FFF; border: 1px solid var(--border-light);
                    border-radius: 24px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .card-title-med {
                    font-size: 16px; font-weight: 700; color: #1C1C1E;
                    display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
                }
                .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .comp-item { padding: 12px; border-radius: 12px; font-size: 12px; line-height: 1.4; }
                .comp-item.false { background-color: #F9FAFB; }
                .comp-item.true { background-color: #F8F6FC; border: 1px solid var(--token-purple-light); }
                .comp-item strong { display: block; margin-bottom: 4px; color: #1C1C1E; }

                .med-list { padding-right: 18px; display: flex; flex-direction: column; gap: 10px; }
                .med-list li { font-size: 13px; color: #444; position: relative; }
                .med-list li::before { content: '•'; position: absolute; right: -15px; color: var(--token-purple-pill); }

                .prep-video-placeholder {
                    height: 160px; background-color: #F8F6FC; border-radius: 24px;
                    display: flex; justify-content: center; align-items: center;
                    border: 2px dashed var(--token-purple-light);
                }
                .play-hint { display: flex; flex-direction: column; align-items: center; gap: 10px; }
                .play-hint span { font-size: 14px; font-weight: 600; color: var(--token-purple-pill); }

                .affirmations-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
                .affirm-bubble {
                    background-color: #F3E8FF; padding: 12px 16px; border-radius: 16px;
                    font-size: 13px; font-weight: 600; color: #6B21A8; white-space: nowrap;
                }

                .stages-flow { display: flex; flex-direction: column; gap: 8px; }
                .stage-step {
                    padding: 12px; background-color: #F9FAFB; border-radius: 12px;
                    font-size: 13px; color: #1C1C1E;
                }

                .type-row { font-size: 14px; color: #444; line-height: 1.5; }
                .procedure-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
                .proc-tag {
                    padding: 8px 14px; background-color: #F3F4F6; border-radius: 10px;
                    font-size: 12px; font-weight: 600; color: #1C1C1E;
                }
                .med-hint { font-size: 11px; color: var(--text-muted); margin-top: 12px; text-align: center; }

                /* Bag Styles */
                .progress-card-mini {
                    background-color: #F8F6FC; padding: 16px; border-radius: 16px; margin-bottom: 10px;
                }
                .prog-label { font-size: 13px; font-weight: 600; color: #1C1C1E; }
                .prog-val { font-size: 15px; font-weight: 700; color: var(--token-purple-pill); }
                .prog-bar { height: 6px; background-color: #E5E7EB; border-radius: 3px; margin-top: 8px; overflow: hidden; }
                .prog-fill { height: 100%; background-color: var(--token-purple-pill); transition: width 0.3s; }

                .bag-cat-title { font-size: 14px; font-weight: 700; color: #1C1C1E; margin-bottom: 12px; padding-right: 4px; }
                .bag-items-list { background-color: #FFF; border: 1px solid var(--border-light); border-radius: 20px; overflow: hidden; }
                .bag-item-row {
                    display: flex; align-items: center; gap: 12px; padding: 14px 18px;
                    border-bottom: 1px solid var(--border-light); cursor: pointer;
                    transition: background 0.2s;
                }
                .bag-item-row:last-child { border-bottom: none; }
                .bag-item-row.checked { background-color: #F9FAFB; }
                .bag-item-row.checked span { color: var(--text-muted); text-decoration: line-through; }
                .bag-item-row span { font-size: 14px; color: #1C1C1E; font-weight: 500; }
            `}</style>
        </div>
    );
}
