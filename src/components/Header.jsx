import React from 'react';
import { Bell } from 'lucide-react';
import { usePregnancy } from '../context/PregnancyContext';

export default function Header() {
  const { currentWeek, avatarUrl, userName } = usePregnancy();
  const progressValue = Math.min(100, Math.round((currentWeek / 40) * 100));
  const circleCircumference = 264;
  const strokeDashoffset = circleCircumference - (circleCircumference * progressValue / 100);

  return (
    <div className="header-container">
      <div className="header-brand flex-col">
        <div className="app-name">نَبضة</div>
        <div className="app-slogan">تسعة أشهر بأمان</div>
      </div>
      <div className="header-actions">
        <div className="profile-img-container" style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: avatarUrl ? 'transparent' : 'var(--token-purple-pill)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FFF', fontSize: '20px', fontWeight: 'bold' }}>
          {!avatarUrl && (userName ? userName.charAt(0) : 'م')}
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
        .app-slogan {
          font-size: 13px;
          font-weight: 500;
          color: var(--token-purple-pill);
          margin-top: -2px;
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
