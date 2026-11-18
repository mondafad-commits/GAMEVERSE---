import { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles, Download } from 'lucide-react';

type Sticker = { id: number; emoji: string; x: number; y: number; size: number };
const colors = ['#ff8fc7','#a78bfa','#65c9b5','#ffd166','#7db8ff','#ffffff'];
const stickers = ['🌸','🦋','⭐','💖','🌈','🦄','🍓','🌙'];
const spots = [[22,25],[72,28],[48,52],[25,73],[76,72],[50,18],[50,82],[15,50],[85,50]];
export default function DrawingGame({ onBack }: { onBack: () => void }) {
  const [color,setColor] = useState(colors[0]);
  const [sticker,setSticker] = useState(stickers[0]);
  const [items,setItems] = useState<Sticker[]>([]);
  const [title,setTitle] = useState('لوحتي الجميلة');
  const add = () => {
    const [x,y] = spots[items.length % spots.length];
    setItems(old => [...old,{id:Date.now()+old.length,emoji:sticker,x,y,size:34+(old.length%3)*8}]);
  };
  const reset = () => setItems([]);
  const saveArtwork = () => {
    const safeTitle = (title || 'لوحتي الجميلة').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
    const decorations = items.map(item =>
      `<text x="${item.x * 8}" y="${55 + item.y * 4.3}" text-anchor="middle" dominant-baseline="middle" font-size="${item.size * 1.35}">${item.emoji}</text>`
    ).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
      <rect width="800" height="520" rx="28" fill="${color}22"/>
      <text x="400" y="48" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="bold" fill="#5b426b">${safeTitle}</text>
      <circle cx="155" cy="150" r="58" fill="${color}"/>
      <text x="650" y="170" text-anchor="middle" font-size="76">☁️</text>
      <text x="315" y="250" text-anchor="middle" font-size="56">☁️</text>
      <path d="M0 410 Q180 270 390 410 T800 400 V520 H0Z" fill="#8ad5b2"/>
      <path d="M430 420 Q610 285 800 390 V520 H430Z" fill="#78b9a6"/>
      ${decorations}
    </svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'لوحتي-الجميلة.svg';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  return <div className="drawing-game" dir="rtl">
    <header className="drawing-top">
      <button onClick={onBack}><ArrowRight size={17}/> رجوع للمكتبة</button>
      <div><span>🎨</span><b>استوديو الرسم</b><small>اصنعي لوحة من خيالك</small></div>
      <span className="drawing-level">ركن الفنانة ✨</span>
    </header>
    <section className="drawing-intro">
      <div><label><Sparkles size={15}/> مساحة الإبداع</label><h2>كل لمسة تحكي حكاية!</h2><p>اختاري لونك وملصقك المفضل، ثم أضيفيه إلى لوحتك.</p></div>
      <input aria-label="اسم اللوحة" value={title} onChange={e=>setTitle(e.target.value)} maxLength={28}/>
    </section>
    <div className="drawing-layout">
      <section className="drawing-canvas" style={{background:color+'22',borderColor:color}}>
        <div className="drawing-canvas-title">{title || 'لوحتي الجميلة'}</div>
        <div className="drawing-art">
          <div className="drawing-sun" style={{background:color}}/>
          <div className="drawing-cloud cloud-one">☁️</div><div className="drawing-cloud cloud-two">☁️</div>
          <div className="drawing-hill hill-one"/><div className="drawing-hill hill-two"/>
          {items.map(item=><span key={item.id} className="drawing-sticker" style={{left:item.x+'%',top:item.y+'%',fontSize:item.size}}>{item.emoji}</span>)}
        </div>
        <div className="drawing-count">✨ {items.length} لمسة فنية</div>
      </section>
      <section className="drawing-tools">
        <div><h3>🎨 اختاري اللون</h3><div className="drawing-colors">{colors.map(c=><button key={c} aria-label={'لون '+c} onClick={()=>setColor(c)} className={color===c?'active':''} style={{background:c}}/>)}</div></div>
        <div><h3>💫 الملصقات</h3><div className="drawing-stickers">{stickers.map(s=><button key={s} onClick={()=>setSticker(s)} className={sticker===s?'active':''}>{s}</button>)}</div></div>
        <div className="drawing-selected">الملصق المختار: <b>{sticker}</b></div>
        <button className="drawing-add" onClick={add}><Sparkles size={17}/> أضيفي إلى لوحتي</button>
        <button className="drawing-reset" onClick={reset}><RotateCcw size={15}/> لوحة جديدة</button>
        <button className="drawing-reset" onClick={saveArtwork}><Download size={15}/> احفظي لوحتي</button>
      </section>
    </div>
    <p className="drawing-note">احفظي لوحتك كصورة وشاركيها مع العائلة والصديقات 💜</p>
  </div>;
}
