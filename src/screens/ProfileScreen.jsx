import React, { useState } from 'react';
import { usePregnancy } from '../context/PregnancyContext';
import { LogOut, User, Settings, Info, ChevronLeft, Calendar, Ruler, Weight, Heart } from 'lucide-react';
import Header from '../components/Header';

export default function ProfileScreen() {
    const { userName, pregnancyDetails, logout, setUserName, avatarUrl, uploadProfileImage } = usePregnancy();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editName, setEditName] = useState(userName);

    const fileInputRef = React.useRef(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            await uploadProfileImage(file);
            setIsUploading(false);
        }
    };

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
                {/* Avatar & Name Card */}
                <div className="profile-header-card">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <div className="avatar-circle" onClick={handleAvatarClick} style={{ cursor: 'pointer', backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {!avatarUrl && (isUploading ? '...' : (userName ? userName.charAt(0) : 'م'))}
                    </div>
                    <div className="change-photo-link" onClick={handleAvatarClick}>تغيير الصورة</div>

                    {isEditing ? (
                        <div className="edit-name-flow">
                            <input
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="profile-edit-input"
                                autoFocus
                            />
                            <button onClick={handleSave} className="save-btn">حفظ</button>
                        </div>
                    ) : (
                        <div className="name-row">
                            <h2 className="profile-name">{userName}</h2>
                            <button onClick={() => setIsEditing(true)} className="edit-icon-btn">
                                <Settings size={14} />
                            </button>
                        </div>
                    )}
                    <span className="profile-badge">✔ مستخدم موثق</span>
                </div>

                {/* Health Info Section */}
                <div className="profile-section">
                    <h3 className="section-label">المعلومات الصحية</h3>
                    <div className="info-grid">
                        <div className="info-card-sm">
                            <div className="info-card-icon"><Calendar size={18} /></div>
                            <span className="info-card-value">{formatDate(pregnancyDetails.lmpDate)}</span>
                            <span className="info-card-label">آخر دورة</span>
                        </div>
                        <div className="info-card-sm">
                            <div className="info-card-icon"><Heart size={18} /></div>
                            <span className="info-card-value">{pregnancyDetails.isFirstPregnancy ? 'نعم' : 'لا'}</span>
                            <span className="info-card-label">حمل أول</span>
                        </div>
                        <div className="info-card-sm">
                            <div className="info-card-icon"><Ruler size={18} /></div>
                            <span className="info-card-value">{pregnancyDetails.height || '-'} سم</span>
                            <span className="info-card-label">الطول</span>
                        </div>
                        <div className="info-card-sm">
                            <div className="info-card-icon"><Weight size={18} /></div>
                            <span className="info-card-value">{pregnancyDetails.weight || '-'} كغ</span>
                            <span className="info-card-label">الوزن</span>
                        </div>
                    </div>

                    {pregnancyDetails.medicalConditions && pregnancyDetails.medicalConditions.length > 0 && (
                        <div className="conditions-row">
                            <span className="conditions-title">حالات طبية:</span>
                            <div className="conditions-wrap">
                                {pregnancyDetails.medicalConditions.map(c => (
                                    <span key={c} className="condition-badge">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings Section */}
                <div className="profile-section">
                    <h3 className="section-label">إعدادات التطبيق</h3>
                    <div className="settings-list">
                        <button className="settings-btn">
                            <div className="flex-row align-center" style={{ gap: '12px' }}>
                                <div className="settings-icon-wrap"><User size={18} /></div>
                                <span>الحساب والأمان</span>
                            </div>
                            <ChevronLeft size={18} color="var(--text-muted)" />
                        </button>
                        <button className="settings-btn">
                            <div className="flex-row align-center" style={{ gap: '12px' }}>
                                <div className="settings-icon-wrap"><Info size={18} /></div>
                                <span>عن تطبيق نَبضة</span>
                            </div>
                            <ChevronLeft size={18} color="var(--text-muted)" />
                        </button>
                    </div>
                </div>

                {/* Logout */}
                <button className="logout-btn" onClick={logout}>
                    <LogOut size={18} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>

            <style>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding-bottom: 80px;
                }

                /* Header Card */
                .profile-header-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #FFF;
                    padding: 28px 20px 24px 20px;
                    border-radius: 28px;
                    border: 1px solid var(--border-light);
                    text-align: center;
                }
                .avatar-circle {
                    width: 88px;
                    height: 88px;
                    border-radius: 50%;
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    font-size: 36px;
                    font-weight: 700;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 12px;
                    box-shadow: 0 8px 24px rgba(168, 116, 246, 0.35);
                    border: 3px solid #FFF;
                    outline: 2px solid var(--token-purple-bg);
                }
                .change-photo-link {
                    font-size: 13px;
                    color: var(--token-purple-pill);
                    font-weight: 600;
                    cursor: pointer;
                    margin-bottom: 14px;
                }
                .name-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .profile-name {
                    font-size: 22px;
                    font-weight: 800;
                    color: var(--text-main);
                }
                .profile-badge {
                    font-size: 12px;
                    color: var(--token-purple-pill);
                    margin-top: 4px;
                    font-weight: 600;
                    background: var(--token-purple-bg);
                    padding: 4px 14px;
                    border-radius: 20px;
                }
                .edit-icon-btn {
                    background: var(--token-purple-bg);
                    border: none;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    color: var(--token-purple-pill);
                }
                .edit-name-flow {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .profile-edit-input {
                    padding: 8px 16px;
                    border-radius: 14px;
                    border: 1.5px solid var(--token-purple-pill);
                    font-size: 15px;
                    font-family: inherit;
                    width: 150px;
                    text-align: center;
                    outline: none;
                }
                .profile-edit-input:focus {
                    box-shadow: 0 0 0 3px rgba(168, 116, 246, 0.15);
                }
                .save-btn {
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border: none;
                    border-radius: 14px;
                    padding: 8px 20px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 14px;
                }

                /* Section */
                .profile-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .section-label {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                /* Health Info Grid */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                .info-card-sm {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: #FFF;
                    border: 1px solid var(--border-light);
                    border-radius: 20px;
                    padding: 16px 12px;
                    gap: 6px;
                }
                .info-card-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 12px;
                    background: var(--token-purple-bg);
                    color: var(--token-purple-pill);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 4px;
                }
                .info-card-value {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .info-card-label {
                    font-size: 11px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                /* Conditions */
                .conditions-row {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    background: #FFF;
                    border: 1px solid var(--border-light);
                    border-radius: 20px;
                    padding: 14px 16px;
                    margin-top: 2px;
                }
                .conditions-title {
                    font-size: 13px;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .conditions-wrap {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .condition-badge {
                    background-color: #FEF2F2;
                    color: #EF4444;
                    padding: 5px 14px;
                    border-radius: 14px;
                    font-size: 12px;
                    font-weight: 600;
                }

                /* Settings */
                .settings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .settings-btn {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #FFF;
                    padding: 14px 16px;
                    border-radius: 20px;
                    border: 1px solid var(--border-light);
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .settings-btn:hover {
                    border-color: var(--token-purple-pill);
                }
                .settings-icon-wrap {
                    width: 36px;
                    height: 36px;
                    border-radius: 12px;
                    background-color: #F8F6FC;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--token-purple-pill);
                }

                /* Logout */
                .logout-btn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    padding: 16px;
                    background-color: #FEF2F2;
                    color: #EF4444;
                    border: 1px solid #FECACA;
                    border-radius: 20px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }
                .logout-btn:hover {
                    background-color: #FEE2E2;
                }
            `}</style>
        </div>
    );
}
