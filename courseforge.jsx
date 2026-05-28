import { useState, useEffect } from "react";

// ── LOGO ──────────────────────────────────────────────────────────────────────
// MedMasters horizontal-light wordmark + three-pillar mark. Brand-canonical hexes.
const Logo = () => (
  <svg viewBox="0 0 720 200" role="img" aria-label="MedMasters Collaborative" style={{display:"block",height:"auto",maxWidth:240,width:"100%"}}>
    <title>MedMasters Collaborative</title>
    <g transform="translate(0, 18)">
      <g transform="translate(60, 0) rotate(8 0 130)">
        <circle cx="0" cy="20" r="10" fill="#0B1530"/>
        <path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#0B1530"/>
      </g>
      <g transform="translate(100, 0)">
        <circle cx="0" cy="10" r="11" fill="#8B3A2E"/>
        <path d="M 0,22 C -11,22 -17,26 -17,34 C -17,52 -14,70 -12,86 C -11,108 -13,122 -15,132 L 15,132 C 13,122 11,108 12,86 C 14,70 17,52 17,34 C 17,26 11,22 0,22 Z" fill="#8B3A2E"/>
      </g>
      <g transform="translate(140, 0) rotate(-8 0 130)">
        <circle cx="0" cy="20" r="10" fill="#C9A14A"/>
        <path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#C9A14A"/>
      </g>
    </g>
    <g transform="translate(240, 0)" fontFamily="Plus Jakarta Sans, system-ui, sans-serif">
      <text x="0" y="118" fontSize="80" fontWeight="800" letterSpacing="-2">
        <tspan fill="#0B1530">Med</tspan><tspan fill="#8B3A2E">Masters</tspan>
      </text>
      <text x="0" y="158" fontSize="15" fontWeight="700" letterSpacing="5" fill="#0B1530" opacity="0.75">COLLABORATIVE</text>
    </g>
  </svg>
);

// ── DATA ──────────────────────────────────────────────────────────────────────

// THEMES: quick-start presets bundling palette + typography + layout choices.
// Updated 2026-05-28: emoji icons removed (per no-emoji spec), palette refs
// remapped to the curated 6-palette library.
const THEMES = [
  { id:"clinical",  name:"Clinical Academic", desc:"Precise, structured. Default for BIO 004 / 431 / 304 / Critical Care.",
    set:{ paletteId:"medmasters",        fontId:"jakarta",  headerId:"structured", cardStyle:"flat",     hover:"lift",       borderW:"1px",  scale:"compact",    mode:"light", vibe:"clinical" }},
  { id:"editorial", name:"Academic Editorial", desc:"Archival, classical. Best for history, art history, classical studies.",
    set:{ paletteId:"pharaohs-atelier",  fontId:"playfair", headerId:"banner",     cardStyle:"outlined", hover:"glow",       borderW:"2px",  scale:"comfortable",mode:"light", vibe:"clinical" }},
  { id:"journalism",name:"Press Newsroom",      desc:"Newspaper grey + orange. Suits journalism, comms, writing.",
    set:{ paletteId:"press-room",        fontId:"sora",     headerId:"minimal",    cardStyle:"flat",     hover:"lift",       borderW:"none", scale:"compact",    mode:"light", vibe:"modern"   }},
  { id:"warm",      name:"Warm Scholar",        desc:"Approachable, mentoring. Soft peach over navy.",
    set:{ paletteId:"linen-indigo",      fontId:"nunito",   headerId:"structured", cardStyle:"bookend",  hover:"colorshift", borderW:"2px",  scale:"comfortable",mode:"light", vibe:"warm"     }},
  { id:"fun",       name:"Comic Studio",        desc:"Bold, student-forward. Marketing/illustration use only.",
    set:{ paletteId:"saturday-funnies",  fontId:"nunito",   headerId:"banner",     cardStyle:"filled",   hover:"colorshift", borderW:"2px",  scale:"comfortable",mode:"light", vibe:"modern"   }},
];

