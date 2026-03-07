import React, { useState } from 'react';
import { usePregnancy } from '../context/PregnancyContext';
import { ChevronRight, ChevronLeft, Calendar, User, Ruler, Weight, Activity } from 'lucide-react';

export default function OnboardingScreen() {
    const { completeOnboarding } = usePregnancy();
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        language: 'ar',
        name: '',
        lmpDate: '',
        isFirstPregnancy: null,
        previousBirths: 0,
        height: '',
        weight: '',
        medicalConditions: []
    });

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 5) setStep(step + 1);
        else handleComplete();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleComplete = () => {
        let edd = null;
        if (formData.lmpDate) {
            const lmp = new Date(formData.lmpDate);
            edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
        }

        const finalMedicalConditions = formData.chronicConditionText
            ? [formData.chronicConditionText]
            : [];

        completeOnboarding({
            ...formData,
            eddDate: edd,
            medicalConditions: finalMedicalConditions
        });
    };



    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="step-title">أهلاً بكِ في نَبضة 👋</h2>
                        <p className="step-desc">لنبدأ رحلة الأمومة معاً. اختاري لغتك المفضلة:</p>

                        <div className="options-grid">
                            <button
                                className={`option-card ${formData.language === 'ar' ? 'selected' : ''}`}
                                onClick={() => updateData('language', 'ar')}
                            >
                                <span className="option-flag">🇸🇦</span>
                                <span className="option-text">العربية</span>
                            </button>
                            <button
                                className={`option-card ${formData.language === 'fr' ? 'selected' : ''}`}
                                onClick={() => updateData('language', 'fr')}
                            >
                                <span className="option-flag">🇫🇷</span>
                                <span className="option-text">Français</span>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="onboarding-step fade-in">
                        <div className="step-icon-wrap"><User size={32} color="var(--token-purple-pill)" /></div>
                        <h2 className="step-title">ما هو اسمك؟</h2>
                        <p className="step-desc">نريد أن نخصص تجربتك وتجربة طفلك معنا.</p>

                        <div className="input-field-wrap mt-24">
                            <input
                                type="text"
                                className="ob-input"
                                placeholder="أدخلي اسمك (اختياري)"
                                value={formData.name}
                                onChange={(e) => updateData('name', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 3: {
                let calculatedEDD = null;
                let calculatedWeeks = 0;
                if (formData.lmpDate) {
                    const lmp = new Date(formData.lmpDate);
                    const now = new Date();
                    calculatedEDD = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
                    const diffTime = now - lmp;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    calculatedWeeks = Math.max(0, Math.floor(diffDays / 7));
                }

                return (
                    <div className="onboarding-step fade-in">
                        <div className="step-icon-wrap"><Calendar size={32} color="var(--token-purple-pill)" /></div>
                        <h2 className="step-title">تاريخ آخر دورة شهرية</h2>
                        <p className="step-desc">يساعدنا هذا في حساب موعد الولادة المتوقع بدقة.</p>

                        <div className="input-field-wrap mt-24">
                            <input
                                type="date"
                                className="ob-input date-input"
                                value={formData.lmpDate}
                                onChange={(e) => updateData('lmpDate', e.target.value)}
                                required
                            />
                        </div>

                        {calculatedEDD && (
                            <div className="calculation-result fade-in mt-16">
                                <div className="calc-row">
                                    <span className="calc-label">موعد الولادة المتوقع:</span>
                                    <span className="calc-value">{calculatedEDD.toLocaleDateString('ar-EG')}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">عمر الحمل الحالي:</span>
                                    <span className="calc-value">{calculatedWeeks} أسبوع</span>
                                </div>
                            </div>
                        )}

                        <p className="step-hint mt-16">أو يمكنك تخطي هذه الخطوة إذا كنتِ لا تتذكرين.</p>
                    </div>
                );
            }
            case 4:
                return (
                    <div className="onboarding-step fade-in">
                        <div className="step-icon-wrap"><Activity size={32} color="var(--token-purple-pill)" /></div>
                        <h2 className="step-title">هل هذا حملك الأول؟</h2>

                        <div className="options-row mt-24">
                            <button
                                className={`radio-btn ${formData.isFirstPregnancy === true ? 'selected' : ''}`}
                                onClick={() => { updateData('isFirstPregnancy', true); updateData('previousBirths', 0); }}
                            >
                                نعم
                            </button>
                            <button
                                className={`radio-btn ${formData.isFirstPregnancy === false ? 'selected' : ''}`}
                                onClick={() => updateData('isFirstPregnancy', false)}
                            >
                                لا
                            </button>
                        </div>

                        {formData.isFirstPregnancy === false && (
                            <div className="fade-in mt-24">
                                <label className="input-label">ما هو عدد ولاداتك السابقة؟</label>
                                <div className="number-stepper">
                                    <button onClick={() => updateData('previousBirths', Math.max(0, formData.previousBirths - 1))}>-</button>
                                    <span>{formData.previousBirths}</span>
                                    <button onClick={() => updateData('previousBirths', formData.previousBirths + 1)}>+</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 5:
                return (
                    <div className="onboarding-step fade-in">
                        <h2 className="step-title">معلوماتك الصحية</h2>
                        <p className="step-desc">تساعدنا في تقديم إرشادات مخصصة لحالتك.</p>

                        <div className="flex-row mt-24" style={{ gap: '16px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label className="input-label flex-row align-center"><Ruler size={14} style={{ marginLeft: 4 }} /> الطول (سم)</label>
                                <input type="number" className="ob-input" placeholder="165" value={formData.height} onChange={(e) => updateData('height', e.target.value)} />
                            </div>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label className="input-label flex-row align-center"><Weight size={14} style={{ marginLeft: 4 }} /> الوزن (كغ)</label>
                                <input type="number" className="ob-input" placeholder="65" value={formData.weight} onChange={(e) => updateData('weight', e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-24">
                            <label className="input-label">الأمراض المزمنة (اختياري)</label>
                            <input
                                type="text"
                                className="ob-input mt-12"
                                placeholder="مثل: السكري، الضغط، الغدة الدرقية..."
                                value={formData.chronicConditionText || ''}
                                onChange={(e) => updateData('chronicConditionText', e.target.value)}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="onboarding-container">
            <div className="ob-header flex-row justify-between align-center">
                <button className="icon-btn" onClick={handleBack} style={{ visibility: step > 1 ? 'visible' : 'hidden' }}>
                    <ChevronRight size={24} />
                </button>
                <div className="step-indicator">
                    {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`step-dot ${s === step ? 'active' : s < step ? 'completed' : ''}`}></div>
                    ))}
                </div>
                <button className="text-btn text-muted font-medium" onClick={handleComplete}>تخطي</button>
            </div>

            <div className="ob-content-wrapper">
                {renderStepContent()}
            </div>

            <div className="ob-footer">
                <button className="primary-btn-lg" onClick={handleNext}>
                    {step === 5 ? 'ابدئي رحلتك' : 'التالي'}
                </button>
            </div>

            <style>{`
                .onboarding-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: #FAFAFC;
                    padding: 24px;
                }

                .ob-header {
                    padding-top: 16px;
                    margin-bottom: 32px;
                }

                .icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid var(--border-light);
                    background: #FFF;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }

                .text-btn {
                    background: transparent;
                    border: none;
                    font-size: 15px;
                    cursor: pointer;
                }

                .step-indicator {
                    display: flex;
                    gap: 8px;
                }

                .step-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #E2E8F0;
                    transition: all 0.3s ease;
                }

                .step-dot.active {
                    background-color: var(--token-purple-pill);
                    width: 24px;
                    border-radius: 4px;
                }

                .step-dot.completed {
                    background-color: var(--token-purple-light);
                }

                .ob-content-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .step-icon-wrap {
                    width: 64px;
                    height: 64px;
                    background-color: #F3E8FF;
                    border-radius: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .step-title {
                    font-size: 26px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 8px;
                    line-height: 1.3;
                }

                .step-desc {
                    font-size: 15px;
                    color: var(--text-muted);
                    line-height: 1.5;
                }

                .mt-12 { margin-top: 12px; }
                .mt-16 { margin-top: 16px; }
                .mt-24 { margin-top: 24px; }

                .input-field-wrap {
                    position: relative;
                }

                .ob-input {
                    width: 100%;
                    padding: 16px;
                    background-color: #FFF;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    font-size: 16px;
                    color: var(--text-main);
                    transition: all 0.2s ease;
                    font-family: inherit;
                    direction: rtl;
                }

                .ob-input:focus {
                    outline: none;
                    border-color: var(--token-purple-pill);
                    box-shadow: 0 0 0 4px rgba(168, 116, 246, 0.1);
                }

                .date-input {
                    text-align: right;
                    direction: ltr; /* Keeps the calendar icon looking right in webkit browsers */
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 32px;
                }

                .option-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 24px 16px;
                    background-color: #FFF;
                    border: 2px solid var(--border-light);
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .option-card.selected {
                    border-color: var(--token-purple-pill);
                    background-color: #FBF9FF;
                }

                .option-flag { font-size: 32px; }
                .option-text { font-size: 16px; font-weight: 600; color: var(--text-main); }

                .options-row {
                    display: flex;
                    gap: 16px;
                }

                .radio-btn {
                    flex: 1;
                    padding: 16px;
                    background-color: #FFF;
                    border: 2px solid var(--border-light);
                    border-radius: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .radio-btn.selected {
                    border-color: var(--token-purple-pill);
                    background-color: #FBF9FF;
                    color: var(--token-purple-pill);
                }

                .number-stepper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: #FFF;
                    border: 1px solid var(--border-light);
                    border-radius: 16px;
                    padding: 8px;
                    margin-top: 8px;
                }

                .number-stepper button {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background-color: #F8F9FA;
                    border: none;
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                }

                .number-stepper span {
                    font-size: 18px;
                    font-weight: 700;
                }

                .calculation-result {
                    background-color: #F3E8FF;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px dashed var(--token-purple-pill);
                }
                .calc-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                .calc-row:last-child { margin-bottom: 0; }
                .calc-label { font-size: 14px; color: var(--text-muted); }
                .calc-value { font-size: 14px; font-weight: 700; color: var(--token-purple-pill); }

                .step-hint {
                    text-align: center;
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .ob-footer {
                    margin-top: auto;
                    padding-bottom: 16px;
                }

                .primary-btn-lg {
                    width: 100%;
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border: none;
                    border-radius: 20px;
                    padding: 18px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 4px 15px rgba(168, 116, 246, 0.3);
                }

                .primary-btn-lg:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(168, 116, 246, 0.4);
                }

                .fade-in {
                    animation: fadeIn 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}
