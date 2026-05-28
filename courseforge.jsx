import { useState, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const THEMES = [
  { id:"clinical",  name:"Clinical Academic", icon:"⚕",  desc:"Precise, structured",
    set:{ paletteId:"medmasters", fontId:"jakarta",  headerId:"structured", cardStyle:"flat",     hover:"lift",       borderW:"1px",  scale:"compact",    mode:"light", vibe:"clinical" }},
  { id:"modern",    name:"Modern EdTech",      icon:"⚡", desc:"Clean, product-quality",
    set:{ paletteId:"carbon",     fontId:"sora",     headerId:"minimal",    cardStyle:"flat",     hover:"lift",       borderW:"none", scale:"compact",    mode:"dark",  vibe:"modern"   }},
  { id:"warm",      name:"Warm Scholar",       icon:"🌿", desc:"Approachable, mentoring",
    set:{ paletteId:"forest",     fontId:"nunito",   headerId:"structured", cardStyle:"bookend",  hover:"colorshift", borderW:"2px",  scale:"comfortable",mode:"light", vibe:"warm"     }},
  { id:"editorial", name:"Academic Editorial", icon:"📖", desc:"Serif-driven, scholarly",
    set:{ paletteId:"royal",      fontId:"playfair", headerId:"banner",     cardStyle:"outlined", hover:"glow",       borderW:"2px",  scale:"comfortable",mode:"light", vibe:"clinical" }},
  { id:"fun",       name:"Fun & Engaging",     icon:"🎯", desc:"Bold, student-forward",
    set:{ paletteId:"pacific",    fontId:"nunito",   headerId:"banner",     cardStyle:"filled",   hover:"colorshift", borderW:"2px",  scale:"comfortable",mode:"light", vibe:"modern"   }},
];

const PALETTES = [
  { id:"medmasters",  name:"MedMasters",       tag:"Default",  p:"#0A1322", a:"#D4A24C", w:"#C25A3E", c:"#5B9AA0" },
  { id:"pacific",     name:"Pacific Clinical",  tag:null,       p:"#073B5C", a:"#1FB5C7", w:"#E05A4E", c:"#3DBCAD" },
  { id:"forest",      name:"Forest Scholar",    tag:null,       p:"#1A3D2B", a:"#D9882A", w:"#B84C3C", c:"#6DAF8E" },
  { id:"royal",       name:"Royal Academic",    tag:null,       p:"#1E1456", a:"#E8B84B", w:"#D46B6B", c:"#7B85C4" },
  { id:"carbon",      name:"Carbon Modern",     tag:null,       p:"#0F1117", a:"#3B7DD8", w:"#E05A44", c:"#48B09E" },
  { id:"terracotta",  name:"Warm Terra",         tag:null,       p:"#2C1810", a:"#D4A840", w:"#C96A45", c:"#87A878" },
];

const FONT_PAIRS = [
  { id:"jakarta",  name:"Jakarta + Atkinson",   tag:"Default",   h:"Plus Jakarta Sans", b:"Atkinson Hyperlegible" },
  { id:"playfair", name:"Playfair + Lora",        tag:"Editorial", h:"Playfair Display",  b:"Lora"                  },
  { id:"sora",     name:"Sora + Source Sans",     tag:null,        h:"Sora",              b:"Source Sans 3"         },
  { id:"nunito",   name:"Nunito + Merriweather",  tag:"Friendly",  h:"Nunito Sans",       b:"Merriweather"          },
];

const HEADER_STYLES = [
  { id:"structured", name:"Structured",  tag:"Default",  desc:"Eyebrow, large title, badge row."                },
  { id:"banner",     name:"Dark Banner",  tag:null,       desc:"Full-width primary header, white text."         },
  { id:"minimal",    name:"Minimal Line", tag:null,       desc:"Left accent border, compact typographic."       },
  { id:"split",      name:"Split Panel",  tag:null,       desc:"Course info left, quick-stats grid right."      },
];

const VIBES = [
  { id:"clinical", name:"Clinical Academic", s:"This course develops systematic anatomical reasoning through cadaveric study, clinical imaging, and structured team-based inquiry." },
  { id:"modern",   name:"Modern EdTech",     s:"You will build real anatomical knowledge through active practice, peer collaboration, and scenario-based learning every session."   },
  { id:"warm",     name:"Warm Scholar",      s:"Together we explore the elegant complexity of the human body, building the confidence you need to thrive clinically."              },
  { id:"bold",     name:"Bold Systematic",   s:"Anatomy is a skill set. This course delivers the framework. You provide the effort. The outcomes follow."                        },
];

const PAGE_MODES = [
  { id:"light",  name:"Light Mode",     desc:"White background, dark text."        },
  { id:"dark",   name:"Dark Mode",      desc:"Dark background, light text."        },
  { id:"toggle", name:"Student Toggle", desc:"Students switch light / dark."       },
];
const CARD_STYLES   = [{id:"flat",name:"Flat"},{id:"bookend",name:"Bookend"},{id:"outlined",name:"Outlined"},{id:"filled",name:"Filled"}];
const HOVER_OPTS    = [{id:"none",name:"None"},{id:"lift",name:"Lift"},{id:"glow",name:"Glow"},{id:"colorshift",name:"Color Shift"}];
const BORDER_OPTS   = [{id:"none",name:"None"},{id:"1px",name:"Thin"},{id:"2px",name:"Medium"},{id:"4px",name:"Bold"}];
const SCALE_OPTS    = [{id:"compact",name:"Compact"},{id:"comfortable",name:"Comfortable"},{id:"spacious",name:"Spacious"}];

const SCHOOLS    = ["Solano Community College","American River College","Yuba College","Other"];
const SEMESTERS  = ["Summer 2026","Fall 2026","Spring 2027","Summer 2027","Fall 2027"];
const DAYS       = ["Mon","Tue","Wed","Thu","Fri","Sat"];
const MODALITIES = ["In-person TBL","Online Asynchronous","Hybrid","In-person Lecture"];
const CTYPES     = ["BIO 004 – Human Anatomy (TBL, In-person)","BIO 431 – Anatomy and Physiology (TBL)","BIO 304 – A&P Online (No TBL)","Custom Course"];
const DEFASSESS  = {
  "BIO 004 – Human Anatomy (TBL, In-person)":[{name:"Lab Exams (5)",weight:35},{name:"iRAT / tRAT",weight:20},{name:"Midterm Exam",weight:20},{name:"Final Exam",weight:20},{name:"Participation",weight:5}],
  "BIO 431 – Anatomy and Physiology (TBL)":[{name:"Lab Practicals",weight:30},{name:"iRAT / tRAT",weight:20},{name:"Midterm Exam",weight:20},{name:"Final Exam",weight:20},{name:"Application Activities",weight:10}],
  "BIO 304 – A&P Online (No TBL)":[{name:"Module Exams",weight:40},{name:"Weekly Quizzes",weight:20},{name:"Lab Reports",weight:20},{name:"Final Exam",weight:15},{name:"Discussion Posts",weight:5}],
  "Custom Course":[{name:"Exams",weight:50},{name:"Assignments",weight:30},{name:"Participation",weight:20}],
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

function rgb(hex) {
  const h=hex.replace("#",""); 
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

function getPal(b) {
  if(b.paletteId==="custom") return {p:b.custom.p,a:b.custom.a,w:b.custom.t,c:b.custom.t,name:"Custom",bg:"#ffffff"};
  return PALETTES.find(x=>x.id===b.paletteId)||PALETTES[0];
}

function buildSys(b) {
  const pal=getPal(b), fp=FONT_PAIRS.find(f=>f.id===b.fontId)||FONT_PAIRS[0];
  const vibe=VIBES.find(v=>v.id===b.vibe)||VIBES[0];
  const gf = {
    jakarta:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Atkinson+Hyperlegible:wght@400;700&display=swap",
    playfair:"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800&family=Lora:wght@400;600;700&display=swap",
    sora:"https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Source+Sans+3:wght@400;600;700&display=swap",
    nunito:"https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Merriweather:wght@400;700&display=swap",
  };
  const fs = {compact:{body:"13px",lbl:"11px",sm:"10px",h1:"26px",h2:"17px",h3:"14px"},comfortable:{body:"15px",lbl:"12px",sm:"11px",h1:"30px",h2:"20px",h3:"16px"},spacious:{body:"16px",lbl:"13px",sm:"11px",h1:"34px",h2:"22px",h3:"17px"}}[b.scale]||{body:"13px",lbl:"11px",sm:"10px",h1:"26px",h2:"17px",h3:"14px"};
  const modeInst = {
    light:`Light mode. Background #ffffff. ${pal.p} text on white.`,
    dark:`Dark mode. Background ${pal.p}. Cards slightly lighter. Body text rgba(255,255,255,0.85). Headings white. Borders rgba(255,255,255,0.1).`,
    toggle:`Default light mode. Include a small moon/sun toggle button fixed top-right. JS toggles class "dark" on body. CSS :root defines light vars, body.dark defines dark vars (bg ${pal.p}, text white).`,
  };
  const cardInst = {
    flat:`Cards: border 1px solid #E0E3E8. No shadow. Clean flat.`,
    bookend:`Cards: border-left 4px solid ${pal.a}; border-right 4px solid ${pal.a}; border-top 1px solid ${pal.a}40; border-bottom 1px solid ${pal.a}40; box-shadow: 0 8px 24px rgba(${rgb(pal.p)},0.12), 0 2px 4px rgba(${rgb(pal.p)},0.08). Lifted bookend look.`,
    outlined:`Cards: border ${b.borderW==="none"?"2px":b.borderW} solid ${pal.a}. No shadow. Strong outline.`,
    filled:`Cards: background rgba(${rgb(pal.a)},0.10). Border 1px solid rgba(${rgb(pal.a)},0.28). No shadow.`,
  };
  const hoverInst = {
    none:"No hover effects.",
    lift:"Hover: transform translateY(-3px), shadow increases. 0.2s ease.",
    glow:`Hover: box-shadow 0 0 0 2px ${pal.a}, 0 8px 24px rgba(${rgb(pal.a)},0.22). 0.2s ease.`,
    colorshift:`Hover: background rgba(${rgb(pal.a)},0.10), border-color ${pal.a}. 0.2s ease.`,
  };
  const headerInst = {
    structured:`Eyebrow (${pal.w}, uppercase, ${fs.sm}, tracking 0.1em), h1 title (${pal.p}, ${fp.h}, ${fs.h1}, 800wt), badge row: course number pill (${pal.a} bg, ${pal.p} text, radius 99px) + semester pill. Quick-info strip below with subtle top rule.`,
    banner:`Full-width block, background ${pal.p}. h1 white ${fs.h1} 800. Eyebrow ${pal.a}. Badges rgba(255,255,255,0.15). Quick-info strip in slightly lighter ${pal.p}.`,
    minimal:`White bg, 4px left-border ${pal.a}. h1 (${fs.h1}, ${fp.h}, 800, ${pal.p}). One-line meta below in muted ink. No badges. No eyebrow. Generous whitespace.`,
    split:`Two-column: left 60% = school eyebrow (${pal.w}, uppercase ${fs.sm}), h1 (${fp.h}, ${fs.h1}, 800, ${pal.p}), instructor. Right 40% = 2x2 quick-stat grid (semester, modality, days, course num) with ${pal.c} borders.`,
  };
  return `You are CourseForge. Build complete single-file HTML course hub pages for professors.

ABSOLUTE RULES:
1. No em dashes. Use commas, colons, or rewrite.
2. No italics anywhere. font-style: normal globally.
3. Squared corners (border-radius: 4px) for cards, panels, inputs, buttons.
4. Pill shape (border-radius: 99px) for badges, chips only.
5. WCAG 2.2 AA: semantic HTML, h1>h2>h3, label for+id pairing, 4.5:1 contrast, skip link, visible focus.
6. Internal links: target="_top". External: target="_blank" rel="noopener".
7. Include in head: <link rel="stylesheet" href="${gf[b.fontId]||gf.jakarta}">
8. Heading font: ${fp.h}. Body font: ${fp.b}.
9. Before </body>: <script>(function(){function sh(){window.parent.postMessage({id:'cf',height:document.body.scrollHeight},'*');}const ro=new ResizeObserver(sh);ro.observe(document.body);window.addEventListener('load',sh);window.addEventListener('resize',sh);})();</script>

EXACT COLORS:
  Primary:    ${pal.p}
  Accent:     ${pal.a}
  Warm:       ${pal.w}
  Cool:       ${pal.c}

FONT SIZES (use exactly, do not enlarge):
  Body: ${fs.body}   Labels: ${fs.lbl}   Small: ${fs.sm}   h1: ${fs.h1}   h2: ${fs.h2}   h3: ${fs.h3}

PAGE MODE: ${modeInst[b.mode]||modeInst.light}
HEADER: ${headerInst[b.headerId]||headerInst.structured}
CARDS: ${cardInst[b.cardStyle]||cardInst.flat}
HOVER: ${hoverInst[b.hover]||hoverInst.lift}
TONE: ${vibe.name} - "${vibe.s}"

SECTIONS TO BUILD:
1. Skip link
2. Header per instruction
3. Quick-info strip (days/time, room, modality, office hours, email)
4. Course overview 2-3 sentences in selected tone
5. Grade breakdown cards with weight% and relative bar per assessment
6. Key dates (start, midterm, final, lab milestones)
7. Policies (late work, attendance, academic integrity)
8. Resources (Canvas placeholder, booking placeholder)
9. Footer (instructor + year)${b.mode==="toggle"?"\n10. Fixed dark/light toggle button top-right":""}

OUTPUT: Raw HTML only. No markdown. No fences. No explanation. Start with <!DOCTYPE html>.`;
}

function buildUser(form) {
  const tot=form.assessments.reduce((s,a)=>s+Number(a.weight||0),0);
  const note=form.courseType.includes("BIO 004")?"CRITICAL: Pure anatomy, no physiology. 8-week TBL. 5 lab exams, midterm wk4, final wk8.":form.courseType.includes("BIO 304")?"CRITICAL: Online async only. No TBL, no in-person.":"";
  return `Build course hub HTML:
Course: ${form.courseName} (${form.courseNumber})
School: ${form.school}  Instructor: ${form.instructor}  Semester: ${form.semester}
Type: ${form.courseType}  Modality: ${form.modality}
Start: ${form.startDate}  End: ${form.endDate}  Weeks: ${form.weeks}
Days: ${form.meetingDays.join(", ")||"TBD"}  Time: ${form.meetingTime||"TBD"}  Room: ${form.location||"TBD"}
Email: ${form.email||"via Canvas"}  Office Hours: ${form.officeHours||"By appointment"}
Assessments (${tot}%):
${form.assessments.map(a=>`- ${a.name}: ${a.weight}%`).join("\n")}
Objectives: ${form.objectives?.trim()||"Generate 5-6 appropriate objectives."}
${note}`;
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

const LABELS = ["Branding","Identity","Schedule","Assessments","Generate"];

export default function CourseForge() {
  const [step, setStep]         = useState(1);
  const [b, setB]               = useState({
    paletteId:"medmasters", custom:{p:"#0A1322",a:"#D4A24C",t:"#C25A3E"},
    fontId:"jakarta", headerId:"structured", vibe:"clinical",
    mode:"light", cardStyle:"flat", hover:"lift", borderW:"1px", scale:"compact",
  });
  const [form, setForm]         = useState({
    courseName:"Human Anatomy", courseNumber:"BIO 004",
    school:"Solano Community College", instructor:"Dr. Sharilyn Rennie",
    semester:"Summer 2026", courseType:"BIO 004 – Human Anatomy (TBL, In-person)",
    modality:"In-person TBL", startDate:"2026-06-15", endDate:"2026-08-06",
    weeks:"8", meetingDays:["Mon","Tue","Wed","Thu"],
    meetingTime:"", location:"", email:"", officeHours:"", objectives:"",
    assessments:[...DEFASSESS["BIO 004 – Human Anatomy (TBL, In-person)"]],
  });
  const [gen, setGen]           = useState(false);
  const [out, setOut]           = useState(null);
  const [tab, setTab]           = useState("preview");
  const [err, setErr]           = useState(null);
  const [dbg, setDbg]           = useState(null);

  // Load all preview fonts
  useEffect(()=>{
    const url="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Atkinson+Hyperlegible:wght@400;700&family=Playfair+Display:wght@700;800&family=Lora:wght@400;700&family=Sora:wght@700;800&family=Source+Sans+3:wght@400;700&family=Nunito+Sans:wght@700;800&family=Merriweather:wght@400;700&display=swap";
    const el=document.createElement("link");
    el.rel="stylesheet"; el.href=url;
    document.head.appendChild(el);
    return ()=>{ try{document.head.removeChild(el);}catch(e){} };
  },[]);

  const u   = (k,v)=>setForm(f=>({...f,[k]:v}));
  const sb  = (k,v)=>setB(x=>({...x,[k]:v}));
  const pal = getPal(b);
  const fp  = FONT_PAIRS.find(f=>f.id===b.fontId)||FONT_PAIRS[0];
  const tot = form.assessments.reduce((s,a)=>s+Number(a.weight||0),0);

  const applyTheme = t => setB(x=>({...x,...t.set}));

  const generate = async()=>{
    setGen(true); setErr(null); setOut(null); setDbg(null);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:8192,system:buildSys(b),messages:[{role:"user",content:buildUser(form)}]}),
      });
      const data=await res.json();
      setDbg({status:res.status,stop:data.stop_reason,types:(data.content||[]).map(x=>x.type).join(",")});
      if(!res.ok) throw new Error(`HTTP ${res.status}: ${data?.error?.message||JSON.stringify(data).slice(0,200)}`);
      if(data.error) throw new Error(data.error.message);
      const text=(data.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("").trim();
      if(!text) throw new Error(`Empty response. Stop: ${data.stop_reason}. Content types: ${(data.content||[]).map(x=>x.type).join(",")}`);
      setOut(text.replace(/^```html\s*/,"").replace(/\s*```$/,"").trim());
      setTab("preview");
    } catch(e){ setErr(e.message); }
    finally{ setGen(false); }
  };

  const download=()=>{
    const blob=new Blob([out],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`${form.courseNumber.replace(/\s+/g,"-").toLowerCase()}-hub.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── MINI CARD RENDERERS ────────────────────────────────────────────────────

  const PalCard=({p})=>{
    const sel=b.paletteId===p.id;
    return <div key={p.id} onClick={()=>sb("paletteId",p.id)} style={{cursor:"pointer",borderRadius:4,overflow:"hidden",border:`2px solid ${sel?p.a:"rgba(255,255,255,0.09)"}`,transition:"border-color .15s"}}>
      <div style={{background:p.p,padding:"10px 12px"}}>
        <div style={{fontSize:7,fontWeight:700,color:p.w,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Solano CC</div>
        <div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:4}}>Human Anatomy</div>
        <span style={{background:p.a,color:p.p,borderRadius:99,fontSize:7,fontWeight:700,padding:"2px 7px"}}>BIO 004</span>
      </div>
      <div style={{display:"flex",height:5}}>{[p.p,p.a,p.w,p.c].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}</div>
      <div style={{padding:"7px 10px",background:"#111B2B",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:11,fontWeight:700,color:sel?p.a:"#fff"}}>{p.name}</div>{p.tag&&<div style={{fontSize:9,color:p.a,fontWeight:600,marginTop:1}}>{p.tag}</div>}</div>
        {sel&&<span style={{background:p.a,color:p.p,borderRadius:99,fontSize:8,fontWeight:700,padding:"1px 7px"}}>ON</span>}
      </div>
    </div>;
  };

  const FontCard=({f})=>{
    const sel=b.fontId===f.id;
    return <div key={f.id} onClick={()=>sb("fontId",f.id)} style={{cursor:"pointer",borderRadius:4,padding:"12px 14px",border:`2px solid ${sel?pal.a:"rgba(255,255,255,0.09)"}`,background:sel?`rgba(${rgb(pal.a)},0.07)`:"rgba(255,255,255,0.02)",transition:"all .15s"}}>
      <div style={{fontFamily:`'${f.h}',Georgia,serif`,fontSize:19,fontWeight:800,color:"#fff",marginBottom:4,lineHeight:1.1,letterSpacing:"-0.01em"}}>{f.h.split(" ")[0]}</div>
      <div style={{fontFamily:`'${f.h}',Georgia,serif`,fontSize:16,fontWeight:800,color:"rgba(255,255,255,0.9)",marginBottom:5,lineHeight:1.1}}>Human Anatomy</div>
      <div style={{fontFamily:`'${f.b}',Georgia,serif`,fontSize:11,color:"rgba(255,255,255,0.48)",lineHeight:1.55,marginBottom:8}}>Active recall and clinical reasoning.</div>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.h} + {f.b}</span>
        {f.tag&&<span style={{background:`rgba(${rgb(pal.a)},0.18)`,color:pal.a,borderRadius:99,fontSize:8,fontWeight:700,padding:"2px 7px"}}>{f.tag}</span>}
      </div>
    </div>;
  };

  const HdrCard=({hs})=>{
    const sel=b.headerId===hs.id; const p=pal;
    const M={
      structured:<div style={{background:"#fff",padding:"9px 11px",borderBottom:"1px solid #E5E7EB"}}><div style={{fontSize:7,fontWeight:700,color:p.w,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Solano CC · Sum 26</div><div style={{fontSize:13,fontWeight:800,color:p.p,marginBottom:4}}>Human Anatomy</div><div style={{display:"flex",gap:4}}><span style={{background:p.a,color:p.p,borderRadius:99,fontSize:7,fontWeight:700,padding:"1px 6px"}}>BIO 004</span><span style={{background:"#F3F4F6",color:p.p,borderRadius:99,fontSize:7,padding:"1px 6px"}}>Dr. Rennie</span></div></div>,
      banner:<div style={{background:p.p,padding:"9px 11px"}}><div style={{fontSize:7,fontWeight:700,color:p.a,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Solano CC · Sum 26</div><div style={{fontSize:13,fontWeight:800,color:"#fff",marginBottom:4}}>Human Anatomy</div><span style={{background:p.a,color:p.p,borderRadius:99,fontSize:7,fontWeight:700,padding:"1px 6px"}}>BIO 004</span></div>,
      minimal:<div style={{background:"#fff",padding:"9px 11px",borderLeft:`3px solid ${p.a}`}}><div style={{fontSize:7,color:"rgba(0,0,0,0.38)",marginBottom:2}}>BIO 004 · Sum 26</div><div style={{fontSize:13,fontWeight:800,color:p.p}}>Human Anatomy</div><div style={{fontSize:7,color:"rgba(0,0,0,0.38)",marginTop:2}}>Dr. Rennie · TBL</div></div>,
      split:<div style={{background:"#fff",padding:"9px 11px",display:"flex",gap:7,borderBottom:"1px solid #E5E7EB"}}><div style={{flex:2}}><div style={{fontSize:7,fontWeight:700,color:p.w,textTransform:"uppercase",marginBottom:2}}>Solano CC</div><div style={{fontSize:12,fontWeight:800,color:p.p}}>Human Anatomy</div></div><div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>{["8wk","TBL","M-Th","004"].map(l=><div key={l} style={{background:"#F3F4F6",borderRadius:2,padding:"2px 3px",fontSize:6,fontWeight:700,color:p.p,textAlign:"center"}}>{l}</div>)}</div></div>,
    };
    return <div key={hs.id} onClick={()=>sb("headerId",hs.id)} style={{cursor:"pointer",borderRadius:4,overflow:"hidden",border:`2px solid ${sel?pal.a:"rgba(255,255,255,0.09)"}`,transition:"border-color .15s"}}>
      {M[hs.id]}
      <div style={{padding:"7px 11px",background:"#111B2B"}}><div style={{fontSize:11,fontWeight:700,color:sel?pal.a:"#fff"}}>{hs.name}</div><div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:1}}>{hs.desc}</div>{hs.tag&&<div style={{fontSize:9,color:pal.a,fontWeight:600,marginTop:1}}>{hs.tag}</div>}</div>
    </div>;
  };

  const Pills=({opts,active,onSel})=>(
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {opts.map(o=>{const sel=active===o.id;return(
        <button key={o.id} type="button" onClick={()=>onSel(o.id)} style={{padding:"5px 12px",borderRadius:99,border:`1px solid ${sel?pal.a:"rgba(255,255,255,0.16)"}`,background:sel?`rgba(${rgb(pal.a)},0.18)`:"transparent",color:sel?pal.a:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .15s",fontFamily:"inherit"}}>
          {o.name}
        </button>
      );})}
    </div>
  );

  // ── LIVE PREVIEW ───────────────────────────────────────────────────────────

  const Preview=()=>{
    const p=pal, isDark=b.mode==="dark";
    const bg=isDark?p.p:"#fff", fg=isDark?"#fff":p.p, bodyFg=isDark?"rgba(255,255,255,0.75)":"#444";
    const vibe=VIBES.find(v=>v.id===b.vibe)||VIBES[0];
    const cardBorder={
      flat:{border:"1px solid #E0E3E8",background:isDark?"rgba(255,255,255,0.06)":"#fff"},
      bookend:{borderLeft:`4px solid ${p.a}`,borderRight:`4px solid ${p.a}`,borderTop:`1px solid ${p.a}40`,borderBottom:`1px solid ${p.a}40`,boxShadow:"0 8px 24px rgba(0,0,0,0.14)",background:isDark?"rgba(255,255,255,0.06)":"#fff"},
      outlined:{border:`2px solid ${p.a}`,background:"transparent"},
      filled:{background:`rgba(${rgb(p.a)},0.12)`,border:`1px solid rgba(${rgb(p.a)},0.3)`},
    }[b.cardStyle]||{border:"1px solid #E0E3E8"};

    return <div style={{border:`1px solid ${p.a}`,borderRadius:4,overflow:"hidden",marginBottom:24}}>
      <div style={{background:`rgba(${rgb(p.a)},0.07)`,padding:"6px 14px",borderBottom:`1px solid ${p.a}`,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:9,fontWeight:700,color:p.a,textTransform:"uppercase",letterSpacing:"0.1em"}}>Live Preview</span>
        <span style={{fontSize:9,color:"rgba(255,255,255,0.28)"}}>Changes update instantly</span>
        <span style={{marginLeft:"auto",fontSize:8,padding:"2px 8px",borderRadius:99,background:"rgba(255,255,255,0.08)",color:p.a,fontWeight:700}}>{b.mode.toUpperCase()}</span>
      </div>
      {/* Header preview */}
      {b.headerId==="structured"&&<div style={{background:bg,padding:"13px 16px",borderBottom:`1px solid ${isDark?"rgba(255,255,255,0.1)":"#E5E7EB"}`}}>
        <div style={{fontSize:8,fontWeight:700,color:p.w,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3}}>Solano Community College · Summer 2026</div>
        <div style={{fontFamily:`'${fp.h}',Georgia,serif`,fontSize:20,fontWeight:800,color:fg,marginBottom:6}}>{form.courseName||"Human Anatomy"}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><span style={{background:p.a,color:p.p,borderRadius:99,fontSize:9,fontWeight:700,padding:"2px 9px"}}>{form.courseNumber||"BIO 004"}</span><span style={{background:isDark?"rgba(255,255,255,0.1)":"#F3F4F6",color:fg,borderRadius:99,fontSize:9,padding:"2px 9px"}}>{form.semester}</span></div>
      </div>}
      {b.headerId==="banner"&&<div style={{background:p.p,padding:"13px 16px"}}>
        <div style={{fontSize:8,fontWeight:700,color:p.a,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3}}>Solano Community College · Summer 2026</div>
        <div style={{fontFamily:`'${fp.h}',Georgia,serif`,fontSize:20,fontWeight:800,color:"#fff",marginBottom:6}}>{form.courseName||"Human Anatomy"}</div>
        <div style={{display:"flex",gap:6}}><span style={{background:p.a,color:p.p,borderRadius:99,fontSize:9,fontWeight:700,padding:"2px 9px"}}>{form.courseNumber||"BIO 004"}</span><span style={{background:"rgba(255,255,255,0.14)",color:"#fff",borderRadius:99,fontSize:9,padding:"2px 9px"}}>{form.weeks} Weeks</span></div>
      </div>}
      {b.headerId==="minimal"&&<div style={{background:bg,padding:"13px 16px",borderLeft:`4px solid ${p.a}`}}>
        <div style={{fontSize:8,color:isDark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",marginBottom:3}}>{form.courseNumber||"BIO 004"} · {form.semester} · Solano CC</div>
        <div style={{fontFamily:`'${fp.h}',Georgia,serif`,fontSize:20,fontWeight:800,color:fg}}>{form.courseName||"Human Anatomy"}</div>
        <div style={{fontSize:9,color:isDark?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",marginTop:3}}>{form.instructor} · {form.modality}</div>
      </div>}
      {b.headerId==="split"&&<div style={{background:bg,padding:"13px 16px",display:"flex",gap:14,alignItems:"center",borderBottom:`1px solid ${isDark?"rgba(255,255,255,0.1)":"#E5E7EB"}`}}>
        <div style={{flex:2}}><div style={{fontSize:8,fontWeight:700,color:p.w,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Solano CC</div><div style={{fontFamily:`'${fp.h}',Georgia,serif`,fontSize:18,fontWeight:800,color:fg}}>{form.courseName||"Human Anatomy"}</div></div>
        <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{[["Sem",form.semester.split(" ")[0]+" '26"],["Type","TBL"],["Days","M-Th"],["No.",form.courseNumber||"BIO004"]].map(([k,v])=><div key={k} style={{border:`1px solid ${p.c}`,borderRadius:3,padding:"4px 5px"}}><div style={{fontSize:6,fontWeight:700,color:p.c,textTransform:"uppercase",marginBottom:1}}>{k}</div><div style={{fontSize:8,fontWeight:700,color:fg}}>{v}</div></div>)}</div>
      </div>}
      {/* Body sample */}
      <div style={{background:isDark?`${p.p}cc`:`rgba(${rgb(p.w)},0.03)`,padding:"10px 16px",borderTop:isDark?"1px solid rgba(255,255,255,0.07)":"1px solid #E5E7EB"}}>
        <div style={{fontFamily:`'${fp.b}',Georgia,serif`,fontSize:11,color:bodyFg,lineHeight:1.6,marginBottom:8}}>{vibe.s}</div>
        {/* Sample card */}
        <div style={{borderRadius:4,padding:"9px 11px",...cardBorder}}>
          <div style={{fontSize:9,fontWeight:700,color:p.a,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>Lab Exams</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{flex:1,height:3,background:isDark?"rgba(255,255,255,0.1)":"#E5E7EB",borderRadius:99}}><div style={{width:"35%",height:"100%",background:p.a,borderRadius:99}}/></div>
            <span style={{fontSize:10,fontWeight:700,color:fg}}>35%</span>
          </div>
        </div>
      </div>
    </div>;
  };

  // ── STEP RENDERERS ─────────────────────────────────────────────────────────

  const S1=()=><>
    <div className="st">Branding</div>
    <div className="ss">Design your course pages. Preview updates live.</div>
    <Preview/>
    <div className="sw"><div className="sl">Quick Themes <span style={{opacity:.45,fontWeight:400,letterSpacing:0,fontSize:9}}>— applies all settings at once</span></div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {THEMES.map(t=><button key={t.id} type="button" onClick={()=>applyTheme(t)} style={{padding:"9px 12px",borderRadius:4,cursor:"pointer",border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.03)",textAlign:"left",fontFamily:"inherit",minWidth:120,transition:"all .15s"}}>
          <div style={{fontSize:15,marginBottom:2}}>{t.icon}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#fff"}}>{t.name}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",marginTop:1}}>{t.desc}</div>
        </button>)}
      </div>
    </div>

    <div className="sw"><div className="sl">Color Palette</div><div className="g3">{PALETTES.map(p=><PalCard key={p.id} p={p}/>)}</div></div>

    <div className="sw">
      <div className="sl">Custom Colors <span style={{opacity:.45,fontWeight:400,letterSpacing:0,fontSize:9}}>— enter hex codes directly</span></div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
        {[["Primary","p"],["Accent","a"],["Tertiary","t"]].map(([label,key])=><div key={key} style={{flex:"1 1 120px"}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{label}</div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <div style={{position:"relative",width:30,height:30,flexShrink:0,borderRadius:4,overflow:"hidden",border:"1px solid rgba(255,255,255,0.15)"}}>
              <div style={{width:"100%",height:"100%",background:b.custom[key]}}/>
              <input type="color" value={b.custom[key]} onChange={e=>sb("custom",{...b.custom,[key]:e.target.value})} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
            </div>
            <input type="text" value={b.custom[key]} onChange={e=>{if(/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value))sb("custom",{...b.custom,[key]:e.target.value});}} style={{flex:1,padding:"5px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:4,fontFamily:"monospace",fontSize:12,color:"#fff",outline:"none"}}/>
          </div>
        </div>)}
        <button type="button" onClick={()=>sb("paletteId","custom")} style={{padding:"7px 12px",borderRadius:4,border:`1px solid ${b.paletteId==="custom"?pal.a:"rgba(255,255,255,0.18)"}`,background:b.paletteId==="custom"?`rgba(${rgb(pal.a)},0.14)`:"transparent",color:b.paletteId==="custom"?pal.a:"rgba(255,255,255,0.45)",fontFamily:"inherit",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>
          {b.paletteId==="custom"?"Using Custom":"Use Custom"}
        </button>
      </div>
    </div>

    <div className="sw"><div className="sl">Page Mode</div>
      <div style={{display:"flex",gap:8}}>
        {PAGE_MODES.map(m=>{const sel=b.mode===m.id;return <div key={m.id} onClick={()=>sb("mode",m.id)} style={{flex:1,padding:"11px 12px",borderRadius:4,cursor:"pointer",border:`2px solid ${sel?pal.a:"rgba(255,255,255,0.09)"}`,background:sel?`rgba(${rgb(pal.a)},0.07)`:"rgba(255,255,255,0.02)",transition:"all .15s"}}>
          <div style={{fontSize:11,fontWeight:700,color:sel?pal.a:"#fff",marginBottom:2}}>{m.name}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>{m.desc}</div>
        </div>;})}
      </div>
    </div>

    <div className="sw"><div className="sl">Typography</div><div className="g2">{FONT_PAIRS.map(f=><FontCard key={f.id} f={f}/>)}</div></div>

    <div className="sw"><div className="sl">Header Layout</div><div className="g2">{HEADER_STYLES.map(hs=><HdrCard key={hs.id} hs={hs}/>)}</div></div>

    <div className="sw"><div className="sl">Components + Details</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["Card Style",CARD_STYLES,b.cardStyle,v=>sb("cardStyle",v)],["Hover Effect",HOVER_OPTS,b.hover,v=>sb("hover",v)],["Border Weight",BORDER_OPTS,b.borderW,v=>sb("borderW",v)],["Font Scale",SCALE_OPTS,b.scale,v=>sb("scale",v)]].map(([label,opts,active,onSel])=><div key={label}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</div>
          <Pills opts={opts} active={active} onSel={onSel}/>
        </div>)}
      </div>
    </div>

    <div className="sw"><div className="sl">Content Tone</div><div className="g2">{VIBES.map(v=>{const sel=b.vibe===v.id;return <div key={v.id} onClick={()=>sb("vibe",v.id)} style={{cursor:"pointer",borderRadius:4,padding:"11px 13px",border:`2px solid ${sel?pal.a:"rgba(255,255,255,0.09)"}`,background:sel?`rgba(${rgb(pal.a)},0.07)`:"rgba(255,255,255,0.02)",transition:"all .15s"}}>
      <div style={{fontSize:11,fontWeight:700,color:sel?pal.a:"#fff",marginBottom:5}}>{v.name}</div>
      <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",lineHeight:1.55}}>{v.s}</div>
    </div>;})}</div></div>
  </>;

  const S2=()=><>
    <div className="st">Course Identity</div><div className="ss">What course are you building?</div>
    <div className="fr2"><div className="fg"><label>Course Name</label><input value={form.courseName} onChange={e=>u("courseName",e.target.value)} placeholder="Human Anatomy"/></div><div className="fg"><label>Course Number</label><input value={form.courseNumber} onChange={e=>u("courseNumber",e.target.value)} placeholder="BIO 004"/></div></div>
    <div className="fr2"><div className="fg"><label>School</label><select value={form.school} onChange={e=>u("school",e.target.value)}>{SCHOOLS.map(s=><option key={s}>{s}</option>)}</select></div><div className="fg"><label>Semester</label><select value={form.semester} onChange={e=>u("semester",e.target.value)}>{SEMESTERS.map(s=><option key={s}>{s}</option>)}</select></div></div>
    <div className="fg"><label>Instructor</label><input value={form.instructor} onChange={e=>u("instructor",e.target.value)}/></div>
    <div className="fg"><label>Course Type</label><div className="g2">{CTYPES.map(ct=>{const[n,s]=ct.split(" – ");return <div key={ct} className={`tc ${form.courseType===ct?"sel":""}`} onClick={()=>setForm(f=>({...f,courseType:ct,assessments:[...DEFASSESS[ct]]}))}>
      <div className="tc-n">{n}</div>{s&&<div className="tc-s">{s}</div>}
    </div>;})}</div></div>
  </>;

  const S3=()=><>
    <div className="st">Schedule</div><div className="ss">When and where does this course meet?</div>
    <div className="fr2"><div className="fg"><label>Start Date</label><input type="date" value={form.startDate} onChange={e=>u("startDate",e.target.value)}/></div><div className="fg"><label>End Date</label><input type="date" value={form.endDate} onChange={e=>u("endDate",e.target.value)}/></div></div>
    <div className="fr2"><div className="fg"><label>Weeks</label><input type="number" value={form.weeks} onChange={e=>u("weeks",e.target.value)} placeholder="8"/></div><div className="fg"><label>Modality</label><select value={form.modality} onChange={e=>u("modality",e.target.value)}>{MODALITIES.map(m=><option key={m}>{m}</option>)}</select></div></div>
    <div className="fg"><label>Meeting Days</label><div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:2}}>
      {DAYS.map(d=><button key={d} type="button" onClick={()=>setForm(f=>({...f,meetingDays:f.meetingDays.includes(d)?f.meetingDays.filter(x=>x!==d):[...f.meetingDays,d]}))} style={{padding:"5px 12px",borderRadius:99,border:`1px solid ${form.meetingDays.includes(d)?pal.a:"rgba(255,255,255,0.16)"}`,background:form.meetingDays.includes(d)?pal.a:"transparent",color:form.meetingDays.includes(d)?pal.p:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>{d}</button>)}
    </div></div>
    <div className="fr2"><div className="fg"><label>Meeting Time</label><input value={form.meetingTime} onChange={e=>u("meetingTime",e.target.value)} placeholder="8:00 AM to 10:50 AM"/></div><div className="fg"><label>Room / Location</label><input value={form.location} onChange={e=>u("location",e.target.value)} placeholder="Building and Room"/></div></div>
    <div className="fr2"><div className="fg"><label>Email</label><input type="email" value={form.email} onChange={e=>u("email",e.target.value)} placeholder="you@college.edu"/></div><div className="fg"><label>Office Hours</label><input value={form.officeHours} onChange={e=>u("officeHours",e.target.value)} placeholder="Mon/Wed 11am to 12pm"/></div></div>
  </>;

  const S4=()=><>
    <div className="st">Assessments</div><div className="ss">Grade breakdown. Weights must total 100%.</div>
    <div className="at"><div className="ah"><span>Assessment</span><span>Weight %</span><span/></div>
      {form.assessments.map((a,i)=><div className="ar" key={i}>
        <input value={a.name} placeholder="Name" onChange={e=>setForm(f=>{const as=[...f.assessments];as[i]={...as[i],name:e.target.value};return{...f,assessments:as}})}/>
        <input type="number" min="0" max="100" value={a.weight} onChange={e=>setForm(f=>{const as=[...f.assessments];as[i]={...as[i],weight:e.target.value};return{...f,assessments:as}})}/>
        <button className="rb" onClick={()=>setForm(f=>({...f,assessments:f.assessments.filter((_,j)=>j!==i)}))}>x</button>
      </div>)}
    </div>
    <div className="wt"><span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>Total:</span><span className={`wb ${tot===100?"wok":"wwn"}`}>{tot}%</span></div>
    <button className="addbtn" type="button" onClick={()=>setForm(f=>({...f,assessments:[...f.assessments,{name:"",weight:0}]}))}>+ Add Assessment</button>
  </>;

  const S5=()=><>
    <div className="st">Review + Generate</div><div className="ss">Confirm and build.</div>
    <div style={{border:"1px solid rgba(255,255,255,0.08)",borderRadius:4,padding:"11px 14px",background:"rgba(255,255,255,0.02)",marginBottom:18,display:"flex",gap:18,flexWrap:"wrap"}}>
      {[["Palette",pal.name],["Fonts",fp.h],["Mode",PAGE_MODES.find(m=>m.id===b.mode)?.name],["Card",CARD_STYLES.find(c=>c.id===b.cardStyle)?.name],["Tone",VIBES.find(v=>v.id===b.vibe)?.name]].map(([k,v])=><div key={k}><div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.28)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{k}</div><div style={{fontSize:12,fontWeight:600,color:"#fff"}}>{v}</div></div>)}
    </div>
    <div className="sg">{[["Course",`${form.courseNumber} ${form.courseName}`],["School",form.school],["Semester",form.semester],["Type",form.courseType.split(" – ")[1]||form.courseType],["Dates",`${form.startDate} to ${form.endDate}`],["Days",form.meetingDays.join(", ")||"TBD"],["Assessments",`${form.assessments.length} items, ${tot}%`],["Modality",form.modality]].map(([k,v])=><div className="sc" key={k}><div className="sk">{k}</div><div className="sv">{v||"—"}</div></div>)}</div>
    <div className="fg"><label>Learning Objectives (optional)</label><textarea value={form.objectives} onChange={e=>u("objectives",e.target.value)} placeholder="Leave blank to auto-generate, or enter one per line..."/></div>
    <div className="gc">
      <p>CourseForge applies your branding and course data to generate a complete, push-ready HTML file.</p>
      <button className="bgen" onClick={generate} disabled={gen||tot!==100}>{gen?"Building...":"Generate Course Hub"}</button>
      {tot!==100&&<div style={{fontSize:10,color:"#C25A3E",marginTop:7}}>Fix assessments to total 100%.</div>}
      <div className="api-n">Powered by Claude Sonnet via Anthropic API</div>
    </div>
  </>;

  // ── CSS ────────────────────────────────────────────────────────────────────
  const css=`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;font-style:normal}
    body{font-family:'Plus Jakarta Sans',sans-serif;background:#090F1A;min-height:100vh;color:#fff;font-size:13px}
    .hdr{padding:15px 26px 11px;border-bottom:1px solid rgba(255,255,255,0.06)}
    .ey{font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D4A24C;margin-bottom:2px}
    .hdr h1{font-size:20px;font-weight:800}
    .tg{font-size:11px;color:rgba(255,255,255,0.35);margin-top:2px}
    .sbar{display:flex;padding:0 26px;border-bottom:1px solid rgba(255,255,255,0.06);overflow-x:auto}
    .stab{padding:10px 14px;font-size:11px;font-weight:700;letter-spacing:0.04em;color:rgba(255,255,255,0.25);border-bottom:2px solid transparent;white-space:nowrap}
    .stab.on{color:#D4A24C;border-bottom-color:#D4A24C}
    .stab.dn{color:rgba(255,255,255,0.5)}
    .body{padding:22px 26px;max-width:800px;margin:0 auto}
    .st{font-size:16px;font-weight:800;margin-bottom:2px}
    .ss{font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:18px}
    .sw{margin-bottom:24px}
    .sl{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,0.06)}
    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .fg{margin-bottom:13px}
    .fg label{display:block;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:4px}
    .fg input,.fg select,.fg textarea{width:100%;padding:8px 10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;font-family:inherit;font-size:13px;color:#fff;outline:none;transition:border-color .15s}
    .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:#D4A24C}
    .fg select option{background:#090F1A}
    .fg textarea{min-height:85px;resize:vertical}
    .fr2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .tc{padding:10px 12px;border:1px solid rgba(255,255,255,0.09);border-radius:4px;cursor:pointer;transition:all .15s;background:rgba(255,255,255,0.02)}
    .tc:hover{border-color:rgba(212,162,76,0.4)}
    .tc.sel{border-color:#D4A24C;background:rgba(212,162,76,0.08)}
    .tc-n{font-size:12px;font-weight:700}
    .tc-s{font-size:10px;color:rgba(255,255,255,0.34);margin-top:2px}
    .at{border:1px solid rgba(255,255,255,0.08);border-radius:4px;overflow:hidden;margin-bottom:8px}
    .ah{display:grid;grid-template-columns:1fr 76px 32px;gap:7px;padding:6px 10px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06)}
    .ah span{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.28)}
    .ar{display:grid;grid-template-columns:1fr 76px 32px;gap:7px;padding:6px 10px;align-items:center;border-bottom:1px solid rgba(255,255,255,0.05)}
    .ar:last-child{border-bottom:none}
    .ar input{padding:5px 7px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:4px;color:#fff;font-family:inherit;font-size:12px;width:100%;outline:none}
    .ar input:focus{border-color:#D4A24C}
    .rb{background:none;border:none;color:rgba(255,255,255,0.22);cursor:pointer;font-size:14px;padding:2px 5px;border-radius:3px;transition:color .15s;line-height:1}
    .rb:hover{color:#C25A3E}
    .wt{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin-bottom:10px}
    .wb{padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700}
    .wok{background:rgba(91,154,160,.15);color:#5B9AA0;border:1px solid rgba(91,154,160,.5)}
    .wwn{background:rgba(194,90,62,.15);color:#C25A3E;border:1px solid rgba(194,90,62,.5)}
    .addbtn{background:none;border:1px dashed rgba(255,255,255,0.16);border-radius:4px;color:rgba(255,255,255,0.3);font-family:inherit;font-size:11px;font-weight:600;padding:6px 14px;cursor:pointer;width:100%;transition:all .15s}
    .addbtn:hover{border-color:#D4A24C;color:#D4A24C}
    .brow{display:flex;justify-content:space-between;align-items:center;margin-top:26px}
    .btn{padding:8px 18px;border-radius:4px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;border:none;transition:all .15s}
    .bg{background:#D4A24C;color:#0A1322}
    .bg:hover{background:#E5B45C}
    .bh{background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.16)}
    .bh:hover{color:#fff;border-color:rgba(255,255,255,0.35)}
    .sg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px}
    .sc{border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:8px 11px;background:rgba(255,255,255,0.02)}
    .sk{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.28);margin-bottom:2px}
    .sv{font-size:12px;font-weight:600}
    .gc{border:1px solid rgba(212,162,76,0.2);border-radius:4px;padding:20px;text-align:center;background:rgba(212,162,76,0.04)}
    .gc p{font-size:11px;color:rgba(255,255,255,0.42);margin-bottom:16px;line-height:1.65}
    .bgen{background:#0A1322;color:#fff;border:2px solid #D4A24C;font-size:14px;font-weight:800;padding:11px 34px;border-radius:4px;cursor:pointer;font-family:inherit;transition:all .15s}
    .bgen:hover:not(:disabled){background:#1F2D44}
    .bgen:disabled{opacity:.45;cursor:not-allowed}
    .api-n{font-size:10px;color:rgba(255,255,255,0.18);margin-top:10px}
    .genbox{text-align:center;padding:44px 24px}
    .spin{width:38px;height:38px;border:3px solid rgba(212,162,76,.18);border-top-color:#D4A24C;border-radius:50%;animation:sp .75s linear infinite;margin:0 auto 14px}
    @keyframes sp{to{transform:rotate(360deg)}}
    .gl{font-size:14px;font-weight:700;color:#D4A24C;margin-bottom:4px}
    .gs{font-size:11px;color:rgba(255,255,255,0.32)}
    .oh{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}
    .ot{font-size:13px;font-weight:800}
    .bdl{background:#5B9AA0;color:#fff;border:none;border-radius:4px;font-family:inherit;font-size:11px;font-weight:700;padding:6px 14px;cursor:pointer;transition:background .15s}
    .bdl:hover{background:#4A8A90}
    .otabs{display:flex;border-bottom:1px solid rgba(255,255,255,0.07);margin-bottom:11px}
    .otab{background:none;border:none;border-bottom:2px solid transparent;padding:7px 15px;font-family:inherit;font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);cursor:pointer;transition:all .15s}
    .otab.on{color:#D4A24C;border-bottom-color:#D4A24C}
    .pframe{width:100%;height:600px;border:1px solid rgba(255,255,255,0.09);border-radius:4px;background:#fff}
    .cbox{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,0.07);border-radius:4px;padding:12px;font-family:monospace;font-size:10px;color:rgba(255,255,255,0.55);max-height:560px;overflow-y:auto;white-space:pre-wrap;word-break:break-all}
    .obrow{display:flex;gap:8px;margin-top:14px}
    .errbox{background:rgba(194,90,62,.1);border:1px solid rgba(194,90,62,.5);border-radius:4px;padding:11px 13px;color:#C25A3E;font-size:11px;margin-top:12px;word-break:break-all}
    .dbg{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:4px;padding:9px 12px;font-size:10px;color:rgba(255,255,255,0.4);margin-top:6px;font-family:monospace}
    @media(max-width:580px){.g3,.g2,.fr2,.sg{grid-template-columns:1fr}.body{padding:16px 14px}.hdr{padding:12px 14px 10px}.sbar{padding:0 14px}}
  `;

  return <>
    <style>{css}</style>
    <div>
      <div className="hdr"><div className="ey">MedMasters Collaborative</div><h1>CourseForge</h1><div className="tg">AI-powered course hub builder</div></div>
      <div className="sbar">{LABELS.map((l,i)=><div key={l} className={`stab ${step===i+1?"on":step>i+1?"dn":""}`}>{i+1}. {l}</div>)}</div>
      <div className="body">
        {!gen&&!out&&<>
          {step===1&&<S1/>}
          {step===2&&<S2/>}
          {step===3&&<S3/>}
          {step===4&&<S4/>}
          {step===5&&<S5/>}
          {err&&<div className="errbox">Error: {err}</div>}
          {dbg&&<div className="dbg">API: status={dbg.status} stop={dbg.stop} content=[{dbg.types}]</div>}
          <div className="brow">
            {step>1?<button className="btn bh" onClick={()=>setStep(s=>s-1)}>Back</button>:<span/>}
            {step<5&&<button className="btn bg" onClick={()=>setStep(s=>s+1)}>{step===4?"Review + Generate":"Next"}</button>}
          </div>
        </>}
        {gen&&<div className="genbox"><div className="spin"/><div className="gl">Building {form.courseNumber} {form.courseName}</div><div className="gs">Applying branding and course data...</div></div>}
        {out&&!gen&&<>
          <div className="oh"><div className="ot">{form.courseNumber} {form.courseName} · {form.semester}</div><button className="bdl" onClick={download}>Download HTML</button></div>
          <div className="otabs"><button className={`otab ${tab==="preview"?"on":""}`} onClick={()=>setTab("preview")}>Preview</button><button className={`otab ${tab==="code"?"on":""}`} onClick={()=>setTab("code")}>Code</button></div>
          {tab==="preview"&&<iframe className="pframe" srcDoc={out} title="Course Hub" sandbox="allow-scripts"/>}
          {tab==="code"&&<div className="cbox">{out}</div>}
          <div className="obrow"><button className="btn bh" onClick={()=>{setOut(null);setStep(1);setErr(null);setDbg(null)}}>Start Over</button><button className="btn bh" onClick={()=>{setOut(null);setErr(null);setDbg(null)}}>Edit</button><button className="btn bg" onClick={generate}>Regenerate</button></div>
        </>}
      </div>
    </div>
  </>;
}
