import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Lightbulb, Baby, Loader2 } from 'lucide-react';

export default function LuckyBox({ week, onGetContent, onClose }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContent] = useState(null);

    const handleOpenBox = async () => {
        setIsLoading(true);
        const data = await onGetContent(week);
        setContent(data);
        setIsLoading(false);
        setIsOpen(true);
    };

    return (
        <div className="lucky-box-overlay fade-in">
            <div className="lucky-box-card">
                <button onClick={onClose} className="close-btn-lucky">
                    <X size={20} />
                </button>

                {!isOpen ? (
                    <div className="box-closed-content flex-col align-center">
                        <div className="magic-box-container" onClick={handleOpenBox}>
                            <div className="box-lid"></div>
                            <div className="box-body"></div>
                            <div className="box-glow"></div>
                            <Sparkles className="box-sparkles" size={32} color="#FFD700" />
                        </div>
                        <h2 className="box-prompt">اضغطي لفتح صندوق الحظ</h2>
                        <p className="box-sub">رسائل إيجابية، نصائح، وحقائق عن جنينكِ</p>
                        {isLoading && (
                            <div className="loading-spinner-lucky flex-row align-center">
                                <Loader2 className="animate-spin" size={20} />
                                <span>جاري تحضير المفاجأة...</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="box-open-content tab-content-fade-in flex-col align-center">
                        <div className="victory-crown">👑</div>
                        <div className="lucky-word">
                            <Heart size={20} fill="#EF4444" color="#EF4444" />
                            <span>{content?.word || 'حب'}</span>
                        </div>

                        <div className="lucky-items flex-col full-width">
                            <div className="lucky-item advice">
                                <div className="item-icon-circle" style={{ background: '#FDF2F8' }}>
                                    <Lightbulb size={24} color="#EC4899" />
                                </div>
                                <div className="flex-col">
                                    <span className="item-label">نصيحة لكِ</span>
                                    <p className="item-text">{content?.advice}</p>
                                </div>
                            </div>

                            <div className="lucky-item fact">
                                <div className="item-icon-circle" style={{ background: '#EFF6FF' }}>
                                    <Baby size={24} color="#3B82F6" />
                                </div>
                                <div className="flex-col">
                                    <span className="item-label">عن جنينكِ</span>
                                    <p className="item-text">{content?.fact}</p>
                                </div>
                            </div>
                        </div>

                        <button className="lucky-close-btn" onClick={onClose}>شكراً لكِ</button>
                    </div>
                )}
            </div>

            <style>{`
                .lucky-box-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
                    z-index: 2000; display: flex; justify-content: center; align-items: center;
                    padding: 24px;
                }
                .lucky-box-card {
                    background: #FFF; width: 100%; max-width: 360px;
                    border-radius: 32px; padding: 32px; position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .close-btn-lucky {
                    position: absolute; top: 16px; left: 16px;
                    width: 32px; height: 32px; border-radius: 50%;
                    border: none; background: #F3F4F6;
                    display: flex; justify-content: center; align-items: center;
                    cursor: pointer; color: #6B7280;
                }

                /* Magic Box Animation */
                .magic-box-container {
                    position: relative; width: 120px; height: 120px;
                    margin-bottom: 24px; cursor: pointer; transition: transform 0.3s;
                }
                .magic-box-container:hover { transform: scale(1.05); }
                .box-body {
                    position: absolute; bottom: 0; left: 10px; width: 100px; height: 70px;
                    background: linear-gradient(135deg, #DEACFF 0%, #A874F6 100%);
                    border-radius: 8px; box-shadow: 0 8px 20px rgba(168, 116, 246, 0.3);
                }
                .box-lid {
                    position: absolute; bottom: 65px; left: 5px; width: 110px; height: 25px;
                    background: #C492FF; border-radius: 6px; z-index: 2;
                }
                .box-glow {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 140px; height: 140px; background: rgba(168, 116, 246, 0.2);
                    filter: blur(25px); border-radius: 50%; animation: pulse 2s infinite;
                }
                .box-sparkles {
                    position: absolute; top: -10px; right: -10px;
                    animation: float 3s infinite ease-in-out;
                }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-10px) rotate(15deg); }
                }

                .box-prompt { font-size: 20px; font-weight: 800; color: #1F2937; margin-bottom: 8px; }
                .box-sub { font-size: 13px; color: #6B7280; margin-bottom: 24px; text-align: center; }
                .loading-spinner-lucky { gap: 8px; color: var(--token-purple-pill); font-size: 14px; font-weight: 600; }

                /* Open Content */
                .victory-crown { font-size: 48px; margin-bottom: 12px; }
                .lucky-word {
                    display: flex; align-items: center; gap: 8px;
                    background: #FEF2F2; padding: 6px 16px; border-radius: 20px;
                    margin-bottom: 24px;
                }
                .lucky-word span { font-weight: 800; font-size: 24px; color: #EF4444; }

                .lucky-items { gap: 16px; margin-bottom: 32px; }
                .lucky-item {
                    display: flex; gap: 16px; align-items: center;
                    padding: 16px; border-radius: 20px; border: 1px solid #F3F4F6;
                    background: #FAFAFA;
                }
                .item-icon-circle {
                    width: 56px; height: 56px; border-radius: 18px;
                    display: flex; justify-content: center; align-items: center;
                    flex-shrink: 0;
                }
                .item-label { font-size: 11px; font-weight: 700; color: #9CA3AF; margin-bottom: 4px; }
                .item-text { font-size: 14px; font-weight: 700; color: #374151; line-height: 1.5; }

                .lucky-close-btn {
                    width: 100%; padding: 16px; border-radius: 20px;
                    background: var(--token-purple-pill); color: #FFF; border: none;
                    font-weight: 700; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(168, 116, 246, 0.3);
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
