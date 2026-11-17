import { useState } from 'react';
import { ArrowRight, ChefHat, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

const recipes = [
  { name: 'كب كيك الفراولة', emoji: '🧁', items: ['🥚', '🥛', '🌾', '🍓'], hint: 'اخلطي البيض والحليب والدقيق ثم زيني بالفراولة' },
  { name: 'بيتزا صغيرة', emoji: '🍕', items: ['🌾', '🍅', '🧀', '🫒'], hint: 'حضّري العجينة ثم أضيفي الطماطم والجبن والزيتون' },
  { name: 'عصير الألوان', emoji: '🥤', items: ['🍓', '🍌', '🥭', '🧊'], hint: 'اختاري الفواكه وأضيفي الثلج في النهاية' },
];
export default function CookingGame({ onBack }: { onBack: () => void }) {
  const [recipe, setRecipe] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const current = recipes[recipe];
  const toggle = (item: string) => {
    if (finished) return;
    setPicked(old => old.includes(item) ? old.filter(x => x !== item) : [...old, item]);
  };
  const reset = () => { setPicked([]); setFinished(false); };
  const next = () => { setRecipe((recipe + 1) % recipes.length); reset(); };
  const complete = current.items.every(item => picked.includes(item));
  return <div className="jewel-game">
    <header className="jewel-top"><button onClick={onBack}><ArrowRight size={17}/> رجوع للمكتبة</button><div><span>👩‍🍳</span><b>تحدي الطبخ</b><small>مطبخ آمنة الصغير</small></div><span className="jewel-level">وصفة {recipe + 1} / {recipes.length}</span></header>
    <section className="jewel-intro"><div><label><ChefHat size={15}/> لعبة المطبخ</label><h2>حضّري {current.name}!</h2><p>{current.hint}</p></div><div className="jewel-score"><span>🧺 <b>{picked.length}/{current.items.length}</b><small>مكونات</small></span><span>⭐ <b>{finished ? 'تم!' : 'جاهزة؟'}</b><small>تحدي الطبخ</small></span></div></section>
    <section style={{maxWidth:720,margin:'22px auto',padding:24,borderRadius:28,background:'linear-gradient(145deg,#fff0df,#ffe2ef)',textAlign:'center',color:'#58354b'}}>
      <div style={{fontSize:90}}>{finished ? '🎉' : current.emoji}</div>
      <h2>{finished ? 'أحسنتِ يا شيف آمنة!' : 'اختاري كل المكونات الصحيحة'}</h2>
      <p>{finished ? 'أصبحت وصفتك جاهزة للتقديم!' : 'اضغطي على المكونات لإضافتها إلى وصفتك.'}</p>
      <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap',margin:'22px 0'}}>
        {current.items.map(item=><button key={item} onClick={()=>toggle(item)} style={{fontSize:34,padding:12,borderRadius:18,border:picked.includes(item)?'3px solid #c45b9b':'2px solid #fff',background:picked.includes(item)?'#f8c7e2':'white',opacity:finished?0.8:1}}>{item}</button>)}
      </div>
      {finished ? <div style={{fontSize:22}}>🏆 ⭐⭐⭐</div> : <button className="fashion-finish" disabled={!complete} onClick={()=>setFinished(true)}><CheckCircle2 size={17}/> قدّمي الطبق</button>}
    </section>
    <div className="jewel-footer"><button onClick={reset}><RotateCcw size={15}/> إعادة الوصفة</button><button onClick={next}><Sparkles size={15}/> الوصفة التالية</button></div>
  </div>;
}
