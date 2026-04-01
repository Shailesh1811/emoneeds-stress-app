import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import emailjs from "@emailjs/browser";

// ── EMONEEDS SVG LOGO (native SVG, zero image dependencies, works offline) ──
function EmoneedsLogo({h=28, color}) {
  const s = h / 28;
  const cLight = "#20c3bd";
  const cDark = "#408b9f";
  return (
    <svg width={150*s} height={28*s} viewBox="0 0 150 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
      <text x="0" y="21" fill={cLight} fontFamily="'Outfit',system-ui,sans-serif" fontWeight="700" fontSize="22.5" letterSpacing="-0.2">emon</text>
      <g transform="translate(63, 1)">
        <path d="M 19,17 L 31,17 C 32.5,17 33,18 33,20 L 33,24 L 19,24 Z" fill={cLight} />
        <path d="M 3,24 L 3,16 C 3,13 6,12 9,12 L 29,12 C 32,12 34,13.5 34,15.5 C 34,17.5 32,19 29,19 L 16.5,19 C 15.5,19 15,19.5 15,20.5 L 15,24 Z" fill={cDark} />
        <circle cx="8" cy="6.5" r="2.8" stroke={cDark} strokeWidth="2.8" fill="none" />
        <circle cx="26" cy="6.5" r="2.8" stroke={cDark} strokeWidth="2.8" fill="none" />
      </g>
      <text x="100" y="21" fill={cLight} fontFamily="'Outfit',system-ui,sans-serif" fontWeight="700" fontSize="22.5" letterSpacing="-0.2">ds</text>
    </svg>
  );
}

function EmoneedsIcon({size=32, bg="rgba(45,212,191,.1)", color}) {
  const cLight = "#20c3bd";
  const cDark = "#408b9f";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
      <rect width="32" height="32" rx="9" fill={bg}/>
      <g transform="translate(0, 4) scale(0.85)">
        <path d="M 19,17 L 31,17 C 32.5,17 33,18 33,20 L 33,24 L 19,24 Z" fill={cLight} />
        <path d="M 3,24 L 3,16 C 3,13 6,12 9,12 L 29,12 C 32,12 34,13.5 34,15.5 C 34,17.5 32,19 29,19 L 16.5,19 C 15.5,19 15,19.5 15,20.5 L 15,24 Z" fill={cDark} />
        <circle cx="8" cy="6.5" r="2.8" stroke={cDark} strokeWidth="2.8" fill="none" />
        <circle cx="26" cy="6.5" r="2.8" stroke={cDark} strokeWidth="2.8" fill="none" />
      </g>
    </svg>
  );
}

const Q = [
  { id:1, text:"been upset because of something that happened unexpectedly", r:false, sub:"h" },
  { id:2, text:"felt unable to control the important things in your life", r:false, sub:"h" },
  { id:3, text:"felt nervous and stressed", r:false, sub:"h" },
  { id:4, text:"felt confident about your ability to handle personal problems", r:true, sub:"e" },
  { id:5, text:"felt that things were going your way", r:true, sub:"e" },
  { id:6, text:"found you could not cope with all the things you had to do", r:false, sub:"h" },
  { id:7, text:"been able to control irritations in your life", r:true, sub:"e" },
  { id:8, text:"felt on top of things", r:true, sub:"e" },
  { id:9, text:"been angered because of things outside your control", r:false, sub:"h" },
  { id:10, text:"felt difficulties were piling up so high you could not overcome them", r:false, sub:"h" },
];

const OPTS = [
  { label:"Never", val:0, color:"#4ade80" },
  { label:"Rarely", val:1, color:"#86efac" },
  { label:"Sometimes", val:2, color:"#fbbf24" },
  { label:"Often", val:3, color:"#fb923c" },
  { label:"Very Often", val:4, color:"#f87171" },
];

const ZONES = [
  { name:"Perception Gate", accent:"#a78bfa", icon:"🔮", bg:"linear-gradient(160deg,#0a0d1a 0%,#1a1535 40%,#0f1b3d 100%)" },
  { name:"Control Tower", accent:"#60a5fa", icon:"🗼", bg:"linear-gradient(160deg,#0a0d1a 0%,#0f1f3d 40%,#0d2952 100%)" },
  { name:"Tension Field", accent:"#c084fc", icon:"⚡", bg:"linear-gradient(160deg,#0a0d1a 0%,#231535 40%,#35104e 100%)" },
  { name:"Confidence Core", accent:"#4ade80", icon:"💎", bg:"linear-gradient(160deg,#0a0d1a 0%,#0f2918 40%,#0d4a2a 100%)" },
  { name:"Flow Stream", accent:"#22d3ee", icon:"🌊", bg:"linear-gradient(160deg,#0a0d1a 0%,#0f2535 40%,#0d3d55 100%)" },
  { name:"Coping Bridge", accent:"#fbbf24", icon:"🌉", bg:"linear-gradient(160deg,#0a0d1a 0%,#25200f 40%,#4a3d0d 100%)" },
  { name:"Balance Beam", accent:"#2dd4bf", icon:"⚖️", bg:"linear-gradient(160deg,#0a0d1a 0%,#0f2925 40%,#0d4a45 100%)" },
  { name:"Summit View", accent:"#818cf8", icon:"🏔", bg:"linear-gradient(160deg,#0a0d1a 0%,#151d40 40%,#1d3065 100%)" },
  { name:"Storm Eye", accent:"#fb7185", icon:"🌪", bg:"linear-gradient(160deg,#0a0d1a 0%,#2d1015 40%,#501020 100%)" },
  { name:"Resolution Peak", accent:"#e879f9", icon:"🎯", bg:"linear-gradient(160deg,#0a0d1a 0%,#231530 40%,#3d1055 100%)" },
];

