import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clipboard, Plus, Trash2, FileText, Activity, Scale } from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function MedicalRecordsScreen({ onBack }) {
    const { getMedicalRecords, addMedicalRecord, deleteMedicalRecord } = usePregnancy();
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newRecord, setNewRecord] = useState({
        record_type: 'فحص', // فحص, وزن, قياس
        title: '',
        date: new Date().toISOString().split('T')[0],
        value: '',
        notes: ''
    });

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        setLoading(true);
        const data = await getMedicalRecords();
        setRecords(data);
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newRecord.title) return;
        await addMedicalRecord(newRecord);
        setNewRecord({ record_type: 'فحص', title: '', date: new Date().toISOString().split('T')[0], value: '', notes: '' });
        setShowAddForm(false);
        loadRecords();
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            await deleteMedicalRecord(id);
            loadRecords();
        }
    };

    const filteredRecords = activeTab === 'all'
        ? records
        : records.filter(r => r.record_type === activeTab);

    const tabs = [
        { id: 'all', label: 'الكل', icon: <Clipboard size={16} /> },
        { id: 'فحص', label: 'تحاليل', icon: <FileText size={16} /> },
        { id: 'وزن', label: 'وزن', icon: <Scale size={16} /> },
        { id: 'قياس', label: 'قياسات', icon: <Activity size={16} /> }
    ];

    return (
        <div className="flex-col" style={{ gap: '20px' }}>
            <Header />

            <div className="flex-row justify-between align-center">
                <div className="flex-row align-center" style={{ gap: '12px' }}>
                    <button onClick={onBack} className="back-btn">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="section-title">السجل الطبي</h2>
                </div>
                <button className="add-fab" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={24} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="record-tabs flex-row" style={{ gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`mini-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {showAddForm && (
                <div className="form-card fade-in">
                    <h3 className="form-title">إضافة سجل جديد</h3>
                    <form onSubmit={handleAdd} className="flex-col" style={{ gap: '12px' }}>
                        <select
                            className="form-input"
                            value={newRecord.record_type}
                            onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                        >
                            <option value="فحص">تحليل طبي / فحص</option>
                            <option value="وزن">قياس وزن</option>
                            <option value="قياس">قياس آخر (ضغط، سكر...)</option>
                        </select>
                        <input
                            type="text"
                            placeholder="العنوان (مثلاً: فحص دم)"
                            className="form-input"
                            value={newRecord.title}
                            onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            className="form-input"
                            value={newRecord.date}
                            onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="القيمة (مثلاً: 65 كغ أو طبيعي)"
                            className="form-input"
                            value={newRecord.value}
                            onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                        />
                        <textarea
                            placeholder="ملاحظات"
                            className="form-input"
                            style={{ height: '60px', resize: 'none' }}
                            value={newRecord.notes}
                            onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                        />
                        <div className="flex-row" style={{ gap: '12px' }}>
                            <button type="submit" className="submit-btn primary">حفظ</button>
                            <button type="button" className="submit-btn secondary" onClick={() => setShowAddForm(false)}>إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="records-list flex-col" style={{ gap: '12px' }}>
                {loading ? (
                    <div className="text-center text-muted">جاري التحميل...</div>
                ) : filteredRecords.length === 0 ? (
                    <div className="empty-state">
                        <Clipboard size={48} className="text-muted" style={{ marginBottom: '12px' }} />
                        <p>لا توجد سجلات حالياً.</p>
                    </div>
                ) : (
                    filteredRecords.map((record) => (
                        <div key={record.id} className="record-card flex-row justify-between align-center fade-in">
                            <div className="flex-row align-center" style={{ gap: '16px' }}>
                                <div className="type-icon-box" style={{
                                    backgroundColor: record.record_type === 'وزن' ? '#FEF3C7' : record.record_type === 'فحص' ? '#FEE2E2' : '#DCFCE7'
                                }}>
                                    {record.record_type === 'وزن' ? <Scale size={18} /> : record.record_type === 'فحص' ? <FileText size={18} /> : <Activity size={18} />}
                                </div>
                                <div className="flex-col">
                                    <span className="record-title">{record.title}</span>
                                    <div className="flex-row align-center text-muted text-xs" style={{ gap: '8px', marginTop: '4px' }}>
                                        <span>{new Date(record.date).toLocaleDateString('ar-DZ')}</span>
                                        {record.value && <span className="value-tag">{record.value}</span>}
                                    </div>
                                </div>
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(record.id)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }
                .add-fab {
                    width: 44px; height: 44px; border-radius: 12px;
                    background-color: var(--token-purple-pill); color: #FFF;
                    border: none; display: flex; justify-content: center; align-items: center;
                    cursor: pointer; box-shadow: 0 4px 12px rgba(168, 116, 246, 0.3);
                }
                .mini-tab {
                    display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px;
                    background: #F3F4F6; border: 1px solid transparent; color: var(--text-muted);
                    font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: all 0.2s;
                }
                .mini-tab.active { background: #FFF; border-color: var(--token-purple-pill); color: var(--token-purple-pill); }
                
                .form-card {
                    background-color: #FFF; padding: 20px; border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-light);
                }
                .form-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
                .form-input {
                    padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-light);
                    background-color: #F9FAFB; font-size: 14px; width: 100%; box-sizing: border-box;
                }
                .submit-btn { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none; }
                .submit-btn.primary { background-color: var(--token-purple-pill); color: #FFF; }
                .submit-btn.secondary { background-color: #F3F4F6; color: var(--text-muted); }
                
                .record-card {
                    background-color: #FFF; padding: 16px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                }
                .type-icon-box {
                    width: 40px; height: 40px; border-radius: 10px; display: flex;
                    justify-content: center; align-items: center; color: var(--text-main);
                }
                .record-title { font-size: 15px; font-weight: 700; }
                .value-tag { background: #F3F4F6; padding: 2px 8px; border-radius: 6px; font-weight: 700; color: var(--text-main); }
                .delete-btn { background: transparent; border: none; color: #EF4444; cursor: pointer; padding: 8px; }
                .empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px; color: var(--text-muted); }
                .fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
