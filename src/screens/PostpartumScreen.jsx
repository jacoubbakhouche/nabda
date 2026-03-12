import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Baby,
    Heart,
    Droplet,
    Stethoscope,
    Utensils,
    Thermometer,
    Info,
    PlayCircle,
    Clock,
    Plus,
    Moon,
    X,
    MessageSquare,
    Smile,
    ArrowRight,
    Send
} from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function PostpartumScreen({ onBack }) {
    const { getFeedingLogs, addFeedingLog, getCareWellnessAdvice, currentWeek } = usePregnancy();
    const [feedingLogs, setFeedingLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('breastfeeding'); // recovery, breastfeeding, newborn, nutrition
    const [isLoading, setIsLoading] = useState(true);

    // Timer States
    const [activeSide, setActiveSide] = useState(null); // 'left', 'right', or null
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualMinutes, setManualMinutes] = useState(15);
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // AI Advisor States
    const [selectedCareArea, setSelectedCareArea] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [isCareLoading, setIsCareLoading] = useState(false);
    const [followUpInput, setFollowUpInput] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setIsLoading(true);
        const data = await getFeedingLogs();
        setFeedingLogs(data || []);
        setIsLoading(false);
    };

    const startTimer = (side) => {
        if (activeSide === side) {
            stopTimerAndSave();
        } else {
            // If another side was active, save it first
            if (activeSide) stopTimerAndSave();

            setActiveSide(side);
            setTimerSeconds(0);
            const interval = setInterval(() => {
                setTimerSeconds(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
        }
    };

    const stopTimerAndSave = async () => {
        if (!activeSide) return;

        clearInterval(timerInterval);
        const duration = Math.max(1, Math.round(timerSeconds / 60));

        setIsSaving(true);
        await addFeedingLog({
            side: activeSide,
            start_time: new Date().toISOString(),
            duration_minutes: duration,
            notes: 'جلسة توقيت'
        });

        setActiveSide(null);
        setTimerSeconds(0);
        setTimerInterval(null);
        loadLogs();
        setIsSaving(false);
    };

    const handleManualSave = async (side) => {
        setIsSaving(true);
        await addFeedingLog({
            side,
            start_time: new Date().toISOString(),
            duration_minutes: manualMinutes,
            notes: notes
        });
        setNotes('');
        setShowManualEntry(false);
        loadLogs();
        setIsSaving(false);
    };

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGetCareAdvice = async (area, userInput = null) => {
        setIsCareLoading(true);
        if (!userInput) {
            setSelectedCareArea(area);
            setConversation([]);
        } else {
            setConversation(prev => [...prev, { role: 'user', content: userInput }]);
        }

        const data = await getCareWellnessAdvice(area, userInput);

        if (userInput) {
            setConversation(prev => [...prev, { role: 'ai', content: data }]);
        } else {
            // Initial advice for breastfeeding
            setConversation([{ role: 'ai', content: data }]);
        }

        setFollowUpInput('');
        setIsCareLoading(false);
    };

    const renderRecovery = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
            <div className="recovery-grid">
                <div className="info-card-medical">
                    <h3 className="card-title-med"><Stethoscope size={18} /> العناية بالجرح</h3>
                    <p className="med-hint">حافظي على نظافة وجفاف منطقة الجرح (طبيعي أو قيصري). إذا لاحظتِ احمراراً شديداً أو إفرازات، اتصلي بطبيبك.</p>
                </div>
                <div className="info-card-medical">
                    <h3 className="card-title-med"><Heart size={18} /> التعافي النفسي</h3>
                    <p className="med-hint">"بيبي بلوز" أمر شائع، لكن إذا استمر الحزن لأكثر من أسبوعين، قد تحتاجين لدعم تخصصي. أنتِ أم رائعة!</p>
                </div>
            </div>

            <div className="checklist-card">
                <h3 className="card-title-med">متى يمكنكِ استئناف حياتكِ؟</h3>
                <div className="timeline-recovery">
                    <div className="t-item"><strong>الرياضة:</strong> بعد 6 أسابيع (بعد استشارة الطبيب).</div>
                    <div className="t-item"><strong>العلاقة الزوجية:</strong> غالباً بعد توقف النزيف (4-6 أسابيع).</div>
                    <div className="t-item"><strong>التأهيل العجاني:</strong> خطوة مهمة لتقوية العضلات لاحقاً.</div>
                </div>
            </div>
        </div>
    );

    const renderBreastfeeding = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="feeding-tracker-card-pro">
                <div className="flex-row justify-between align-center" style={{ marginBottom: '20px' }}>
                    <div className="flex-col">
                        <span className="tracker-title-pro">عداد الرضاعة</span>
                        <span className="tracker-subtitle">تابعي مدة الرضاعة لكل جهة</span>
                    </div>
                    <Clock size={24} color="var(--token-purple-pill)" />
                </div>

                <div className="timer-display-container">
                    <span className="timer-val">{activeSide ? formatTime(timerSeconds) : "00:00"}</span>
                    {activeSide && <span className="timer-label">جاري الإرضاع من {activeSide === 'left' ? 'اليمين' : 'اليسار'}...</span>}
                </div>

                <div className="flex-row justify-center" style={{ gap: '16px', margin: '10px 0' }}>
                    <button
                        className={`side-btn-pro left ${activeSide === 'left' ? 'active' : ''}`}
                        onClick={() => startTimer('left')}
                    >
                        {activeSide === 'left' ? 'إيقاف' : 'اليمين'}
                    </button>
                    <button
                        className={`side-btn-pro right ${activeSide === 'right' ? 'active' : ''}`}
                        onClick={() => startTimer('right')}
                    >
                        {activeSide === 'right' ? 'إيقاف' : 'اليسار'}
                    </button>
                </div>

                <button className="manual-entry-trigger" onClick={() => setShowManualEntry(!showManualEntry)}>
                    {showManualEntry ? 'إلغاء الإضافة اليدوية' : 'أو أضيفي يدوياً'}
                </button>

                {showManualEntry && (
                    <div className="manual-form tab-content-fade-in">
                        <div className="flex-col" style={{ gap: '12px' }}>
                            <div className="input-group">
                                <label>المدة (بالدقائق):</label>
                                <input
                                    type="number"
                                    value={manualMinutes}
                                    onChange={(e) => setManualMinutes(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="input-group">
                                <label>ملاحظات:</label>
                                <textarea
                                    placeholder="كيف كانت الرضعة؟"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                            <div className="flex-row gap-8">
                                <button className="save-log-btn left" onClick={() => handleManualSave('left')}>حفظ لليمين</button>
                                <button className="save-log-btn right" onClick={() => handleManualSave('right')}>حفظ لليسار</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="recent-logs-pro flex-col">
                    <div className="flex-row justify-between align-center" style={{ marginBottom: '12px' }}>
                        <span className="logs-label-pro">سجلات الجلسات الأخيرة</span>
                    </div>
                    {isLoading ? (
                        <div className="skeleton-text skeleton" style={{ width: '100%', height: '40px' }}></div>
                    ) : feedingLogs.length === 0 ? (
                        <p className="no-logs">لا توجد سجلات بعد</p>
                    ) : (
                        <div className="logs-chips-grid">
                            {feedingLogs.slice(0, 4).map((log, i) => (
                                <div key={i} className={`log-chip ${log.side}`}>
                                    <div className="chip-side-indicator"></div>
                                    <div className="flex-col">
                                        <div className="flex-row align-center justify-between">
                                            <span className="chip-side-name">{log.side === 'left' ? 'اليمين' : 'اليسار'}</span>
                                            <span className="chip-duration">{log.duration_minutes} د</span>
                                        </div>
                                        <span className="chip-time">{new Date(log.start_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="ai-advisor-banner-purple" onClick={() => handleGetCareAdvice('breastfeeding')}>
                <div className="flex-row align-center" style={{ gap: '12px' }}>
                    <div className="ai-icon-circle-white">
                        <MessageSquare size={20} color="var(--token-purple-pill)" />
                    </div>
                    <div className="flex-col">
                        <span className="ai-banner-title">مستشار الرضاعة الذكي</span>
                        <span className="ai-banner-desc">اسألي عن أي شيء يخص الرضاعة والوضعيات</span>
                    </div>
                </div>
                <button className="chat-now-btn">دردشة</button>
            </div>

            <div className="info-card-medical premium">
                <div className="flex-row justify-between align-center" style={{ marginBottom: '12px' }}>
                    <h3 className="card-title-med"><PlayCircle size={18} /> وضعيات الرضاعة الصحيحة</h3>
                </div>
                <div className="video-player-container">
                    <video controls>
                        <source src="/wissal.mp4" type="video/mp4" />
                        متصفحك لا يدعم تشغيل الفيديو.
                    </video>
                </div>
                <p className="med-hint mt-2">اختاري الوضعية الأكثر راحة لكِ ولطفلكِ لضمان إدرار جيد وتجنب الألم.</p>
            </div>
        </div>
    );

    const renderNewborn = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
            <div className="quote-banner">
                <p>"كل أم تتعلم بالتدريج، لا أحد يولد خبيراً" ✨</p>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med"><Baby size={18} /> العناية بالسرة</h3>
                <p className="med-hint">حافظي على السرة نظيفة وجافة. ستسقط تلقائياً خلال 7-14 يوماً.</p>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med"><Moon size={18} /> المغص والغازات</h3>
                <p className="med-hint">تدليك بطن الطفل باتجاه عقارب الساعة أو تمرين "الدراجة" يساعد في تخفيف الغازات.</p>
            </div>

            <div className="video-placeholder-large">
                <PlayCircle size={48} color="#FFF" />
                <div className="flex-col">
                    <span className="v-title">أول حمام للبيبي</span>
                    <span className="v-desc">دليل خطوة بخطوة بالفيديو</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="postpartum-container flex-col">
            <Header />
            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">رعاية ما بعد الولادة</h2>
            </div>

            <div className="postpartum-tabs">
                <button className={`p-tab ${activeTab === 'recovery' ? 'active' : ''}`} onClick={() => setActiveTab('recovery')}>التعافي</button>
                <button className={`p-tab ${activeTab === 'breastfeeding' ? 'active' : ''}`} onClick={() => setActiveTab('breastfeeding')}>الرضاعة</button>
                <button className={`p-tab ${activeTab === 'newborn' ? 'active' : ''}`} onClick={() => setActiveTab('newborn')}>البيبي</button>
                <button className={`p-tab ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>التغذية</button>
            </div>

            <div className="postpartum-content">
                {activeTab === 'recovery' && renderRecovery()}
                {activeTab === 'breastfeeding' && renderBreastfeeding()}
                {activeTab === 'newborn' && renderNewborn()}
                {activeTab === 'nutrition' && (
                    <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
                        <div className="info-card-medical">
                            <h3 className="card-title-med"><Utensils size={18} /> أطعمة مدرة للحليب</h3>
                            <ul className="med-list">
                                <li>الشوفان واللبن.</li>
                                <li>الحلبة واليانسون.</li>
                                <li>الخضروات الورقية الخضراء.</li>
                                <li>شرب كميات كبيرة من الماء (3 لتر يومياً).</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {selectedCareArea && (
                <div className="fullscreen-chat-overlay tab-content-fade-in">
                    <div className="chat-header-full flex-row align-center">
                        <div className="flex-row align-center" style={{ flex: 1, gap: '12px' }}>
                            <div className="header-icon-mini" style={{ background: 'var(--token-purple-pill)' }}>
                                <MessageSquare size={18} />
                            </div>
                            <div className="flex-col">
                                <span className="header-chat-title">مستشار الرضاعة</span>
                                <span className="header-chat-subtitle">متصل الآن</span>
                            </div>
                        </div>
                        <button className="chat-close-btn" onClick={() => setSelectedCareArea(null)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages-container flex-col">
                        {conversation.map((msg, i) => (
                            <div key={i} className={`flex-col ${msg.role === 'user' ? 'align-end' : 'align-start'}`}>
                                <div className={msg.role === 'user' ? 'user-bubble-full' : 'ai-bubble-full'}>
                                    {msg.role === 'ai' ? (
                                        <div className="flex-col" style={{ gap: '12px' }}>
                                            <p style={{ lineHeight: 1.6 }}>{msg.content.routine_title || msg.content}</p>
                                            {msg.content.steps && (
                                                <div className="flex-col" style={{ gap: '8px' }}>
                                                    {msg.content.steps.map((s, idx) => (
                                                        <div key={idx} className="step-card-mini">
                                                            <span style={{ fontWeight: 800 }}>{s.action}:</span>
                                                            <span style={{ fontSize: 13, color: '#666' }}>{s.benefit}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
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
                                placeholder="اسألي المستشار عن الرضاعة..."
                                value={followUpInput}
                                onChange={(e) => setFollowUpInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGetCareAdvice(selectedCareArea, followUpInput)}
                            />
                            <button className="send-care-btn-full" onClick={() => handleGetCareAdvice(selectedCareArea, followUpInput)}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .postpartum-container { padding-bottom: 40px; }
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }

                .postpartum-tabs {
                    display: flex; gap: 8px; margin: 20px 0; overflow-x: auto;
                    scrollbar-width: none;
                }
                .postpartum-tabs::-webkit-scrollbar { display: none; }
                .p-tab {
                    padding: 12px 24px; border-radius: 24px;
                    background-color: #FFF; border: 1px solid var(--border-light);
                    white-space: nowrap; font-size: 14px; font-weight: 700; cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    color: #6B7280;
                }
                .p-tab.active { 
                    background: var(--token-purple-pill); color: #FFF; 
                    border-color: var(--token-purple-pill);
                    box-shadow: 0 8px 15px rgba(168, 85, 247, 0.2);
                    transform: translateY(-2px);
                }

                .recovery-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
                
                .info-card-medical {
                    background-color: #FFF; border: 1px solid var(--border-light);
                    border-radius: 28px; padding: 24px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .info-card-medical.premium { border-top: 4px solid var(--token-purple-pill); }
                .card-title-med {
                    font-size: 17px; font-weight: 800; color: #111827;
                    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
                }
                .med-hint { font-size: 14px; color: #4B5563; line-height: 1.6; }

                .checklist-card { background: #F5F3FF; padding: 24px; border-radius: 28px; border: 1px solid rgba(139, 92, 246, 0.1); }
                .timeline-recovery { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
                .t-item { font-size: 14px; color: #1F2937; line-height: 1.5; }
                .t-item strong { color: var(--token-purple-pill); }

                /* Feeding Tracker Pro */
                .feeding-tracker-card-pro { 
                    background: #FFF; border: 1px solid var(--border-light); 
                    border-radius: 28px; padding: 24px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.04);
                }
                .tracker-title-pro { font-size: 17px; font-weight: 800; color: #111827; display: block; }
                .tracker-subtitle { font-size: 12px; color: #6B7280; }

                .timer-display-container {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    margin: 24px 0; padding: 20px; background: #F9FAFB; border-radius: 24px;
                }
                .timer-val { font-size: 42px; font-weight: 900; color: var(--token-purple-pill); font-family: 'Courier New', Courier, monospace; }
                .timer-label { font-size: 12px; color: #10B981; font-weight: 700; margin-top: 8px; }

                .side-btn-pro {
                    flex: 1; padding: 18px; border-radius: 20px; border: 2px solid transparent; 
                    font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .side-btn-pro.left { background: #F3E8FF; color: #6B21A8; }
                .side-btn-pro.right { background: #FCE7F3; color: #BE185D; }
                .side-btn-pro.active { 
                    background: var(--token-purple-pill) !important; color: #FFF !important; 
                    animation: pulseTimer 2s infinite; outline: 3px solid rgba(168, 85, 247, 0.2);
                }
                @keyframes pulseTimer { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }

                .manual-entry-trigger {
                    width: 100%; padding: 12px; border: none; background: none; 
                    font-size: 13px; font-weight: 700; color: #9CA3AF; cursor: pointer;
                    text-decoration: underline; margin-top: 10px;
                }
                .manual-form { margin-top: 16px; padding: 20px; background: #F9FAFB; border-radius: 20px; border: 1px solid #F3F4F6; }
                .input-group label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 6px; }
                .input-group input, .input-group textarea { 
                    width: 100%; padding: 12px; border: 1px solid #E5E7EB; border-radius: 12px; 
                    font-size: 14px; outline: none; font-family: inherit;
                }
                .save-log-btn { flex: 1; padding: 12px; border-radius: 12px; border: none; color: #FFF; font-weight: 700; cursor: pointer; }
                .save-log-btn.left { background: #9333EA; }
                .save-log-btn.right { background: #DB2777; }

                .recent-logs-pro { border-top: 1px solid #F3F4F6; padding-top: 16px; margin-top: 16px; }
                .logs-label-pro { font-size: 14px; font-weight: 800; color: #111827; }
                
                .logs-chips-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .log-chip {
                    background: #FAFAFA;
                    border: 1px solid #F3F4F6;
                    border-radius: 16px;
                    padding: 10px 12px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: transform 0.2s;
                }
                .log-chip:active { transform: scale(0.98); }
                .log-chip .chip-side-indicator { width: 4px; height: 24px; border-radius: 2px; }
                .log-chip.left .chip-side-indicator { background: #9333EA; }
                .log-chip.right .chip-side-indicator { background: #DB2777; }
                
                .chip-side-name { font-size: 12px; font-weight: 800; color: #374151; }
                .chip-duration { font-size: 11px; font-weight: 900; color: var(--token-purple-pill); }
                .chip-time { font-size: 10px; color: #9CA3AF; margin-top: 2px; }

                .no-logs { text-align: center; color: #9CA3AF; font-size: 13px; margin: 20px 0; font-weight: 600; }

                /* Video Player */
                .video-player-container { 
                    width: 100%; border-radius: 20px; overflow: hidden; 
                    aspect-ratio: 16/9; background: #000; margin-top: 8px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }
                .video-player-container video { width: 100%; height: 100%; object-fit: cover; }

                /* AI Banner */
                .ai-advisor-banner-purple {
                    background: linear-gradient(135deg, #7E22CE 0%, #A855F7 100%);
                    padding: 20px; border-radius: 28px; display: flex; align-items: center; justify-content: space-between;
                    color: #FFF; cursor: pointer; box-shadow: 0 12px 25px rgba(126, 34, 206, 0.2);
                }
                .ai-icon-circle-white { width: 44px; height: 44px; border-radius: 14px; background: #FFF; display: flex; justify-content: center; align-items: center; }
                .ai-banner-title { font-size: 16px; font-weight: 800; display: block; }
                .ai-banner-desc { font-size: 11px; opacity: 0.9; }
                .chat-now-btn { padding: 8px 16px; background: #FFF; color: #7E22CE; border: none; border-radius: 12px; font-size: 12px; font-weight: 800; }

                .quote-banner { background: #FDF4FF; border: 1px solid #F5D0FE; padding: 20px; border-radius: 24px; color: #701A75; text-align: center; }
                .quote-banner p { font-size: 15px; font-weight: 700; font-style: italic; }

                .video-placeholder-large {
                    height: 180px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80');
                    background-size: cover; border-radius: 24px; display: flex; align-items: center; padding: 20px; gap: 16px; color: #FFF;
                }
                .v-title { font-size: 18px; font-weight: 700; }
                .v-desc { font-size: 12px; opacity: 0.9; }

                /* Newborn */
                .quote-banner { background: var(--token-purple-pill); padding: 16px; border-radius: 16px; color: #FFF; text-align: center; }
                .quote-banner p { font-size: 14px; font-weight: 700; }

                .video-placeholder-large {
                    height: 180px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80');
                    background-size: cover; border-radius: 24px; display: flex; align-items: center; padding: 20px; gap: 16px; color: #FFF;
                }
                .v-title { font-size: 18px; font-weight: 700; }
                .v-desc { font-size: 12px; opacity: 0.9; }

                /* Postpartum Content Fade */
                .postpartum-content { animation: fadeIn 0.4s ease-out; }

                /* Fullscreen Chat Overlay Styles (Shared Logic) */
                .fullscreen-chat-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: #F9FAFB;
                    z-index: 3000;
                    display: flex;
                    flex-direction: column;
                }
                .chat-header-full {
                    background: #FFF; padding: 40px 20px 20px 20px;
                    border-bottom: 1px solid var(--border-light);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                }
                .chat-close-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: #F3F4F6; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .header-icon-mini { width: 32px; height: 32px; border-radius: 10px; display: flex; justify-content: center; align-items: center; color: #FFF; }
                .header-chat-title { font-size: 15px; font-weight: 800; color: #111827; }
                .header-chat-subtitle { font-size: 11px; color: #10B981; font-weight: 600; }

                .chat-messages-container { flex: 1; overflow-y: auto; padding: 20px; gap: 16px; padding-bottom: 120px; }
                .ai-bubble-full { background: #FFF; border: 1px solid var(--border-light); padding: 18px; border-radius: 20px 20px 20px 4px; width: 85%; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
                .user-bubble-full { background: var(--token-purple-pill); color: #FFF; padding: 16px; border-radius: 20px 20px 4px 20px; width: 85%; font-weight: 600; }

                .full-chat-input-container { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, #F9FAFB 70%, transparent 100%); padding: 20px; }
                .full-chat-input-wrap { background: #FFF; border-radius: 24px; padding: 8px 8px 8px 20px; display: flex; align-items: center; gap: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.06); border: 1px solid var(--border-light); }
                .full-chat-input-wrap input { flex: 1; border: none; outline: none; font-size: 14px; background: transparent; font-family: inherit; }
                .send-care-btn-full { width: 44px; height: 44px; border-radius: 16px; background: var(--token-purple-pill); color: #FFF; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; }

                .step-card-mini { background: #F9FAFB; padding: 10px; border-radius: 12px; border: 1px solid #EEE; }

                .ai-typing-indicator { gap: 4px; padding: 10px 16px; background: #FFF; border-radius: 14px; width: fit-content; border: 1px solid var(--border-light); }
                .typing-dot { width: 6px; height: 6px; background: #A855F7; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
