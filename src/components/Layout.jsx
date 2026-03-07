import React from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="app-container">
            {/* Top Status Bar (fake) */}
            <div className="flex-row justify-between align-start" style={{ padding: '16px 24px 8px 32px' }}>
                <span style={{ fontSize: '15px', fontWeight: '600', paddingTop: '4px' }}>9:41</span>
                <div className="flex-row" style={{ gap: '6px' }}>
                    <div style={{ width: 16, height: 12, backgroundColor: '#000', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
                    <div style={{ width: 14, height: 12, borderRadius: 2, backgroundColor: '#000' }}></div>
                    <div style={{ width: 22, height: 12, border: '1px solid #000', borderRadius: 4, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 1, right: 1, bottom: 1, left: 1, backgroundColor: '#000', borderRadius: 2 }}></div>
                    </div>
                </div>
            </div>

            <div className="screen-content">
                {children}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
