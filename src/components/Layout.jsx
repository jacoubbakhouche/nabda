import React from 'react';
import BottomNav from './BottomNav';

export default function Layout({ children, activeTab, setActiveTab }) {
    return (
        <div className="app-container">

            <div className="screen-content">
                {children}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