const FUN_FACTS = [
  { icon:"🧠", fact:"Your brain uses only 20 watts of power. Less than your fridge light. But it outperforms every supercomputer ever built.", src:"Northwestern Medicine" },
  { icon:"💀", fact:"Your brain has zero pain receptors. None. That's why surgeons can operate on it while patients are awake and talking.", src:"National Geographic" },
  { icon:"🫁", fact:"90% of your body's serotonin (the happiness chemical) is made in your gut, not your brain. Butterflies in your stomach are real neuroscience.", src:"American Psychological Association" },
  { icon:"👃", fact:"When you smell a stressed person's sweat, your own brain's fear centre activates instantly. Stress spreads through smell alone.", src:"PLOS ONE Research" },
];

const INDIA_STATS = [
  { n:"80%", l:"of India's workforce reported mental health issues", ic:"👥" },
  { n:"59%", l:"burnout rate in India, highest globally", ic:"🔥" },
  { n:"₹1.1L Cr", l:"annual cost to Indian employers", ic:"💰" },
  { n:"3.6×", l:"presenteeism costs vs absenteeism", ic:"📉" },
  { n:"4×", l:"more likely to resign with MH issues", ic:"🚪" },
  { n:"0.09%", l:"of Indian companies have EAPs", ic:"🏢" },
];

function calcScore(a) { return Q.reduce((s,q,i) => s + (q.r ? 4-(a[i]??0) : (a[i]??0)), 0); }
function calcSub(a) {
  let h=0, e=0;
  Q.forEach((q,i) => { const v = q.r ? 4-(a[i]??0) : (a[i]??0); q.sub==="h" ? h+=v : e+=v; });
  return { h, e, hMax:24, eMax:16 };
}
function getBand(s) {
  if(s<=13) return { label:"Low Stress", key:"low", color:"#4ade80" };
  if(s<=26) return { label:"Moderate Stress", key:"moderate", color:"#fbbf24" };
  return { label:"High Stress", key:"high", color:"#fb7185" };
}

function genInsights(a, score, sub) {
  const hPct = sub.h/sub.hMax*100, ePct = sub.e/sub.eMax*100, r = [];
  const q1=a[0]??0, q2=a[1]??0, q3=a[2]??0, q4=a[3]??0, q5=a[4]??0;
  const q6=a[5]??0, q7=a[6]??0, q8=a[7]??0, q9=a[8]??0, q10=a[9]??0;

  if(q2>=3 && q7<=1) {
    r.push({ t:"The Paradox Mind", ic:"🧩",
      f:"You struggle with the big picture but handle daily irritations like a pro. Researchers call this the 'executive gap.' Your tactical brain is sharp, but strategic uncertainty quietly drains you.",
      tip:"Write down 3 things you CAN control each morning. This simple ritual rebuilds your brain's sense of agency."
    });
  } else if(q2>=3) {
    r.push({ t:"The Turbulence Navigator", ic:"🌊",
      f:`Your 'loss of control' response is running hot. The Framingham Heart Study found that this feeling raises cortisol 23% more than general worry. Your body treats unpredictability as a physical threat.`,
      tip:"Micro-decisions restore control. Choose your coffee, pick your route, rearrange your desk. Tiny choices literally rewire neural pathways."
    });
  } else {
    r.push({ t:"The Steady Captain", ic:"⚓",
      f:"You feel genuinely in command of your life's direction. People with your control profile show 31% lower inflammatory markers. Your mindset is actively protecting your immune system.",
      tip:"Your sense of agency is a leadership superpower. Sharing it through mentoring amplifies the effect for both sides."
    });
  }

  if(ePct >= 62) {
    r.push({ t:"The Inner Skeptic", ic:"🪞",
      f:`Your self-efficacy is in the alert zone (${Math.round(ePct)}%). Stanford's Albert Bandura proved that low self-efficacy creates a vicious cycle: doubting yourself makes tasks genuinely harder, which confirms the doubt.`,
      tip:"Break any task into absurdly small steps. Completing micro-wins rebuilds efficacy pathways in your prefrontal cortex."
    });
  } else if(ePct >= 30) {
    r.push({ t:"The Balanced Realist", ic:"🎯",
      f:`Your self-efficacy sits at ${Math.round(100-ePct)}%, which is the optimal zone. Moderate confidence is actually linked to better decisions than extreme confidence. You weigh risks without freezing.`,
      tip:"Keep a 'wins journal' and write 3 things you handled well today. It compounds your confidence without inflating it."
    });
  } else {
    r.push({ t:"The Unshakeable Core", ic:"💎",
      f:`Your self-efficacy is remarkably strong (${Math.round(100-ePct)}%). Research links this to higher vagal tone, meaning your nervous system recovers from stress faster than the average person's.`,
      tip:"Your resilience is high. The next frontier is coaching others because it activates your brain's reward circuits even further."
    });
  }

  if(q9>=3 && q1>=3) {
    r.push({ t:"The Lightning Rod", ic:"⚡",
      f:"Your brain is running on high alert. fMRI studies show this pattern maps to an overactive amygdala, meaning your internal alarm fires even when there's no real danger nearby.",
      tip:"Try 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s. Just 3 cycles shrinks amygdala reactivity within 90 seconds."
    });
  } else if(q9>=3) {
    r.push({ t:"The Justice Sensor", ic:"⚖️",
      f:"External frustrations hit you hard, but surprises don't rattle you. Your anterior cingulate cortex (the brain's 'unfairness detector') may be especially active.",
      tip:"Name it to tame it: say 'I notice frustration.' UCLA research shows verbalising emotions cuts amygdala activation by 43%."
    });
  } else {
    r.push({ t:"The Calm Observer", ic:"🌿",
      f:"External chaos barely touches you. Your prefrontal cortex effectively moderates emotional surges, which neuroscientists call strong 'top-down processing.'",
      tip:"In high-stress meetings, others unconsciously mirror your calm. Your composure is a team-wide stabiliser."
    });
  }

  if(q10>=3 && q6>=3) {
    r.push({ t:"The Atlas Complex", ic:"🏋️",
      f:"When both 'piling up' and 'can't cope' are elevated, cortisol disrupts working memory, making even simple tasks feel harder. It's a neurological bottleneck, not a character flaw.",
      tip:"Your brain holds only 3 to 4 items at once. Offload everything to paper and free your working memory for actual thinking."
    });
  } else if(q10>=3) {
    r.push({ t:"The Plate Spinner", ic:"🎪",
      f:"Demands feel relentless, but you're still coping. The Zeigarnik Effect means unfinished tasks haunt your brain 90% more than completed ones because your mind simply can't let go.",
      tip:"Close open loops: even a partial to-do list reduces mental load by up to 40%. Your brain just needs the list to exist."
    });
  } else if(q8<=1 && q5<=1) {
    r.push({ t:"The Flow Master", ic:"🏄",
      f:"You frequently feel 'on top of things.' This maps to strong dorsolateral prefrontal cortex activity, the region powering planning, focus, and working memory efficiency.",
      tip:"You're in rare territory. Consider learning something wildly outside your domain because your mental bandwidth can handle it."
    });
  } else {
    r.push({ t:"The Adaptive Mind", ic:"🔄",
      f:"Your stress pattern shows real flexibility. You neither crumble under pressure nor feel invincible. Psychologists call this 'stress inoculation' where moderate exposure builds genuine toughness.",
      tip:"Deliberately take on one slightly above comfort challenge per week. This is how resilience compounds over time."
    });
  }
  return r;
}

