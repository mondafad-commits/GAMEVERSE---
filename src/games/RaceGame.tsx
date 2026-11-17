import { useState } from 'react';

type Props = { onBack: () => void };

export default function RaceGame({ onBack }: Props) {
  const [player, setPlayer] = useState(0);
  const [rival, setRival] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);

  function race() {
    if (finished) return;
    const nextPlayer = Math.min(100, player + 12 + Math.floor(Math.random() * 7));
    const nextRival = Math.min(100, rival + 8 + Math.floor(Math.random() * 8));
    setPlayer(nextPlayer);
    setRival(nextRival);
    if (nextPlayer >= 100 || nextRival >= 100) {
      setFinished(true);
      setWon(nextPlayer >= 100 && nextPlayer >= nextRival);
    }
  }

  function restart() {
    setPlayer(0);
    setRival(0);
    setFinished(false);
    setWon(false);
  }

  return (
    <div className="race-screen" dir="rtl">
      <button className="race-back" onClick={onBack}>← العودة للألعاب</button>
      <div className="race-panel">
        <div className="race-kicker">🏁 تحدّي السرعة</div>
        <h2>سباق النجوم</h2>
        <p>اضغطي زر الانطلاق بسرعة، وكوني أول من يصل إلى خط النهاية!</p>
        <div className="race-track">
          <div className="race-lane">
            <span className="race-name">أنتِ ⭐</span>
            <div className="race-road"><span className="race-car" style={{ right: `${player}%` }}>🏎️</span></div>
            <b>{player}%</b>
          </div>
          <div className="race-lane">
            <span className="race-name">المنافسة 💜</span>
            <div className="race-road"><span className="race-car rival" style={{ right: `${rival}%` }}>🚙</span></div>
            <b>{rival}%</b>
          </div>
          <div className="race-finish">🏁 خط النهاية</div>
        </div>
        {finished ? (
          <div className="race-result" role="status">
            <strong>{won ? '🎉 فزتِ بالسباق!' : '👏 سباق رائع! حاولي مرة أخرى'}</strong>
            <button onClick={restart}>إعادة السباق</button>
          </div>
        ) : (
          <button className="race-go" onClick={race}>🚀 انطلقي الآن!</button>
        )}
        <small className="race-hint">لعبة فردية تجريبية — لا تحتاج إلى تسجيل أو اتصال بحساب.</small>
      </div>
    </div>
  );
}
