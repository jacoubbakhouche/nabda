import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, MapPin, Plus, Trash2, Clock } from 'lucide-react';
import Header from '../components/Header';
import { usePregnancy } from '../context/PregnancyContext';

export default function AppointmentsScreen({ onBack }) {
    const { getAppointments, addAppointment, deleteAppointment } = usePregnancy();
    const [appointments, setAppointments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [newAppt, setNewAppt] = useState({
        title: '',
        doctor_name: '',
        date: '',
        time: '',
        location: '',
        notes: ''
    });

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newAppt.title || !newAppt.date) return;

        await addAppointment(newAppt);
        setNewAppt({ title: '', doctor_name: '', date: '', time: '', location: '', notes: '' });
        setShowAddForm(false);
        loadAppointments();
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
            await deleteAppointment(id);
            loadAppointments();
        }
    };

    return (
        <div className="flex-col" style={{ gap: '20px' }}>
            <Header />

            <div className="flex-row justify-between align-center">
                <div className="flex-row align-center" style={{ gap: '12px' }}>
                    <button onClick={onBack} className="back-btn">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="section-title">المواعيد</h2>
                </div>
                <button className="add-fab" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus size={24} />
                </button>
            </div>

            {showAddForm && (
                <div className="form-card fade-in">
                    <h3 className="form-title">موعد جديد</h3>
                    <form onSubmit={handleAdd} className="flex-col" style={{ gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="عنوان الموعد (مثلاً: فحص دوري)"
                            className="form-input"
                            value={newAppt.title}
                            onChange={(e) => setNewAppt({ ...newAppt, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="اسم الطبيب (اختياري)"
                            className="form-input"
                            value={newAppt.doctor_name}
                            onChange={(e) => setNewAppt({ ...newAppt, doctor_name: e.target.value })}
                        />
                        <div className="flex-row" style={{ gap: '12px' }}>
                            <input
                                type="date"
                                className="form-input"
                                value={newAppt.date}
                                onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                                required
                                style={{ flex: 1 }}
                            />
                            <input
                                type="time"
                                className="form-input"
                                value={newAppt.time}
                                onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                                required
                                style={{ flex: 1 }}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="المكان"
                            className="form-input"
                            value={newAppt.location}
                            onChange={(e) => setNewAppt({ ...newAppt, location: e.target.value })}
                        />
                        <textarea
                            placeholder="ملاحظات إضافية"
                            className="form-input"
                            style={{ height: '80px', resize: 'none' }}
                            value={newAppt.notes}
                            onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                        />
                        <div className="flex-row" style={{ gap: '12px' }}>
                            <button type="submit" className="submit-btn primary">حفظ</button>
                            <button type="button" className="submit-btn secondary" onClick={() => setShowAddForm(false)}>إلغاء</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="appt-list flex-col" style={{ gap: '16px' }}>
                {loading ? (
                    <div className="text-center text-muted">جاري التحميل...</div>
                ) : appointments.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={48} className="text-muted" style={{ marginBottom: '12px' }} />
                        <p>لا توجد مواعيد مجدولة حالياً.</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div key={appt.id} className="appt-card flex-row justify-between align-center fade-in">
                            <div className="flex-col" style={{ gap: '4px' }}>
                                <span className="appt-title">{appt.title}</span>
                                {appt.doctor_name && (
                                    <span className="text-sm text-muted">د. {appt.doctor_name}</span>
                                )}
                                <div className="flex-row align-center text-muted text-xs" style={{ gap: '8px', marginTop: '4px' }}>
                                    <Clock size={14} />
                                    <span>
                                        {new Date(appt.date).toLocaleDateString('ar-DZ', { dateStyle: 'medium' })}
                                        {appt.time ? ` - ${appt.time}` : ''}
                                    </span>
                                </div>
                                {appt.location && (
                                    <div className="flex-row align-center text-muted text-xs" style={{ gap: '8px' }}>
                                        <MapPin size={14} />
                                        <span>{appt.location}</span>
                                    </div>
                                )}
                            </div>
                            <button className="delete-btn" onClick={() => handleDelete(appt.id)}>
                                <Trash2 size={18} />
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
                .form-card {
                    background-color: #FFF; padding: 20px; border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-light);
                }
                .form-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: var(--text-main); }
                .form-input {
                    padding: 12px 16px; border-radius: 12px; border: 1px solid var(--border-light);
                    background-color: #F9FAFB; font-size: 14px; width: 100%; box-sizing: border-box;
                }
                .submit-btn {
                    flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; border: none;
                }
                .submit-btn.primary { background-color: var(--token-purple-pill); color: #FFF; }
                .submit-btn.secondary { background-color: #F3F4F6; color: var(--text-muted); }
                
                .appt-card {
                    background-color: #FFF; padding: 16px 20px; border-radius: 20px;
                    border: 1px solid var(--border-light); box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                }
                .appt-title { font-size: 16px; font-weight: 700; color: var(--text-main); }
                .delete-btn {
                    background: transparent; border: none; color: #EF4444; cursor: pointer;
                    padding: 8px; border-radius: 8px; transition: background 0.2s;
                }
                .delete-btn:hover { background-color: #FEF2F2; }
                .empty-state {
                    display: flex; flex-direction: column; align-items: center;
                    justify-content: center; padding: 40px 20px; color: var(--text-muted);
                }
                .fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
