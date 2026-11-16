import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';

type Recipe = { name:string; emoji:string; ingredients:string[]; steps:string[]; color:string };
const recipes:Recipe[] = [
  { name:'بيتزا الأصدقاء', emoji:'🍕', color:'#f59e0b', ingredients:['عجينة','صلصة طماطم','جبن','زيتون','فلفل'], steps:['افردي العجينة','أضيفي الصلصة','وزّعي الجبن','زيّني بالخضار','أدخليها الفرن'] },
  { name:'كب كيك الفراولة', emoji:'🧁', color:'#ec4899', ingredients:['دقيق','حليب','بيض','سكر','فراولة'], steps:['اخلطي المكونات','ضعي الخليط في القوالب','أضيفي الفراولة','اخبزي الكب كيك','زيّني وقدّمي'] },
  { name:'سلطة قوس قزح', emoji:'🥗', color:'#10b981', ingredients:['خس','طماطم','خيار','ذرة','ليمون'], steps:['اغسلي الخضار','قطّعي الطماطم','قطّعي الخيار','أضيفي الذرة والخس','أضيفي الليمون'] },
];
export default function CookingGame({onBack}:{onBack:()=>void}) {
  const [recipeIndex,setRecipeIndex]=useState(0);
  const [selected,setSelected]=useState<string[]>([]);
  const [step,setStep]=useState(0);
  const [finished,setFinished]=useState(false);
  const recipe=recipes[recipeIndex];
  const correct=useMemo(()=>selected.filter(x=>recipe.ingredients.includes(x)).length,[selected,recipe]);
  const toggle=(item:string)=>{if(finished)return;setSelected(v=>v.includes(item)?v.filter(x=>x!==item):[...v,item]);};
  const start=()=>{setSelected([]);setStep(0);setFinished(false);};
  const next=()=>{if(step<recipe.steps.length-1)setStep(v=>v+1);else setFinished(true);};
  const chooseRecipe=(i:number)=>{setRecipeIndex(i);setSelected([]);setStep(0);setFinished(false);};
  return <div style={{minHeight:'100vh',padding:'22px 5%',background:'radial-gradient(ellipse at 50% 0%,#633d34,#1c1426 65%)',color:'#fff',fontFamily:'inherit'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,borderBottom:'1px solid #ffffff25',paddingBottom:18}}>
      <button onClick={onBack} style={btn('#ffffff18') }><ArrowRight size={16}/> رجوع للمكتبة</button>
      <div style={{textAlign:'center'}}><div style={{fontSize:27}}>👩🏻‍🍳</div><b style={{fontSize:18}}>تحدي الطبخ</b><small style={{display:'block',color:'#e9bda9',fontSize:11}}>مطبخ آمنة الصغير</small></div>
      <span style={{fontSize:12,color:'#ffe0a8'}}>⭐ {finished?'3':'1'} نجوم</span>
    </header>
    <section style={{maxWidth:900,margin:'28px auto',textAlign:'center'}}>
      <div style={{color:'#ffd2a9',fontSize:12}}>✨ وصفة اليوم</div><h2 style={{fontSize:'clamp(25px,4vw,38px)',margin:'9px 0'}}>حضّري طبقك اللذيذ!</h2><p style={{color:'#d8c7c0',fontSize:13}}>اختاري وصفة، اجمعي مكوناتها، ثم اتبعي خطوات التحضير.</p>
      <div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',margin:'22px 0'}}>
        {recipes.map((r,i)=><button key={r.name} onClick={()=>chooseRecipe(i)} style={{...btn(recipeIndex===i?'#a65b45':'#ffffff12'),border:recipeIndex===i?'2px solid #ffd0a8':'1px solid #ffffff20',padding:'10px 16px'}}>{r.emoji} {r.name}</button>)}
      </div>
      <div style={{background:'linear-gradient(140deg,#ffffff16,#ffffff08)',border:'1px solid #ffffff25',borderRadius:24,padding:'24px 18px',boxShadow:'0 20px 50px #0004'}}>
        <div style={{fontSize:76,marginBottom:6}}>{finished?'🏆':recipe.emoji}</div><h3 style={{fontSize:22,margin:'5px 0 18px'}}>{finished?'أبدعتِ يا شيف آمنة!':recipe.name}</h3>
        {!finished&&<><b style={{display:'block',textAlign:'right',fontSize:14,marginBottom:12}}>🧺 اختاري المكونات ({selected.length}/{recipe.ingredients.length})</b><div style={{display:'flex',justifyContent:'center',gap:9,flexWrap:'wrap'}}>{recipe.ingredients.map((item,i)=><button key={item} onClick={()=>toggle(item)} style={{...btn(selected.includes(item)?'#2e8a70':'#ffffff12'),border:selected.includes(item)?'2px solid #8ce5c1':'1px solid #ffffff25',minWidth:90,justifyContent:'center'}}>{['🥣','🍅','🧀','🫒','🫑'][i%5]} {item} {selected.includes(item)&&<Check size={14}/>}</button>)}</div>
        <div style={{margin:'22px auto 12px',padding:14,borderRadius:15,background:'#0003',maxWidth:550}}><small style={{color:'#ffd2a9'}}>الخطوة {step+1} من {recipe.steps.length}</small><h3 style={{fontSize:19,margin:'8px 0'}}>{recipe.steps[step]}</h3><div style={{height:7,borderRadius:9,background:'#ffffff22',overflow:'hidden'}}><div style={{height:'100%',width:((step+1)/recipe.steps.length*100)+'%',background:'#ffd19b',borderRadius:9}}/></div></div>
        <button onClick={next} disabled={selected.length<recipe.ingredients.length} style={{...btn('#d87954'),opacity:selected.length<recipe.ingredients.length?.5:1,cursor:selected.length<recipe.ingredients.length?'not-allowed':'pointer'}}>{step===recipe.steps.length-1?'قدّمي الطبق':'الخطوة التالية'} <Sparkles size={15}/></button>
        <small style={{display:'block',marginTop:10,color:'#d8c7c0'}}>اختاري كل المكونات لبدء خطوات الوصفة.</small></>}
        {finished&&<><div style={{fontSize:25,margin:'8px'}}>⭐ ⭐ ⭐</div><p style={{color:'#e8d6cc'}}>أنهيتِ {recipe.name} بنجاح. مطبخك يستحق التصفيق!</p><button onClick={start} style={btn('#d87954')}><RotateCcw size={15}/> أعيدي الوصفة</button></>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',maxWidth:550,margin:'15px auto',fontSize:12,color:'#e6c6b8'}}><span>🥕 المكونات الصحيحة: {correct}</span><span>🍽️ وصفات متنوعة: 3</span></div>
    </section>
  </div>;
}
function btn(background:string):CSSProperties { return {display:'inline-flex',alignItems:'center',gap:8,border:0,borderRadius:13,padding:'11px 15px',background,color:'#fff',font:'inherit',fontSize:12,fontWeight:600,cursor:'pointer'}; }
