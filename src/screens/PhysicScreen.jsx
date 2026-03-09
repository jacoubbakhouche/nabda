import { ChevronDown, CalendarDays, Heart, Download } from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function PhysicScreen({ onSelectCategory }) {
  const { currentWeek, getTimelinePercentage, selectedDay, setSelectedDay, weekDates, currentMonth, dynamicStats } = usePregnancy();

  return (
    <div className="flex-col" style={{ gap: '24px' }}>

      <Header />

      {/* Screen Title & Month Selector */}
      <div className="flex-row justify-between" style={{ alignItems: 'flex-start' }}>
        <h2 className="section-title">رحلة الحمل</h2>
        <div className="flex-row" style={{ gap: '12px' }}>
          <div className="dropdown-btn text-muted text-sm font-medium">
            {currentMonth} <ChevronDown size={16} />
          </div>
          <div className="action-btn-black">
            <CalendarDays size={18} color="#FFF" />
          </div>
        </div>
      </div>

      {/* Calendar Row */}
      <div className="calendar-row flex-row justify-between" style={{ marginTop: '10px' }}>
        {weekDates.map((item, index) => {
          const isActive = item.date === selectedDay;
          return (
            <div
              key={index}
              className={`calendar-item flex-col align-center ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedDay(item.date)}
              style={{ cursor: 'pointer' }}
            >
              <span className="text-xs text-muted" style={{ marginBottom: '8px', textAlign: 'center' }}>{item.day}</span>
              <div className="date-circle font-semibold">{item.date}</div>
            </div>
          )
        })}
      </div>

      {/* Physic of Mother Card */}
      <div className="white-card-large">
        <div className="flex-row justify-between" style={{ marginBottom: '24px' }}>
          <div className="flex-row" style={{ gap: '12px' }}>
            <div className="icon-badge"><CalendarDays size={18} color="#1C1C1E" /></div>
            <span className="font-semibold" style={{ fontSize: '15px' }}>تطور الجنين</span>
          </div>
          <div className="icon-badge text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
        </div>

        <div className="timeline-labels text-xs font-medium">
          <span>1W</span><span>10W</span><span>20W</span><span>30W</span><span>40W</span>
        </div>
        <div className="progress-bar-container" style={{ marginBottom: '8px' }}>
          <div className="progress-bar-bg" style={{ width: '100%' }}></div>
          <div className="progress-bar-fill" style={{ width: `${getTimelinePercentage(currentWeek)}%`, transition: 'width 0.5s ease' }}></div>
          <div className="progress-dot" style={{ left: `${getTimelinePercentage(currentWeek)}%`, transition: 'left 0.5s ease' }}>{currentWeek}</div>
          <div className="progress-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </div>


      {/* Categories Grid (Group) */}
      <div className="flex-col" style={{ gap: '16px', marginTop: '16px', marginBottom: '80px' }}>
        <h3 className="section-subtitle" style={{ fontSize: '20px', fontWeight: '600', color: '#1C1C1E', marginBottom: '8px' }}>المجموعة</h3>
        <div className="group-grid">
          {[
            { id: 'follow-up', icon: "📊", label: "متابعة الحمل", desc: "تتبع أسبوعي" },
            { id: 'library', icon: "📚", label: "المكتبة", desc: "معلومات طبية" },
            { id: 'appointments', icon: "📅", label: "المواعيد", desc: "جدولة زياراتك" },
            { id: 'medical', icon: "📋", label: "السجل الطبي", desc: "تحاليلك" },
            { id: 'wellness', icon: "🧘", label: "رفاهية", desc: "عناية وراحة" },
            { id: 'prepare', icon: "🤰", label: "الولادة", desc: "دليل اللقاء" },
            { id: 'baby-care', icon: "👶", label: "رعاية الرضيع", desc: "ما بعد الولادة" },
            { id: 'diary', icon: "📝", label: "تجربتك", desc: "يومياتك" },
          ].map((cat, index) => {
            const isPurple = (index % 4 === 0) || (index % 4 === 3);
            return (
              <div
                key={cat.id}
                className={`group-symptom-card ${isPurple ? 'group-purple-card' : 'group-white-card'}`}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              >
                <div className={`group-symptom-icon-wrapper ${isPurple ? 'group-purple-icon' : 'group-white-icon'}`}>
                  <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                </div>
                <div className="group-symptom-text">
                  <div className="group-status-indicator" style={!isPurple ? { color: '#1C1C1E' } : {}}>
                    <span className="group-dot" style={!isPurple ? { backgroundColor: '#1C1C1E' } : {}}></span> {cat.desc}
                  </div>
                  <div className={`group-symptom-name ${!isPurple ? 'group-text-dark' : ''}`}>{cat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .header-container { align-items: center; }
        .icon-btn-border {
          width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border-light);
          display: flex; justify-content: center; align-items: center; background: #FFF;
        }
        
        .section-title { font-size: 24px; font-weight: 600; line-height: 1.2; color: #1C1C1E; }
        .dropdown-btn {
          display: flex; align-items: center; gap: 4px; border-radius: 20px;
          padding: 8px 12px; border: 1px solid var(--border-light); background: #FFF;
        }
        .action-btn-black {
          background-color: #1C1C1E; border-radius: 50%; width: 44px; height: 44px;
          display: flex; justify-content: center; align-items: center;
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
        .calendar-item.active .text-muted { color: var(--token-purple-pill); font-weight: 600; }

        .white-card-large {
          background: #FFF; border-radius: 24px; padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid var(--border-light);
        }
        .icon-badge {
          width: 36px; height: 36px; border-radius: 10px; background: #F8F6FC;
          display: flex; justify-content: center; align-items: center;
        }
        
        .timeline-labels { display: flex; justify-content: space-between; margin-bottom: 12px; color: var(--text-muted); }
        .progress-bar-container { position: relative; height: 12px; display: flex; align-items: center; }
        .progress-bar-bg {
          position: absolute; height: 12px; background-color: #E2E2E6; border-radius: 6px;
          background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, #D4D4D8 4px, #D4D4D8 5px);
        }
        .progress-bar-fill { position: absolute; height: 12px; background-color: var(--token-purple-pill); border-radius: 6px; z-index: 1; }
        .progress-dot {
          position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: var(--token-purple-pill); border: 3px solid #FFF;
          z-index: 2; display: flex; justify-content: center; align-items: center; color: #FFF; font-size: 10px; font-weight: 700;
          transform: translateX(-50%); box-shadow: 0 4px 8px rgba(168, 116, 246, 0.4);
        }
        .progress-arrow {
           position: absolute; right: 0; width: 24px; height: 24px; background-color: #1C1C1E; border-radius: 50%;
           display: flex; justify-content: center; align-items: center; z-index: 2;
        }


        /* Group Cards Styles */
        .group-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .group-symptom-card {
          flex: 1;
          height: 160px;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .group-symptom-card:active { transform: scale(0.96); }
        .group-purple-card {
          background-color: var(--token-purple-light, #A855F7);
          color: #FFF;
        }
        .group-white-card {
          background-color: #FFF;
          border: 1px solid var(--border-light);
        }
        .group-symptom-icon-wrapper {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; justify-content: center; align-items: center;
        }
        .group-purple-icon { background-color: rgba(255, 255, 255, 0.9); }
        .group-white-icon { background-color: #F8F6FC; }
        
        .group-symptom-text { margin-top: auto; }
        .group-status-indicator {
          font-size: 11px; display: flex; align-items: center; gap: 6px; margin-bottom: 4px;
          font-weight: 500;
        }
        .group-dot { width: 6px; height: 6px; border-radius: 50%; background-color: #FFF; }
        .group-symptom-name { font-size: 18px; font-weight: 600; line-height: 1.2; }
        .group-text-dark { color: #1C1C1E; }
      `}</style>
    </div>
  );
}
