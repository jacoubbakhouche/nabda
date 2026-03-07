import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Heart, AlertCircle, Loader } from 'lucide-react';

export default function AuthScreen() {
    const [view, setView] = useState('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (view === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) setErrorMsg(error.message);
            } else if (view === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { name }
                    }
                });
                if (error) setErrorMsg(error.message);
                else setErrorMsg("تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.");
            }
        } catch (err) {
            setErrorMsg("حدث خطأ غير متوقع.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`auth-container ${view === 'welcome' ? 'welcome-bg' : ''}`}>
            {view === 'welcome' ? (
                <div className="welcome-view fade-in">
                    <div className="welcome-content">
                        <div className="auth-logo-circle big-logo">
                            <Heart size={50} color="#FFF" fill="#FFF" />
                        </div>
                        <h1 className="welcome-title">مرحباً بكِ في <span>نَبضة</span> ❤️</h1>
                        <p className="welcome-desc">مرافقة الحامل أسبوعًا بأسبوع عبر معلومات موثوقة ومتابعة صحية شاملة 🌷</p>
                    </div>

                    <div className="welcome-actions">
                        <button className="primary-btn-lg w-100" onClick={() => setView('signup')}>
                            لنبدأ الرحلة السعيدة
                        </button>
                        <button className="text-btn outline w-100 mt-16" onClick={() => setView('login')}>
                            لدي حساب بالفعل، تسجيل الدخول
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="auth-header fade-in">
                        <div className="auth-logo-circle">
                            <Heart size={40} color="#FFF" fill="#FFF" />
                        </div>
                        <h1 className="auth-title">نَبضة</h1>
                        <p className="auth-slogan">تسعة أشهر بأمان</p>
                    </div>

                    <div className="auth-card fade-in">
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab ${view === 'login' ? 'active' : ''}`}
                                onClick={() => { setView('login'); setErrorMsg(''); }}
                            >
                                تسجيل الدخول
                            </button>
                            <button
                                className={`auth-tab ${view === 'signup' ? 'active' : ''}`}
                                onClick={() => { setView('signup'); setErrorMsg(''); }}
                            >
                                إنشاء حساب
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="auth-error-box flex-row align-center" style={{ gap: '8px', marginBottom: '16px' }}>
                                <AlertCircle size={16} color="#EF4444" />
                                <span style={{ fontSize: '13px', color: '#EF4444' }}>{errorMsg}</span>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            {view === 'signup' && (
                                <div className="input-group">
                                    <label className="input-label">الاسم الكامل</label>
                                    <div className="input-wrapper">
                                        <User size={20} color="var(--text-muted)" className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="أدخلي اسمك الكامل"
                                            required={view === 'signup'}
                                            className="auth-input"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="input-group">
                                <label className="input-label">البريد الإلكتروني</label>
                                <div className="input-wrapper">
                                    <Mail size={20} color="var(--text-muted)" className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="example@email.com"
                                        required
                                        className="auth-input"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">كلمة المرور</label>
                                <div className="input-wrapper">
                                    <Lock size={20} color="var(--text-muted)" className="input-icon" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="auth-input"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {view === 'login' && (
                                <div className="forgot-password">
                                    <a href="#">نسيت كلمة المرور؟</a>
                                </div>
                            )}

                            <button type="submit" className="primary-btn mt-4" disabled={loading}>
                                {loading ? <Loader size={20} className="spin" /> : (view === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب')}
                            </button>

                            <div className="auth-divider">
                                <span>أو الدخول بواسطة</span>
                            </div>

                            <div className="social-auth-container">
                                <button type="button" className="social-btn">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="24" height="24" />
                                    Google
                                </button>
                                <button type="button" className="social-btn">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0151 22.5029C6.20233 22.5029 1.49023 17.7892 1.49023 11.9745C1.49023 6.15983 6.20233 1.44617 12.0151 1.44617C17.8279 1.44617 22.54 6.15983 22.54 11.9745C22.54 17.7892 17.8279 22.5029 12.0151 22.5029ZM11.0255 18.0673H13.6234V13.8247H16.4819L16.9099 11.2227H13.6234V9.56306C13.6234 8.80939 13.8329 8.29571 14.9238 8.29571L16.3138 8.29511V5.96788C16.0734 5.93582 15.2476 5.86469 14.2882 5.86469C12.2831 5.86469 10.9094 7.08906 10.9094 9.32486V11.2227H8.30371V13.8247H10.9094V18.0673Z" fill="#1877F2" />
                                        <path d="M16.4822 13.8247L16.9102 11.2227H13.6237V9.56306C13.6237 8.80939 13.8332 8.29571 14.9242 8.29571L16.3142 8.29511V5.96788C16.0737 5.93582 15.2479 5.86469 14.2885 5.86469C12.2834 5.86469 10.9097 7.08906 10.9097 9.32486V11.2227H8.30396V13.8247H10.9097V18.0673C11.2725 18.1216 11.6418 18.15 12.0154 18.15C12.5699 18.15 13.107 18.0975 13.6237 18.0016V13.8247H16.4822Z" fill="white" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}     <style>{`
                .auth-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background: linear-gradient(135deg, rgba(246,242,253,1) 0%, rgba(255,255,255,1) 100%);
                    padding: 24px;
                    justify-content: center;
                }

                .auth-container.welcome-bg {
                    background: linear-gradient(180deg, rgba(235,224,255,1) 0%, rgba(255,255,255,1) 100%);
                    align-items: center;
                }

                .welcome-view {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    width: 100%;
                    max-width: 400px;
                    flex: 1;
                    padding: 40px 0;
                }

                .welcome-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin-top: 40px;
                }

                .big-logo {
                    width: 120px;
                    height: 120px;
                    margin-bottom: 32px;
                }

                .welcome-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 16px;
                    line-height: 1.4;
                }
                
                .welcome-title span {
                    color: var(--token-purple-pill);
                }

                .welcome-desc {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--text-muted);
                    line-height: 1.6;
                    padding: 0 20px;
                }

                .welcome-actions {
                    margin-top: auto;
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
                }

                .primary-btn-lg:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(168, 116, 246, 0.4);
                }

                .text-btn.outline {
                    background-color: transparent;
                    color: var(--token-purple-pill);
                    border: 2px solid var(--token-purple-light);
                    border-radius: 20px;
                    padding: 18px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s ease;
                }
                
                .text-btn.outline:hover {
                    background-color: var(--token-purple-light);
                    color: #FFF;
                }

                .w-100 { width: 100%; }
                
                .fade-in { animation: fadeIn 0.4s ease-out; }

                .auth-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 40px;
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

                .auth-card {
                    background-color: #FFF;
                    border-radius: 32px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
                    padding: 32px 24px;
                    width: 100%;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .auth-tabs {
                    display: flex;
                    background-color: var(--bg-surface);
                    border-radius: 16px;
                    padding: 4px;
                    margin-bottom: 24px;
                }

                .auth-tab {
                    flex: 1;
                    padding: 12px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 15px;
                    color: var(--text-muted);
                    background: transparent;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .auth-tab.active {
                    background-color: #FFF;
                    color: var(--text-main);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
                }

                .auth-error-box {
                    background-color: #FEF2F2;
                    border: 1px dashed #FDA4AF;
                    padding: 12px;
                    border-radius: 12px;
                }

                .auth-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    right: 16px;
                }

                .auth-input {
                    width: 100%;
                    padding: 16px 48px 16px 16px; /* Right padding for icon in RTL */
                    background-color: var(--bg-surface);
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    font-size: 15px;
                    color: var(--text-main);
                    transition: all 0.2s ease;
                    font-family: inherit;
                    direction: rtl;
                }

                .auth-input:focus {
                    outline: none;
                    border-color: var(--token-purple-pill);
                    background-color: #FFF;
                    box-shadow: 0 0 0 4px rgba(168, 116, 246, 0.1);
                }

                .forgot-password {
                    text-align: left; /* Left align for RTL (opposite side) */
                    margin-top: -8px;
                }

                .forgot-password a {
                    font-size: 13px;
                    color: var(--token-purple-pill);
                    text-decoration: none;
                    font-weight: 500;
                }

                .primary-btn {
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border: none;
                    border-radius: 16px;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 4px 15px rgba(168, 116, 246, 0.3);
                }

                .primary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(168, 116, 246, 0.4);
                }

                .mt-4 {
                    margin-top: 16px;
                }

                .auth-divider {
                    position: relative;
                    text-align: center;
                    margin: 24px 0;
                }

                .auth-divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background-color: var(--border-light);
                    z-index: 1;
                }

                .auth-divider span {
                    position: relative;
                    z-index: 2;
                    background-color: #FFF;
                    padding: 0 16px;
                    color: var(--text-muted);
                    font-size: 13px;
                }

                .social-auth-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background-color: var(--bg-surface);
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .social-btn:hover {
                    background-color: #F3F0F7;
                }
            `}</style>
        </div>
    );
}
