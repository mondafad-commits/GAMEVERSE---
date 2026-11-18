import { useState } from 'react';
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react';

const animals = [
  { id: 'cat', emoji: '🐱', name: 'القطة' },
  { id: 'fox', emoji: '🦊', name: 'الثعلب' },
  { id: 'panda', emoji: '🐼', name: 'الباندا' },
  { id: 'rabbit', emoji: '🐰', name: 'الأرنب' },
  { id: 'lion', emoji: '🦁', name: 'الأسد' },
  { id: 'koala', emoji: '🐨', name: 'الكوالا' },
];

type Card = { key: number; id: string; emoji: string; name: string };

function makeDeck(): Card[] {
  const deck = [...animals, ...animals].map((animal, key) => ({ ...animal, key }));
  // Fisher–Yates gives every new round a properly shuffled deck.
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function PetGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>(makeDeck);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);

  const choose = (index: number) => {
    if (busy || opened.includes(index) || matched.includes(index) || opened.length >= 2) return;

    if (opened.length === 0) {
      setOpened([index]);
      return;
    }

    const first = opened[0];
    setOpened([first, index]);
    setMoves(value => value + 1);

    if (cards[first].id === cards[index].id) {
      setMatched(previous => [...previous, first, index]);
      setOpened([]);
    } else {
      setBusy(true);
      window.setTimeout(() => {
        setOpened([]);
        setBusy(false);
      }, 850);
    }
  };

  const reset = () => {
    setCards(makeDeck());
    setOpened([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
  };

  const complete = matched.length === cards.length;

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 20, color: '#46345c' }}>
      <button onClick={onBack} style={{ border: 0, borderRadius: 14, padding: '10px 16px', background: '#f2e8ff', color: '#6945a0', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
        <ArrowRight size={17}/> رجوع للمكتبة
      </button>
      <div style={{ textAlign: 'center', padding: '20px 8px' }}>
        <div style={{ fontSize: 42 }}>🦊 🐼 🐰</div>
        <h2 style={{ fontSize: 28, margin: '8px 0' }}>جزيرة الحيوانات</h2>
        <p style={{ margin: 0, color: '#806d94' }}>اقلبِي البطاقات واكتشفي كل حيوانين متشابهين!</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ background: '#f5edff', padding: '8px 14px', borderRadius: 20 }}>⭐ الأزواج: {matched.length / 2} / 6</span>
          <span style={{ background: '#eaf8f2', padding: '8px 14px', borderRadius: 20 }}>🎯 المحاولات: {moves}</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10, maxWidth: 560, margin: '0 auto' }}>
        {cards.map((card, index) => {
          const visible = opened.includes(index) || matched.includes(index);
          return (
            <button key={card.key} onClick={() => choose(index)} aria-label={visible ? card.name : 'بطاقة مخفية'} aria-pressed={visible}
              style={{ aspectRatio: '1', border: matched.includes(index) ? '2px solid #75c9a5' : '2px solid #eadcfb', borderRadius: 18, background: visible ? '#fff' : 'linear-gradient(145deg,#c8a8f4,#f4c5e6)', fontSize: 'clamp(26px,7vw,48px)', cursor: 'pointer', boxShadow: '0 5px 14px #5a3b7715' }}>
              {visible ? card.emoji : '✨'}
            </button>
          );
        })}
      </div>
      {complete && (
        <div role="status" style={{ textAlign: 'center', padding: 20, marginTop: 18, background: '#effaf4', borderRadius: 18 }}>
          <Trophy size={34}/>
          <h3 style={{ fontSize: 22, margin: '8px 0' }}>أحسنتِ يا بطلة الجزيرة!</h3>
          <p>وجدتِ كل الحيوانات في {moves} محاولة ⭐⭐⭐</p>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
        <button onClick={reset} style={{ border: 0, borderRadius: 14, padding: '12px 18px', background: '#7c54b5', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center' }}>
          <RotateCcw size={16}/> ابدئي جولة جديدة
        </button>
      </div>
    </div>
  );
}
