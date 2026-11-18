import { useState } from 'react';
import { ArrowRight, Heart, Utensils, Sparkles, Droplets, RotateCcw } from 'lucide-react';

const pets = [
  { id: 'cat', emoji: '🐱', name: 'لولو القطة' },
  { id: 'fox', emoji: '🦊', name: 'فوفو الثعلب' },
  { id: 'panda', emoji: '🐼', name: 'بندق الباندا' },
  { id: 'rabbit', emoji: '🐰', name: 'مشمش الأرنب' },
  { id: 'koala', emoji: '🐨', name: 'كوكو الكوالا' },
];

const initialNeeds = { hunger: 65, happiness: 55, cleanliness: 75, energy: 70 };
type Needs = typeof initialNeeds;

export default function PetGame({ onBack }: { onBack: () => void }) {
  const [pet, setPet] = useState(0);
  const [needs, setNeeds] = useState<Needs>({ ...initialNeeds });
  const [message, setMessage] = useState('مرحباً! أنا أنتظر صديقتي الجديدة 💜');
  const [careCount, setCareCount] = useState(0);

  const care = (changes: Partial<Record<keyof Needs, number>>, text: string) => {
    setNeeds(old => {
      const next = { ...old };
      (Object.keys(changes) as (keyof Needs)[]).forEach(key => {
        next[key] = Math.min(100, Math.max(0, old[key] + (changes[key] ?? 0)));
      });
      return next;
    });
    setMessage(text);
    setCareCount(value => value + 1);
  };

  const changePet = (index: number) => {
    setPet(index);
    setNeeds({ ...initialNeeds });
    setCareCount(0);
    setMessage('اختيار جميل! هيا نعتني بصديقنا الجديد 🌷');
  };

  const reset = () => {
    setNeeds({ ...initialNeeds });
    setCareCount(0);
    setMessage('عاد صديقك نشيطاً وسعيداً، هيا نبدأ من جديد!');
  };

  const bars: { key: keyof Needs; label: string; emoji: string; color: string }[] = [
    { key: 'hunger', label: 'الشبع', emoji: '🍎', color: '#f0a34c' },
    { key: 'happiness', label: 'السعادة', emoji: '💖', color: '#e77eb3' },
    { key: 'cleanliness', label: 'النظافة', emoji: '🫧', color: '#72bce8' },
    { key: 'energy', label: 'النشاط', emoji: '⚡', color: '#9b83dc' },
  ];

  return (
    <div dir="rtl" style={{ maxWidth: 900, margin: '24px auto', padding: 18, color: '#46345c' }}>
      <button onClick={onBack} style={{ border: 0, borderRadius: 14, padding: '10px 16px', background: '#f2e8ff', color: '#6945a0', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
        <ArrowRight size={17}/> رجوع للمكتبة
      </button>
      <div style={{ textAlign: 'center', padding: '18px 8px 8px' }}>
        <div style={{ fontSize: 38 }}>🏝️ 🐾 🌴</div>
        <h2 style={{ margin: '8px 0', fontSize: 28 }}>جزيرة الحيوانات</h2>
        <p style={{ margin: 0, color: '#806d94' }}>اختاري حيوانك الأليف واعتني به حتى يصبح سعيداً!</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 9, flexWrap: 'wrap', margin: '18px 0' }}>
        {pets.map((item, index) => (
          <button key={item.id} onClick={() => changePet(index)} aria-pressed={pet === index}
            style={{ border: pet === index ? '2px solid #9a70d0' : '2px solid #eadcfb', borderRadius: 16, padding: '9px 12px', background: pet === index ? '#f2e8ff' : '#fff', cursor: 'pointer', fontWeight: 800, color: '#604779' }}>
            <span style={{ fontSize: 25 }}>{item.emoji}</span><br/><small>{item.name}</small>
          </button>
        ))}
      </div>
      <section style={{ background: 'linear-gradient(145deg,#e7f8ed,#f8e6f6)', borderRadius: 28, padding: 22, textAlign: 'center', maxWidth: 680, margin: '0 auto', boxShadow: '0 8px 24px #60477912' }}>
        <div style={{ fontSize: 100, lineHeight: 1.35 }}>{pets[pet].emoji}</div>
        <h3 style={{ fontSize: 23, margin: '4px 0 8px' }}>{pets[pet].name}</h3>
        <p role="status" style={{ minHeight: 28, margin: '0 0 18px', color: '#765d8b', fontWeight: 700 }}>{message}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(125px,1fr))', gap: 12, textAlign: 'right' }}>
          {bars.map(bar => (
            <div key={bar.key} style={{ background: '#ffffffd9', padding: 12, borderRadius: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13 }}><span>{bar.emoji} {bar.label}</span><span>{needs[bar.key]}%</span></div>
              <div style={{ height: 9, borderRadius: 20, background: '#eee7f3', marginTop: 9, overflow: 'hidden' }}>
                <div style={{ width: needs[bar.key] + '%', height: '100%', borderRadius: 20, background: bar.color, transition: 'width .25s' }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(125px,1fr))', gap: 10, marginTop: 20 }}>
          <button onClick={() => care({ hunger: 25, cleanliness: -5 }, 'لذيذ! شبع صديقك، لكن حان وقت تنظيفه لاحقاً 🍎')} style={actionStyle}><Utensils size={18}/> أطعميه</button>
          <button onClick={() => care({ happiness: 24, energy: -12, hunger: -5 }, 'يا لها من لعبة ممتعة! لقد أسعدته، لكنه يحتاج إلى الراحة والطعام 🎾')} style={actionStyle}><Heart size={18}/> العبي معه</button>
          <button onClick={() => care({ cleanliness: 25, energy: -4 }, 'أصبح نظيفاً ولامعاً! أحسنتِ الاعتناء به 🫧')} style={actionStyle}><Droplets size={18}/> نظّفيه</button>
          <button onClick={() => care({ energy: 25, hunger: -8 }, 'وقت الراحة أعاده نشيطاً! لكنه سيجوع بعد النوم 🌙')} style={actionStyle}><Sparkles size={18}/> وقت الراحة</button>
        </div>
        <div style={{ marginTop: 16, color: '#765d8b', fontWeight: 800 }}>🌟 مرات الاعتناء بصديقك: {careCount}</div>
      </section>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <button onClick={reset} style={{ border: 0, borderRadius: 14, padding: '11px 17px', background: '#7c54b5', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
          <RotateCcw size={16}/> إعادة النشاط
        </button>
      </div>
    </div>
  );
}

const actionStyle = { border: 0, borderRadius: 15, padding: '13px 10px', background: '#fff', color: '#684a83', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' } as const;
