import React, { useState } from 'react';
import {
    ChevronLeft,
    Search,
    Apple,
    Brain,
    Info,
    ShieldAlert,
    Users,
    Volume2,
    CheckCircle2,
    XCircle,
    PlayCircle
} from 'lucide-react';
import Header from '../components/Header';

export default function LibraryScreen({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('all'); // all, nutrition, health, symptoms, myths, family
    const [selectedArticle, setSelectedArticle] = useState(null);

    const sections = [
        { id: 'nutrition', label: 'التغذية', icon: <Apple size={20} />, color: "#F3E8FF" },
        { id: 'health', label: 'الصحة النفسية', icon: <Brain size={20} />, color: "#E0F2FE" },
        { id: 'symptoms', label: 'توعية صحية', icon: <Info size={20} />, color: "#DCFCE7" },
        { id: 'myths', label: 'خرافة أم حقيقة', icon: <ShieldAlert size={20} />, color: "#FEF3C7" },
        { id: 'family', label: 'العائلة والداعم', icon: <Users size={20} />, color: "#FEE2E2" },
    ];

    const libraryData = [
        // Nutrition
        {
            id: 'n0',
            section: 'nutrition',
            title: 'نصائح غذائية عامة',
            desc: 'القواعد الأساسية لتغذية صحية أثناء الحمل.',
            icon: '🌟',
            content: `• شرب 2 إلى 3 لترات من الماء يوميًا.
• تناول 3 وجبات رئيسية ووجبتين خفيفتين.
• غسل الخضر والفواكه جيدًا.
• طهي اللحوم والبيض جيدًا.
• التقليل من الكافيين.`
        },
        {
            id: 'n1',
            section: 'nutrition',
            title: 'تغذية الأشهر الأولى',
            desc: 'تغذية الحامل في الأشهر الأولى مهمة لنمو الجنين وتكوين أعضائه.',
            icon: '🥗',
            content: `يفضل التركيز على الأطعمة الغنية بـ:
• حمض الفوليك مثل السبانخ والخس.
• البروتين مثل البيض والعدس.
• الفواكه الطازجة.
• الحبوب الكاملة.

يساعد حمض الفوليك على حماية الجنين من التشوهات الخلقية.`
        },
        {
            id: 'n2',
            section: 'nutrition',
            title: 'الأطعمة الممنوعة في البداية',
            desc: 'بعض الأطعمة قد تكون خطيرة في الأشهر الأولى.',
            icon: '❌',
            content: `❌ الكبد بكميات كبيرة: لأنه غني بفيتامين A الذي قد يسبب تشوهات للجنين.
❌ اللحوم النيئة: قد تحتوي على بكتيريا خطيرة.
❌ الأسماك النيئة: مثل السوشي.
❌ الحليب غير المبستر: قد يسبب عدوى للحامل.`
        },
        {
            id: 'n3',
            section: 'nutrition',
            title: 'تقوية دم الحامل',
            desc: 'تساعد هذه الأطعمة في الوقاية من فقر الدم.',
            icon: '🩸',
            content: `الأطعمة الغنية بالحديد:
• اللحوم الحمراء
• العدس
• الحمص
• السبانخ
• الفاصوليا

نصيحة: تناول البرتقال أو الليمون مع هذه الأطعمة لتحسين امتصاص الحديد.`
        },
        {
            id: 'n4',
            section: 'nutrition',
            title: 'نمو دماغ الجنين',
            desc: 'بعض الأطعمة تساعد في نمو دماغ الجنين.',
            icon: '🧠',
            content: `الأطعمة الغنية بالأوميغا 3:
• السردين
• السلمون
• الجوز
• بذور الكتان

تساعد هذه الدهون الصحية على نمو الدماغ والجهاز العصبي.`
        },
        {
            id: 'n5',
            section: 'nutrition',
            title: 'وجبات صحية مقترحة',
            desc: 'أمثلة لوجبات متوازنة للحامل.',
            icon: '🍱',
            content: `مثال وجبة 1: أرز + دجاج مشوي + سلطة خضراء.
مثال وجبة 2: عدس + خبز كامل + خضر.
مثال وجبة 3: بيض مسلوق + خبز كامل + فاكهة.`
        },
        {
            id: 'n6',
            section: 'nutrition',
            title: 'تخفيف الغثيان',
            desc: 'الغثيان شائع خاصة في الأشهر الأولى.',
            icon: '🍋',
            content: `• تناول وجبات صغيرة.
• تجنب الأطعمة الدسمة.
• شرب الزنجبيل أو الليمون.
• تناول البسكويت صباحًا قبل النهوض.`
        },
        {
            id: 'n7',
            section: 'nutrition',
            title: 'تقوية عظام الجنين',
            desc: 'الكالسيوم ضروري لنمو عظام الجنين.',
            icon: '🦴',
            content: `الأطعمة الغنية بالكالسيوم:
• الحليب
• اللبن
• الجبن
• اللوز
• السمسم

تحتاج الحامل حوالي 1000 ملغ من الكالسيوم يوميًا.`
        },
        {
            id: 'n8',
            section: 'nutrition',
            title: 'تقليل الإمساك',
            desc: 'الإمساك مشكلة شائعة أثناء الحمل.',
            icon: '🍏',
            content: `الأطعمة الغنية بالألياف:
• التفاح
• البرتقال
• الخضر
• الحبوب الكاملة
• الشوفان

كما ينصح بشرب الماء بكثرة.`
        },
        {
            id: 'n9',
            section: 'nutrition',
            title: 'المشروبات المفيدة',
            desc: 'بعض المشروبات مفيدة لصحة الحامل.',
            icon: '🥤',
            content: `• الماء
• الحليب
• عصير الفواكه الطبيعي
• عصير البرتقال
• الحساء

يفضل تجنب المشروبات الغازية.`
        },
        {
            id: 'n10',
            section: 'nutrition',
            title: 'الكافيين والحمل',
            desc: 'يجب الانتباه إلى كمية الكافيين المستهلكة.',
            icon: '☕',
            content: `ينصح بألا تتجاوز الحامل 200 ملغ من الكافيين يوميًا.
ما يعادل تقريبًا كوب قهوة واحد.

الإفراط في الكافيين قد يزيد خطر الإجهاض أو انخفاض وزن الجنين.`
        },
        // Monthly Nutrition Guides
        {
            id: 'nm1',
            section: 'nutrition',
            title: 'تغذية الشهر الأول',
            desc: 'التركيز على حمض الفوليك لتجنب تشوهات الأنبوب العصبي.',
            icon: '1️⃣',
            content: `في هذه المرحلة يبدأ تشكل الجنين وتكون الخلايا الأولى.
            
المسموح: الخضر الورقية (سبانخ، خس)، فواكه طازجة، حبوب كاملة، حليب مبستر، بيض ولحوم مطهية جيداً، عدس وحمص.
الممنوع: الكحول والتدخين، اللحوم والأسماك النيئة، الحليب غير المبستر، الكافيين المفرط.`
        },
        {
            id: 'nm2',
            section: 'nutrition',
            title: 'تغذية الشهر الثاني',
            desc: 'بداية تشكل الأعضاء والتعامل مع الغثيان.',
            icon: '2️⃣',
            content: `المسموح: وجبات صغيرة ومتكررة، خبز كامل، موز، زنجبيل (للعلاج الغثيان)، أرز وخضر مسلوقة، يافورت.
الممنوع: الأطعمة الدسمة والمقلية، الروائح القوية، المشروبات الغازية بكثرة.`
        },
        {
            id: 'nm3',
            section: 'nutrition',
            title: 'تغذية الشهر الثالث',
            desc: 'استمرار نمو الأعضاء وتحذير من فيتامين A الزائد.',
            icon: '3️⃣',
            content: `المسموح: لحوم حمراء وبيض مطهي جيداً، فواكه وخضر، حبوب كاملة، مكسرات باعتدال.
تجنبي: الكبد بكميات كبيرة (غني بفيتامين A)، واللحوم والأسماك النيئة.`
        },
        {
            id: 'nm4',
            section: 'nutrition',
            title: 'تغذية الشهر الرابع',
            desc: 'بداية النمو السريع وزيادة الحاجة للطاقة.',
            icon: '4️⃣',
            content: `المسموح: لحوم حمراء، عدس وفاصوليا، حليب ومشتقاته، خضر ورقية، فواكه متنوعة.
قللي من: الحلويات بكثرة والملح الزائد.`
        },
        {
            id: 'nm5',
            section: 'nutrition',
            title: 'تغذية الشهر الخامس',
            desc: 'زيادة الحركة والحاجة للحديد والكالسيوم.',
            icon: '5️⃣',
            content: `المسموح: سبانخ، عدس، لحوم حمراء، حليب وجبن مبستر، لوز.
تجنبي: القهوة بكثرة والأطعمة المالحة جداً.`
        },
        {
            id: 'nm6',
            section: 'nutrition',
            title: 'تغذية الشهر السادس',
            desc: 'التعامل مع الحموضة المعوية.',
            icon: '6️⃣',
            content: `المسموح: أرز، بطاطا، لبن، خضر مطهية، فواكه.
تجنبي: الأطعمة الحارة والدسمة، والوجبات الكبيرة قبل النوم.`
        },
        {
            id: 'nm7',
            section: 'nutrition',
            title: 'تغذية الشهر السابع',
            desc: 'زيادة حجم الدم والحاجة المكثفة للحديد.',
            icon: '7️⃣',
            content: `المسموح: لحوم حمراء، عدس، حمص، سبانخ، برتقال (لامتصاص الحديد).
نصيحة: تجنبي الشاي مباشرة بعد الطعام لأنه يقلل امتصاص الحديد.`
        },
        {
            id: 'nm8',
            section: 'nutrition',
            title: 'تغذية الشهر الثامن',
            desc: 'النمو السريع للجنين وثقل المعدة.',
            icon: '8️⃣',
            content: `المسموح: وجبات صغيرة ومتكررة، بروتينات، خضر وفواكه، حبوب كاملة.
تجنبي: الوجبات الثقيلة والحلويات بكثرة.`
        },
        {
            id: 'nm9',
            section: 'nutrition',
            title: 'تغذية الشهر التاسع',
            desc: 'الاستعداد للولادة والتركيز على الطاقة والترطيب.',
            icon: '9️⃣',
            content: `المسموح: التمر (باعتدال)، حساء، خضر وفواكه، بروتينات، ماء بكثرة.
قللي من: الأطعمة الدسمة والسكريات الزائدة.`
        },
        // Health
        {
            id: 'h1',
            section: 'health',
            title: 'تخفيف القلق والتوتر',
            desc: 'تقنيات للهدوء النفسي أثناء الحمل.',
            icon: '🧘‍♀️',
            content: 'تنفسي بعمق، مارسي التأمل...'
        },
        {
            id: 'h2',
            section: 'health',
            title: 'وضعيات النوم المريحة',
            desc: 'كيف تنامين بعمق في كل مرحلة.',
            icon: '😴',
            content: 'النوم على الجانب الأيسر هو الأفضل للأوعية الدموية...'
        },
        // Symptoms
        {
            id: 's1',
            section: 'symptoms',
            title: 'الحموضة وآلام الظهر',
            desc: 'شرح بسيط للأعراض وطرق الوقاية.',
            icon: '💡',
            content: 'تجنبي النوم مباشرة بعد الأكل، حافظي على استقامة ظهرك...'
        },
        // Myths
        {
            id: 'm1',
            section: 'myths',
            title: 'خرافات شائعة عن الحمل',
            desc: 'هل هي حقيقة أم خرافة؟ مرجعية منظمة الصحة العالمية.',
            icon: '🧐',
            isFlip: true,
            myth: 'الأكل عن شخصين ضروري لنمو الجنين.',
            fact: 'تحتاجين فقط لـ 300 سعرة حرارية إضافية في اليوم تقريباً.'
        },
        // Family
        {
            id: 'f1',
            section: 'family',
            title: 'كيف يساعد الزوج؟',
            desc: 'دور الشريك في مراحل الحمل المختلفة.',
            icon: '🤝',
            content: 'الدعم النفسي، حضور المواعيد الطبية، المساعدة في المنزل...'
        },
    ];

    const filteredData = libraryData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSection = activeSection === 'all' || item.section === activeSection;
        return matchesSearch && matchesSection;
    });

    const renderArticle = (article) => (
        <div className="article-overlay fade-in">
            <div className="article-content-card">
                <button className="close-article-btn" onClick={() => setSelectedArticle(null)}>
                    <ChevronLeft size={24} />
                </button>
                <div className="article-header">
                    <span className="article-icon-large">{article.icon}</span>
                    <h2 className="article-page-title">{article.title}</h2>
                </div>
                <div className="article-body text-rtl">
                    <p>{article.content || "محتوى المقال الكامل سيظهر هنا..."}</p>
                    {article.isFlip && (
                        <div className="myth-fact-box">
                            <div className="myth-side">
                                <strong>الخرافة:</strong> {article.myth}
                            </div>
                            <div className="fact-side">
                                <strong>الحقيقة (حسب OMS):</strong> {article.fact}
                            </div>
                        </div>
                    )}
                </div>
                <div className="article-actions-row">
                    <button className="action-pill"><Volume2 size={16} /> نسخة صوتية</button>
                    <button className="action-pill">مشاركة</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="library-container flex-col">
            <div className="flex-row align-center" style={{ gap: '12px', marginTop: '16px' }}>
                <button onClick={onBack} className="back-btn">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="section-title">المكتبة</h2>
            </div>

            <p className="library-intro text-rtl">مكتبتك: المكان الموثوق لمتابعة حملك</p>

            {/* Smart Search */}
            <div className="search-bar-container">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="ابحثي عن دوخة، ألم ظهر، تغذية..."
                    className="smart-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Horizontal Sections */}
            <div className="sections-scroll-nav">
                <button
                    className={`section-nav-pill ${activeSection === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveSection('all')}
                >الكل</button>
                {sections.map(sec => (
                    <button
                        key={sec.id}
                        className={`section-nav-pill ${activeSection === sec.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(sec.id)}
                    >
                        {sec.icon}
                        <span>{sec.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="library-grid">
                {filteredData.map(item => (
                    <div
                        key={item.id}
                        className="library-card-item"
                        onClick={() => setSelectedArticle(item)}
                    >
                        <div className="card-top flex-row justify-between">
                            <span className="card-emoji">{item.icon}</span>
                            {item.section === 'myths' && <span className="myth-badge">حقيقة/خرافة</span>}
                        </div>
                        <div className="card-main">
                            <h4 className="card-title-lib text-rtl">{item.title}</h4>
                            <p className="card-desc-lib text-rtl">{item.desc}</p>
                        </div>
                        <div className="card-footer-lib">
                            <span>اقرئي المزيد</span>
                            <ChevronLeft size={14} />
                        </div>
                    </div>
                ))}
            </div>

            {selectedArticle && renderArticle(selectedArticle)}

            <style>{`
                .library-container { padding-bottom: 40px; }
                .library-intro {
                    font-size: 14px;
                    color: var(--text-muted);
                    margin-top: -12px;
                    margin-bottom: 20px;
                }
                .search-bar-container {
                    position: relative;
                    margin-bottom: 24px;
                }
                .search-icon {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .smart-search-input {
                    width: 100%;
                    padding: 14px 48px 14px 20px;
                    border-radius: 16px;
                    border: 1px solid var(--border-light);
                    background-color: var(--bg-surface);
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .smart-search-input:focus { border-color: var(--token-purple-pill); }

                .sections-scroll-nav {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding-bottom: 16px;
                    margin: 0 -20px;
                    padding: 0 20px 16px 20px;
                    scrollbar-width: none;
                }
                .sections-scroll-nav::-webkit-scrollbar { display: none; }
                .section-nav-pill {
                    padding: 10px 18px;
                    border-radius: 20px;
                    background-color: var(--bg-surface);
                    border: 1px solid var(--border-light);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .section-nav-pill.active {
                    background-color: var(--token-purple-pill);
                    color: #FFF;
                    border-color: var(--token-purple-pill);
                }

                .library-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }
                .library-card-item {
                    background-color: #FFF;
                    border-radius: 24px;
                    padding: 20px;
                    border: 1px solid var(--border-light);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .library-card-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                }
                .card-emoji { font-size: 24px; }
                .card-title-lib { font-size: 15px; font-weight: 700; color: #1C1C1E; line-height: 1.3; }
                .card-desc-lib { font-size: 11px; color: var(--text-muted); line-height: 1.4; }
                .card-footer-lib {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--token-purple-pill);
                    margin-top: auto;
                }
                .myth-badge {
                    font-size: 9px;
                    background-color: #FEF3C7;
                    color: #92400E;
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-weight: 600;
                }

                .article-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: rgba(255,255,255,0.98);
                    z-index: 1000;
                    padding: 20px;
                    overflow-y: auto;
                }
                .article-content-card {
                    max-width: 600px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    padding-top: 40px;
                }
                .close-article-btn {
                    width: 44px; height: 44px; border-radius: 50%;
                    border: 1px solid var(--border-light);
                    background: transparent;
                    display: flex; justify-content: center; align-items: center;
                    cursor: pointer; align-self: flex-start;
                }
                .article-icon-large { font-size: 48px; }
                .article-page-title { font-size: 28px; font-weight: 700; color: #1C1C1E; margin-top: 10px; }
                .article-body { font-size: 16px; color: #444; line-height: 1.8; }
                
                .myth-fact-box {
                    margin-top: 30px;
                    border-radius: 20px;
                    overflow: hidden;
                    border: 1px solid var(--border-light);
                }
                .myth-side {
                    background-color: #FFF1F2;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-light);
                }
                .fact-side {
                    background-color: #ECFDF5;
                    padding: 20px;
                }

                .article-actions-row {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }
                .action-pill {
                    padding: 10px 20px;
                    border-radius: 20px;
                    border: 1px solid var(--border-light);
                    background-color: var(--bg-surface);
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
