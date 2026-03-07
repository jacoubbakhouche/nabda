import React from 'react';
import { Bell } from 'lucide-react';
import { usePregnancy } from '../context/PregnancyContext';

export default function Header() {
  const { currentWeek } = usePregnancy();
  const progressValue = Math.min(100, Math.round((currentWeek / 40) * 100));
  const circleCircumference = 264;
  const strokeDashoffset = circleCircumference - (circleCircumference * progressValue / 100);

  return (
    <div className="header-container">
      <div className="header-brand flex-row" style={{ gap: '16px', alignItems: 'center' }}>
        <div className="progress-ring-container">
          <svg width="56" height="56" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="#F3F0F7" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--token-purple-pill)" strokeWidth="8"
              strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 50 50)" />
            <text x="50" y="55" textAnchor="middle" className="progress-text">{progressValue}%</text>
          </svg>
        </div>
        <div className="flex-col">
          <div className="app-name">نَبضة</div>
          <div className="app-slogan">تسعة أشهر بأمان</div>
        </div>
      </div>
      <div className="header-actions">
        <div className="profile-img-container">
          <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="profile-img" />
        </div>
        <div className="notification-btn">
          <Bell size={22} color="#1C1C1E" strokeWidth={1.5} />
        </div>
      </div>
      <style>{`
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }
        .header-brand {
          display: flex;
          flex-direction: column;
        }
        .app-name {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }
        .app-slogan {
          font-size: 13px;
          font-weight: 500;
          color: var(--token-purple-pill);
          margin-top: -2px;
        }
        .progress-ring-container {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .progress-text {
          font-size: 20px;
          font-weight: 700;
          fill: var(--text-main);
          font-family: inherit;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .profile-img-container {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
        }
        .profile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .notification-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--border-light);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
