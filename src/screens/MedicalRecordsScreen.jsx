import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clipboard, Plus, Trash2, FileText, Activity, Scale, Image as ImageIcon, Download, Upload, Cpu, X } from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2pdf from 'html2pdf.js';

export default function MedicalRecordsScreen({ onBack }) {
    const { getMedicalRecords, addMedicalRecord, deleteMedicalRecord, uploadMedicalFile, analyzeMedicalRecord } = usePregnancy();
    const [records, setRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // AI Analysis State
    const [analyzingId, setAnalyzingId] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const pdfRef = useRef();

    const [newRecord, setNewRecord] = useState({
        record_type: 'فحص', // فحص, وزن, قياس, إيكو
        title: '',
        date: new Date().toISOString().split('T')[0],
        value: '', // For simple values
        notes: '',
        measurements: {}, // For structured JSON like { sys, dia } or { sugarType, value }
        file_url: null,
    });

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        loadRecords();
    }, []);

    // Also update form record_type when changing tabs if the form is open
    useEffect(() => {
        if (showAddForm && activeTab !== 'all') {
            setNewRecord(prev => ({ ...prev, record_type: activeTab }));
        }
    }, [activeTab, showAddForm]);

    const loadRecords = async () => {
        setLoading(true);
        const data = await getMedicalRecords();
        setRecords(data);
        setLoading(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setUploading(true);

        let fileInfo = null;
        if (selectedFile) {
            fileInfo = await uploadMedicalFile(selectedFile, newRecord.record_type === 'إيكو' ? 'echography' : 'documents');
        }

        const dataToSave = {
            record_type: newRecord.record_type,
            title: newRecord.title || getTranslatedType(newRecord.record_type),
            date: newRecord.date,
            value: newRecord.value,
            notes: newRecord.notes,
            measurements: newRecord.measurements,
            file_url: fileInfo ? fileInfo.url : null,
            fileInfo: fileInfo
        };

        if (!dataToSave.title) dataToSave.title = 'سجل طبي';

        await addMedicalRecord(dataToSave);

        setNewRecord({ record_type: activeTab !== 'all' ? activeTab : 'فحص', title: '', date: new Date().toISOString().split('T')[0], value: '', notes: '', measurements: {}, file_url: null });
        setSelectedFile(null);
        setShowAddForm(false);
        setUploading(false);
        loadRecords();
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
            await deleteMedicalRecord(id);
            loadRecords();
        }
    };

    const handleAnalyze = async (record) => {
        setAnalyzingId(record.id);
        const textToAnalyze = `العنوان: ${record.title}\nالنتيجة: ${record.value}\nملاحظات: ${record.notes}`;
        const result = await analyzeMedicalRecord(textToAnalyze);
        setAnalysisResult({ id: record.id, text: result, title: record.title });
        setAnalyzingId(null);
    };

    const exportToPDF = () => {
        const element = pdfRef.current;
        const opt = {
            margin: 10,
            filename: 'الملف_الطبي_نبضة.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const getTranslatedType = (type) => {
        switch (type) {
            case 'فحص': return 'تحليل طبي';
            case 'إيكو': return 'صورة إيكوغرافي';
            case 'وزن': return 'قياس وزن';
            case 'قياس': return 'قياس حيوي';
            default: return type;
        }
    };

    const filteredRecords = activeTab === 'all'
        ? records
        : records.filter(r => r.record_type === activeTab);

    // Prepare chart data
    const weightData = records.filter(r => r.record_type === 'وزن' && r.value).map(r => ({
        date: new Date(r.date).toLocaleDateString('ar-DZ', { month: 'short', day: 'numeric' }),
        rawDate: new Date(r.date).getTime(),
        weight: parseFloat(r.value)
    })).sort((a, b) => a.rawDate - b.rawDate);

    const bpData = records.filter(r => r.record_type === 'قياس' && r.measurements?.sys && r.measurements?.dia).map(r => ({
        date: new Date(r.date).toLocaleDateString('ar-DZ', { month: 'short', day: 'numeric' }),
        rawDate: new Date(r.date).getTime(),
        sys: parseInt(r.measurements.sys),
        dia: parseInt(r.measurements.dia)
    })).sort((a, b) => a.rawDate - b.rawDate);

    const sugarData = records.filter(r => r.record_type === 'قياس' && r.measurements?.sugarValue).map(r => ({
        date: new Date(r.date).toLocaleDateString('ar-DZ', { month: 'short', day: 'numeric' }),
        rawDate: new Date(r.date).getTime(),
        sugar: parseFloat(r.measurements.sugarValue)
    })).sort((a, b) => a.rawDate - b.rawDate);

    const tabs = [
        { id: 'all', label: 'الكل', icon: <Clipboard size={16} /> },
        { id: 'فحص', label: 'تحاليل', icon: <FileText size={16} /> },
        { id: 'إيكو', label: 'إيكوغراف', icon: <ImageIcon size={16} /> },
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
                <div className="flex-row" style={{ gap: '12px' }}>
                    <button className="icon-btn-purple" onClick={exportToPDF} title="تصدير إلى PDF">
                        <Download size={20} />
                    </button>
                    <button className="add-fab" onClick={() => {
                        setNewRecord({ ...newRecord, record_type: activeTab !== 'all' ? activeTab : 'فحص' });
                        setShowAddForm(!showAddForm);
                    }}>
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="record-tabs flex-row" style={{ gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`mini-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.id); setShowAddForm(false); }}
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

                        {activeTab === 'all' && (
                            <select
                                className="form-input"
                                value={newRecord.record_type}
                                onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value, measurements: {} })}
                            >
                                <option value="فحص">تحليل طبي / فحص</option>
                                <option value="إيكو">صورة إيكوغرافي</option>
                                <option value="وزن">قياس وزن</option>
                                <option value="قياس">قياس آخر (ضغط، سكر)</option>
                            </select>
                        )}

                        <input
                            type="text"
                            placeholder={newRecord.record_type === 'إيكو' ? "عنوان الصورة (مثلاً: إيكو الأسبوع 12)" : "العنوان (مثلاً: فحص دم، ضغط...)"}
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

                        {newRecord.record_type === 'وزن' && (
                            <input
                                type="number" step="0.1"
                                placeholder="الوزن (كغ)"
                                className="form-input"
                                value={newRecord.value}
                                onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                                required
                            />
                        )}

                        {newRecord.record_type === 'قياس' && (
                            <div className="flex-col" style={{ gap: '12px' }}>
                                <select
                                    className="form-input"
                                    value={newRecord.measurements.type || ''}
                                    onChange={(e) => setNewRecord({ ...newRecord, measurements: { type: e.target.value } })}
                                    required
                                >
                                    <option value="" disabled>اختر نوع القياس...</option>
                                    <option value="bp">ضغط الدم</option>
                                    <option value="sugar">نسبة السكر</option>
                                </select>

                                {newRecord.measurements.type === 'bp' && (
                                    <div className="flex-row" style={{ gap: '12px' }}>
                                        <input type="number" placeholder="الانقباضي (Systolic)" className="form-input" required
                                            onChange={(e) => setNewRecord({ ...newRecord, measurements: { ...newRecord.measurements, sys: e.target.value } })} />
                                        <input type="number" placeholder="الانبساطي (Diastolic)" className="form-input" required
                                            onChange={(e) => setNewRecord({ ...newRecord, measurements: { ...newRecord.measurements, dia: e.target.value } })} />
                                    </div>
                                )}

                                {newRecord.measurements.type === 'sugar' && (
                                    <div className="flex-row" style={{ gap: '12px' }}>
                                        <select className="form-input" required
                                            onChange={(e) => setNewRecord({ ...newRecord, measurements: { ...newRecord.measurements, sugarType: e.target.value } })}>
                                            <option value="" disabled selected>الحالة...</option>
                                            <option value="fasting">صائم</option>
                                            <option value="after">بعد الأكل</option>
                                        </select>
                                        <input type="number" step="0.01" placeholder="النسبة (g/L)" className="form-input" required
                                            onChange={(e) => setNewRecord({ ...newRecord, measurements: { ...newRecord.measurements, sugarValue: e.target.value } })} />
                                    </div>
                                )}
                            </div>
                        )}

                        {(newRecord.record_type === 'فحص' || newRecord.record_type === 'إيكو') && (
                            <>
                                {newRecord.record_type === 'فحص' && (
                                    <textarea
                                        placeholder="نتيجة التحليل (يمكنك كتابتها هنا وتخطي رفع الملف)"
                                        className="form-input"
                                        style={{ height: '80px', resize: 'none' }}
                                        value={newRecord.value}
                                        onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                                    />
                                )}
                                <div className="file-upload-wrapper">
                                    <Upload size={20} color="var(--token-purple-pill)" />
                                    <span>{selectedFile ? selectedFile.name : 'إرفاق ملف أو صورة (اختياري)'}</span>
                                    <input type="file" className="file-input" onChange={handleFileChange} accept="image/*,.pdf" />
                                </div>
                            </>
                        )}

                        <textarea
                            placeholder="ملاحظات إضافية"
                            className="form-input"
                            style={{ height: '60px', resize: 'none' }}
                            value={newRecord.notes}
                            onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                        />

                        <div className="flex-row" style={{ gap: '12px', marginTop: '8px' }}>
                            <button type="submit" className="submit-btn primary" disabled={uploading}>
                                {uploading ? 'جاري الحفظ...' : 'حفظ'}
                            </button>
                            <button type="button" className="submit-btn secondary" onClick={() => setShowAddForm(false)}>إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Content to Export */}
            <div ref={pdfRef} className="export-container flex-col" style={{ gap: '20px' }}>

                {/* Visual Charts Section */}
                {!showAddForm && (
                    <div className="charts-section">
                        {(activeTab === 'all' || activeTab === 'وزن') && weightData.length > 0 && (
                            <div className="chart-card fade-in">
                                <h3 className="chart-title">منحنى الوزن (كغ)</h3>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="weight" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'all' || activeTab === 'قياس') && bpData.length > 0 && (
                            <div className="chart-card fade-in">
                                <h3 className="chart-title">قياسات ضغط الدم</h3>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={bpData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" name="الانقباضي" dataKey="sys" stroke="#EF4444" strokeWidth={3} dot={{ r: 3 }} />
                                            <Line type="monotone" name="الانبساطي" dataKey="dia" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'all' || activeTab === 'قياس') && sugarData.length > 0 && (
                            <div className="chart-card fade-in">
                                <h3 className="chart-title">نسبة السكر في الدم</h3>
                                <div className="chart-wrapper">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={sugarData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[0, 'auto']} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" name="السكر" dataKey="sugar" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Echography Gallery view for "إيكو" tab */}
                {activeTab === 'إيكو' && (
                    <div className="gallery-grid">
                        {filteredRecords.map(record => (
                            <div key={record.id} className="gallery-card fade-in">
                                {record.file_url ? (
                                    <img src={record.file_url} alt={record.title} className="gallery-img" />
                                ) : (
                                    <div className="gallery-placeholder">لا توجد صورة</div>
                                )}
                                <div className="gallery-info">
                                    <h4>{record.title}</h4>
                                    <span>{new Date(record.date).toLocaleDateString('ar-DZ')}</span>
                                </div>
                                <button className="delete-btn-corner" onClick={() => handleDelete(record.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {filteredRecords.length === 0 && !loading && (
                            <div className="empty-state w-100 grid-col-span-2">
                                <ImageIcon size={48} className="text-muted" style={{ marginBottom: '12px' }} />
                                <p>لا توجد صور إيكوغرافي حالياً.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* List View for other tabs */}
                {activeTab !== 'إيكو' && (
                    <div className="records-list flex-col" style={{ gap: '12px' }}>
                        {loading ? (
                            <div className="text-center text-muted">جاري التحميل...</div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="empty-state">
                                <Clipboard size={48} className="text-muted" style={{ marginBottom: '12px' }} />
                                <p>لا توجد سجلات حالياً في هذا القسم.</p>
                            </div>
                        ) : (
                            filteredRecords.map((record) => (
                                <div key={record.id} className="record-card flex-col fade-in">
                                    <div className="flex-row justify-between align-center">
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
                                                    {record.record_type === 'وزن' && record.value && <span className="value-tag">{record.value} كغ</span>}
                                                    {record.record_type === 'قياس' && record.measurements?.type === 'bp' &&
                                                        <span className="value-tag">{record.measurements.sys}/{record.measurements.dia} mmHg</span>}
                                                    {record.record_type === 'قياس' && record.measurements?.type === 'sugar' &&
                                                        <span className="value-tag">{record.measurements.sugarValue} g/L</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="delete-btn" onClick={() => handleDelete(record.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {(record.value && record.record_type === 'فحص') && (
                                        <div className="record-value-box mt-12">
                                            <strong>النتيجة: </strong>{record.value}
                                        </div>
                                    )}

                                    {record.notes && (
                                        <div className="record-notes mt-8">
                                            {record.notes}
                                        </div>
                                    )}

                                    {record.file_url && (
                                        <a href={record.file_url} target="_blank" rel="noreferrer" className="view-file-btn mt-12">
                                            <FileText size={16} /> عرض الملف المرفق
                                        </a>
                                    )}

                                    {/* AI Analysis Integration for Analyses */}
                                    {record.record_type === 'فحص' && (
                                        <div className="mt-12">
                                            <button
                                                className="ai-analyze-btn"
                                                onClick={() => handleAnalyze(record)}
                                                disabled={analyzingId === record.id}
                                            >
                                                <Cpu size={16} />
                                                {analyzingId === record.id ? 'جاري التحليل...' : 'تحليل النتيجة الذكي'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* AI Analysis Modal */}
            {analysisResult && (
                <div className="modal-overlay fade-in" onClick={() => setAnalysisResult(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="flex-row justify-between align-center mb-16">
                            <h3 className="modal-title flex-row align-center gap-8">
                                <Cpu size={20} color="var(--token-purple-pill)" />
                                التحليل الذكي: {analysisResult.title}
                            </h3>
                            <button className="icon-btn" onClick={() => setAnalysisResult(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="ai-result-content">
                            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '15px' }}>
                                {analysisResult.text}
                            </p>
                        </div>
                        <p className="ai-disclaimer text-xs text-muted mt-16">
                            ملاحظة: هذا التحليل مدعوم بالذكاء الاصطناعي لتوضيح المفاهيم، ولا يغني عن استشارة الطبيب المختص.
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                .back-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    border: 1px solid var(--border-light); background: transparent;
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                }
                .icon-btn-purple {
                    width: 40px; height: 40px; border-radius: 12px;
                    background-color: #F3E8FF; color: var(--token-purple-pill);
                    border: none; display: flex; justify-content: center; align-items: center; cursor: pointer;
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
                .mini-tab.active { background: #FFF; border-color: var(--token-purple-pill); color: var(--token-purple-pill); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                
                .form-card {
                    background-color: #FFF; padding: 20px; border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-light);
                }
                .form-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; }
                .form-input {
                    padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-light);
                    background-color: #F9FAFB; font-size: 14px; width: 100%; box-sizing: border-box; fontFamily: inherit;
                }
                .form-input:focus { outline: none; border-color: var(--token-purple-pill); background: #FFF; }
                
                .file-upload-wrapper {
                    position: relative; overflow: hidden; display: flex; align-items: center; gap: 8px;
                    padding: 12px 16px; background: #F3E8FF; border: 1px dashed var(--token-purple-pill);
                    border-radius: 12px; color: var(--token-purple-pill); font-weight: 600; font-size: 14px; justify-content: center;
                }
                .file-input { position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0; cursor: pointer; width: 100%; }

                .submit-btn { flex: 1; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; font-size: 15px; transition: all 0.2s; }
                .submit-btn.primary { background-color: var(--token-purple-pill); color: #FFF; }
                .submit-btn.primary:disabled { background-color: #D1D5DB; cursor: not-allowed; }
                .submit-btn.secondary { background-color: #F3F4F6; color: var(--text-main); }
                
                .record-card {
                    background-color: #FFF; padding: 16px; border-radius: 20px;
                    border: 1px solid var(--border-light);
                }
                .type-icon-box {
                    width: 44px; height: 44px; border-radius: 12px; display: flex;
                    justify-content: center; align-items: center; color: var(--text-main); flex-shrink: 0;
                }
                .record-title { font-size: 16px; font-weight: 700; color: #1C1C1E; }
                .value-tag { background: #F3F4F6; padding: 4px 8px; border-radius: 8px; font-weight: 700; color: var(--text-main); }
                .delete-btn { background: transparent; border: none; color: #EF4444; cursor: pointer; padding: 8px; border-radius: 50%; transition: background 0.2s; }
                .delete-btn:hover { background: #FEF2F2; }
                
                .record-value-box { background: #F9FAFB; padding: 12px; border-radius: 12px; font-size: 14px; color: var(--text-main); border-right: 3px solid var(--token-purple-pill); }
                .record-notes { font-size: 14px; color: var(--text-muted); background: #FFF; border: 1px solid var(--border-light); padding: 10px; border-radius: 10px; }
                .view-file-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #EEF2FF; color: #4F46E5; border-radius: 10px; font-size: 13px; font-weight: 600; text-decoration: none; }
                
                /* AI Button */
                .ai-analyze-btn {
                    display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center;
                    background: linear-gradient(135deg, #A855F7, #EC4899); color: #FFF; border: none;
                    padding: 12px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer;
                }
                .ai-analyze-btn:disabled { opacity: 0.7; cursor: wait; }

                /* Charts */
                .chart-card { background: #FFF; padding: 20px 16px; border-radius: 24px; border: 1px solid var(--border-light); margin-bottom: 20px; }
                .chart-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #1C1C1E; }
                .chart-wrapper { width: 100%; height: 200px; }

                /* Gallery */
                .gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .gallery-card { position: relative; border-radius: 16px; overflow: hidden; background: #FFF; border: 1px solid var(--border-light); }
                .gallery-img { width: 100%; height: 140px; object-fit: cover; }
                .gallery-placeholder { width: 100%; height: 140px; background: #F3F4F6; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--text-muted); }
                .gallery-info { padding: 10px; }
                .gallery-info h4 { font-size: 13px; font-weight: 700; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .gallery-info span { font-size: 11px; color: var(--text-muted); }
                .delete-btn-corner { position: absolute; top: 6px; left: 6px; background: rgba(255,255,255,0.9); border: none; color: #EF4444; width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; }

                /* Modal */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 20px; }
                .modal-card { background: #FFF; width: 100%; max-width: 400px; border-radius: 24px; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 80vh; overflow-y: auto; }
                .modal-title { font-size: 18px; font-weight: 800; color: #1C1C1E; margin: 0; }
                .icon-btn { width: 32px; height: 32px; border-radius: 50%; background: #F3F4F6; border: none; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .ai-result-content { background: #FAF5FF; padding: 16px; border-radius: 16px; border: 1px dashed var(--token-purple-pill); }
                .ai-disclaimer { text-align: center; font-size: 12px; }

                .empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 20px; color: var(--text-muted); text-align: center; }
                .fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                
                .mt-8 { margin-top: 8px; }
                .mt-12 { margin-top: 12px; }
                .mt-16 { margin-top: 16px; }
                .mb-16 { margin-bottom: 16px; }
                .gap-8 { gap: 8px; }
                .w-100 { width: 100%; }
                .grid-col-span-2 { grid-column: span 2; }
            `}</style>
        </div>
    );
}
