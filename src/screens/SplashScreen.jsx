import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setFadeOut(true), 2200);
        const endTimer = setTimeout(() => onFinish(), 2800);
        return () => { clearTimeout(timer); clearTimeout(endTimer); };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="splash-bg-image" />
            <div className="splash-overlay" />

            <div className="splash-content">
                <div className="splash-logo-pulse">
                    <span className="splash-heart">💜</span>
                </div>
                <h1 className="splash-title">نَبضة</h1>
                <p className="splash-slogan">تسعة أشهر بأمان</p>
                <div className="splash-loader">
                    <div className="splash-loader-bar" />
                </div>
            </div>

            <style>{`
                .splash-screen {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.6s ease;
                    opacity: 1;
                }

                .splash-screen.fade-out {
                    opacity: 0;
                    pointer-events: none;
                }

                .splash-bg-image {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: url('/welcome-bg.png') center center / cover no-repeat;
                    z-index: 0;
                }

                .splash-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(168, 85, 247, 0.55) 0%,
                        rgba(139, 92, 246, 0.7) 50%,
                        rgba(109, 40, 217, 0.85) 100%
                    );
                    z-index: 1;
                }

                .splash-content {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    animation: splashSlideUp 0.8s ease-out;
                }

                .splash-logo-pulse {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    animation: pulse 1.5s ease-in-out infinite;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .splash-heart {
                    font-size: 44px;
                    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
                }

                .splash-title {
                    font-size: 48px;
                    font-weight: 900;
                    color: #FFF;
                    margin: 0 0 8px 0;
                    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    letter-spacing: 2px;
                }

                .splash-slogan {
                    font-size: 18px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.85);
                    margin: 0 0 40px 0;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .splash-loader {
                    width: 120px;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.25);
                    border-radius: 4px;
                    overflow: hidden;
                }

                .splash-loader-bar {
                    width: 100%;
                    height: 100%;
                    background: #FFF;
                    border-radius: 4px;
                    animation: splashLoad 2.2s ease-in-out;
                    transform-origin: right;
                }

                @keyframes splashSlideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255,255,255,0); }
                }

                @keyframes splashLoad {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
}
