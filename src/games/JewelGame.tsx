import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Trophy } from 'lucide-react';

const gems = ['💎','🌸','🦋','🍓','🌈','🧁','⭐','🐬'];
type Tile = { id:number; gem:string };
function makeDeck(): Tile[] {
  return [...gems,...gems].map((gem,id)=>({id,gem})).sort(()=>Math.random()-.5);
}
export default function JewelGame({onBack}:{onBack:()=>void}) {
  const [deck,setDeck]=useState<Tile[]>(makeDeck);
  const [open,setOpen]=useState<number[]>([]);
  const [matched,setMatched]=useState<number[]>([]);
  const [moves,setMoves]=useState(0);
  const [locked,setLocked]=useState(false);
  const [best,setBest]=useState<number|null>(null);
  const complete=matched.length===deck.length;
  const stars=useMemo(()=>moves<=12?3:moves<=18?2:1,[moves]);
  const choose=(id:number)=>{
    if(locked||open.includes(id)||matched.includes(id)||complete)return;
    if(open.length===0){setOpen([id]);return;}
    const first=open[0];setOpen([first,id]);setMoves(v=>v+1);
    if(deck[first].gem===deck[id].gem){
      const next=[...matched,first,id];setMatched(next);setOpen([]);
      if(next.length===deck.length)setBest(v=>v===null?moves+1:Math.min(v,moves+1));
    } else {
      setLocked(true);
      window.setTimeout(()=>{setOpen([]);setLocked(false)},750);
    }
  };
  const restart=()=>{setDeck(makeDeck());setOpen([]);setMatched([]);setMoves(0);setLocked(false)};
  return <div className="jewel-game">
    <header className="jewel-top"><button onClick={onBack}><ArrowRight size={17}/> رجوع للمكتبة</button><div><span>💎</span><b>لغز الجواهر</b><small>اختبري ذاكرتك واجمعي الجواهر</small></div><span className="jewel-level">تحدي الذاكرة</span></header>
    <section className="jewel-intro"><div><label><Sparkles size={15}/> لعبة الذكاء</label><h2>اكتشفي الأزواج المتشابهة!</h2><p>اقلبي بطاقتين في كل مرة، وحاولي جمع كل الأزواج بأقل عدد من المحاولات.</p></div><div className="jewel-score"><span>🔄 <b>{moves}</b><small>محاولة</small></span><span>💖 <b>{matched.length/2}/8</b><small>أزواج مكتشفة</small></span></div></section>
    <div className="jewel-board">{deck.map((tile,i)=>{const visible=open.includes(i)||matched.includes(i);return <button key={tile.id} className={'jewel-tile '+(visible?'revealed ':'')+(matched.includes(i)?'matched':'')} onClick={()=>choose(i)} aria-label={visible?tile.gem:'بطاقة مخفية'}><span>{visible?tile.gem:'✦'}</span></button>})}</div>
    {complete&&<div className="jewel-win"><Trophy size={30}/><b>أحسنتِ يا بطلة!</b><span>{'⭐'.repeat(stars)}</span><small>أنهيتِ التحدي في {moves} محاولة{best!==null?' • أفضل نتيجة: '+best:''}</small></div>}
    <div className="jewel-footer"><span>✨ تلميح: تذكّري أماكن الصور التي شاهدتِها</span><button onClick={restart}><RotateCcw size={15}/> {complete?'العبِي من جديد':'إعادة اللعبة'}</button></div>
  </div>;
}
