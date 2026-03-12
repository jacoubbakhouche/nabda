import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Ruler, Weight, Calendar, Clock } from 'lucide-react';
import { usePregnancy } from '../context/PregnancyContext';

// Available fetus image indices (based on actual files in /public)
const AVAILABLE_IMAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 19];

// Map week (1-40) to the closest available fetus image
const getClosestFetusImage = (week) => {
    const clamped = Math.min(Math.max(1, week), 40);
    let closest = AVAILABLE_IMAGES[0];
    let minDiff = Math.abs(clamped - closest);
    for (const img of AVAILABLE_IMAGES) {
        const diff = Math.abs(clamped - img);
        if (diff < minDiff) {
            minDiff = diff;
            closest = img;
        }
    }
    return closest;
};

// Approximate fetus data by week (height in cm, weight in grams)
const fetusData = {
    1: { height: '0.1', weight: '< 1' },
    2: { height: '0.1', weight: '< 1' },
    3: { height: '0.1', weight: '< 1' },
    4: { height: '0.2', weight: '< 1' },
    5: { height: '0.3', weight: '< 1' },
    6: { height: '0.5', weight: '< 1' },
    7: { height: '1', weight: '< 1' },
    8: { height: '1.6', weight: '1' },
    9: { height: '2.3', weight: '2' },
    10: { height: '3.1', weight: '4' },
    11: { height: '4.1', weight: '7' },
    12: { height: '5.4', weight: '14' },
    13: { height: '7.4', weight: '23' },
    14: { height: '8.7', weight: '43' },
    15: { height: '10.1', weight: '70' },
    16: { height: '11.6', weight: '100' },
    17: { height: '13', weight: '140' },
    18: { height: '14.2', weight: '190' },
    19: { height: '15.3', weight: '240' },
    20: { height: '16.4', weight: '300' },
    21: { height: '26.7', weight: '360' },
    22: { height: '27.8', weight: '430' },
    23: { height: '28.9', weight: '500' },
    24: { height: '30', weight: '600' },
    25: { height: '34.6', weight: '660' },
    26: { height: '35.6', weight: '760' },
    27: { height: '36.6', weight: '875' },
    28: { height: '37.6', weight: '1000' },
    29: { height: '38.6', weight: '1150' },
    30: { height: '39.9', weight: '1320' },
    31: { height: '41.1', weight: '1500' },
    32: { height: '42.4', weight: '1700' },
    33: { height: '43.7', weight: '1920' },
    34: { height: '45', weight: '2150' },
    35: { height: '46.2', weight: '2380' },
    36: { height: '47.4', weight: '2620' },
    37: { height: '48.6', weight: '2860' },
    38: { height: '49.8', weight: '3080' },
    39: { height: '50.7', weight: '3290' },
    40: { height: '51.2', weight: '3460' },
};