function Stars({count=30, accent="#fff"}) {
  const p = useRef(Array.from({length:count},()=>({
    x:Math.random()*100, y:Math.random()*100, s:Math.random()*2+.5,
    d:Math.random()*30+15, dl:Math.random()*-30, o:Math.random()*0.25+0.03,
  }))).current;
  return <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
    {p.map((s,i)=><div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.s,height:s.s,borderRadius:"50%",background:accent,opacity:s.o,animation:`dr ${s.d}s ease-in-out ${s.dl}s infinite`}}/>)}
  </div>;
}

function Gauge({score, band}) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    let f; const t0=performance.now();
    const tick=n=>{const p=Math.min((n-t0)/2200,1);setV((1-Math.pow(1-p,4))*score);if(p<1)f=requestAnimationFrame(tick)};
    f=requestAnimationFrame(tick); return()=>cancelAnimationFrame(f);
  },[score]);
  const W=270, H=W*.56, r=W/2-22, cx=W/2, cy=W/2+12, pct=v/40;
  const na=Math.PI-pct*Math.PI, nx=cx+(r-32)*Math.cos(na), ny=cy-(r-32)*Math.sin(na);
  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{marginBottom:4}}>
    <defs>
      <linearGradient id="arc" x1="0%" x2="100%"><stop offset="0%" stopColor="#4ade80"/><stop offset="50%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#fb7185"/></linearGradient>
      <filter id="ndg"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="18" strokeLinecap="round"/>
    <path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="url(#arc)" strokeWidth="18" strokeLinecap="round" strokeDasharray={Math.PI*r} strokeDashoffset={Math.PI*r*(1-pct)}/>
    <circle cx={nx} cy={ny} r="10" fill={band?.color||"#fff"} opacity=".15" filter="url(#ndg)"/>
    <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    <circle cx={cx} cy={cy} r="4" fill="#fff"/><circle cx={nx} cy={ny} r="3.5" fill="#fff"/>
  </svg>;
}

