import React, { useState, useEffect, useRef } from 'react';
import { X, Wind, Sparkles, Loader2, Play, Pause, RotateCcw } from 'lucide-react';

export default function BreathingExercise({ week, onGetMantra, onClose }) {
    const [phase, setPhase] = useState('ready'); // ready, inhaling, holding, exhaling
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(4);
    const [mantra, setMantra] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchMantra = async () => {
            const data = await onGetMantra(week);
            setMantra(data);
            setIsLoading(false);
        };
        fetchMantra();
    }, [week]);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        nextPhase();
                        return 4;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, phase]);

    const nextPhase = () => {
        setPhase((prev) => {
            if (prev === 'inhaling') return 'holding';
            if (prev === 'holding') return 'exhaling';
            return 'inhaling';
        });
    };

    const startExercise = () => {
        setIsActive(true);
        setPhase('inhaling');
        setTimeLeft(4);
    };

    const resetExercise = () => {
        setIsActive(false);
        setPhase('ready');
        setTimeLeft(4);
    };

    return (
        <div className="breathing-overlay fade-in">
            <div className="breathing-card flex-col align-center">
                <button onClick={onClose} className="close-btn-breathing">
                    <X size={24} />
                </button>

                <div className="breathing-header flex-col align-center">
                    <Wind size={40} color="var(--token-purple-pill)" />
                    <h2 className="breathing-title">تمرين التنفس العميق</h2>
                    {isLoading ? (
                        <div className="loading-mantra flex-row align-center">
                            <Loader2 className="animate-spin" size={16} />
                            <span>توليد التوكيدات...</span>
                        </div>
                    ) : (
                        <div className="mantra-container flex-col align-center tab-content-fade-in">
                            <p className="mantra-text">"{mantra?.mantra}"</p>
                            <span className="mantra-focus">{mantra?.focus}</span>
                        </div>
                    )}
                </div>

                <div className="exercise-area flex-col align-center">
                    <div className={`breathing-circle-container ${phase}`}>
                        <div className="breathing-circle outer"></div>
                        <div className="breathing-circle inner"></div>
                        <div className="phase-text">
                            {phase === 'ready' && 'جاهزة؟'}
                            {phase === 'inhaling' && 'شهـيق'}
                            {phase === 'holding' && 'توقف'}
                            {phase === 'exhaling' && 'زفـير'}
                        </div>
                        <div className="timer-text">{isActive ? timeLeft : ''}</div>
                    </div>

                    <div className="controls flex-row align-center" style={{ gap: '20px', marginTop: '40px' }}>
                        {!isActive ? (
                            <button className="control-btn primary" onClick={startExercise}>
                                <Play fill="currentColor" size={24} />
                                <span>ابدئي الآن</span>
                            </button>
                        ) : (
                            <>
                                <button className="control-btn secondary" onClick={() => setIsActive(false)}>
                                    <Pause fill="currentColor" size={24} />
                                    <span>إيقاف</span>
                                </button>
                                <button className="control-btn icon-only" onClick={resetExercise}>
                                    <RotateCcw size={24} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .breathing-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: #F0F4F8; z-index: 2500; display: flex;
                    justify-content: center; align-items: center;
                }
                .breathing-card {
                    width: 100%; max-width: 400px; height: 100%;
                    padding: 40px 24px; position: relative; background: #FFF;
                }
                .close-btn-breathing {
                    position: absolute; top: 20px; left: 20px;
                    background: none; border: none; cursor: pointer; color: #64748B;
                }
                .breathing-title { font-size: 24px; font-weight: 800; margin: 16px 0 8px 0; color: #1E293B; }
                
                .mantra-container { text-align: center; margin-bottom: 40px; }
                .mantra-text { font-size: 18px; font-weight: 700; color: #475569; font-style: italic; }
                .mantra-focus { font-size: 12px; color: #94A3B8; margin-top: 4px; }
                .loading-mantra { gap: 8px; color: #94A3B8; font-size: 14px; }

                /* Breathing Animation */
                .exercise-area { flex: 1; display: flex; justify-content: center; width: 100%; }
                .breathing-circle-container {
                    position: relative; width: 220px; height: 220px;
                    display: flex; justify-content: center; align-items: center;
                }
                .breathing-circle {
                    position: absolute; border-radius: 50%; width: 100%; height: 100%;
                    transition: transform 4s linear;
                }
                .breathing-circle.outer { background: rgba(168, 116, 246, 0.1); }
                .breathing-circle.inner { background: rgba(168, 116, 246, 0.3); border: 2px solid #FFF; width: 80%; height: 80%; }

                .inhaling .breathing-circle.outer { transform: scale(1.4); }
                .inhaling .breathing-circle.inner { transform: scale(1.3); }
                .exhaling .breathing-circle.outer { transform: scale(1); }
                .exhaling .breathing-circle.inner { transform: scale(1); }
                .holding .breathing-circle { /* Stay as is */ }

                .phase-text { position: relative; z-index: 10; font-size: 24px; font-weight: 800; color: var(--token-purple-pill); }
                .timer-text { position: absolute; bottom: -30px; font-size: 14px; font-weight: 700; color: #94A3B8; }

                .control-btn {
                    display: flex; align-items: center; gap: 12px;
                    padding: 16px 32px; border-radius: 30px; border: none;
                    font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.2s;
                }
                .control-btn.primary { background: var(--token-purple-pill); color: #FFF; box-shadow: 0 4px 15px rgba(168, 116, 246, 0.4); }
                .control-btn.secondary { background: #F1F5F9; color: #475569; }
                .control-btn.icon-only { width: 56px; height: 56px; border-radius: 50%; padding: 0; background: #F1F5F9; color: #475569; justify-content: center; }

                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
