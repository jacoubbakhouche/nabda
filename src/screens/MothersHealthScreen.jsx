import React, { useState } from 'react';
import Header from '../components/Header';
import { Heart, ChevronRight, ChevronDown } from 'lucide-react';
import { usePregnancy } from '../context/PregnancyContext';

export default function MothersHealthScreen() {
  const [activeSegment, setActiveSegment] = useState('Months');
  const { currentWeek, getTimelinePercentage, fetusIndex } = usePregnancy();

  return (
    <div className="flex-col" style={{ gap: '24px' }}>
      <Header />

      {/* Segmented Control */}
      <div className="segment-control">
        {['Weeks', 'Months', 'Trimesters'].map(seg => (
          <button
            key={seg}
            className={`segment-btn ${activeSegment === seg ? 'active' : ''}`}
            onClick={() => setActiveSegment(seg)}
          >
            {seg}
          </button>
        ))}
      </div>

      {/* Title Area */}
      <div className="flex-row justify-between align-start">
        <h2 className="section-title">صحة الأم<br />سجل المتابعة</h2>
        <div className="dropdown-btn text-muted text-sm">
          {activeSegment} <ChevronDown size={16} />
        </div>
      </div>

      {/* Main Card */}
      <div className="timeline-card">
        <img src="/pregnant_woman.png" alt="Pregnant woman" className="timeline-img" />

        <div className="card-top flex-row justify-between">
          <div className="heart-icon-wrapper">
            <Heart size={20} color="#1C1C1E" strokeWidth={1.5} />
          </div>
          <div className="card-title">الجدول الزمني<br />للحمل</div>
        </div>

        <div className="card-bottom">
          <div className="timeline-labels text-xs font-semibold">
            <span>12W</span>
            <span>16W</span>
            <span>20W</span>
            <span>24W</span>
            <span>28W</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg"></div>
            <div className="progress-bar-fill" style={{ width: `${getTimelinePercentage(currentWeek)}%`, transition: 'width 0.5s ease' }}></div>
            <div className="progress-dot" style={{ left: `${getTimelinePercentage(currentWeek)}%`, transition: 'left 0.5s ease' }}>{currentWeek}</div>
            <div className="progress-arrow">
              <ChevronRight size={14} color="#FFF" />
            </div>
          </div>
        </div>
      </div>

      {/* List Items */}
      <div className="list-items flex-col" style={{ gap: '16px' }}>
        <HealthItem
          title="فحص سكر الحمل"
          week="الأسبوع الخامس والعشرون"
          imgSrc={`/fetus${fetusIndex + 1}.png`}
        />
        <HealthItem
          title="مراقبة ضغط الدم"
          week="الأسبوع الخامس والعشرون"
          imgSrc={`/fetus${fetusIndex + 1}.png`}
        />
      </div>

      <style>{`
        .segment-control {
          display: flex;
          background-color: var(--bg-surface);
          border-radius: 40px;
          padding: 6px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .segment-btn {
          flex: 1;
          padding: 12px 0;
          border: none;
          background: transparent;
          border-radius: 40px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .segment-btn.active {
          background-color: var(--token-purple-pill);
          color: #FFF;
          box-shadow: 0 4px 12px rgba(168, 116, 246, 0.4);
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.3;
        }
        .dropdown-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: var(--bg-surface);
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .timeline-card {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .timeline-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
        }
        .card-top {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 24px;
          align-items: flex-start;
        }
        .heart-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card-title {
          font-size: 18px;
          font-weight: 600;
          text-align: right;
          color: #1C1C1E;
        }

        .card-bottom {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 16px;
        }
        .timeline-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #1C1C1E;
        }
        .progress-bar-container {
          position: relative;
          height: 12px;
          display: flex;
          align-items: center;
        }
        .progress-bar-bg {
          position: absolute;
          width: 100%;
          height: 12px;
          background-color: #E2E2E6; /* Light gray */
          /* Adding a diagonal pattern for the remaining part (mock) */
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            #D4D4D8 4px,
            #D4D4D8 5px
          );
          border-radius: 6px;
        }
        .progress-bar-fill {
          position: absolute;
          height: 12px;
          background-color: var(--token-purple-pill);
          border-radius: 6px;
          z-index: 1;
        }
        .progress-dot {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--token-purple-pill);
          border: 3px solid #FFF;
          z-index: 2;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFF;
          font-size: 10px;
          font-weight: 700;
          transform: translateX(-50%);
          box-shadow: 0 4px 8px rgba(168, 116, 246, 0.4);
        }
        .progress-arrow {
           position: absolute;
           right: 0;
           width: 24px;
           height: 24px;
           background-color: #1C1C1E;
           border-radius: 50%;
           display: flex;
           justify-content: center;
           align-items: center;
           z-index: 2;
        }
      `}</style>
    </div>
  );
}

function HealthItem({ title, week, imgSrc }) {
  return (
    <div className="health-item flex-row justify-between">
      <div className="flex-row" style={{ gap: '16px' }}>
        <div className="item-icon-wrapper">
          {imgSrc ? (
            <img src={imgSrc} alt={title} className="item-img" onError={(e) => { e.target.onError = null; e.target.src = '/fetus.png'; }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', borderRadius: '12px' }}></div>
          )}
        </div>
        <div className="flex-col">
          <span className="font-semibold text-sm" style={{ marginBottom: '4px' }}>{title}</span>
          <span className="text-xs text-muted font-medium">{week}</span>
        </div>
      </div>
      <div className="action-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="19" x2="19" y2="5"></line>
          <polyline points="9 5 19 5 19 15"></polyline>
        </svg>
      </div>
      <style>{`
        .health-item {
          background-color: var(--bg-surface);
          padding: 12px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .item-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background-color: #F8F6FC;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6px;
        }
        .item-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .action-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
