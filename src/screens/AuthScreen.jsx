import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Loader } from 'lucide-react';

export default function AuthScreen() {
    const [view, setView] = useState('welcome');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setErrorMsg('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) setErrorMsg(error.message);
        } catch (err) {
            setErrorMsg("حدث خطأ أثناء الاتصال بجوجل.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-container ${view === 'welcome' ? 'welcome-bg' : 'login-bg'}`}>
            {view === 'welcome' ? (
                <div className="welcome-view fade-in">
                    <div className="welcome-spacer"></div>
                    <div className="welcome-bottom">
                        <div className="welcome-content">
                            <h1 className="welcome-title">رحلتكِ تبدأ من هنا</h1>
                            <p className="welcome-desc">نَبضة ترافقكِ في كل أسبوع من حملكِ بنصائح طبية موثوقة ومتابعة شاملة لكِ ولطفلكِ</p>
                        </div>

                        <div className="welcome-actions">
                            <button className="primary-btn-lg w-100" onClick={() => setView('login')}>
                                لنبدأ الرحلة السعيدة
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="login-view fade-in">
                    <div className="login-header">
                        <div className="auth-logo-circle">
                            <Heart size={40} color="#FFF" fill="#FFF" />
                        </div>
                        <h1 className="auth-title">نَبضة</h1>
                        <p className="auth-slogan">تسعة أشهر بأمان</p>
                    </div>

                    <div className="login-card">
                        {errorMsg && (
                            <div className="auth-error-box">
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <button
                            className="google-btn w-100"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader size={20} className="spin" />
                            ) : (
                                <>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="24" height="24" />
                                    المتابعة باستخدام Google
                                </>
                            )}
                        </button>

                        <p className="terms-text">
                            بالمتابعة، أنتِ توافقين على <span className="terms-link">شروط الاستخدام</span> و<span className="terms-link">سياسة الخصوصية</span>
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                .auth-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    padding: 24px;
                    justify-content: center;
                }

                /* Welcome Screen */
                .auth-container.welcome-bg {
                    background: url('/welcome-bg.png') center top / cover no-repeat;
                    align-items: center;
                    position: relative;
                }
                .welcome-bg::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(to bottom, rgba(255,255,255,0) 35%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.95) 70%, rgba(255,255,255,1) 85%);
                    z-index: 0;
                }
                .welcome-view {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    max-width: 400px;
                    flex: 1;
                    position: relative;
                    z-index: 1;
                }
                .welcome-spacer {
                    flex: 1;
                }
                .welcome-bottom {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                    padding-bottom: 32px;
                }
                .welcome-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .welcome-title {
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 12px;
                    line-height: 1.4;
                }
                .welcome-desc {
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--text-muted);
                    line-height: 1.7;
                    max-width: 300px;
                }
                .welcome-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .primary-btn-lg {
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border: none;
                    border-radius: 20px;
                    padding: 18px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 8px 25px rgba(168, 116, 246, 0.4);
                    text-align: center;
                    font-family: inherit;
                }
                .primary-btn-lg:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(168, 116, 246, 0.4);
                }

                /* Login Screen */
                .auth-container.login-bg {
                    background: #FFF;
                    align-items: center;
                }
                .login-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100%;
                    max-width: 400px;
                    flex: 1;
                    justify-content: center;
                }
                .login-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 48px;
                }
                .auth-logo-circle {
                    width: 80px;
                    height: 80px;
                    background-color: var(--token-purple-pill);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                    box-shadow: 0 10px 30px rgba(168, 116, 246, 0.4);
                }
                .auth-title {
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 4px;
                }
                .auth-slogan {
                    font-size: 16px;
                    color: var(--token-purple-pill);
                    font-weight: 500;
                }
                .login-card {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .google-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 18px;
                    background-color: #FFF;
                    border: 1.5px solid var(--border-light);
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
                    font-family: inherit;
                }
                .google-btn:hover {
                    border-color: var(--token-purple-pill);
                    box-shadow: 0 6px 20px rgba(168, 116, 246, 0.15);
                    transform: translateY(-2px);
                }
                .google-btn:disabled {
                    opacity: 0.6;
                    pointer-events: none;
                }
                .terms-text {
                    font-size: 12px;
                    color: var(--text-muted);
                    text-align: center;
                    line-height: 1.6;
                    max-width: 280px;
                }
                .terms-link {
                    color: var(--token-purple-pill);
                    font-weight: 600;
                    cursor: pointer;
                }
                .auth-error-box {
                    background-color: #FEF2F2;
                    border: 1px dashed #FDA4AF;
                    padding: 12px;
                    border-radius: 12px;
                    width: 100%;
                    text-align: center;
                    font-size: 13px;
                    color: #EF4444;
                }

                .w-100 { width: 100%; }
                .fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
