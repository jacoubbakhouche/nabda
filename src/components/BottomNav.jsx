import React from 'react';
import { Home, Watch, Cpu, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'watch', icon: Watch },
    { id: 'ai', icon: Cpu },
    { id: 'profile', icon: User }
  ];

  return (
    <div className="bottom-nav-container">
      <div className="bottom-nav">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="icon-wrapper">
                <Icon size={24} color={isActive ? "var(--token-purple-pill)" : "#6B6A71"} strokeWidth={isActive ? 2.5 : 2} />
              </div>
            </button>
          )
        })}
      </div>

      <style>{`
        .bottom-nav-container {
          position: fixed;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 400px;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          z-index: 1000;
        }
        .bottom-nav {
          background-color: var(--nav-bg);
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          outline: none;
          transition: all 0.2s ease;
        }
        .nav-btn.active {
          background-color: rgba(168, 116, 246, 0.2); /* very subtle purple on black */
        }
        .icon-wrapper {
          display: flex;
        }
      `}</style>
    </div>
  );
}
