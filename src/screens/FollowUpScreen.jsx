import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Baby, User, Lightbulb, AlertCircle, Ruler, Weight, Info, PhoneCall } from 'lucide-react';
import Header from '../components/Header';
import FetusViewer from '../components/FetusViewer';
import { usePregnancy } from '../context/PregnancyContext';
import { getFetusImageIndex } from '../utils/pregnancyUtils';

export default function FollowUpScreen({ onBack }) {
  const { currentWeek, invokeAIAnalysis } = usePregnancy();
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [activeSubTab, setActiveSubTab] = useState('fetus');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFetusViewer, setShowFetusViewer] = useState(false);
  const scrollRef = useRef(null);

  const tabs = [
    { id: 'fetus', label: 'تطور الجنين', icon: <Baby size={20} /> },
    { id: 'mother', label: 'تغيرات الأم', icon: <User size={20} /> },
    { id: 'tips', label: 'نصائح يومية', icon: <Lightbulb size={20} /> },
    { id: 'risks', label: 'علامات الخطر', icon: <AlertCircle size={20} /> },
  ];

  useEffect(() => {
    fetchWeekData(selectedWeek);
    // Scroll current week into center
    if (scrollRef.current) {
      const btn = scrollRef.current.querySelector(`.week-btn[data-week="${selectedWeek}"]`);
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }, [selectedWeek]);

  const fetchWeekData = async (week) => {
    setLoading(true);
    const data = await invokeAIAnalysis(week);
    setAnalysis(data);
    setLoading(false);
  };

  const renderFetusContent = () => {
    const fetusIndex = getFetusImageIndex(selectedWeek);

    return (
      <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
        <div className="fetus-image-preview-container flex-col align-center">
          <img
            src={`/fetus${fetusIndex}.png`}
            alt={`Fetus Week ${selectedWeek}`}
            className="fetus-display-img"
            onClick={() => setShowFetusViewer(true)}
            style={{ cursor: 'pointer' }}
          />
          <div className="image-caption">تطور طفلك في الأسبوع {selectedWeek}</div>
        </div>

        <div className="stats-glass-grid">
          <div className="stat-glass-item">
            <Ruler size={24} color="var(--token-purple-pill)" />
            <div className="flex-col">
              <span className="glass-val">{analysis?.fetus?.height || '28 سم'}</span>
              <span className="glass-label">الطول التقريبي</span>
            </div>
          </div>
          <div className="stat-glass-item">
            <Weight size={24} color="var(--token-purple-pill)" />
            <div className="flex-col">
              <span className="glass-val">{analysis?.fetus?.weight || '450 غ'}</span>
              <span className="glass-label">الوزن التقريبي</span>
            </div>
          </div>
        </div>

        <div className="info-card fetus-detail-card">
          <h3 className="card-title flex-row align-center" style={{ gap: '8px' }}>
            <Info size={18} /> ماذا يتطور هذا الأسبوع؟
          </h3>
          <ul className="dev-list">
            {(analysis?.fetus?.developments || [
              "بدأت ملامح الوجه في الوضوح أكثر.",
              "الجهاز العصبي يتطور بسرعة مذهلة.",
              "يمكنه سماع نبضات قلبك وصوتك."
            ]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="tips-banner nutrition">
          <h4 className="banner-title">🥗 نصيحة التغذية</h4>
          <p>{analysis?.fetus?.nutrition || "أكثري من شرب الماء وتناول الأطعمة الغنية بالألياف لتجنب الإمساك."}</p>
        </div>
      </div>
    );
  };

  const renderMotherContent = () => (
    <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
      {(analysis?.mother?.symptoms || [
        { title: "ألم أسفل الظهر", status: "طبيعي", manage: "استخدمي وسادة حمل مريحة للنوم." },
        { title: "حرقة المعدة", status: "طبيعي", manage: "تناولي وجبات صغيرة وكثيرة." },
        { title: "تورم بسيط في القدمين", status: "طبيعي", manage: "ارفعي قدميك عند الجلوس." }
      ]).map((symptom, i) => (
        <div key={i} className="symptom-item-card flex-row justify-between align-center">
          <div className="flex-col" style={{ gap: '4px' }}>
            <span className="symptom-name">{symptom.title}</span>
            <span className="symptom-manage">{symptom.manage}</span>
          </div>
          <span className={`status-tag ${symptom.status === 'طبيعي' ? 'normal' : 'warning'}`}>
            {symptom.status}
          </span>
        </div>
      ))}
    </div>
  );

  const renderTipsContent = () => (
    <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
      <div className="daily-tip-mega-card">
        <div className="flex-row align-center" style={{ gap: '12px', marginBottom: '16px' }}>
          <div className="bulb-pulse-icon">
            <Lightbulb size={24} color="#FFF" />
          </div>
          <h3 className="mega-title">نصيحة اليوم</h3>
        </div>
        <p className="mega-content text-rtl">
          {analysis?.daily_tip || "خصصي 10 دقائق اليوم للتواصل مع طفلك. ضعي يدك على بطنك وتحدثي معه بهدوء، فدراسات تؤكد أن الأجنة تستجيب للأصوات المألوفة في هذه المرحلة."}
        </p>
        <div className="mega-footer">نصيحة ذكية مخصصة لأسبوعك الحالي ✨</div>
      </div>
    </div>
  );

  const renderRisksContent = () => (
    <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
      {[
        { title: "نزيف مهبلي مفاجئ", action: "اذهبي للمستشفى فوراً" },
        { title: "صداع شديد ومستمر", action: "اتصلي بطبيبك الآن" },
        { title: "انخفاض مفاجئ في حركة الجنين", action: "سجلي عدد الركلات واتصلي بالطبيب" },
        { title: "آلام شديدة في البطن", action: "التوجه لقسم الطوارئ" }
      ].map((risk, i) => (
        <div key={i} className="risk-item-card flex-row justify-between align-center">
          <div className="flex-col" style={{ gap: '4px' }}>
            <span className="risk-title">{risk.title}</span>
            <span className="risk-action">{risk.action}</span>
          </div>
          <AlertCircle size={24} color="#EF4444" />
        </div>
      ))}

      <button className="emergency-big-btn flex-row align-center justify-center" style={{ gap: '12px' }}>
        <PhoneCall size={20} />
        <span>اتصال طوارئ</span>
      </button>
    </div>
  );

  return (
    <div className="flex-col follow-up-screen-container" style={{ gap: '20px' }}>
      <Header />

      <div className="flex-row align-center" style={{ gap: '12px' }}>
        <button onClick={onBack} className="back-btn">
          <ChevronLeft size={24} />
        </button>
        <h2 className="section-title">متابعة الحمل</h2>
      </div>

      {/* Weekly Slider */}
      <div className="weekly-slider-container">
        <div className="weeks-scroll-area" ref={scrollRef}>
          {Array.from({ length: 40 }, (_, i) => i + 1).map(week => (
            <button
              key={week}
              data-week={week}
              className={`week-btn ${selectedWeek === week ? 'active' : ''}`}
              onClick={() => setSelectedWeek(week)}
            >
              <span className="week-num">{week}</span>
              <span className="week-txt">أسبوع</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="tabs-selector-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn-pill ${activeSubTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveSubTab(tab.id)}
          >
            {tab.icon}
            <span className="tab-label-text">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="follow-up-content">
        {loading ? (
          <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="fetus-image-preview-container flex-col align-center">
              <div className="skeleton-avatar skeleton" style={{ width: '180px', height: '180px', borderRadius: '50%' }}></div>
              <div className="skeleton-text skeleton" style={{ width: '40%', marginTop: '16px', height: '16px' }}></div>
            </div>

            <div className="stats-glass-grid">
              <div className="stat-glass-item skeleton-card" style={{ padding: '20px', gap: '12px', margin: 0 }}>
                <div className="skeleton-avatar skeleton" style={{ width: '24px', height: '24px' }}></div>
                <div className="flex-col" style={{ flex: 1, gap: '6px' }}>
                  <div className="skeleton-text skeleton" style={{ width: '60%', margin: 0 }}></div>
                  <div className="skeleton-text skeleton" style={{ width: '40%', margin: 0 }}></div>
                </div>
              </div>
              <div className="stat-glass-item skeleton-card" style={{ padding: '20px', gap: '12px', margin: 0 }}>
                <div className="skeleton-avatar skeleton" style={{ width: '24px', height: '24px' }}></div>
                <div className="flex-col" style={{ flex: 1, gap: '6px' }}>
                  <div className="skeleton-text skeleton" style={{ width: '60%', margin: 0 }}></div>
                  <div className="skeleton-text skeleton" style={{ width: '40%', margin: 0 }}></div>
                </div>
              </div>
            </div>

            <div className="info-card fetus-detail-card skeleton-card" style={{ padding: '24px' }}>
              <div className="skeleton-text skeleton" style={{ width: '50%', height: '20px', marginBottom: '20px' }}></div>
              <div className="skeleton-text skeleton" style={{ width: '90%', height: '14px' }}></div>
              <div className="skeleton-text skeleton" style={{ width: '80%', height: '14px' }}></div>
              <div className="skeleton-text skeleton" style={{ width: '85%', height: '14px' }}></div>
            </div>
          </div>
        ) : (
          <>
            {activeSubTab === 'fetus' && renderFetusContent()}
            {activeSubTab === 'mother' && renderMotherContent()}
            {activeSubTab === 'tips' && renderTipsContent()}
            {activeSubTab === 'risks' && renderRisksContent()}
          </>
        )}
      </div>

      <FetusViewer
        isOpen={showFetusViewer}
        onClose={() => setShowFetusViewer(false)}
        initialWeek={selectedWeek}
      />

      <style>{`
                .follow-up-screen-container { padding-bottom: 40px; }
                
                /* Fetus Image Preview */
                .fetus-image-preview-container {
                    background: radial-gradient(circle at center, rgba(168, 116, 246, 0.05) 0%, transparent 70%);
                    padding: 20px 0;
                    margin-bottom: -10px;
                }
                .fetus-display-img {
                    width: 180px;
                    height: auto;
                    filter: drop-shadow(0 15px 30px rgba(168, 116, 246, 0.2));
                    animation: floatImage 4s ease-in-out infinite;
                }
                .image-caption {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--token-purple-pill);
                    margin-top: 12px;
                    opacity: 0.8;
                }
                @keyframes floatImage {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                /* Weekly Slider */
                .weekly-slider-container {
                    margin: 0 -20px;
                    padding: 4px 20px;
                }
                .weeks-scroll-area {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding: 10px 0;
                    scrollbar-width: none;
                }
                .weeks-scroll-area::-webkit-scrollbar { display: none; }
                
                .week-btn {
                    min-width: 64px;
                    height: 80px;
                    border-radius: 20px;
                    background-color: var(--bg-surface);
                    border: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                }
                .week-btn.active {
                    background: linear-gradient(135deg, var(--token-purple-pill) 0%, #8B5CF6 100%);
                    border-color: transparent;
                    color: #FFF;
                    transform: scale(1.1);
                    box-shadow: 0 10px 20px rgba(168, 116, 246, 0.3);
                }
                .week-num { font-size: 24px; font-weight: 800; }
                .week-txt { font-size: 10px; font-weight: 500; opacity: 0.8; }
                
                /* Tabs */
                .tabs-selector-container {
                    display: flex;
                    overflow-x: auto;
                    gap: 12px;
                    padding-bottom: 8px;
                    scrollbar-width: none;
                }
                .tabs-selector-container::-webkit-scrollbar { display: none; }
                .tab-btn-pill {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 16px; border-radius: 20px;
                    background-color: var(--bg-surface); border: 1px solid var(--border-light);
                    color: var(--text-muted); cursor: pointer; white-space: nowrap; transition: all 0.2s;
                }
                .tab-btn-pill.active {
                    background-color: var(--token-purple-pill); border-color: var(--token-purple-pill);
                    color: #FFF; box-shadow: 0 4px 12px rgba(168, 116, 246, 0.2);
                }

                /* Glassmorphism Stats */
                .stats-glass-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                }
                .stat-glass-item {
                    background: rgba(255, 255, 255, 0.6);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 20px; border-radius: 24px;
                    display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
                }
                .glass-val { font-size: 18px; font-weight: 800; color: var(--text-main); }
                .glass-label { font-size: 11px; color: var(--text-muted); }

                /* Cards */
                .info-card {
                    background: #FFF; padding: 24px; border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02); border: 1px solid var(--border-light);
                }
                .card-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; }
                .dev-list { list-style: none; padding: 0; margin: 0; }
                .dev-list li {
                    padding-right: 20px; position: relative; margin-bottom: 10px;
                    font-size: 14px; color: var(--text-muted); line-height: 1.5;
                }
                .dev-list li::before {
                    content: ""; position: absolute; right: 0; top: 8px;
                    width: 6px; height: 6px; border-radius: 50%;
                    background-color: var(--token-purple-pill);
                }

                /* Banners */
                .tips-banner { padding: 20px; border-radius: 20px; border-right: 4px solid; }
                .tips-banner.nutrition { background: #F0FDFA; border-color: #0D9488; }
                .banner-title { font-weight: 700; margin-bottom: 6px; font-size: 14px; color: #134E4A; }
                .tips-banner p { font-size: 13px; color: #115E59; line-height: 1.4; }

                /* Mother Tab */
                .symptom-item-card {
                    background: #FFF; padding: 16px 20px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                }
                .symptom-name { font-weight: 700; font-size: 15px; color: var(--text-main); }
                .symptom-manage { font-size: 12px; color: var(--text-muted); }
                .status-tag { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 700; }
                .status-tag.normal { background: #DCFCE7; color: #166534; }
                .status-tag.warning { background: #FEF3C7; color: #92400E; }

                /* Tips Tab */
                .daily-tip-mega-card {
                    background: linear-gradient(135deg, #A855F7 0%, #6366F1 100%);
                    padding: 30px; border-radius: 32px; color: #FFF;
                    box-shadow: 0 15px 35px rgba(99, 102, 241, 0.3);
                    position: relative; overflow: hidden;
                }
                .mega-title { font-size: 22px; font-weight: 800; }
                .mega-content { font-size: 16px; line-height: 1.7; opacity: 0.95; }
                .mega-footer { margin-top: 20px; font-size: 12px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); }
                .bulb-pulse-icon {
                    width: 48px; height: 48px; border-radius: 16px;
                    background: rgba(255,255,255,0.2); display: flex;
                    justify-content: center; align-items: center;
                    animation: pulseBulb 2s infinite;
                }
                @keyframes pulseBulb {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255,255,255,0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0); }
                }

                /* Risks Tab */
                .risk-item-card {
                    background: #FFF1F2; padding: 18px 20px; border-radius: 20px;
                    border: 1px solid #FECDD3;
                }
                .risk-title { font-weight: 700; font-size: 15px; color: #9F1239; }
                .risk-action { font-size: 12px; color: #E11D48; font-weight: 600; }
                .emergency-big-btn {
                    margin-top: 20px; padding: 18px; border-radius: 24px;
                    background: #E11D48; color: #FFF; border: none;
                    font-size: 18px; font-weight: 800; cursor: pointer;
                    box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);
                    transition: all 0.2s;
                }
                .emergency-big-btn:active { transform: scale(0.98); opacity: 0.9; }

                /* Loading */
                .loading-state { height: 300px; color: var(--text-muted); gap: 16px; }
                .spinner {
                    width: 40px; height: 40px; border: 4px solid rgba(168, 116, 246, 0.1);
                    border-top-color: var(--token-purple-pill); border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                /* Back Button */
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: var(--bg-surface); border: 1px solid var(--border-light);
                    display: flex; justify-content: center; align-items: center;
                    cursor: pointer; color: var(--text-main); transition: all 0.2s;
                }
                .back-btn:hover { background: #F3F0F7; }

                .text-rtl { text-align: right; direction: rtl; }
                .tab-content-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
    </div>
  );
}
