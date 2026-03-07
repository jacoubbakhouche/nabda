import React from 'react';
import Header from '../components/Header';
import { ChevronLeft } from 'lucide-react';

export default function CategoryGridScreen({ onBack, onSelectCategory }) {
    const categories = [
        { id: 'follow-up', icon: "📊", label: "متابعة الحمل", desc: "تتبع أسبوعي دقيق", color: "#F3E8FF" },
        { id: 'library', icon: "📚", label: "المكتبة", desc: "معلومات طبية موثوقة", color: "#E0F2FE" },
        { id: 'appointments', icon: "📅", label: "المواعيد", desc: "جدولة زياراتك", color: "#DCFCE7" },
        { id: 'prepare', icon: "🤰", label: "استعدي للولادة", desc: "دليلك ليوم اللقاء", color: "#FEF3C7" },
        { id: 'medical', icon: "📋", label: "السجل الطبي", desc: "تحاليلك وقياساتك", color: "#FEE2E2" },
        { id: 'wellness', icon: "🧘", label: "رفاهية", desc: "عناية وراحة", color: "#EDE9FE" },
        { id: 'baby-care', icon: "👶", label: "رعاية الرضيع", desc: "ما بعد الولادة", color: "#E0F2FE" },
        { id: 'diary', icon: "📝", label: "تجربتك", desc: "يومياتك للذكرى", color: "#F1F5F9" },
    ];

    return (
        <div className="flex-col" style={{ gap: '24px' }}>
            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">المجموعة</h2>
            </div>

            <div className="categories-full-grid">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="category-card flex-row align-center"
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <div className="cat-icon-box" style={{ backgroundColor: cat.color }}>
                            {cat.icon}
                        </div>
                        <div className="flex-col" style={{ marginLeft: '16px' }}>
                            <span className="cat-label">{cat.label}</span>
                            <span className="cat-desc">{cat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .back-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 1px solid var(--border-light);
                    background: transparent;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                }
                .categories-full-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 40px;
                }
                .category-card {
                    background-color: var(--bg-surface);
                    padding: 16px;
                    border-radius: 24px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                    border: 1px solid transparent;
                    transition: border-color 0.2s ease;
                    cursor: pointer;
                }
                .category-card:hover {
                    border-color: var(--token-purple-pill);
                }
                .cat-icon-box {
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 28px;
                }
                .cat-label {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .cat-desc {
                    font-size: 12px;
                    color: var(--text-muted);
                    margin-top: 2px;
                }
            `}</style>
        </div>
    );
}