function Prog({cur}) {
  const pct=(cur/10)*100;
  return <div style={{width:"100%",maxWidth:460,margin:"0 auto 18px"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontFamily:"var(--f)",fontSize:11,color:"rgba(255,255,255,.35)",letterSpacing:1.5,fontWeight:600}}>
      <span>{cur+1} / 10</span><span style={{color:ZONES[cur]?.accent}}>{ZONES[cur]?.name}</span>
    </div>
    <div style={{height:5,background:"rgba(255,255,255,.04)",borderRadius:3,position:"relative",overflow:"visible"}}>
      <div style={{height:"100%",borderRadius:3,background:`linear-gradient(90deg,${ZONES[0].accent},${ZONES[cur].accent})`,width:`${pct}%`,transition:"width .5s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 14px ${ZONES[cur].accent}33`}}/>
      <div style={{position:"absolute",top:-7,left:`${pct}%`,transform:"translateX(-50%)",fontSize:16,transition:"left .5s cubic-bezier(.4,0,.2,1)",filter:`drop-shadow(0 0 8px ${ZONES[cur].accent})`}}>{ZONES[cur]?.icon}</div>
    </div>
  </div>;
}

export default function App() {
  const [scr, setScr]=useState("welcome");
  const [nm, setNm]=useState(""); const [dn, setDn]=useState("there");
  const [cq, setCq]=useState(0); const [ans, setAns]=useState({});
  const [sc, setSc]=useState(0); const [band, setBand]=useState(null);
  const [sub, setSub]=useState(null); const [pf, setPf]=useState([]);
  const [fd, setFd]=useState("fi");
  const [em, setEm]=useState(""); const [co, setCo]=useState(""); const [dg, setDg]=useState("");
  const [done, setDone]=useState(false); const [shA, setShA]=useState(false); const [toast, setToast]=useState("");
  const rt=useRef(null);

  const go=useCallback(n=>{setFd("fo");setTimeout(()=>{setScr(n);setFd("fi")},380)},[]);
  const rst=useCallback(()=>{
    setScr("welcome");setNm("");setDn("there");setCq(0);setAns({});setSc(0);setBand(null);
    setSub(null);setPf([]);setEm("");setCo("");setDg("");setDone(false);setShA(false);setToast("");setFd("fi");
  },[]);
  useEffect(()=>{if(scr==="thanks"){rt.current=setTimeout(rst,15000);return()=>clearTimeout(rt.current)}},[scr,rst]);

  const pick=v=>{
    const na={...ans,[cq]:v}; setAns(na);
    setTimeout(()=>{
      if(cq<9){setCq(cq+1)}
      else{
        const s=calcScore(na),ss=calcSub(na),b=getBand(s);
        setSc(s);setBand(b);setSub(ss);setPf(genInsights(na,s,ss));
        go("calc"); setTimeout(()=>go("results"),2500);
      }
    },280);
  };

  const submit = async (audit) => {
    try {
      const { error } = await supabase.from('leads').insert([
        { name: dn!=="there"?dn:"", email: em, company: co, designation: dg, score: sc, band: band?.key, booked_audit: audit }
      ]);
      if (error) console.error("Supabase Error:", error);
    } catch (e) {
      console.error(e);
    }

    try {
      await emailjs.send(
        'service_7434fac',
        'template_12ssup8',
        {
          user_name: dn!=="there"?dn:"Friend",
          user_email: em,
          user_score: sc,
          user_band: band?.label || band?.key
        },
        'bAYpz4FeLe7GTJWM8'
      );
    } catch (e) {
      console.error("EmailJS Error:", e);
    }

    console.log("LEAD:",{name:dn,email:em,company:co,designation:dg,score:sc,band:band?.key,booked_audit:audit});
    setDone(true); setToast(audit?"✅ Audit booked successfully!":"✅ Report sent to your inbox!");
    setTimeout(()=>setToast(""),3500); setTimeout(()=>go("thanks"),900);
  };

  const bg = scr==="quiz" ? ZONES[cq].bg
    : scr==="results"||scr==="personal" ? `linear-gradient(160deg,#0a0d1a 0%,#0f1225 40%,${(band?.color||'#1a1a2e')}08 100%)`
    : "linear-gradient(160deg,#0a0d1a 0%,#0e1225 50%,#0d1530 100%)";

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      :root{--f:'Outfit',system-ui,sans-serif}
      *{margin:0;padding:0;box-sizing:border-box}
      html,body,#root{height:100%;width:100%;overflow:hidden;font-family:var(--f);-webkit-font-smoothing:antialiased}
      .fi{animation:fi .48s cubic-bezier(.25,.46,.45,.94) forwards}
      .fo{animation:fo .35s ease forwards}
      @keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fo{from{opacity:1}to{opacity:0;transform:translateY(-8px)}}
      @keyframes dr{0%,100%{transform:translate(0,0)}33%{transform:translate(6px,-18px)}66%{transform:translate(-10px,-6px)}}
      @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
      @keyframes sp{to{transform:rotate(360deg)}}
      @keyframes su{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
      @keyframes gl{0%,100%{box-shadow:0 0 16px rgba(74,222,128,.1)}50%{box-shadow:0 0 32px rgba(74,222,128,.22)}}
      @keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}
      @keyframes pu{0%,100%{opacity:1}50%{opacity:.5}}
      .bp{background:linear-gradient(135deg,#0d9488,#2dd4bf);color:#0a0d1a;border:none;padding:17px 40px;border-radius:60px;font:700 15px/1 var(--f);cursor:pointer;transition:all .3s;box-shadow:0 4px 20px rgba(45,212,191,.2);position:relative;overflow:hidden;letter-spacing:.2px}
      .bp:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(45,212,191,.3)}.bp:active{transform:scale(.97)}
      .bp::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);animation:sh 3.5s infinite}
      .bs{background:0;color:#2dd4bf;border:1.5px solid rgba(45,212,191,.3);padding:13px 28px;border-radius:60px;font:600 13px/1 var(--f);cursor:pointer;transition:all .3s}
      .bs:hover{background:rgba(45,212,191,.06);border-color:#2dd4bf}
      .ip{background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.08);color:#fff;padding:15px 18px;border-radius:12px;font:400 14px/1.2 var(--f);outline:none;width:100%;transition:all .3s;backdrop-filter:blur(8px)}
      .ip:focus{border-color:rgba(45,212,191,.4);background:rgba(45,212,191,.02);box-shadow:0 0 20px rgba(45,212,191,.06)}
      .ip::placeholder{color:rgba(255,255,255,.2)}
      .op{border:1.5px solid rgba(255,255,255,.06);background:rgba(255,255,255,.02);color:#fff;padding:13px 6px;border-radius:13px;cursor:pointer;transition:all .22s cubic-bezier(.4,0,.2,1);text-align:center;font:500 12px/1.3 var(--f);flex:1;min-height:68px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
      .op:hover{border-color:rgba(45,212,191,.25);background:rgba(45,212,191,.04);transform:translateY(-2px)}
      .op:active,.op.s{border-color:#2dd4bf;background:rgba(45,212,191,.1);transform:scale(.96)}
      .cd{background:rgba(255,255,255,.02);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.05);border-radius:18px}
      .gh{background:0;border:0;color:rgba(255,255,255,.25);font:400 11px/1 var(--f);cursor:pointer;text-decoration:underline;text-underline-offset:3px}.gh:hover{color:rgba(255,255,255,.4)}
      .tp{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2dd4bf;color:#0a0d1a;padding:13px 26px;border-radius:60px;font:700 13px/1 var(--f);box-shadow:0 8px 28px rgba(45,212,191,.35);animation:su .4s ease;z-index:100}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:2px}
    `}</style>
    <div style={{width:"100%",height:"100%",background:bg,transition:"background .65s ease",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <Stars accent={scr==="quiz"?ZONES[cq]?.accent:"#2dd4bf"}/>
      <div style={{position:"absolute",top:0,left:0,right:0,padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10}}>
        <div style={{display:"flex",alignItems:"center"}}>
          <EmoneedsLogo h={24} />
        </div>
        {scr!=="welcome"&&<button className="gh" onClick={rst}>Start Over</button>}
      </div>
      <div className={fd} style={{position:"relative",zIndex:5,width:"100%",maxWidth:600,padding:"14px 18px 32px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",maxHeight:"calc(100vh - 64px)",overflowY:"auto",overflowX:"hidden"}}>

        {scr==="welcome"&&<>
          <div style={{marginBottom:20,animation:"fl 4s ease-in-out infinite,gl 4s ease-in-out infinite"}}><EmoneedsIcon size={72} /></div>
          <h1 style={{font:"900 clamp(26px,5vw,40px)/1.12 var(--f)",color:"#fff",marginBottom:10,letterSpacing:-.5}}>
            How Stressed<br/><span style={{background:"linear-gradient(135deg,#2dd4bf,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Are You, Really?</span>
          </h1>
          <p style={{font:"400 14px/1.65 var(--f)",color:"rgba(255,255,255,.4)",maxWidth:380,marginBottom:22}}>
            A 2 minute science backed journey. Get your personalised stress profile with insights powered by real neuroscience research.
          </p>
          <div style={{display:"flex",gap:18,marginBottom:26,font:"500 11px/1 var(--f)",color:"rgba(255,255,255,.28)",letterSpacing:.5}}>
            <span>🔬 PSS-10 Validated</span><span>🧩 Personalised</span><span>⏱ 2 min</span>
          </div>
          <button className="bp" onClick={()=>go("name")} style={{fontSize:16,padding:"19px 44px"}}>Start Your Journey →</button>
        </>}

        {scr==="name"&&<>
          <div style={{fontSize:36,marginBottom:14,animation:"fl 3s ease-in-out infinite"}}>👋</div>
          <h2 style={{font:"800 24px/1.2 var(--f)",color:"#fff",marginBottom:5}}>What should we call you?</h2>
          <p style={{font:"400 13px/1 var(--f)",color:"rgba(255,255,255,.35)",marginBottom:26}}>Makes your results personal</p>
          <input className="ip" type="text" placeholder="First name" value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){if(nm.trim())setDn(nm.trim());go("facts")}}} autoFocus style={{maxWidth:300,textAlign:"center",fontSize:17}}/>
          <button className="bp" onClick={()=>{if(nm.trim())setDn(nm.trim());go("facts")}} style={{marginTop:18}}>Continue →</button>
          <button className="gh" onClick={()=>{setDn("there");go("facts")}} style={{marginTop:12}}>Skip</button>
        </>}

        {scr==="facts"&&<>
          <div style={{font:"600 12px/1 var(--f)",color:"#2dd4bf",letterSpacing:3,textTransform:"uppercase",marginBottom:10}}>Before we begin...</div>
          <h2 style={{font:"900 26px/1.15 var(--f)",color:"#fff",marginBottom:5}}>Did You Know? 🤯</h2>
          <p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.3)",marginBottom:22}}>Mind blowing facts about your brain</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:500,marginBottom:24}}>
            {FUN_FACTS.map((f,i)=>(
              <div key={i} className="cd" style={{padding:"15px 18px",textAlign:"left",animation:`su .45s ${i*.11}s ease forwards`,opacity:0,display:"flex",gap:13,alignItems:"flex-start"}}>
                <div style={{fontSize:26,flexShrink:0,marginTop:1}}>{f.icon}</div>
                <div>
                  <p style={{font:"500 13px/1.55 var(--f)",color:"rgba(255,255,255,.8)"}}>{f.fact}</p>
                  <p style={{font:"400 10px/1 var(--f)",color:"rgba(45,212,191,.45)",marginTop:5}}>Source: {f.src}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cd" style={{padding:"18px 22px",maxWidth:460,marginBottom:22,border:"1px solid rgba(45,212,191,.1)",background:"rgba(45,212,191,.03)"}}>
            <p style={{font:"600 14px/1.55 var(--f)",color:"#fff"}}>
              Want to uncover surprising facts about <span style={{color:"#2dd4bf"}}>your own mind</span>?
            </p>
            <p style={{font:"400 12px/1.5 var(--f)",color:"rgba(255,255,255,.38)",marginTop:5}}>
              Answer 10 quick questions and we'll reveal personalised insights about how your brain uniquely handles stress. Based on real neuroscience.
            </p>
          </div>
          <button className="bp" onClick={()=>go("quiz")} style={{marginTop:4,flexShrink:0}}>Let's Find Out →</button>
        </>}

        {scr==="quiz"&&<>
          <Prog cur={cq}/>
          <div style={{display:"flex",alignItems:"center",width:"100%",marginBottom:8}}>
            {cq>0&&<button onClick={()=>setCq(cq-1)} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",color:"rgba(255,255,255,.4)",width:38,height:38,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>‹</button>}
          </div>
          <div style={{fontSize:32,marginBottom:10,animation:"fl 3s ease-in-out infinite",filter:`drop-shadow(0 0 10px ${ZONES[cq].accent}35)`}}>{ZONES[cq].icon}</div>
          <p style={{font:"600 10px/1 var(--f)",color:ZONES[cq].accent,letterSpacing:2.5,textTransform:"uppercase",marginBottom:7}}>In the last month...</p>
          <h3 style={{font:"700 clamp(16px,3vw,20px)/1.5 var(--f)",color:"#fff",marginBottom:22,maxWidth:440}}>
            How often have you {Q[cq].text}?
          </h3>
          <div style={{display:"flex",gap:7,width:"100%",maxWidth:500,flexWrap:"wrap",justifyContent:"center"}}>
            {OPTS.map(o=>(
              <button key={o.val} className={`op${ans[cq]===o.val?" s":""}`} onClick={()=>pick(o.val)} style={{minWidth:84}}>
                <div style={{width:8,height:8,borderRadius:4,background:o.color,boxShadow:`0 0 8px ${o.color}44`}}/>
                <span>{o.label}</span>
              </button>
            ))}
          </div>
        </>}

        {scr==="calc"&&<>
          <div style={{position:"relative",width:90,height:90,margin:"0 auto 18px"}}>
            <div style={{width:90,height:90,border:"2px solid rgba(45,212,191,.08)",borderTopColor:"#2dd4bf",borderRadius:"50%",animation:"sp .85s linear infinite"}}/>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><EmoneedsIcon size={52} bg="transparent" /></div>
          </div>
          <h3 style={{font:"700 20px/1.2 var(--f)",color:"#fff",marginBottom:6}}>Mapping your profile...</h3>
          <p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.35)"}}>Analysing patterns across 10 dimensions</p>
        </>}

        {scr==="results"&&band&&<>
          <Gauge score={sc} band={band}/>
          <h2 style={{font:"900 24px/1.2 var(--f)",color:"#fff",marginTop:2}}>
            {dn!=="there"?dn+"'s":"Your"} score: <span style={{color:band.color}}>{sc}/40</span>
          </h2>
          <div style={{display:"inline-flex",padding:"5px 16px",borderRadius:60,background:`${band.color}12`,border:`1.5px solid ${band.color}30`,font:"700 13px/1 var(--f)",color:band.color,margin:"6px 0 14px"}}>{band.label}</div>
          {sub&&<div style={{display:"flex",gap:14,marginBottom:14,width:"100%",maxWidth:380}}>
            {[{l:"Perceived Control",v:Math.round((1-sub.h/sub.hMax)*100),c:"#60a5fa"},{l:"Self-Efficacy",v:Math.round((1-sub.e/sub.eMax)*100),c:"#4ade80"}].map((b,i)=>(
              <div key={i} style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",font:"500 10px/1 var(--f)",color:"rgba(255,255,255,.3)",marginBottom:4}}><span>{b.l}</span><span>{b.v}%</span></div>
                <div style={{height:4,background:"rgba(255,255,255,.04)",borderRadius:2}}>
                  <div style={{height:"100%",borderRadius:2,background:b.c,width:`${b.v}%`,transition:"width 1.5s cubic-bezier(.4,0,.2,1)"}}/>
                </div>
              </div>
            ))}
          </div>}
          <div className="cd" style={{padding:"16px 20px",maxWidth:440,textAlign:"left",marginBottom:14}}>
            <p style={{font:"400 13px/1.6 var(--f)",color:"rgba(255,255,255,.65)"}}>
              {band.key==="low"&&`Great going${dn!=="there"?`, ${dn}`:""}, you're managing stress well. But 80% of India's workforce reports mental health challenges. Your team may need support even when you don't.`}
              {band.key==="moderate"&&`${dn!=="there"?dn+", you're":"You're"} experiencing moderate stress, alongside 59% of India's workforce. The demands of leadership accumulate. Small, consistent interventions shift this significantly.`}
              {band.key==="high"&&`${dn!=="there"?dn+", your":"Your"} stress levels are elevated. This is more common among leaders than you'd think. Proactive wellness support reduces these numbers and the ROI is measurable.`}
            </p>
          </div>
          <button className="bp" onClick={()=>go("personal")} style={{marginTop:4,flexShrink:0}}>Unlock Your Personal Insights →</button>
        </>}

        {scr==="personal"&&pf.length>0&&<>
          <div style={{font:"600 11px/1 var(--f)",color:"#2dd4bf",letterSpacing:3,textTransform:"uppercase",marginBottom:7}}>Your Unique Profile</div>
          <h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>What Your Answers Reveal 🔍</h2>
          <p style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>Personalised insights from your response patterns</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:500,marginBottom:20}}>
            {pf.map((f,i)=>(
              <div key={i} className="cd" style={{padding:"16px 18px",textAlign:"left",animation:`su .45s ${i*.13}s ease forwards`,opacity:0}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                  <span style={{fontSize:22}}>{f.ic}</span>
                  <span style={{font:"700 14px/1 var(--f)",color:"#fff"}}>{f.t}</span>
                </div>
                <p style={{font:"400 12.5px/1.55 var(--f)",color:"rgba(255,255,255,.6)",marginBottom:9}}>{f.f}</p>
                <div style={{background:"rgba(45,212,191,.04)",border:"1px solid rgba(45,212,191,.08)",borderRadius:10,padding:"9px 13px"}}>
                  <p style={{font:"500 11.5px/1.45 var(--f)",color:"#2dd4bf"}}>💡 {f.tip}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="bp" onClick={()=>go("stats")} style={{marginTop:4,flexShrink:0}}>See the Bigger Picture →</button>
        </>}

        {scr==="stats"&&<>
          <h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>India Inc. Reality Check</h2>
          <p style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.28)",marginBottom:18}}>The workplace mental health landscape</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,width:"100%",maxWidth:500,marginBottom:14}}>
            {INDIA_STATS.map((s,i)=>(
              <div key={i} className="cd" style={{padding:"14px 12px",textAlign:"center",animation:`su .4s ${i*.07}s ease forwards`,opacity:0}}>
                <div style={{fontSize:22,marginBottom:3}}>{s.ic}</div>
                <div style={{font:"900 22px/1.1 var(--f)",color:"#2dd4bf"}}>{s.n}</div>
                <div style={{font:"400 10px/1.35 var(--f)",color:"rgba(255,255,255,.38)",marginTop:3}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="cd" style={{padding:"12px 16px",maxWidth:440,border:"1px solid rgba(45,212,191,.08)",background:"rgba(45,212,191,.02)",marginBottom:4}}>
            <p style={{font:"600 13px/1.2 var(--f)",color:"#2dd4bf"}}>💡 ₹1 invested → ₹4 return in productivity</p>
            <p style={{font:"400 9px/1 var(--f)",color:"rgba(255,255,255,.22)",marginTop:3}}>WHO / Lancet Psychiatry</p>
          </div>
          <p style={{font:"400 9px/1 var(--f)",color:"rgba(255,255,255,.15)",marginBottom:14}}>Deloitte India · McKinsey Health Institute · WHO</p>
          <button className="bp" onClick={()=>go("lead")} style={{marginTop:4,flexShrink:0}}>Take Action →</button>
        </>}

        {scr==="lead"&&<>
          <div style={{fontSize:32,marginBottom:10}}>🌱</div>
          <h2 style={{font:"900 22px/1.2 var(--f)",color:"#fff",marginBottom:4}}>Take the First Step</h2>
          <p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.32)",marginBottom:22}}>For your organisation's wellbeing</p>
          {!shA?<>
            <button className="bp" onClick={()=>setShA(true)} style={{marginBottom:18}}>📋 Book a Free Wellness Audit</button>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,color:"rgba(255,255,255,.18)",font:"400 11px/1 var(--f)"}}>
              <div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>or<div style={{flex:1,height:1,background:"rgba(255,255,255,.05)"}}/>
            </div>
            <p style={{font:"400 12px/1 var(--f)",color:"rgba(255,255,255,.38)",marginBottom:9}}>📩 Get your detailed report emailed</p>
            <div style={{display:"flex",gap:7,maxWidth:340,width:"100%"}}>
              <input className="ip" type="email" placeholder="your@email.com" value={em} onChange={e=>setEm(e.target.value)} style={{flex:1}}/>
              <button className="bs" onClick={()=>em&&submit(false)}>Send</button>
            </div>
          </>:<div className="cd" style={{padding:"20px",maxWidth:360,width:"100%"}}>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              <input className="ip" value={dn!=="there"?dn:""} readOnly={dn!=="there"} placeholder="Name" style={{opacity:dn!=="there"?.45:1}}/>
              <input className="ip" type="email" placeholder="Email *" value={em} onChange={e=>setEm(e.target.value)} autoFocus/>
              <input className="ip" placeholder="Company (optional)" value={co} onChange={e=>setCo(e.target.value)}/>
              <input className="ip" placeholder="Designation (optional)" value={dg} onChange={e=>setDg(e.target.value)}/>
              <button className="bp" onClick={()=>em&&submit(true)} style={{width:"100%",marginTop:2}}>Book My Audit ✅</button>
              <button className="gh" onClick={()=>setShA(false)} style={{marginTop:2}}>← Back</button>
            </div>
          </div>}
          <button className="gh" onClick={()=>go("thanks")} style={{marginTop:18}}>Skip</button>

          {/* QR CODE — pure inline SVG, works offline */}
          <div style={{marginTop:24,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <a href="https://www.emoneeds.com/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <div style={{background:"#fff",borderRadius:12,padding:10,display:"inline-block",boxShadow:"0 4px 20px rgba(0,0,0,.25)",cursor:"pointer"}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="110" height="110" shapeRendering="crispEdges">
                  <path fill="#0a0d1a" d="M0,0h7v1h-7zM11,0h1v1h-1zM16,0h1v1h-1zM18,0h7v1h-7zM0,1h1v1h-1zM6,1h1v1h-1zM9,1h1v1h-1zM14,1h3v1h-3zM18,1h1v1h-1zM24,1h1v1h-1zM0,2h1v1h-1zM2,2h3v1h-3zM6,2h1v1h-1zM8,2h1v1h-1zM10,2h1v1h-1zM12,2h1v1h-1zM14,2h3v1h-3zM18,2h1v1h-1zM20,2h3v1h-3zM24,2h1v1h-1zM0,3h1v1h-1zM2,3h3v1h-3zM6,3h1v1h-1zM8,3h1v1h-1zM10,3h1v1h-1zM13,3h3v1h-3zM18,3h1v1h-1zM20,3h3v1h-3zM24,3h1v1h-1zM0,4h1v1h-1zM2,4h3v1h-3zM6,4h1v1h-1zM8,4h2v1h-2zM12,4h1v1h-1zM16,4h1v1h-1zM18,4h1v1h-1zM20,4h3v1h-3zM24,4h1v1h-1zM0,5h1v1h-1zM6,5h1v1h-1zM8,5h3v1h-3zM14,5h2v1h-2zM18,5h1v1h-1zM24,5h1v1h-1zM0,6h7v1h-7zM8,6h1v1h-1zM10,6h1v1h-1zM12,6h1v1h-1zM14,6h1v1h-1zM16,6h1v1h-1zM18,6h7v1h-7zM8,7h5v1h-5zM16,7h1v1h-1zM0,8h1v1h-1zM2,8h5v1h-5zM10,8h1v1h-1zM12,8h3v1h-3zM18,8h5v1h-5zM4,9h1v1h-1zM7,9h1v1h-1zM9,9h3v1h-3zM14,9h1v1h-1zM16,9h2v1h-2zM19,9h1v1h-1zM23,9h1v1h-1zM0,10h2v1h-2zM5,10h3v1h-3zM10,10h4v1h-4zM15,10h7v1h-7zM23,10h2v1h-2zM2,11h1v1h-1zM7,11h5v1h-5zM14,11h1v1h-1zM16,11h2v1h-2zM19,11h1v1h-1zM24,11h1v1h-1zM0,12h2v1h-2zM6,12h1v1h-1zM12,12h2v1h-2zM17,12h4v1h-4zM22,12h3v1h-3zM0,13h1v1h-1zM2,13h1v1h-1zM4,13h2v1h-2zM10,13h1v1h-1zM13,13h1v1h-1zM16,13h2v1h-2zM19,13h1v1h-1zM21,13h1v1h-1zM23,13h1v1h-1zM0,14h1v1h-1zM3,14h1v1h-1zM5,14h2v1h-2zM8,14h2v1h-2zM11,14h11v1h-11zM23,14h2v1h-2zM0,15h1v1h-1zM3,15h3v1h-3zM11,15h1v1h-1zM15,15h3v1h-3zM19,15h2v1h-2zM24,15h1v1h-1zM0,16h1v1h-1zM2,16h1v1h-1zM6,16h9v1h-9zM16,16h5v1h-5zM22,16h1v1h-1zM8,17h1v1h-1zM10,17h1v1h-1zM12,17h1v1h-1zM15,17h2v1h-2zM20,17h2v1h-2zM0,18h7v1h-7zM13,18h1v1h-1zM16,18h1v1h-1zM18,18h1v1h-1zM20,18h1v1h-1zM22,18h3v1h-3zM0,19h1v1h-1zM6,19h1v1h-1zM8,19h1v1h-1zM11,19h1v1h-1zM14,19h1v1h-1zM16,19h1v1h-1zM20,19h2v1h-2zM23,19h2v1h-2zM0,20h1v1h-1zM2,20h3v1h-3zM6,20h1v1h-1zM8,20h2v1h-2zM11,20h10v1h-10zM22,20h1v1h-1zM0,21h1v1h-1zM2,21h3v1h-3zM6,21h1v1h-1zM8,21h2v1h-2zM11,21h3v1h-3zM18,21h1v1h-1zM20,21h5v1h-5zM0,22h1v1h-1zM2,22h3v1h-3zM6,22h1v1h-1zM8,22h3v1h-3zM13,22h2v1h-2zM21,22h2v1h-2zM24,22h1v1h-1zM0,23h1v1h-1zM6,23h1v1h-1zM9,23h2v1h-2zM14,23h4v1h-4zM19,23h3v1h-3zM24,23h1v1h-1zM0,24h7v1h-7zM8,24h2v1h-2zM11,24h4v1h-4zM19,24h6v1h-6z"/>
                </svg>
              </div>
            </a>
            <p style={{font:"500 11px/1.3 var(--f)",color:"rgba(255,255,255,.3)"}}>Scan to learn more about Emoneeds</p>
          </div>
        </>}

        {scr==="thanks"&&<>
          <div style={{marginBottom:16,animation:"fl 3s ease-in-out infinite"}}><EmoneedsIcon size={64} /></div>
          <h2 style={{font:"900 24px/1.2 var(--f)",color:"#fff",marginBottom:7}}>Thank you{dn!=="there"?`, ${dn}`:""}!</h2>
          <p style={{font:"400 13px/1.55 var(--f)",color:"rgba(255,255,255,.42)",maxWidth:340,marginBottom:18}}>
            {done?"Check your inbox for your detailed stress report. 📬":"Talk to our team at the booth to learn about Emoneeds corporate wellness programs."}
          </p>
          <div className="cd" style={{padding:"12px 18px",marginBottom:14}}>
            <p style={{font:"400 11px/1 var(--f)",color:"rgba(255,255,255,.3)"}}>🌐 www.emoneeds.com</p>
          </div>
          <p style={{font:"400 10px/1 var(--f)",color:"rgba(255,255,255,.18)",animation:"pu 2s infinite"}}>Restarting in 15 seconds...</p>
        </>}
      </div>
      {toast&&<div className="tp">{toast}</div>}
    </div>
  </>;
}