// PALETTES: the curated 6-palette library. Each palette has 4 distinct slots and
// passes WCAG AA on white for body text and warm eyebrow. See compliance-notes.md
// for the full audit. Field Notes is excluded from MedMasters-branded courses
// (BIO 004 / 431 / 304 / TBL Lab / Critical Care) per the standing sage rule.
const PALETTES = [
  { id:"medmasters",        name:"MedMasters",        tag:"Default",    p:"#0B1530", a:"#C9A14A", w:"#8B3A2E", c:"#5B9AA0" },
  { id:"pharaohs-atelier",  name:"Pharaoh's Atelier", tag:"Editorial",  p:"#12343b", a:"#e1b382", w:"#9E6B39", c:"#2d545e" },
  { id:"press-room",        name:"Press Room",        tag:null,         p:"#393939", a:"#FF5A09", w:"#BF5712", c:"#be4f0c" },
  { id:"linen-indigo",      name:"Linen and Indigo",  tag:null,         p:"#3a4660", a:"#ed8a63", w:"#946F4E", c:"#845007" },
  { id:"saturday-funnies",  name:"Saturday Funnies",  tag:"Marketing",  p:"#1400c6", a:"#beef00", w:"#EB0025", c:"#657a00" },
  { id:"field-notes",       name:"Field Notes",       tag:"Non-MM",     p:"#5E7A73", a:"#ff3a22", w:"#897334", c:"#a4893d" },
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
3. No emojis. Use text labels or inline SVG icons.
4. Squared corners (border-radius: 4px) for cards, panels, inputs, buttons.
5. Pill shape (border-radius: 99px) for badges, chips only.
6. WCAG 2.2 AA on every text/background pair. Contrast 4.5:1 minimum for body text; 3:1 for large text and non-text UI components. Verify before output.
7. For pills with Accent (${pal.a}) background: if contrast(${pal.p}, ${pal.a}) < 4.5:1, use white text (#ffffff) instead of Primary. If still <4.5:1, darken the Primary 15% before use.
8. For small-text eyebrows on white: only use Warm (${pal.w}). The Cool slot (${pal.c}) is decorative only, never use as text on white.
9. Semantic HTML required: main, header, nav, aside, footer landmarks. h1>h2>h3 hierarchy. Label-for + input-id pairing. Skip link as first focusable. Visible focus outlines (2px solid, 3:1 vs adjacent).
10. Internal links: target="_top". External: target="_blank" rel="noopener".
11. Include in head: <link rel="stylesheet" href="${gf[b.fontId]||gf.jakarta}">
12. Heading font: ${fp.h}. Body font: ${fp.b}.
13. Before </body>: <script>(function(){function sh(){window.parent.postMessage({id:'cf',height:document.body.scrollHeight},'*');}const ro=new ResizeObserver(sh);ro.observe(document.body);window.addEventListener('load',sh);window.addEventListener('resize',sh);})();</script>
14. prefers-reduced-motion: wrap any transform/transition in @media (prefers-reduced-motion: no-preference).

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
    paletteId:"medmasters", custom:{p:"#0B1530",a:"#C9A14A",t:"#8B3A2E"},
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
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  // Course-context palette gating: Field Notes is reserved for non-MedMasters
  // courses (sage standing rule). When the current course is a MedMasters-branded
  // BIO course, hide Field Notes from the picker.
  const isMMCourse = /^BIO\s?(004|431|304)/.test(form.courseType||"");
  const visiblePalettes = isMMCourse ? PALETTES.filter(p=>p.id!=="field-notes") : PALETTES;

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
    return <div key={p.id} onClick={()=>sb("paletteId",p.id)} role="radio" aria-checked={sel} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("paletteId",p.id);}}} style={{cursor:"pointer",borderRadius:4,overflow:"hidden",border:`2px solid ${sel?"#0B1530":"#DCE0E6"}`,background:"#FFFFFF",boxShadow:sel?"0 4px 12px rgba(11,21,48,0.10)":"0 1px 3px rgba(11,21,48,0.06)"}}>
      <div style={{background:p.p,padding:"14px 16px"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,fontWeight:700,color:p.w,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Solano CC</div>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"#fff",marginBottom:8,lineHeight:1.15}}>Human Anatomy</div>
        <span style={{background:p.a,color:p.p,borderRadius:99,fontSize:10,fontWeight:700,padding:"3px 10px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>BIO 004</span>
      </div>
      <div style={{display:"flex",height:8}} aria-hidden="true">{[p.p,p.a,p.w,p.c].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}</div>
      <div style={{padding:"12px 14px",background:"#FFFFFF",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #ECEFF2"}}>
        <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0B1530"}}>{p.name}</div>{p.tag&&<div style={{fontSize:12,color:"#5A6573",fontWeight:600,marginTop:2}}>{p.tag}</div>}</div>
        {sel&&<span style={{background:"#0B1530",color:"#fff",borderRadius:99,fontSize:11,fontWeight:700,padding:"3px 10px",fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:"0.05em"}}>SELECTED</span>}
      </div>
    </div>;
  };

  const FontCard=({f})=>{
    const sel=b.fontId===f.id;
    return <div key={f.id} onClick={()=>sb("fontId",f.id)} role="radio" aria-checked={sel} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("fontId",f.id);}}} style={{cursor:"pointer",borderRadius:4,padding:"16px 18px",border:`2px solid ${sel?"#0B1530":"#DCE0E6"}`,background:sel?"#EDF1F3":"#FFFFFF"}}>
      <div style={{fontFamily:`'${f.h}',Georgia,serif`,fontSize:24,fontWeight:800,color:"#0B1530",marginBottom:6,lineHeight:1.1,letterSpacing:"-0.01em"}}>{f.h.split(" ")[0]}</div>
      <div style={{fontFamily:`'${f.h}',Georgia,serif`,fontSize:18,fontWeight:800,color:"#0B1530",marginBottom:8,lineHeight:1.15}}>Human Anatomy</div>
      <div style={{fontFamily:`'${f.b}',Georgia,serif`,fontSize:14,color:"#5A6573",lineHeight:1.55,marginBottom:12}}>Active recall and clinical reasoning.</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:"#5A6573",textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.h} + {f.b}</span>
        {f.tag&&<span style={{background:"rgba(139,58,46,0.10)",color:"#8B3A2E",borderRadius:99,fontSize:10,fontWeight:700,padding:"3px 9px",fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:"0.05em"}}>{f.tag}</span>}
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
    return <div key={hs.id} onClick={()=>sb("headerId",hs.id)} role="radio" aria-checked={sel} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("headerId",hs.id);}}} style={{cursor:"pointer",borderRadius:4,overflow:"hidden",border:`2px solid ${sel?"#0B1530":"#DCE0E6"}`,background:"#FFFFFF",boxShadow:sel?"0 4px 12px rgba(11,21,48,0.10)":"0 1px 3px rgba(11,21,48,0.06)"}}>
      {M[hs.id]}
      <div style={{padding:"12px 14px",background:"#FFFFFF",borderTop:"1px solid #ECEFF2"}}><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0B1530"}}>{hs.name}</div><div style={{fontSize:13,color:"#5A6573",marginTop:3,lineHeight:1.45}}>{hs.desc}</div>{hs.tag&&<div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"#8B3A2E",fontWeight:700,marginTop:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>{hs.tag}</div>}</div>
    </div>;
  };

  const Pills=({opts,active,onSel})=>(
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {opts.map(o=>{const sel=active===o.id;return(
        <button key={o.id} type="button" onClick={()=>onSel(o.id)} aria-pressed={sel} style={{padding:"7px 16px",borderRadius:99,border:`1px solid ${sel?"#0B1530":"#DCE0E6"}`,background:sel?"#0B1530":"#FFFFFF",color:sel?"#FFFFFF":"#0B1530",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
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

    return <div style={{border:"1px solid #DCE0E6",borderRadius:4,overflow:"hidden",marginBottom:28,background:"#FFFFFF"}}>
      <div style={{background:"#EDF1F3",padding:"10px 16px",borderBottom:"1px solid #DCE0E6",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:"#8B3A2E",textTransform:"uppercase",letterSpacing:"0.1em"}}>Live Preview</span>
        <span style={{fontSize:13,color:"#5A6573"}}>Changes update instantly</span>
        <span style={{marginLeft:"auto",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,padding:"3px 10px",borderRadius:99,background:"#FFFFFF",color:"#0B1530",fontWeight:700,border:"1px solid #DCE0E6",letterSpacing:"0.05em"}}>{b.mode.toUpperCase()}</span>
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
    <div className="sw"><div className="sl">Quick Themes <span style={{opacity:.6,fontWeight:400,letterSpacing:0,fontSize:11,textTransform:"none"}}>(applies all settings at once)</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {THEMES.map(t=><button key={t.id} type="button" onClick={()=>applyTheme(t)} style={{padding:"14px 16px",borderRadius:4,cursor:"pointer",border:"1px solid #DCE0E6",background:"#FFFFFF",textAlign:"left",fontFamily:"inherit"}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0B1530",marginBottom:4}}>{t.name}</div>
          <div style={{fontSize:13,color:"#5A6573",lineHeight:1.45}}>{t.desc}</div>
        </button>)}
      </div>
    </div>

    <div className="sw">
      <div className="sl">Color Palette {isMMCourse&&<span style={{opacity:.6,fontWeight:400,letterSpacing:0,fontSize:11,textTransform:"none"}}>(Field Notes hidden for MedMasters courses)</span>}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flex:"1 1 320px"}}>
          <div style={{display:"flex",height:48,width:160,borderRadius:4,overflow:"hidden",border:"1px solid #DCE0E6",flexShrink:0}} aria-hidden="true">
            {[pal.p,pal.a,pal.w,pal.c].map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
          </div>
          <div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,color:"#0B1530",marginBottom:2}}>{pal.name||"Custom"}</div>
            <div style={{fontSize:13,color:"#5A6573"}}>{pal.tag?`${pal.tag}. `:""}Click Browse Library to see all options.</div>
          </div>
        </div>
        <button type="button" onClick={()=>setPaletteOpen(true)} className="btn bh" style={{whiteSpace:"nowrap"}}>Browse Library</button>
      </div>
    </div>

    <div className="sw">
      <div className="sl">Custom Colors <span style={{opacity:.6,fontWeight:400,letterSpacing:0,fontSize:11,textTransform:"none"}}>(enter hex codes directly)</span></div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",alignItems:"flex-end"}}>
        {[["Primary","p"],["Accent","a"],["Tertiary","t"]].map(([label,key])=><div key={key} style={{flex:"1 1 160px"}}>
          <label htmlFor={`cf-cust-${key}`} style={{display:"block",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,color:"#5A6573",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{label}</label>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{position:"relative",width:38,height:38,flexShrink:0,borderRadius:4,overflow:"hidden",border:"1px solid #DCE0E6"}}>
              <div style={{width:"100%",height:"100%",background:b.custom[key]}}/>
              <input type="color" aria-label={`${label} color picker`} value={b.custom[key]} onChange={e=>sb("custom",{...b.custom,[key]:e.target.value})} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
            </div>
            <input id={`cf-cust-${key}`} type="text" value={b.custom[key]} onChange={e=>{if(/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value))sb("custom",{...b.custom,[key]:e.target.value});}} style={{flex:1,padding:"8px 10px",background:"#FFFFFF",border:"1px solid #DCE0E6",borderRadius:4,fontFamily:"'SF Mono',Menlo,Consolas,monospace",fontSize:14,color:"#0B1530",outline:"none"}}/>
          </div>
        </div>)}
        <button type="button" onClick={()=>sb("paletteId","custom")} aria-pressed={b.paletteId==="custom"} style={{padding:"10px 16px",borderRadius:4,border:`1px solid ${b.paletteId==="custom"?"#0B1530":"#DCE0E6"}`,background:b.paletteId==="custom"?"#0B1530":"#FFFFFF",color:b.paletteId==="custom"?"#FFFFFF":"#0B1530",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
          {b.paletteId==="custom"?"Using Custom":"Use Custom"}
        </button>
      </div>
    </div>

    <div className="sw"><div className="sl">Page Mode</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}} role="radiogroup" aria-label="Page mode">
        {PAGE_MODES.map(m=>{const sel=b.mode===m.id;return <div key={m.id} onClick={()=>sb("mode",m.id)} role="radio" aria-checked={sel} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("mode",m.id);}}} style={{flex:"1 1 180px",padding:"14px 16px",borderRadius:4,cursor:"pointer",border:`2px solid ${sel?"#0B1530":"#DCE0E6"}`,background:sel?"#EDF1F3":"#FFFFFF"}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0B1530",marginBottom:4}}>{m.name}</div>
          <div style={{fontSize:13,color:"#5A6573",lineHeight:1.45}}>{m.desc}</div>
        </div>;})}
      </div>
    </div>

    <div className="sw"><div className="sl">Typography</div><div className="g2">{FONT_PAIRS.map(f=><FontCard key={f.id} f={f}/>)}</div></div>

    <div className="sw"><div className="sl">Header Layout</div><div className="g2">{HEADER_STYLES.map(hs=><HdrCard key={hs.id} hs={hs}/>)}</div></div>

    <div className="sw"><div className="sl">Components + Details</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        {[["Card Style",CARD_STYLES,b.cardStyle,v=>sb("cardStyle",v)],["Hover Effect",HOVER_OPTS,b.hover,v=>sb("hover",v)],["Border Weight",BORDER_OPTS,b.borderW,v=>sb("borderW",v)],["Font Scale",SCALE_OPTS,b.scale,v=>sb("scale",v)]].map(([label,opts,active,onSel])=><div key={label}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,color:"#5A6573",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{label}</div>
          <Pills opts={opts} active={active} onSel={onSel}/>
        </div>)}
      </div>
    </div>

    <div className="sw"><div className="sl">Content Tone</div><div className="g2" role="radiogroup" aria-label="Content tone">{VIBES.map(v=>{const sel=b.vibe===v.id;return <div key={v.id} onClick={()=>sb("vibe",v.id)} role="radio" aria-checked={sel} tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("vibe",v.id);}}} style={{cursor:"pointer",borderRadius:4,padding:"14px 16px",border:`2px solid ${sel?"#0B1530":"#DCE0E6"}`,background:sel?"#EDF1F3":"#FFFFFF"}}>
      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0B1530",marginBottom:6}}>{v.name}</div>
      <div style={{fontSize:13,color:"#5A6573",lineHeight:1.55}}>{v.s}</div>
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
    <div className="fg"><label>Meeting Days</label><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:4}} role="group" aria-label="Meeting days">
      {DAYS.map(d=>{const on=form.meetingDays.includes(d);return <button key={d} type="button" aria-pressed={on} onClick={()=>setForm(f=>({...f,meetingDays:f.meetingDays.includes(d)?f.meetingDays.filter(x=>x!==d):[...f.meetingDays,d]}))} style={{padding:"8px 16px",borderRadius:99,border:`1px solid ${on?"#0B1530":"#DCE0E6"}`,background:on?"#0B1530":"#FFFFFF",color:on?"#FFFFFF":"#0B1530",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{d}</button>;})}
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
    <div className="wt"><span>Total:</span><span className={`wb ${tot===100?"wok":"wwn"}`}>{tot}%</span></div>
    <button className="addbtn" type="button" onClick={()=>setForm(f=>({...f,assessments:[...f.assessments,{name:"",weight:0}]}))}>+ Add Assessment</button>
  </>;

  const S5=()=><>
    <div className="st">Review + Generate</div><div className="ss">Confirm and build.</div>
    <div style={{border:"1px solid #DCE0E6",borderRadius:4,padding:"16px 18px",background:"#EDF1F3",marginBottom:20,display:"flex",gap:24,flexWrap:"wrap"}}>
      {[["Palette",pal.name],["Fonts",fp.h],["Mode",PAGE_MODES.find(m=>m.id===b.mode)?.name],["Card",CARD_STYLES.find(c=>c.id===b.cardStyle)?.name],["Tone",VIBES.find(v=>v.id===b.vibe)?.name]].map(([k,v])=><div key={k}><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:"#5A6573",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>{k}</div><div style={{fontSize:14,fontWeight:600,color:"#0B1530"}}>{v}</div></div>)}
    </div>
    <div className="sg">{[["Course",`${form.courseNumber} ${form.courseName}`],["School",form.school],["Semester",form.semester],["Type",form.courseType.split(" – ")[1]||form.courseType],["Dates",`${form.startDate} to ${form.endDate}`],["Days",form.meetingDays.join(", ")||"TBD"],["Assessments",`${form.assessments.length} items, ${tot}%`],["Modality",form.modality]].map(([k,v])=><div className="sc" key={k}><div className="sk">{k}</div><div className="sv">{v||"n/a"}</div></div>)}</div>
    <div className="fg"><label>Learning Objectives (optional)</label><textarea value={form.objectives} onChange={e=>u("objectives",e.target.value)} placeholder="Leave blank to auto-generate, or enter one per line..."/></div>
    <div className="gc">
      <p>CourseForge applies your branding and course data to generate a complete, push-ready HTML file.</p>
      <button className="bgen" onClick={generate} disabled={gen||tot!==100}>{gen?"Building...":"Generate Course Hub"}</button>
      {tot!==100&&<div style={{fontSize:13,color:"#8B3A2E",marginTop:10,fontWeight:600}}>Fix assessments to total 100%.</div>}
      <div className="api-n">Powered by Claude Sonnet via Anthropic API</div>
    </div>
  </>;

  // ── CSS (light-mode, MedMasters-branded, comfortable reading sizes) ──────────
  const css=`
    :root {
      --navy: #0B1530;
      --navy-deep: #050913;
      --navy-tint: #EDF1F3;
      --gold: #C9A14A;
      --terra-dark: #8B3A2E;
      --teal: #5B9AA0;
      --white: #FFFFFF;
      --offwhite: #FAFAF9;
      --rule: #DCE0E6;
      --rule-soft: #ECEFF2;
      --ink: #0B1530;
      --ink-muted: #5A6573;
    }
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;font-style:normal}
    body{font-family:'Atkinson Hyperlegible','Plus Jakarta Sans',system-ui,sans-serif;background:var(--offwhite);min-height:100vh;color:var(--ink);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}
    a{color:var(--navy);text-underline-offset:3px;text-decoration-color:var(--gold)}
    a:hover,a:focus-visible{color:var(--navy-deep)}
    :focus-visible{outline:2px solid var(--navy);outline-offset:3px;box-shadow:0 0 0 4px var(--gold);border-radius:4px}
    a.skip{position:absolute;left:-9999px;top:8px;background:var(--navy);color:var(--white);padding:8px 14px;border-radius:4px;font-weight:700;font-size:14px;z-index:100}
    a.skip:focus{left:16px}

    .hdr{background:var(--white);padding:24px 32px 22px;border-bottom:1px solid var(--rule)}
    .hdr-inner{max-width:1100px;margin:0 auto}
    .hdr .logo-mark{margin-bottom:18px}
    .hdr .logo-mark svg{display:block;height:auto;max-width:220px;width:100%}
    .ey{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--terra-dark);margin-bottom:8px}
    .hdr h1{font-family:'Plus Jakarta Sans',sans-serif;font-size:38px;font-weight:800;line-height:1.1;letter-spacing:-0.01em;margin-bottom:6px}
    .hdr h1 .course{color:var(--navy)}
    .hdr h1 .forge{color:var(--terra-dark)}
    .tg{font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:600;color:var(--terra-dark)}

    .sbar{display:flex;padding:0 32px;background:var(--white);border-bottom:1px solid var(--rule);overflow-x:auto}
    .sbar-inner{display:flex;max-width:1100px;margin:0 auto;width:100%}
    .stab{padding:14px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.03em;color:var(--ink-muted);border-bottom:2px solid transparent;white-space:nowrap}
    .stab.on{color:var(--navy);border-bottom-color:var(--gold)}
    .stab.dn{color:var(--navy)}

    .body{padding:32px;max-width:1100px;margin:0 auto}
    .st{font-family:'Plus Jakarta Sans',sans-serif;font-size:26px;font-weight:800;color:var(--navy);margin-bottom:4px;letter-spacing:-0.01em}
    .ss{font-size:15px;color:var(--ink-muted);margin-bottom:28px;line-height:1.5}
    .sw{margin-bottom:32px;background:var(--white);border:1px solid var(--rule);border-radius:4px;padding:20px 22px}
    .sl{font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--terra-dark);margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--rule-soft)}

    .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}

    .fg{margin-bottom:16px}
    .fg label{display:block;font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:6px}
    .fg input,.fg select,.fg textarea{width:100%;padding:10px 12px;background:var(--white);border:1px solid var(--rule);border-radius:4px;font-family:inherit;font-size:15px;color:var(--ink);outline:none;transition:border-color .15s}
    .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(201,161,74,0.25)}
    .fg textarea{min-height:100px;resize:vertical;line-height:1.5}

    .fr2{display:grid;grid-template-columns:1fr 1fr;gap:14px}

    .tc{padding:14px 16px;border:1px solid var(--rule);border-radius:4px;cursor:pointer;background:var(--white);transition:border-color .15s,box-shadow .15s}
    .tc:hover{border-color:var(--gold)}
    .tc.sel{border-color:var(--navy);background:var(--navy-tint)}
    .tc-n{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;color:var(--navy)}
    .tc-s{font-size:13px;color:var(--ink-muted);margin-top:3px;line-height:1.45}

    .at{border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:10px;background:var(--white)}
    .ah{display:grid;grid-template-columns:1fr 96px 36px;gap:10px;padding:10px 14px;background:var(--navy-tint);border-bottom:1px solid var(--rule)}
    .ah span{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-muted)}
    .ar{display:grid;grid-template-columns:1fr 96px 36px;gap:10px;padding:10px 14px;align-items:center;border-bottom:1px solid var(--rule-soft)}
    .ar:last-child{border-bottom:none}
    .ar input{padding:8px 10px;background:var(--white);border:1px solid var(--rule);border-radius:4px;color:var(--ink);font-family:inherit;font-size:14px;width:100%;outline:none}
    .ar input:focus{border-color:var(--navy)}
    .rb{background:none;border:1px solid var(--rule);color:var(--ink-muted);cursor:pointer;font-size:16px;width:32px;height:32px;border-radius:4px;transition:all .15s;line-height:1}
    .rb:hover{color:var(--terra-dark);border-color:var(--terra-dark)}

    .wt{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:14px;font-size:14px;color:var(--ink-muted)}
    .wb{padding:4px 14px;border-radius:99px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700}
    .wok{background:rgba(91,154,160,0.15);color:#2E6E75;border:1px solid var(--teal)}
    .wwn{background:rgba(139,58,46,0.10);color:var(--terra-dark);border:1px solid var(--terra-dark)}

    .addbtn{background:var(--white);border:1px dashed var(--rule);border-radius:4px;color:var(--ink-muted);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;padding:10px 18px;cursor:pointer;width:100%;transition:all .15s}
    .addbtn:hover{border-color:var(--navy);color:var(--navy);background:var(--navy-tint)}

    .brow{display:flex;justify-content:space-between;align-items:center;margin-top:32px;padding-top:20px;border-top:1px solid var(--rule)}
    .btn{padding:12px 24px;border-radius:4px;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:700;cursor:pointer;border:1px solid transparent;transition:all .15s}
    .bg{background:var(--navy);color:var(--white);border-color:var(--navy)}
    .bg:hover{background:var(--navy-deep);border-color:var(--navy-deep)}
    .bh{background:var(--white);color:var(--navy);border-color:var(--rule)}
    .bh:hover{border-color:var(--navy)}

    .sg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}
    .sc{border:1px solid var(--rule);border-radius:4px;padding:12px 14px;background:var(--white)}
    .sk{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-muted);margin-bottom:4px}
    .sv{font-size:14px;font-weight:600;color:var(--navy)}

    .gc{border:1px solid var(--gold);border-radius:4px;padding:28px;text-align:center;background:var(--white)}
    .gc p{font-size:15px;color:var(--ink-muted);margin-bottom:20px;line-height:1.55;max-width:520px;margin-left:auto;margin-right:auto}
    .bgen{background:var(--navy);color:var(--white);border:2px solid var(--gold);font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:800;padding:14px 42px;border-radius:4px;cursor:pointer;transition:all .15s}
    .bgen:hover:not(:disabled){background:var(--navy-deep)}
    .bgen:disabled{opacity:.45;cursor:not-allowed}
    .api-n{font-size:12px;color:var(--ink-muted);margin-top:14px}

    .genbox{text-align:center;padding:60px 24px;background:var(--white);border:1px solid var(--rule);border-radius:4px}
    .spin{width:44px;height:44px;border:3px solid var(--rule);border-top-color:var(--gold);border-radius:50%;animation:sp .75s linear infinite;margin:0 auto 18px}
    @keyframes sp{to{transform:rotate(360deg)}}
    .gl{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:700;color:var(--navy);margin-bottom:6px}
    .gs{font-size:14px;color:var(--ink-muted)}

    .oh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px}
    .ot{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;color:var(--navy)}
    .bdl{background:var(--gold);color:var(--navy);border:none;border-radius:4px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;padding:10px 18px;cursor:pointer;transition:background .15s}
    .bdl:hover{background:#B8924A}

    .otabs{display:flex;border-bottom:1px solid var(--rule);margin-bottom:14px}
    .otab{background:none;border:none;border-bottom:2px solid transparent;padding:10px 18px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:700;color:var(--ink-muted);cursor:pointer;transition:all .15s}
    .otab.on{color:var(--navy);border-bottom-color:var(--gold)}

    .pframe{width:100%;height:680px;border:1px solid var(--rule);border-radius:4px;background:var(--white)}
    .cbox{background:var(--navy-tint);border:1px solid var(--rule);border-radius:4px;padding:16px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;color:var(--navy);max-height:620px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;line-height:1.5}

    .obrow{display:flex;gap:10px;margin-top:18px}
    .errbox{background:rgba(139,58,46,0.08);border:1px solid var(--terra-dark);border-radius:4px;padding:14px 16px;color:var(--terra-dark);font-size:14px;margin-top:14px;word-break:break-all;line-height:1.5}
    .dbg{background:var(--navy-tint);border:1px solid var(--rule);border-radius:4px;padding:12px 14px;font-size:13px;color:var(--ink-muted);margin-top:8px;font-family:'SF Mono',Menlo,Consolas,monospace}

    /* Palette browse modal */
    .pmodal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px}
    .pmodal-backdrop{position:absolute;inset:0;background:rgba(11,21,48,0.55)}
    .pmodal-panel{position:relative;background:var(--offwhite);border-radius:4px;max-width:1080px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 50px rgba(11,21,48,0.30);border:1px solid var(--rule)}
    .pmodal-header{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:22px 28px 16px;border-bottom:1px solid var(--rule);position:sticky;top:0;background:var(--offwhite);z-index:1}
    .pmodal-header h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:800;color:var(--navy);margin-bottom:4px}
    .pmodal-header .sub{font-size:14px;color:var(--ink-muted)}
    .pmodal-close{background:transparent;border:1px solid var(--rule);color:var(--navy);width:40px;height:40px;border-radius:4px;font-size:22px;line-height:1;cursor:pointer;flex-shrink:0;font-family:inherit}
    .pmodal-close:hover,.pmodal-close:focus-visible{border-color:var(--navy);background:var(--white)}
    .pmodal-body{padding:24px 28px 32px}
    .pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
    .ptile{background:var(--white);border:1px solid var(--rule);border-radius:4px;overflow:hidden;cursor:pointer;box-shadow:0 1px 3px rgba(11,21,48,0.06);display:flex;flex-direction:column}
    .ptile:hover,.ptile:focus-visible{border-color:var(--gold)}
    .ptile.sel{border-color:var(--navy);border-width:2px}
    .ptile-swatches{display:flex;height:96px}
    .ptile-swatch{flex:1;position:relative}
    .ptile-swatch .role{position:absolute;bottom:6px;left:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase}
    .ptile-meta{padding:14px 16px;flex:1;display:flex;flex-direction:column}
    .ptile-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;color:var(--navy);margin-bottom:4px}
    .ptile-tag{font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--terra-dark);margin-bottom:8px}
    .ptile-select{margin-top:auto;padding:8px 12px;border-radius:4px;background:var(--white);color:var(--navy);border:1px solid var(--rule);font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;width:100%}
    .ptile-select:hover{border-color:var(--navy)}
    .ptile.sel .ptile-select{background:var(--navy);color:var(--white);border-color:var(--navy)}

    @media (prefers-reduced-motion: no-preference) {
      .tc,.sw,.btn,.bgen,.bdl,.addbtn,.ptile{transition:all .2s ease}
    }
    @media(max-width:720px){.g3,.g2,.fr2,.sg{grid-template-columns:1fr}.body{padding:20px 16px}.hdr{padding:18px 16px 14px}.hdr h1{font-size:30px}.sbar{padding:0 8px}.stab{padding:12px 12px;font-size:12px}.pgrid{grid-template-columns:1fr}}
  `;

  return <>
    <style>{css}</style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Atkinson+Hyperlegible:wght@400;700&display=swap"/>
    <a href="#cf-main" className="skip">Skip to main content</a>
    <div>
      <header className="hdr">
        <div className="hdr-inner">
          <div className="logo-mark"><Logo/></div>
          <div className="ey">MedMasters Collaborative</div>
          <h1><span className="course">Course</span><span className="forge">Forge</span></h1>
          <div className="tg">AI-powered course hub builder</div>
        </div>
      </header>
      <nav className="sbar" aria-label="Workflow steps"><div className="sbar-inner">{LABELS.map((l,i)=><div key={l} className={`stab ${step===i+1?"on":step>i+1?"dn":""}`}>{i+1}. {l}</div>)}</div></nav>
      <main id="cf-main" className="body">
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
      </main>
    </div>
    {paletteOpen&&<div className="pmodal" role="dialog" aria-modal="true" aria-labelledby="pmodal-title" onKeyDown={e=>{if(e.key==="Escape")setPaletteOpen(false)}}>
      <div className="pmodal-backdrop" onClick={()=>setPaletteOpen(false)}/>
      <div className="pmodal-panel">
        <div className="pmodal-header">
          <div>
            <h2 id="pmodal-title">Color Palette Library</h2>
            <div className="sub">{visiblePalettes.length} curated palettes. Each one passes WCAG 2.2 AA on white at small-text size. Click to select.</div>
          </div>
          <button className="pmodal-close" type="button" aria-label="Close library" onClick={()=>setPaletteOpen(false)}>&times;</button>
        </div>
        <div className="pmodal-body">
          <div className="pgrid" role="radiogroup" aria-label="Choose palette">
            {visiblePalettes.map(p=>{
              const sel=b.paletteId===p.id;
              return <article key={p.id} className={`ptile ${sel?"sel":""}`} role="radio" aria-checked={sel} tabIndex={0}
                onClick={()=>{sb("paletteId",p.id);setPaletteOpen(false)}}
                onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();sb("paletteId",p.id);setPaletteOpen(false)}}}>
                <div className="ptile-swatches" aria-hidden="true">
                  {[["Primary",p.p],["Accent",p.a],["Warm",p.w],["Cool",p.c]].map(([role,c])=>{
                    const rgb=parseInt(c.replace("#",""),16);
                    const r=(rgb>>16)&255,g=(rgb>>8)&255,bl=rgb&255;
                    const lin=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};
                    const L=0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bl);
                    const txt=L>0.179?"rgba(0,0,0,0.85)":"rgba(255,255,255,0.96)";
                    return <div key={role} className="ptile-swatch" style={{background:c}}><span className="role" style={{color:txt}}>{role}</span></div>;
                  })}
                </div>
                <div className="ptile-meta">
                  {p.tag&&<div className="ptile-tag">{p.tag}</div>}
                  <div className="ptile-name">{p.name}</div>
                  <button type="button" className="ptile-select" tabIndex={-1}>{sel?"Selected":"Select"}</button>
                </div>
              </article>;
            })}
          </div>
        </div>
      </div>
    </div>}
  </>;
}
