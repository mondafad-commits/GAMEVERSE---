import { useMemo, useState } from 'react';
import { ArrowRight, Check, Sparkles, RotateCcw, WandSparkles } from 'lucide-react';

type Choice = { name: string; emoji: string; color: string };
const looks: Choice[] = [
  { name: 'فستان الأميرة', emoji: '👗', color: '#f28fca' },
  { name: 'إطلالة النجمة', emoji: '🩷', color: '#a78bfa' },
  { name: 'ستايل الربيع', emoji: '🌼', color: '#72cbb0' },
  { name: 'فستان السهرة', emoji: '✨', color: '#78a9ee' },
];
const hairs: Choice[] = [
  { name: 'شعر طويل', emoji: '💇🏻‍♀️', color: '#bd805b' },
  { name: 'ضفائر', emoji: '👧🏻', color: '#8c5a43' },
  { name: 'تاج لامع', emoji: '👸🏻', color: '#e8bd59' },
];
const extras: Choice[] = [
  { name: 'حقيبة', emoji: '👜', color: '#d88bd4' },
  { name: 'وردة', emoji: '🌸', color: '#f39ac5' },
  { name: 'نجمة', emoji: '🌟', color: '#edc66a' },
  { name: 'قلادة', emoji: '📿', color: '#9b8be7' },
];
const scenes = [
  { name: 'حديقة الأحلام', emoji: '🌷', color: 'linear-gradient(145deg,#f9c8e7,#b7e8d6)' },
  { name: 'قصر الأميرات', emoji: '🏰', color: 'linear-gradient(145deg,#cbb8ff,#f6c7e8)' },
  { name: 'ليلة النجوم', emoji: '🌙', color: 'linear-gradient(145deg,#27386f,#916bc2)' },
];
export default function FashionGame({ onBack }: { onBack: () => void }) {
  const [look, setLook] = useState(0);
  const [hair, setHair] = useState(0);
  const [extra, setExtra] = useState(0);
  const [scene, setScene] = useState(0);
  const [done, setDone] = useState(false);
  const total = useMemo(() => 3 + (look === 0 ? 1 : 0) + (extra === 2 ? 1 : 0), [look, extra]);
  const reset = () => { setLook(0); setHair(0); setExtra(0); setScene(0); setDone(false); };
  return <div className="fashion-game">
    <div className="fashion-top"><button className="fashion-back" onClick={onBack}><ArrowRight size={17}/> رجوع للمكتبة</button><div><span>🎀</span><b>مملكة الأزياء</b><small>استوديو تصميمك الخاص</small></div><span className="fashion-level">المستوى 1 ⭐</span></div>
    <div className="fashion-heading"><div><label><WandSparkles size={15}/> تحدي اليوم</label><h2>صمّمي إطلالة الأحلام!</h2><p>اختاري الملابس والتسريحة والإكسسوارات، ثم اعرضي إبداعك.</p></div><div className="fashion-progress"><span>✨</span><b>{done ? 'اكتمل التحدي!' : 'مهمتك: 3 اختيارات'}</b><small>{done ? 'أبدعتِ يا مصممة!' : 'كل اختيار يضيف لمستك الخاصة'}</small></div></div>
    <div className="fashion-layout">
      <section className="fashion-stage" style={{ background: scenes[scene].color }}>
        <div className="stage-stars">✦　 ✧　✦</div><div className="stage-scene">{scenes[scene].emoji}</div>
        <div className="fashion-character"><div className="character-crown">👑</div><div className="character-hair">{hairs[hair].emoji}</div><div className="character-face">😊</div><div className="character-dress" style={{ background: looks[look].color }}>{looks[look].emoji}</div><div className="character-extra">{extras[extra].emoji}</div></div>
        <div className="stage-caption"><b>مصممة الأزياء الصغيرة</b><span>إطلالة من اختيارك 💖</span></div>
        {done && <div className="fashion-result"><span>🏆</span><b>رائعة يا آمنة!</b><small>حصلتِ على {total} نجوم</small></div>}
      </section>
      <section className="fashion-wardrobe">
        <div className="wardrobe-title"><div><Sparkles size={17}/><b>خزانة الإبداع</b></div><span>اختاري ما تحبين</span></div>
        <div className="wardrobe-group"><h3>👗 الملابس</h3><div className="choice-grid">{looks.map((x,i)=><button key={x.name} className={look===i?'choice active':'choice'} onClick={()=>{setLook(i);setDone(false)}}><span style={{background:x.color}}>{x.emoji}</span><small>{x.name}</small>{look===i&&<Check size={14}/>}</button>)}</div></div>
        <div className="wardrobe-group"><h3>💇🏻‍♀️ التسريحة</h3><div className="choice-grid compact">{hairs.map((x,i)=><button key={x.name} className={hair===i?'choice active':'choice'} onClick={()=>{setHair(i);setDone(false)}}><span style={{background:x.color}}>{x.emoji}</span><small>{x.name}</small>{hair===i&&<Check size={14}/>}</button>)}</div></div>
        <div className="wardrobe-group"><h3>💎 الإكسسوارات</h3><div className="choice-grid compact">{extras.map((x,i)=><button key={x.name} className={extra===i?'choice active':'choice'} onClick={()=>{setExtra(i);setDone(false)}}><span style={{background:x.color}}>{x.emoji}</span><small>{x.name}</small>{extra===i&&<Check size={14}/>}</button>)}</div></div>
        <div className="wardrobe-group"><h3>🌈 مكان العرض</h3><div className="scene-picks">{scenes.map((x,i)=><button key={x.name} className={scene===i?'scene-pick active':'scene-pick'} onClick={()=>setScene(i)} title={x.name}>{x.emoji}</button>)}</div></div>
        <div className="fashion-actions"><button className="fashion-reset" onClick={reset}><RotateCcw size={15}/> إعادة التصميم</button><button className="fashion-finish" onClick={()=>setDone(true)}><Sparkles size={16}/> اعرضي إطلالتك</button></div>
      </section>
    </div>
  </div>;
}
