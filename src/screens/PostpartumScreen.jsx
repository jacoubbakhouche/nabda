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
    Moon
} from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function PostpartumScreen({ onBack }) {
    const { getFeedingLogs, addFeedingLog } = usePregnancy();
    const [feedingLogs, setFeedingLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('recovery'); // recovery, breastfeeding, newborn, nutrition
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setIsLoading(true);
        const data = await getFeedingLogs();
        setFeedingLogs(data || []);
        setIsLoading(false);
    };

    const handleAddLog = async (side) => {
        const newLog = {
            side,
            start_time: new Date().toISOString(),
            duration_minutes: 15 // Mock duration
        };
        await addFeedingLog(newLog);
        loadLogs();
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
            <div className="feeding-tracker-card">
                <div className="flex-row justify-between align-center">
                    <span className="tracker-title">تعقب الرضاعة</span>
                    <Clock size={20} color="var(--token-purple-pill)" />
                </div>
                <div className="flex-row justify-center" style={{ gap: '20px', margin: '20px 0' }}>
                    <button className="side-btn left" onClick={() => handleAddLog('left')}>
                        <Plus size={16} /> اليمين
                    </button>
                    <button className="side-btn right" onClick={() => handleAddLog('right')}>
                        <Plus size={16} /> اليسار
                    </button>
                </div>
                <div className="recent-logs flex-col" style={{ gap: '8px' }}>
                    <span className="logs-label">آخر الرضعات:</span>
                    {isLoading ? (
                        <>
                            <div className="skeleton-text skeleton" style={{ width: '100%', height: '24px', margin: 0 }}></div>
                            <div className="skeleton-text skeleton" style={{ width: '100%', height: '24px', margin: 0 }}></div>
                            <div className="skeleton-text skeleton" style={{ width: '100%', height: '24px', margin: 0 }}></div>
                        </>
                    ) : (
                        feedingLogs.slice(0, 3).map((log, i) => (
                            <div key={i} className="log-row">
                                <span>{log.side === 'left' ? 'اليمين' : 'اليسار'}</span>
                                <span>{new Date(log.start_time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="info-card-medical">
                <h3 className="card-title-med">وضعيات الرضاعة الصحيحة</h3>
                <div className="video-placeholder-mini">
                    <PlayCircle size={32} color="var(--token-purple-pill)" />
                    <span>مشاهدة الوضعيات (فيديو)</span>
                </div>
                <p className="med-hint mt-2">تأكدي من أن طفلِك يمسك الثدي بعمق لتجنب التشققات.</p>
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
                    padding: 10px 20px; border-radius: 20px;
                    background-color: var(--bg-surface); border: 1px solid var(--border-light);
                    white-space: nowrap; font-size: 13px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s;
                }
                .p-tab.active { background: var(--token-purple-pill); color: #FFF; border-color: var(--token-purple-pill); }

                .recovery-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
                
                .info-card-medical {
                    background-color: #FFF; border: 1px solid var(--border-light);
                    border-radius: 24px; padding: 20px;
                }
                .card-title-med {
                    font-size: 16px; font-weight: 700; color: #1C1C1E;
                    display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
                }
                .med-hint { font-size: 13px; color: #555; line-height: 1.6; }

                .checklist-card { background: #F8F6FC; padding: 20px; border-radius: 24px; }
                .timeline-recovery { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
                .t-item { font-size: 13px; color: #1C1C1E; }
                .t-item strong { color: var(--token-purple-pill); }

                /* Breastfeeding */
                .feeding-tracker-card { background: #FFF; border: 1px solid var(--border-light); border-radius: 24px; padding: 20px; }
                .tracker-title { font-size: 15px; font-weight: 700; }
                .side-btn {
                    flex: 1; padding: 16px; border-radius: 16px; border: none; font-weight: 700;
                    display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
                }
                .side-btn.left { background: #F3E8FF; color: #6B21A8; }
                .side-btn.right { background: #FCE7F3; color: #BE185D; }
                .recent-logs { border-top: 1px solid #EEE; padding-top: 16px; margin-top: 10px; }
                .logs-label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
                .log-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #444; margin-bottom: 4px; }

                .video-placeholder-mini {
                    height: 100px; background: #F9FAFB; border-radius: 16px;
                    display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;
                    font-size: 12px; font-weight: 700; color: var(--token-purple-pill); border: 2px dashed #EEE;
                }

                /* Newborn */
                .quote-banner { background: var(--token-purple-pill); padding: 16px; border-radius: 16px; color: #FFF; text-align: center; }
                .quote-banner p { font-size: 14px; font-weight: 700; }

                .video-placeholder-large {
                    height: 180px; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80');
                    background-size: cover; border-radius: 24px; display: flex; align-items: center; padding: 20px; gap: 16px; color: #FFF;
                }
                .v-title { font-size: 18px; font-weight: 700; }
                .v-desc { font-size: 12px; opacity: 0.9; }

                .med-list li { font-size: 13px; margin-bottom: 8px; padding-right: 15px; position: relative; }
                .med-list li::before { content: '•'; position: absolute; right: 0; color: var(--token-purple-pill); font-weight: 800; }
            `}</style>
        </div>
    );
}
