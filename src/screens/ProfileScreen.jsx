import React, { useState } from 'react';
import { usePregnancy } from '../context/PregnancyContext';
import { LogOut, User, Settings, Info, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';

export default function ProfileScreen() {
    const { userName, pregnancyDetails, logout, setUserName } = usePregnancy();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(userName);

    const handleSave = () => {
        setUserName(editName);
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG');
    };

    return (
        <div className="flex-col" style={{ gap: '20px' }}>
            <Header />

            <div className="profile-container">
                <div className="profile-header">
                    <div className="avatar-circle">
                        {userName ? userName.charAt(0) : 'م'}
                    </div>

                    {isEditing ? (
                        <div className="edit-name-flow flex-row align-center">
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="profile-edit-input"
                            />
                            <button onClick={handleSave} className="save-btn">حفظ</button>
                        </div>
                    ) : (
                        <div className="flex-row align-center" style={{ gap: '8px' }}>
                            <h2 className="profile-name">{userName}</h2>
                            <button onClick={() => setIsEditing(true)} className="edit-icon-btn">
                                <Settings size={16} />
                            </button>
                        </div>
                    )}
                    <span className="profile-email">مستخدم موثق ✔️</span>
                </div>

                <div className="profile-section">
                    <h3 className="section-label">المعلومات الصحية والتاريخ</h3>

                    <div className="info-list">
                        <div className="info-item">
                            <div className="flex-row justify-between w-100">
                                <span className="info-label text-muted">تاريخ آخر دورة:</span>
                                <span className="info-value font-medium">{formatDate(pregnancyDetails.lmpDate)}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="flex-row justify-between w-100">
                                <span className="info-label text-muted">حمل أول؟</span>
                                <span className="info-value font-medium">{pregnancyDetails.isFirstPregnancy ? 'نعم' : 'لا'}</span>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="flex-row justify-between w-100">
                                <span className="info-label text-muted">الطول / الوزن:</span>
                                <span className="info-value font-medium">
                                    {pregnancyDetails.height ? `${pregnancyDetails.height} سم` : '- '} /
                                    {pregnancyDetails.weight ? ` ${pregnancyDetails.weight} كغ` : ' -'}
                                </span>
                            </div>
                        </div>
                        {pregnancyDetails.medicalConditions && pregnancyDetails.medicalConditions.length > 0 && (
                            <div className="info-item flex-col align-start">
                                <span className="info-label text-muted mb-4">حالات طبية مزمنة:</span>
                                <div className="flex-row flex-wrap" style={{ gap: '6px' }}>
                                    {pregnancyDetails.medicalConditions.map(c => (
                                        <span key={c} className="condition-badge">{c}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="profile-section">
                    <h3 className="section-label">إعدادات التطبيق</h3>
                    <div className="settings-list">
                        <button className="settings-btn">
                            <div className="flex-row align-center" style={{ gap: '12px' }}>
                                <div className="settings-icon-wrap"><User size={20} /></div>
                                <span>الحساب والأمان</span>
                            </div>
                            <ChevronLeft size={20} color="var(--text-muted)" />
                        </button>
                        <button className="settings-btn">
                            <div className="flex-row align-center" style={{ gap: '12px' }}>
                                <div className="settings-icon-wrap"><Info size={20} /></div>
                                <span>عن تطبيق نَبضة</span>
                            </div>
                            <ChevronLeft size={20} color="var(--text-muted)" />
                        </button>
                    </div>
                </div>

                <button className="logout-btn" onClick={logout}>
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>

            <style>{`
                .profile-container {
                    padding: 0 24px 80px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .profile-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: #FFF;
                    padding: 32px 24px;
                    border-radius: 32px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    text-align: center;
                }

                .avatar-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    font-size: 36px;
                    font-weight: 700;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 16px;
                    box-shadow: 0 10px 25px rgba(168, 116, 246, 0.4);
                }

                .profile-name {
                    font-size: 24px;
                    font-weight: 800;
                    color: var(--text-main);
                }

                .profile-email {
                    font-size: 14px;
                    color: var(--token-purple-pill);
                    margin-top: 4px;
                    font-weight: 500;
                }

                .edit-icon-btn {
                    background: #F3F0F7;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: var(--text-main);
                }

                .profile-edit-input {
                    padding: 8px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--token-purple-pill);
                    font-size: 16px;
                    font-family: inherit;
                    width: 150px;
                    text-align: center;
                }

                .save-btn {
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border: none;
                    border-radius: 12px;
                    padding: 8px 16px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-right: 8px;
                }

                .section-label {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 12px;
                    padding: 0 8px;
                }

                .info-list {
                    background-color: #FFF;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid var(--border-light);
                }

                .info-item {
                    padding: 16px;
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                }
                .info-item:last-child { border-bottom: none; }

                .condition-badge {
                    background-color: #FEF2F2;
                    color: #EF4444;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .settings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .settings-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #FFF;
                    padding: 16px;
                    border-radius: 20px;
                    border: 1px solid var(--border-light);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--text-main);
                    transition: all 0.2s ease;
                }

                .settings-btn:hover {
                    border-color: var(--token-purple-pill);
                }

                .settings-icon-wrap {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background-color: #F8F9FA;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--text-main);
                }

                .logout-btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background-color: #FEF2F2;
                    color: #EF4444;
                    border: 1px dashed #FDA4AF;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 16px;
                    transition: all 0.2s ease;
                }

                .logout-btn:hover {
                    background-color: #FEE2E2;
                }

                .mb-4 { margin-bottom: 4px; }
            `}</style>
        </div>
    );
}
