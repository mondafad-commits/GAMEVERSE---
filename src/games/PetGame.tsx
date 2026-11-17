import { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Star } from 'lucide-react';

const animals = [
  { id: 'cat', emoji: '🐱', name: 'القطة' },
  { id: 'fox', emoji: '🦊', name: 'الثعلب' },
  { id: 'panda', emoji: '🐼', name: 'الباندا' },
  { id: 'rabbit', emoji: '🐰', name: 'الأرنب' },
  { id: 'lion', emoji: '🦁', name: 'الأسد' },
  { id: 'koala', emoji: '🐨', name: 'الكوالا' },
];
export default function PetGame({ onBack }: { onBack: () => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const cards = [...animals, ...animals].sort((a, b) => a.id.localeCompare(b.id)).map((a, i) => ({ ...a, key: a.id + '-' + i })).sort((a,b) => ((a.id.charCodeAt(0)*7 + a.key.length*13) % 17) - ((b.id.charCodeAt(0)*7 + b.key.length*13) % 17));
  const choose = (key: string, id: string) => {
    if (busy || picked.includes(key) || found.includes(id)) return;
    const next = [...picked, key];
    setPicked(next);
    if (next.length === 2) {
      setMoves(v => v + 1);
      const first = cards.find(c => c.key === next[0]);
      if (first?.id === id) {
        setFound(v => [...v, id]);
        setPicked([]);
      } else {
        setBusy(true);
        window.setTimeout(() => { setPicked([]); setBusy(false); }, 750);
      }
    }
  };
  const reset = () => { setPicked([]); setFound([]); setMoves(0); setBusy(false); };
  return <div style={{maxWidth:900,margin:'24px auto',padding:'20px',color:'#46345c'}}>
    <button onClick={onBack} style={{border:0,borderRadius:14,padding:'10px 16px',background:'#f2e8ff',color:'#6945a0',fontWeight:800,cursor:'pointer',display:'flex',gap:8,alignItems:'center'}}><ArrowRight size={17}/> رجوع للمكتبة</button>
    <div style={{textAlign:'center',padding:'20px 8px'}}>
      <div style={{fontSize:42}}>🦊 🐼 🐰</div><h2 style={{fontSize:28,margin:'8px 0'}}>جزيرة الحيوانات</h2>
      <p style={{margin:0,color:'#806d94'}}>اقلبِي البطاقات واكتشفي كل حيوانين متشابهين!</p>
      <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:16,flexWrap:'wrap'}}>
        <span style={{background:'#f5edff',padding:'8px 14px',borderRadius:20}}>⭐ الأزواج: {found.length} / 6</span>
        <span style={{background:'#eaf8f2',padding:'8px 14px',borderRadius:20}}>🎯 المحاولات: {moves}</span>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:10,maxWidth:560,margin:'0 auto'}}>
      {cards.map(card => {
        const open = picked.includes(card.key) || found.includes(card.id);
        return <button key={card.key} onClick={()=>choose(card.key,card.id)} aria-label={open?card.name:'بطاقة مخفية'} style={{aspectRatio:'1',border:found.includes(card.id)?'2px solid #75c9a5':'2px solid #eadcfb',borderRadius:18,background:open?'#fff':'linear-gradient(145deg,#c8a8f4,#f4c5e6)',fontSize:'clamp(26px,7vw,48px)',cursor:'pointer',boxShadow:'0 5px 14px #5a3b7715',transition:'transform .15s'}}>
          {open ? card.emoji : '✨'}
        </button>;
      })}
    </div>
    {found.length===6 && <div style={{textAlign:'center',padding:20,marginTop:18,background:'#effaf4',borderRadius:18}}><div style={{fontSize:34}}>🏆</div><b style={{fontSize:22}}>أحسنتِ يا بطلة الجزيرة!</b><p>وجدتِ كل الحيوانات في {moves} محاولة</p></div>}
    <div style={{display:'flex',justifyContent:'center',marginTop:18}}><button onClick={reset} style={{border:0,borderRadius:14,padding:'12px 18px',background:'#7c54b5',color:'white',fontWeight:800,cursor:'pointer',display:'flex',gap:8,alignItems:'center'}}><RotateCcw size={16}/> ابدئي من جديد</button></div>
  </div>;
}