export default function FetusViewer({ isOpen, onClose, initialWeek }) {
    const { completedWeeks, remainingWeeks } = usePregnancy();
    const [viewWeek, setViewWeek] = useState(initialWeek || 1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [animating, setAnimating] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isOpen && initialWeek) {
            setViewWeek(initialWeek);
        }
    }, [isOpen, initialWeek]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const currentData = fetusData[viewWeek] || { height: '--', weight: '--' };
    const imgIndex = getClosestFetusImage(viewWeek);

    const goToWeek = (newWeek) => {
        if (newWeek < 1 || newWeek > 40 || animating) return;
        setAnimating(true);
        const direction = newWeek > viewWeek ? -1 : 1;
        setTranslateX(direction * window.innerWidth);
        setTimeout(() => {
            setViewWeek(newWeek);
            setTranslateX(-direction * window.innerWidth);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTranslateX(0);
                    setTimeout(() => setAnimating(false), 350);
                });
            });
        }, 200);
    };

    const handleTouchStart = (e) => {
        if (animating) return;
        setIsDragging(true);
        setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || animating) return;
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;
        setTranslateX(diff);
    };

    const handleTouchEnd = () => {
        if (!isDragging || animating) return;
        setIsDragging(false);
        const threshold = 60;
        if (translateX < -threshold && viewWeek < 40) {
            goToWeek(viewWeek + 1);
        } else if (translateX > threshold && viewWeek > 1) {
            goToWeek(viewWeek - 1);
        } else {
            setTranslateX(0);
        }
    };

    const progressPercent = Math.round((viewWeek / 40) * 100);

    return (
        <div className="fetus-viewer-overlay">
            {/* Top Bar */}
            <div className="fv-top-bar">
                <button className="fv-close-btn" onClick={onClose}>
                    <ChevronLeft size={28} strokeWidth={2.5} />
                </button>
                <div className="fv-week-indicator">
                    الأسبوع {viewWeek}
                </div>
                <div style={{ width: '48px' }}></div>
            </div>

            {/* Progress Bar */}
            <div className="fv-progress-container">
                <div className="fv-progress-bar">
                    <div className="fv-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="fv-progress-labels">
                    <span>الأسبوع 1</span>
                    <span>الأسبوع 40</span>
                </div>
            </div>

            {/* Main Carousel Area */}
            <div
                className="fv-carousel-area"
                ref={containerRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={isDragging ? handleTouchMove : undefined}
                onMouseUp={handleTouchEnd}
                onMouseLeave={isDragging ? handleTouchEnd : undefined}
            >
                <div
                    className="fv-image-wrapper"
                    style={{
                        transform: `translateX(${translateX}px)`,
                        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                >
                    <img
                        src={`/fetus${imgIndex}.png`}
                        alt={`الجنين في الأسبوع ${viewWeek}`}
                        className="fv-fetus-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = '/fetus.png'; }}
                        draggable={false}
                    />
                </div>
            </div>

            {/* Bottom Stats Panel */}
            <div className="fv-stats-panel">
                <div className="fv-stat-item">
                    <div className="fv-stat-icon"><Ruler size={18} /></div>
                    <div className="fv-stat-info">
                        <span className="fv-stat-value">{currentData.height} سم</span>
                        <span className="fv-stat-label">الطول</span>
                    </div>
                </div>
                <div className="fv-stat-divider"></div>
                <div className="fv-stat-item">
                    <div className="fv-stat-icon"><Weight size={18} /></div>
                    <div className="fv-stat-info">
                        <span className="fv-stat-value">{currentData.weight} غ</span>
                        <span className="fv-stat-label">الوزن</span>
                    </div>
                </div>
                <div className="fv-stat-divider"></div>
                <div className="fv-stat-item">
                    <div className="fv-stat-icon"><Calendar size={18} /></div>
                    <div className="fv-stat-info">
                        <span className="fv-stat-value">{viewWeek}</span>
                        <span className="fv-stat-label">أسبوع مكتمل</span>
                    </div>
                </div>
                <div className="fv-stat-divider"></div>
                <div className="fv-stat-item">
                    <div className="fv-stat-icon"><Clock size={18} /></div>
                    <div className="fv-stat-info">
                        <span className="fv-stat-value">{Math.max(0, 40 - viewWeek)}</span>
                        <span className="fv-stat-label">أسبوع متبقي</span>
                    </div>
                </div>
            </div>

            {/* Swipe hint */}
            <div className="fv-swipe-hint">
                ← اسحبي لتصفح الأسابيع →
            </div>

            <style>{`
                .fetus-viewer-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(180deg, #FCFBFE 0%, #F3EEFA 40%, #EAE2F8 100%);
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    animation: fvFadeIn 0.35s ease-out;
                    user-select: none;
                    -webkit-user-select: none;
                }
                @keyframes fvFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                /* Top Bar */
                .fv-top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 56px 20px 12px 20px;
                }
                .fv-close-btn {
                    width: 48px; height: 48px; border-radius: 50%;
                    background: #FFF;
                    border: 1px solid var(--border-light);
                    display: flex; justify-content: center; align-items: center;
                    cursor: pointer; color: var(--text-main); transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                }
                .fv-close-btn:hover { background: #F8F6FC; border-color: var(--token-purple-pill); color: var(--token-purple-pill); }
                .fv-week-indicator {
                    font-size: 20px; font-weight: 800; color: var(--text-main);
                    text-align: center;
                }

                /* Progress Bar */
                .fv-progress-container {
                    padding: 0 24px;
                    margin-bottom: 8px;
                }
                .fv-progress-bar {
                    height: 5px;
                    background: rgba(168, 116, 246, 0.12);
                    border-radius: 5px;
                    overflow: hidden;
                }
                .fv-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--token-purple-pill) 0%, var(--token-purple-light) 100%);
                    border-radius: 5px;
                    transition: width 0.4s ease;
                }
                .fv-progress-labels {
                    display: flex; justify-content: space-between;
                    font-size: 10px; color: var(--text-muted);
                    margin-top: 4px;
                    opacity: 0.6;
                }

                /* Carousel */
                .fv-carousel-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    touch-action: pan-y;
                }
                .fv-image-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    will-change: transform;
                }
                .fv-fetus-img {
                    width: 340px;
                    height: auto;
                    max-height: 60vh;
                    object-fit: contain;
                    filter: drop-shadow(0 25px 50px rgba(168, 116, 246, 0.25));
                    animation: fvFloat 5s ease-in-out infinite;
                    pointer-events: none;
                }
                @keyframes fvFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }

                /* Bottom Stats */
                .fv-stats-panel {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    padding: 18px 12px;
                    margin: 0 16px 8px 16px;
                    background: #FFF;
                    border: 1px solid var(--border-light);
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .fv-stat-item {
                    display: flex; align-items: center; gap: 8px;
                }
                .fv-stat-icon {
                    color: var(--token-purple-pill);
                }
                .fv-stat-info {
                    display: flex; flex-direction: column;
                }
                .fv-stat-value {
                    font-size: 15px; font-weight: 800; color: var(--text-main);
                }
                .fv-stat-label {
                    font-size: 10px; color: var(--text-muted); font-weight: 500;
                }
                .fv-stat-divider {
                    width: 1px; height: 28px;
                    background: var(--border-light);
                }

                /* Swipe Hint */
                .fv-swipe-hint {
                    text-align: center;
                    padding: 8px 0 36px 0;
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                    opacity: 0.5;
                    animation: fvPulse 3s ease-in-out infinite;
                }
                @keyframes fvPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}
