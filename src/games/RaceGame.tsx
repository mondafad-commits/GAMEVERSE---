import { useEffect, useState } from 'react';

type Props = { onBack: () => void };
type View = 'chase' | 'top';

export default function RaceGame({ onBack }: Props) {
  const [view, setView] = useState<View>('chase');
  const [lane, setLane] = useState(1);
  const [distance, setDistance] = useState(0);
  const [rival, setRival] = useState(0);
  const [nitro, setNitro] = useState(3);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [traffic, setTraffic] = useState(1);

  useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => {
      setRival(v => Math.min(100, v + 1.15));
      setTraffic(v => (v + 1) % 3);
    }, 900);
    return () => window.clearInterval(timer);
  }, [finished]);

  function advance(boost = false) {
    if (finished) return;
    const gain = boost ? 8 : 3.5;
    const next = Math.min(100, distance + gain);
    const rivalNext = Math.min(100, rival + (boost ? 0.4 : 1.4));
    setDistance(next);
    setRival(rivalNext);
    setScore(s => s + (boost ? 35 : 10));
    if (next >= 100 || rivalNext >= 100) {
      setFinished(true);
      setWon(next >= 100 && next >= rivalNext);
    }
  }

  function boost() {
    if (nitro > 0 && !finished) {
      setNitro(n => n - 1);
      advance(true);
    }
  }

  function steer(direction: number) {
    if (!finished) setLane(v => Math.max(0, Math.min(2, v + direction)));
  }

  function restart() {
    setLane(1); setDistance(0); setRival(0); setNitro(3);
    setScore(0); setFinished(false); setWon(false); setTraffic(1);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') steer(-1);
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') steer(1);
      if (e.key === 'ArrowUp' || e.key === ' ') { e.preventDefault(); advance(); }
      if (e.key.toLowerCase() === 'n') boost();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className={`race-screen ${view === 'top' ? 'race-top-mode' : 'race-chase-mode'}`} dir="rtl">
      <button className="race-back" onClick={onBack}>← العودة للألعاب</button>
      <div className="race-panel race-arcade">
        <div className="race-head">
          <div><div className="race-kicker">🏁 تحدّي السرعة</div><h2>سباق النجوم</h2></div>
          <div className="race-view-switch">
            <button className={view === 'chase' ? 'active' : ''} onClick={() => setView('chase')}>🚘 خلف السيارة</button>
            <button className={view === 'top' ? 'active' : ''} onClick={() => setView('top')}>🛣️ من الأعلى</button>
          </div>
        </div>
        <div className="race-hud">
          <span>🏆 النقاط <b>{score}</b></span><span>⚡ نيترو <b>{nitro}</b></span>
          <span>🏁 التقدم <b>{Math.round(distance)}%</b></span>
        </div>
        <div className={`race-world ${view}`}>
          <div className="race-sky"><span>☀️</span><i>☁️</i></div>
          <div className="race-road-arcade">
            <div className="race-road-lines"><i/><i/></div>
            <div className="race-traffic" style={{ left: `${traffic * 29 + 5}%` }}>🚙</div>
            <div className="race-player" style={{ left: `${lane * 29 + 6}%` }}>🏎️</div>
            {view === 'chase' && <div className="race-dashboard">🏎️　SPEED RUSH</div>}
          </div>
          <div className="race-progress"><span style={{ width: `${distance}%` }}/></div>
          <div className="race-progress-label"><span>انطلاق</span><span>خط النهاية 🏁</span></div>
        </div>
        <div className="race-opponent"><span>🚙 المنافسة</span><div><i style={{width:`${rival}%`}}/></div><b>{Math.round(rival)}%</b></div>
        {finished ? <div className="race-result" role="status"><strong>{won ? '🎉 فزتِ بالسباق!' : '👏 سباق رائع! حاولي مرة أخرى'}</strong><button onClick={restart}>إعادة السباق</button></div> :
          <div className="race-controls">
            <button className="race-steer" onClick={() => steer(-1)}>⬅️</button>
            <button className="race-accelerate" onClick={() => advance()}>دوسي بنزين 🏎️</button>
            <button className="race-nitro" onClick={boost} disabled={nitro === 0}>⚡ نيترو</button>
            <button className="race-steer" onClick={() => steer(1)}>➡️</button>
          </div>}
        <small className="race-hint">التحكم بالأسهم أو الأزرار · غيّري المسار وتجاوزي المنافسة · زر N للنيترو</small>
      </div>
    </div>
  );
}
