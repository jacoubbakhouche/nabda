import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Camera,
    Mic,
    Smile,
    MessageSquare,
    Calendar,
    Image as ImageIcon,
    Share2,
    Trash2,
    Plus
} from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function JournalScreen({ onBack }) {
    const { getJournalEntries, addJournalEntry } = usePregnancy();
    const [entries, setEntries] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // list, new, prompts
    const [newEntry, setNewEntry] = useState({
        text: '',
        mood: 'happy',
        type: 'daily', // daily, weekly, message-to-baby
        photo: null
    });

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        const data = await getJournalEntries();
        setEntries(data || []);
    };

    const handleSave = async () => {
        if (!newEntry.text.trim()) return;
        await addJournalEntry(newEntry);
        setNewEntry({ text: '', mood: 'happy', type: 'daily', photo: null });
        setActiveTab('list');
        loadEntries();
    };

    const moods = [
        { id: 'happy', icon: '😊', label: 'سعيدة' },
        { id: 'tired', icon: '😴', label: 'متعبة' },
        { id: 'excited', icon: '🤩', label: 'متحمسة' },
        { id: 'anxious', icon: '😟', label: 'قلقة' },
    ];

    const renderNewEntry = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '20px' }}>
            <div className="entry-type-selector">
                <button className={`type-btn ${newEntry.type === 'daily' ? 'active' : ''}`} onClick={() => setNewEntry({ ...newEntry, type: 'daily' })}>يوميات</button>
                <button className={`type-btn ${newEntry.type === 'weekly' ? 'active' : ''}`} onClick={() => setNewEntry({ ...newEntry, type: 'weekly' })}>أسبوعي</button>
                <button className={`type-btn ${newEntry.type === 'message-to-baby' ? 'active' : ''}`} onClick={() => setNewEntry({ ...newEntry, type: 'message-to-baby' })}>رسالة للجنين</button>
            </div>

            <div className="mood-selector">
                <span className="field-label">كيف هو مزاجك اليوم؟</span>
                <div className="mood-grid">
                    {moods.map(m => (
                        <button
                            key={m.id}
                            className={`mood-btn ${newEntry.mood === m.id ? 'active' : ''}`}
                            onClick={() => setNewEntry({ ...newEntry, mood: m.id })}
                        >
                            <span className="mood-icon">{m.icon}</span>
                            <span className="mood-label">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-area-wrapper">
                <textarea
                    placeholder="اكتبي مشاعرك هنا..."
                    value={newEntry.text}
                    onChange={(e) => setNewEntry({ ...newEntry, text: e.target.value })}
                />
                <div className="entry-actions">
                    <button className="icon-action-btn"><Camera size={20} /></button>
                    <button className="icon-action-btn"><Mic size={20} /></button>
                    <button className="icon-action-btn"><ImageIcon size={20} /></button>
                </div>
            </div>

            <button className="save-entry-btn" onClick={handleSave}>حفظ التدوينة</button>
        </div>
    );

    const renderList = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
            {entries.length === 0 ? (
                <div className="empty-state">
                    <MessageSquare size={48} color="#CCC" />
                    <p>لا توجد تدوينات بعد. ابدئي بتسجيل لحظاتك!</p>
                </div>
            ) : (
                <div className="timeline">
                    {entries.map((entry, i) => (
                        <div key={entry.id || i} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="entry-card">
                                <div className="flex-row justify-between align-center" style={{ marginBottom: '8px' }}>
                                    <span className="entry-date">{new Date(entry.created_at).toLocaleDateString('ar-EG')}</span>
                                    <span className="entry-mood-icon">{moods.find(m => m.id === entry.mood)?.icon || '😊'}</span>
                                </div>
                                {entry.type === 'message-to-baby' && <div className="baby-msg-tag">رسالة لـ طفلي 👶</div>}
                                <p className="entry-text">{entry.text}</p>
                                <div className="flex-row justify-end" style={{ gap: '10px', marginTop: '12px' }}>
                                    <button className="entry-mini-btn"><Share2 size={14} /></button>
                                    <button className="entry-mini-btn delete"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button className="fab-add" onClick={() => setActiveTab('new')}>
                <Plus size={24} color="#FFF" />
            </button>
        </div>
    );

    const renderPrompts = () => (
        <div className="tab-content-fade-in flex-col" style={{ gap: '16px' }}>
            {[
                "كيف اكتشفتِ أنكِ حامل؟",
                "ما هي أجمل لحظة في حملكِ حتى الآن؟",
                "أصعب يوم مر عليكِ وكيف تجاوزتِه؟",
                "ماذا تعلمتِ من تجربتكِ حتى الآن؟"
            ].map((p, i) => (
                <div key={i} className="prompt-card" onClick={() => {
                    setNewEntry({ ...newEntry, text: p + "\n\n", type: 'weekly' });
                    setActiveTab('new');
                }}>
                    <p className="prompt-text">{p}</p>
                    <Plus size={18} color="var(--token-purple-pill)" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="journal-container flex-col">
            <Header />
            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">تجربتك</h2>
            </div>

            <div className="journal-tabs">
                <button className={`j-tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>الجدول الزمني</button>
                <button className={`j-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>تدوين جديد</button>
                <button className={`j-tab ${activeTab === 'prompts' ? 'active' : ''}`} onClick={() => setActiveTab('prompts')}>أسئلة ملهمة</button>
            </div>

            <div className="journal-content">
                {activeTab === 'list' && renderList()}
                {activeTab === 'new' && renderNewEntry()}
                {activeTab === 'prompts' && renderPrompts()}
            </div>

            <style>{`
                .journal-container { padding-bottom: 80px; position: relative; min-height: 100vh; }
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }

                .journal-tabs {
                    display: flex; gap: 8px; margin: 20px 0; background: #EEE;
                    padding: 4px; border-radius: 12px;
                }
                .j-tab {
                    flex: 1; padding: 10px; border-radius: 10px;
                    border: none; background: transparent; font-size: 13px; font-weight: 600;
                    cursor: pointer; transition: all 0.2s;
                }
                .j-tab.active { background: #FFF; color: var(--token-purple-pill); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                /* New Entry */
                .entry-type-selector { display: flex; gap: 8px; }
                .type-btn {
                    padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-light);
                    background: #FFF; font-size: 12px; font-weight: 600; cursor: pointer;
                }
                .type-btn.active { background: var(--token-purple-pill); color: #FFF; border-color: var(--token-purple-pill); }

                .mood-selector { background: #F8F6FC; padding: 16px; border-radius: 20px; }
                .field-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 12px; }
                .mood-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
                .mood-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 6px;
                    padding: 10px; border-radius: 12px; background: #FFF; border: 1px solid transparent;
                    cursor: pointer;
                }
                .mood-btn.active { border-color: var(--token-purple-pill); background: #F3E8FF; }
                .mood-icon { font-size: 20px; }
                .mood-label { font-size: 11px; font-weight: 600; }

                .text-area-wrapper {
                    background: #FFF; border: 1px solid var(--border-light);
                    border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 12px;
                }
                .text-area-wrapper textarea {
                    width: 100%; min-height: 150px; border: none; outline: none;
                    font-size: 14px; line-height: 1.6; resize: none;
                }
                .entry-actions { display: flex; gap: 12px; }
                .icon-action-btn {
                    width: 40px; height: 40px; border-radius: 10px; background: #F9FAFB;
                    border: none; display: flex; justify-content: center; align-items: center; cursor: pointer;
                    color: #666;
                }

                .save-entry-btn {
                    background: var(--token-purple-pill); color: #FFF; border: none;
                    padding: 16px; border-radius: 16px; font-weight: 700; cursor: pointer;
                    margin-top: 10px;
                }

                /* List */
                .empty-state {
                    display: flex; flex-direction: column; align-items: center; gap: 16px;
                    margin-top: 60px; color: var(--text-muted); text-align: center;
                }
                .timeline { position: relative; padding-right: 20px; border-right: 2px solid #EEE; margin-right: 10px; }
                .timeline-item { position: relative; margin-bottom: 30px; }
                .timeline-dot {
                    position: absolute; right: -27px; top: 10px;
                    width: 12px; height: 12px; border-radius: 50%;
                    background: var(--token-purple-pill); border: 2px solid #FFF;
                }
                .entry-card {
                    background: #FFF; border: 1px solid var(--border-light);
                    padding: 16px; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                .entry-date { font-size: 11px; color: var(--text-muted); font-weight: 600; }
                .entry-mood-icon { font-size: 18px; }
                .entry-text { font-size: 14px; color: #1C1C1E; line-height: 1.6; }
                .baby-msg-tag {
                    display: inline-block; padding: 4px 10px; background: #E0F2FE;
                    color: #0369A1; font-size: 11px; font-weight: 700; border-radius: 8px; margin-bottom: 8px;
                }
                .entry-mini-btn {
                    width: 32px; height: 32px; border-radius: 8px; background: #F9FAFB;
                    border: none; display: flex; justify-content: center; align-items: center;
                    cursor: pointer; color: #666;
                }
                .entry-mini-btn.delete:hover { color: #EF4444; background: #FEF2F2; }

                .fab-add {
                    position: fixed; bottom: 30px; left: 30px;
                    width: 60px; height: 60px; border-radius: 30px;
                    background: var(--token-purple-pill); border: none;
                    display: flex; justify-content: center; align-items: center;
                    box-shadow: 0 10px 25px rgba(168, 116, 246, 0.4);
                    cursor: pointer; z-index: 100;
                }

                /* Prompts */
                .prompt-card {
                    background: #FFF; padding: 20px; border-radius: 24px;
                    border: 1px solid var(--border-light);
                    display: flex; justify-content: space-between; align-items: center;
                    cursor: pointer; transition: transform 0.2s;
                }
                .prompt-card:active { transform: scale(0.98); }
                .prompt-text { font-size: 14px; font-weight: 600; color: #1C1C1E; flex: 1; margin-left: 10px; }
            `}</style>
        </div>
    );
}
