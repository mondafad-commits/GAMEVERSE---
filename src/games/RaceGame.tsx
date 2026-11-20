import { useEffect, useRef, useState } from 'react';

type Props = { onBack: () => void };
type View = 'chase' | 'top';
type Obstacle = { lane: number; y: number; kind: number; passed: boolean };

export default function RaceGame({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const held = useRef({ left: false, right: false, gas: false, nitro: false });
  const game = useRef({ lane: 0, speed: 0, distance: 0, score: 0, nitro: 100, crash: 0, obstacles: [] as Obstacle[], spawn: 0, stripe: 0, finished: false, won: false, last: 0 });
  const [view, setView] = useState<View>('chase');
  const [hud, setHud] = useState({ speed: 0, distance: 0, score: 0, nitro: 100, crashed: false, finished: false, won: false });
  const [soundHint, setSoundHint] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let lastHud = 0;
    const drawCar = (x: number, y: number, w: number, h: number, color: string, player = false) => {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#0008'; ctx.beginPath(); ctx.ellipse(0, h * .42, w * .62, h * .25, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#171b27'; ctx.fillRect(-w*.55,-h*.28,w*.18,h*.34); ctx.fillRect(w*.37,-h*.28,w*.18,h*.34);
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(-w*.42,-h*.5,w*.84,h,Math.min(12,w*.2)); ctx.fill();
      ctx.fillStyle = player ? '#bceaff' : '#c8e7f7'; ctx.beginPath(); ctx.roundRect(-w*.29,-h*.24,w*.58,h*.32,7); ctx.fill();
      ctx.fillStyle = '#fff4bd'; ctx.fillRect(-w*.34,h*.34,w*.2,h*.08); ctx.fillRect(w*.14,h*.34,w*.2,h*.08);
      ctx.fillStyle = '#ff566e'; ctx.fillRect(-w*.34,-h*.48,w*.2,h*.07); ctx.fillRect(w*.14,-h*.48,w*.2,h*.07);
      if (player) { ctx.fillStyle='#fff'; ctx.font='bold 9px sans-serif'; ctx.textAlign='center'; ctx.fillText('YOU',0,h*.16); }
      ctx.restore();
    };
    const frame = (time: number) => {
      const g = game.current;
      const dt = Math.min(.04, (time - (g.last || time)) / 1000 || .016); g.last = time;
      const W = canvas.width = Math.max(320, canvas.clientWidth * devicePixelRatio);
      const H = canvas.height = Math.max(300, canvas.clientHeight * devicePixelRatio);
      ctx.setTransform(W / 420, 0, 0, H / 560, 0, 0);
      const w=420,h=560;
      if (!g.finished) {
        const accelerating = held.current.gas;
        const boosting = held.current.nitro && g.nitro > 0;
        const target = accelerating ? (boosting ? 1 : .76) : .28;
        g.speed += (target - g.speed) * Math.min(1, dt * 2.2);
        if (boosting) g.nitro = Math.max(0,g.nitro - 28*dt); else g.nitro = Math.min(100,g.nitro + 4*dt);
        if (held.current.left) g.lane -= 1.7*dt;
        if (held.current.right) g.lane += 1.7*dt;
        g.lane = Math.max(-.88,Math.min(.88,g.lane));
        g.distance += g.speed * dt * 8.5;
        g.score += Math.round(g.speed * dt * 18);
        g.stripe += g.speed * dt * 460;
        g.spawn -= dt;
        if (g.spawn <= 0) { g.obstacles.push({lane:Math.floor(Math.random()*3)-1,y:-60,kind:Math.random()>.78?2:(Math.random()>.5?0:1),passed:false}); g.spawn=.9+Math.random()*.85; }
        g.obstacles.forEach(o => {
          o.y += g.speed*dt*390;
          const nearPlayer = Math.abs(o.lane-g.lane)<.48 && o.y>390 && o.y<490;
          if (o.kind===2 && !o.passed && nearPlayer) { o.passed=true; g.score+=150; g.nitro=Math.min(100,g.nitro+22); }
          if (!o.passed && o.y>450) { o.passed=true; if(o.kind!==2) g.score+=35; }
          if (o.kind!==2 && nearPlayer && g.crash<=0) { g.crash=1.1; g.speed*=.25; g.score=Math.max(0,g.score-50); }
        });
        g.obstacles = g.obstacles.filter(o=>o.y<620);
        if (g.crash>0) g.crash-=dt;
        if (g.distance>=100) {g.distance=100;g.finished=true;g.won=true;}
      }
      // sky / landscape
      const sky=ctx.createLinearGradient(0,0,0,270); sky.addColorStop(0,'#79c7f4');sky.addColorStop(1,'#d5f0e7');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
      ctx.fillStyle='#f8df88';ctx.beginPath();ctx.arc(340,75,29,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#70b981';ctx.fillRect(0,235,w,325);
      for(let i=0;i<11;i++){const x=(i*53+((g.stripe*.18)%53))-25;ctx.fillStyle=i%2?'#3f9867':'#4da471';ctx.beginPath();ctx.arc(x,270+(i%3)*28,20,0,Math.PI*2);ctx.fill();}
      const horizon= view==='chase'?235:0;
      const roadTop=view==='chase'?80:420;
      if(view==='chase'){
        ctx.fillStyle='#333947';ctx.beginPath();ctx.moveTo(188,235);ctx.lineTo(232,235);ctx.lineTo(405,560);ctx.lineTo(15,560);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#fff2d2';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(188,235);ctx.lineTo(15,560);ctx.moveTo(232,235);ctx.lineTo(405,560);ctx.stroke();
        for(let i=0;i<9;i++){const y=245+((i*48+(g.stripe*1.3)%48));const t=(y-235)/325;const x1=210- (1-t)*17;const x2=210+(1-t)*17;ctx.strokeStyle='#f8f4de';ctx.lineWidth=1+t*3;ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();}
        g.obstacles.forEach(o=>{
          const t=Math.max(0,Math.min(1,(o.y+60)/620)); const x=210+o.lane*105*t;
          if(o.kind===2){ctx.save();ctx.font=`bold ${Math.round(15+t*22)}px sans-serif`;ctx.textAlign='center';ctx.fillText('⭐',x,245+t*270);ctx.restore();}
          else drawCar(x,245+t*270,18+t*26,31+t*34,o.kind===1?'#f5a33b':'#e85b76');
        });
        drawCar(210+g.lane*105,475,46,82,g.crash>0?'#ff765e':'#43d6e8',true);
      } else {
        ctx.fillStyle='#303744';ctx.fillRect(58,0,304,h);
        ctx.fillStyle='#fff1d1';ctx.fillRect(62,0,5,h);ctx.fillRect(353,0,5,h);
        ctx.fillStyle='#f7f0d0';for(let y=-70+(g.stripe%90);y<h;y+=90){ctx.fillRect(157,y,5,52);ctx.fillRect(258,y,5,52);}
        g.obstacles.forEach(o=>{
          const x=210+o.lane*100;
          if(o.kind===2){ctx.save();ctx.font='bold 30px sans-serif';ctx.textAlign='center';ctx.fillText('⭐',x,o.y+25);ctx.restore();}
          else drawCar(x,o.y,42,69,o.kind===1?'#f5a33b':'#e85b76');
        });
        drawCar(210+g.lane*100,465,48,82,g.crash>0?'#ff765e':'#43d6e8',true);
      }
      // speed overlay
      ctx.fillStyle='#10182acc';ctx.beginPath();ctx.roundRect(12,12,105,52,12);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 23px sans-serif';ctx.textAlign='left';ctx.fillText(String(Math.round(g.speed*220)),24,39);
      ctx.font='10px sans-serif';ctx.fillStyle='#c5d9ee';ctx.fillText('KM/H',25,54);
      ctx.fillStyle='#10182acc';ctx.beginPath();ctx.roundRect(303,12,105,52,12);ctx.fill();
      ctx.textAlign='right';ctx.fillStyle='#fff';ctx.font='bold 15px sans-serif';ctx.fillText('🏁 '+Math.floor(g.distance)+'%',397,43);
      if(g.crash>0){ctx.fillStyle='#ffefef';ctx.font='bold 24px sans-serif';ctx.textAlign='center';ctx.fillText('اصطدام!',210,145);}
      if(g.finished){ctx.fillStyle='#081326bb';ctx.fillRect(0,0,w,h);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 30px sans-serif';ctx.fillText(g.won?'فزت بالسباق!':'انتهى السباق',210,245);ctx.font='16px sans-serif';ctx.fillText('النقاط: '+g.score,210,282);}
      if(time-lastHud>120){lastHud=time;setHud({speed:Math.round(g.speed*220),distance:Math.floor(g.distance),score:g.score,nitro:Math.round(g.nitro),crashed:g.crash>0,finished:g.finished,won:g.won});}
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[view]);

  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{const k=e.key.toLowerCase();if(['arrowleft','a'].includes(k)){held.current.left=e.type==='keydown';e.preventDefault();}if(['arrowright','d'].includes(k)){held.current.right=e.type==='keydown';e.preventDefault();}if(['arrowup',' '].includes(k)){held.current.gas=e.type==='keydown';e.preventDefault();}if(k==='shift')held.current.nitro=e.type==='keydown';};
    const up=()=>{held.current={left:false,right:false,gas:false,nitro:false};};
    window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',up);
    return()=>{window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);window.removeEventListener('blur',up);};
  },[]);

  const reset=()=>{game.current={lane:0,speed:0,distance:0,score:0,nitro:100,crash:0,obstacles:[],spawn:0,stripe:0,finished:false,won:false,last:0};held.current={left:false,right:false,gas:false,nitro:false};setHud({speed:0,distance:0,score:0,nitro:100,crashed:false,finished:false,won:false});};
  const hold=(key:'left'|'right'|'gas'|'nitro',value:boolean)=> (e:React.PointerEvent<HTMLButtonElement>)=>{e.preventDefault();held.current[key]=value; if(value){e.currentTarget.setPointerCapture?.(e.pointerId);} };
  return <main className="race-screen race-real" dir="rtl">
    <button className="race-back" onClick={onBack}>← العودة للألعاب</button>
    <section className="race-panel race-arcade">
      <div className="race-head"><div><div className="race-kicker">🏁 بطولة أمونة</div><h2>سباق النجوم</h2></div>
        <div className="race-view-switch"><button className={view==='chase'?'active':''} onClick={()=>setView('chase')}>🚘 خلف السيارة</button><button className={view==='top'?'active':''} onClick={()=>setView('top')}>🛣️ من الأعلى</button></div>
      </div>
      <div className="race-real-hud"><span>⚡ السرعة <b>{hud.speed}</b> كم/س</span><span>🏆 النقاط <b>{hud.score}</b></span><span>🏁 المسافة <b>{hud.distance}%</b></span></div>
      <div className="race-canvas-wrap"><canvas ref={canvasRef} aria-label="مضمار سباق تفاعلي"/></div>
      <div className="race-nitro-meter"><span>⚡ النيترو</span><div><i style={{width:hud.nitro+'%'}}/></div><b>{hud.nitro}%</b></div>
      {hud.finished ? <div className="race-controls race-restart"><button onClick={reset}>🔄 سباق جديد</button></div> :
      <div className="race-controls race-real-controls">
        <button className="race-steer" onPointerDown={hold('left',true)} onPointerUp={hold('left',false)} onPointerCancel={hold('left',false)} onContextMenu={e=>e.preventDefault()}>⬅️</button>
        <button className="race-accelerate" onPointerDown={hold('gas',true)} onPointerUp={hold('gas',false)} onPointerLeave={hold('gas',false)} onPointerCancel={hold('gas',false)}>اضغطي باستمرار للتسارع 🏎️</button>
        <button className="race-nitro" onPointerDown={hold('nitro',true)} onPointerUp={hold('nitro',false)} onPointerLeave={hold('nitro',false)} onPointerCancel={hold('nitro',false)}>⚡ نيترو</button>
        <button className="race-steer" onPointerDown={hold('right',true)} onPointerUp={hold('right',false)} onPointerCancel={hold('right',false)}>➡️</button>
      </div>}
      <div className="race-real-foot"><span>اجمعي ⭐ لزيادة النقاط والنيترو · تفادي السيارات المنافسة</span><button onClick={reset}>إعادة ضبط</button></div>
    </section>
  </main>;
}
