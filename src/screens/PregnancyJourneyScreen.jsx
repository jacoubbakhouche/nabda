import React from 'react';
import { ChevronDown, ChevronRight, Flower2, Syringe } from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function PregnancyJourneyScreen({ onSelectCategory }) {
  const { userName, currentWeek, completedWeeks, remainingWeeks, selectedDay, setSelectedDay, weekDates, currentMonth, fetusIndex, adviceIndex } = usePregnancy();

  const babyMessages = [
    "مرحباً ماما! أنا في طور التكوين، أستمد الغذاء منكِ ليتشكل جسمي.",
    "قلبي الصغير بدأ بالنبض والتشكل! حافظي على راحتكِ.",
    "أطرافي بدأت بالنمو، وأصبحت أتحرك قليلاً حتى لو لم تشعري بي.",
    "حواسي تتطور، أنا الآن أسمع نبضات قلبك! إنها أجمل أنشودة.",
    "بدأت أفتح عينيّ وأشعر بالضوء الخارجي من خلالكِ.",
    "مرحباً ماما! أنا أكتسب وزناً الآن وأستعد للقائك قريباً!",
    "أنا جاهز تقريباً للخروج إلى العالم ورؤيتك يا أغلى ماما!"
  ];
  const currentMessage = babyMessages[adviceIndex] || babyMessages[babyMessages.length - 1];

  return (
    <div className="flex-col" style={{ gap: '24px' }}>
      <Header />

      {/* Greeting Area */}
      <div className="flex-col align-start">
        <span className="text-xs font-semibold text-muted">صباح الخير</span>
        <span className="text-lg font-bold">مرحباً {userName}!</span>
      </div>

      {/* Screen Title & Month Selector */}
      <div className="flex-row justify-between" style={{ alignItems: 'flex-start' }}>
        <h2 className="section-title">رحلة الحمل</h2>
        <div className="dropdown-btn text-muted text-sm font-medium">
          شهر {currentMonth} <ChevronDown size={16} />
        </div>
      </div>

      {/* Calendar Row + Action Btn */}
      <div className="flex-row justify-between" style={{ marginTop: '20px', alignItems: 'center' }}>
        <div className="calendar-row flex-row justify-between" style={{ flex: 1, marginRight: '16px' }}>
          {weekDates.map((item, index) => {
            const isActive = item.date === selectedDay;
            return (
              <div
                key={index}
                className={`calendar-item flex-col align-center ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedDay(item.date)}
                style={{ cursor: 'pointer' }}
              >
                <span className="text-xs text-muted" style={{ marginBottom: '8px', textAlign: 'center' }}>
                  {item.day}
                </span>
                <div className="date-circle font-semibold">{item.date}</div>
              </div>
            )
          })}
        </div>
        <div className="action-btn-black">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>

      {/* 3D Fetus Showcase Area */}
      <div className="fetus-showcase">
        <div className="baby-message-bubble">
          {currentMessage}
        </div>
        <div className="fetus-image-container">
          <img
            src={`/fetus${fetusIndex}.png`}
            alt={`Fetus 3D Stage ${fetusIndex}`}
            className="fetus-img-large fade-in"
            onError={(e) => { e.target.onError = null; e.target.src = '/fetus.png'; }}
          />
        </div>

        {/* Floating Badge 1 (Completed Week) */}
        <div className="floating-badge badge-top-right">
          <div className="text-xl font-bold" style={{ color: '#1C1C1E' }}>{completedWeeks}</div>
          <div className="text-xs text-muted font-medium" style={{ lineHeight: 1.2 }}>الأسبوع<br />المكتمل</div>
          <div className="badge-icon badge-icon-tr">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </div>
        </div>

        {/* Floating Badge 2 (Remaining Week) */}
        <div className="floating-badge badge-bottom-left">
          <div className="text-xl font-bold" style={{ color: '#1C1C1E' }}>{remainingWeeks < 10 ? `0${remainingWeeks}` : remainingWeeks}</div>
          <div className="text-xs text-muted font-medium" style={{ lineHeight: 1.2 }}>الأسبوع<br />المتبقي</div>
          <div className="badge-icon badge-icon-tl">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* Symptoms Cards */}
      <div className="flex-row" style={{ gap: '16px', marginTop: '16px' }}>
        <div className="symptom-card purple-card" onClick={() => onSelectCategory('follow-up')} style={{ cursor: 'pointer' }}>
          <div className="symptom-icon-wrapper purple-icon">
            <Syringe size={20} color="#1C1C1E" />
          </div>
          <div className="symptom-text">
            <div className="status-indicator">
              <span className="dot"></span> الأسبوع {currentWeek}
            </div>
            <div className="symptom-name">متابعة الحمل</div>
          </div>
        </div>

        <div className="symptom-card white-card" style={{ alignItems: 'center', justifyContent: 'center', padding: '16px', gap: '8px' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="transparent" stroke="#F3F0F7" strokeWidth="8" />
              <circle cx="50" cy="50" r="44" fill="transparent" stroke="var(--token-purple-pill)" strokeWidth="8"
                strokeDasharray="276" strokeDashoffset={276 - (276 * Math.min(100, Math.round((currentWeek / 40) * 100)) / 100)} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="57" textAnchor="middle" fill="#1C1C1E" style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'inherit' }}>
                {Math.min(100, Math.round((currentWeek / 40) * 100))}%
              </text>
            </svg>
          </div>
          <div className="font-semibold text-sm text-dark" style={{ marginTop: '8px' }}>نسبة التقدم</div>
        </div>
      </div>


      <style>{`
        .section-title { font-size: 24px; font-weight: 600; line-height: 1.2; color: #1C1C1E; }
        .section-subtitle { font-size: 20px; font-weight: 600; color: #1C1C1E; margin-bottom: 8px; }
        
        .dropdown-btn {
          display: flex; align-items: center; gap: 4px; border-radius: 20px;
          padding: 8px 12px; border: 1px solid var(--border-light);
        }
        .action-btn-black {
          background-color: #1C1C1E; border-radius: 50%; width: 44px; height: 44px;
          display: flex; justify-content: center; align-items: center;
          flex-shrink: 0;
        }
        .calendar-row { width: 100%; }
        .calendar-item { align-items: center; }
        .date-circle {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; justify-content: center; align-items: center;
          background-color: transparent; color: #1C1C1E; font-size: 15px;
        }
        .calendar-item.active .date-circle {
          background-color: transparent; color: var(--token-purple-pill);
          border: 2px solid var(--token-purple-pill);
        }
        .calendar-item.active .text-muted {
          color: var(--token-purple-pill);
          font-weight: 600;
        }
        
        .fetus-showcase {
          position: relative;
          height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
          perspective: 1000px;
        }
        .baby-message-bubble {
          position: absolute;
          top: -20px;
          background-color: var(--token-purple-pill);
          color: #FFF;
          padding: 8px 16px;
          border-radius: 16px 16px 16px 0;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(168, 116, 246, 0.3);
          z-index: 100;
          max-width: 200px;
          animation: bubbleFloat 3s ease-in-out infinite alternate;
        }
        @keyframes bubbleFloat {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
        .fetus-image-container {
          position: relative;
          z-index: 50;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: floatAnimation 4s ease-in-out infinite;
        }
        .fetus-image-container:hover {
          transform: scale(1.4) translateY(-10px) rotateY(15deg);
          z-index: 200;
        }
        @keyframes floatAnimation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .fetus-img-large {
          width: 200px;
          height: auto;
          filter: drop-shadow(0 20px 30px rgba(168, 116, 246, 0.25));
          transition: filter 0.3s ease;
        }
        .fetus-image-container:hover .fetus-img-large {
          filter: drop-shadow(0 30px 40px rgba(168, 116, 246, 0.4));
        }
 
        .floating-badge {
          position: absolute;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 16px;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          border: 1px solid rgba(255,255,255,0.8);
          z-index: 2;
          width: 120px;
        }
        .badge-top-right {
          top: 20px;
          right: 0px;
          transform: rotate(5deg);
        }
        .badge-bottom-left {
          bottom: 20px;
          left: 0px;
          transform: rotate(-5deg);
        }
 
        .badge-icon {
          position: absolute;
          width: 24px; height: 24px; border-radius: 50%;
          background: #FFF; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        }
        .badge-icon-tr { top: -10px; right: 16px; }
        .badge-icon-tl { top: -10px; left: 16px; }
 
        .symptom-card {
          flex: 1;
          height: 160px;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }
        .purple-card {
          background-color: var(--token-purple-light);
          color: #FFF;
        }
        .white-card {
          background-color: #FFF;
          border: 1px solid var(--border-light);
        }
        
        .symptom-icon-wrapper {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; justify-content: center; align-items: center;
        }
        .purple-icon { background-color: rgba(255, 255, 255, 0.9); }
        .white-icon { background-color: #F8F6FC; }
 
        .symptom-text { margin-top: auto; }
        .status-indicator {
          font-size: 11px; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
          font-weight: 500;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%; background-color: #FFF;
        }
        .symptom-name { font-size: 18px; font-weight: 600; line-height: 1.2; }
        .text-dark { color: #1C1C1E; }
 
      `}</style>
    </div>
  );
}
