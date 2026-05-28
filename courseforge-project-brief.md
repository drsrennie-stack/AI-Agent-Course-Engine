# CourseForge — Project Brief
**MedMasters Collaborative · AI Course Infrastructure Builder**
*Last updated: May 2026 · Owner: Dr. Sharilyn Rennie (Scrubs)*

---

## What This Is

CourseForge is a React-based AI-powered tool that takes a professor's course parameters and generates complete, push-ready single-file HTML course hub pages. It lives as a Claude artifact and calls the Anthropic API internally.

**Phase 1:** Built for Scrubs — defaults to her design system, her three course types, her pedagogy. She uses it to eliminate semester-prep grunt work.

**Phase 2:** Productized under MedMasters Launch Studio — other professors configure their own branding, the tool generates their infrastructure. Likely a subscription or per-course credit model on Kajabi.

---

## Current Build State (as of this conversation)

### What works
- 5-step form flow: Branding → Identity → Schedule → Assessments → Generate
- Live brand preview that updates in real time as options are selected
- Quick Themes (5 presets that apply all settings at once)
- Palette selector with 6 presets + custom hex input (3 color pickers with text field entry)
- Page Mode: Light / Dark / Student Toggle (toggle generates a moon/sun button in the HTML)
- Font selector with 4 pairs — fonts load via `useEffect` + document.head link injection
- Header layout selector with 4 options (live HTML mockups as thumbnails)
- Card style: Flat / Bookend (side rails + lift shadow) / Outlined / Filled
- Hover effects: None / Lift / Glow / Color Shift
- Border weight: None / Thin / Medium / Bold
- Font scale: Compact (default, smallest comfortable) / Comfortable / Spacious
- Content tone: Clinical Academic / Modern EdTech / Warm Scholar / Bold Systematic
- All branding selections flow into the API system prompt as explicit instructions
- Download button outputs named HTML file
- Preview tab (iframe srcDoc) + Code tab (raw HTML)
- Debug info bar shows API response status, stop reason, and content types when there's an error
- Pre-filled with BIO 004 Summer 2026 defaults

### Known issues / things to fix next
- Font rendering in preview cards may lag until Google Fonts loads (fonts are distinct but load async)
- Generated HTML occasionally wraps in markdown fences if the model ignores the "no fences" instruction — code already strips these but worth monitoring
- The `max_tokens: 4096` cap may cut off very long generated pages — consider bumping to 8192 for complex courses or using streaming
- The bookend card style preview in the live preview strip could be more dramatic — the CSS is correct but the mini scale reduces the visual impact
- No save/load state yet — refreshing loses all form data
- No way to iterate on just one section of the generated page without full regeneration

---

## Architecture

### Stack
- React (artifact, no build step)
- Anthropic API via `fetch` to `https://api.anthropic.com/v1/messages`
- Model: `claude-sonnet-4-20250514`
- Google Fonts via dynamic `<link>` injection in `useEffect`
- No external state management, no localStorage (artifact limitation)

### Component structure
```
CourseForge()
  ├── State: [step, branding, form, gen, out, tab, err, dbg]
  ├── useEffect → loads all Google Fonts for preview rendering
  ├── getPal(b) → resolves effective palette (preset or custom)
  ├── buildSys(b) → builds system prompt from branding state
  ├── buildUser(form) → builds user prompt from course form
  ├── generate() → fetch call, error handling, debug info
  ├── PalCard(p) → mini palette preview card with mockup header
  ├── FontCard(f) → font pair card with live rendered text
  ├── HdrCard(hs) → header layout card with actual HTML mockup
  ├── Pills(opts, active, onSel) → reusable pill button group
  ├── Preview() → live brand preview strip at top of Step 1
  └── Step renderers: S1 (Branding), S2 (Identity), S3 (Schedule), S4 (Assessments), S5 (Generate)
```

### How branding feeds into generation
`buildSys(b)` constructs the system prompt by resolving:
- Effective palette (preset or custom hex)
- Font pair + Google Fonts URL
- Exact font sizes from scale setting
- Page mode instructions (light/dark/toggle JS)
- Header layout instructions (detailed CSS + structure)
- Card style instructions (exact CSS for flat/bookend/outlined/filled)
- Hover effect instructions
- Content tone + sample sentence

All values are injected as explicit literal instructions — hex codes, pixel values, CSS rules — so the model generates exactly what was configured.

---

## Design System (Scrubs Canonical)

### Colors
```
navy:         #0A1322  (primary)
navy-mid:     #1F2D44
gold:         #D4A24C  (accent)
gold-bright:  #E5B45C
terra:        #C25A3E  (warm/anatomy)
teal:         #5B9AA0  (cool/physiology)
white:        #ffffff  (default page bg)
rule:         #B8BEC8
rule-soft:    #DCE0E6
ink-muted:    #3D4860
```

### Typography
- Headings/UI: **Plus Jakarta Sans** (400/600/700/800)
- Body reading: **Atkinson Hyperlegible** (400/700)

### Layout rules
- Squared corners (border-radius: 4px) for all cards, panels, inputs, buttons
- Pill shape (border-radius: 99px) for badges, chips, tags only
- No italics anywhere — `font-style: normal` globally
- No em dashes — use commas, colons, or rewrite
- No heavy drop shadows — max card shadow: `0 1px 3px rgba(10,19,34,0.08)`
- No pastel tinted backgrounds in bordered callout boxes
- White (#ffffff) default page background
- Primary CTA buttons: navy fill, white text, hover navy-mid
- WCAG 2.2 AA required on all generated output

### Semantic color roles
- Anatomy content: terra (#C25A3E)
- Physiology content: teal (#5B9AA0)
- Lab tags: terra
- Admin/meta: #2C3E50
- Required items: terra
- Recommended items: gold
- Optional items: navy-mid

### iframe/Kajabi rules (all generated HTML must include)
```html
<!-- Before </body> -->
<script>
(function(){
  function sh(){window.parent.postMessage({id:'cf',height:document.body.scrollHeight},'*');}
  const ro=new ResizeObserver(sh);ro.observe(document.body);
  window.addEventListener('load',sh);window.addEventListener('resize',sh);
})();
</script>
```
- Internal/same-domain links: `target="_top"`
- External links: `target="_blank" rel="noopener"`

---

## Course Types (keep these distinct)

| Course | Key constraints |
|--------|----------------|
| **BIO 004 — Human Anatomy** | Pure anatomy ONLY, no physiology. 8-week summer TBL. Mon–Thu. 5 lab exams, midterm week 4, final week 8. |
| **BIO 431 — A&P** | Both anatomy and physiology. TBL format with lab. |
| **BIO 304 — A&P Online** | Online asynchronous ONLY. No TBL, no in-person sessions, no team activities. |

**Instructor byline on all student-facing materials:** "Dr. Sharilyn Rennie" with NO credential suffix. Never append ", ND" or ", MD".

---

## Data: Palette Presets

```js
{ id:"medmasters",  p:"#0A1322", a:"#D4A24C", w:"#C25A3E", c:"#5B9AA0" }  // Default
{ id:"pacific",     p:"#073B5C", a:"#1FB5C7", w:"#E05A4E", c:"#3DBCAD" }
{ id:"forest",      p:"#1A3D2B", a:"#D9882A", w:"#B84C3C", c:"#6DAF8E" }
{ id:"royal",       p:"#1E1456", a:"#E8B84B", w:"#D46B6B", c:"#7B85C4" }
{ id:"carbon",      p:"#0F1117", a:"#3B7DD8", w:"#E05A44", c:"#48B09E" }
{ id:"terracotta",  p:"#2C1810", a:"#D4A840", w:"#C96A45", c:"#87A878" }
```

Custom palette is supported via `paletteId: "custom"` + `custom: { p, a, t }` in branding state.

## Data: Font Pairs

```js
{ id:"jakarta",  h:"Plus Jakarta Sans", b:"Atkinson Hyperlegible" }  // Default
{ id:"playfair", h:"Playfair Display",  b:"Lora"                  }  // Editorial
{ id:"sora",     h:"Sora",             b:"Source Sans 3"         }
{ id:"nunito",   h:"Nunito Sans",      b:"Merriweather"          }  // Friendly
```

## Data: Quick Themes

Each theme applies a full set of branding defaults at once:

| Theme | Palette | Font | Header | Cards | Hover | Mode |
|-------|---------|------|--------|-------|-------|------|
| Clinical Academic | MedMasters | Jakarta | Structured | Flat | Lift | Light |
| Modern EdTech | Carbon | Sora | Minimal | Flat | Lift | Dark |
| Warm Scholar | Forest | Nunito | Structured | Bookend | Color Shift | Light |
| Academic Editorial | Royal | Playfair | Banner | Outlined | Glow | Light |
| Fun & Engaging | Pacific | Nunito | Banner | Filled | Color Shift | Light |

---

## Branding State Shape

```js
{
  paletteId: "medmasters",          // or "custom"
  custom: { p:"#0A1322", a:"#D4A24C", t:"#C25A3E" },
  fontId: "jakarta",
  headerId: "structured",           // structured | banner | minimal | split
  vibe: "clinical",                 // clinical | modern | warm | bold
  mode: "light",                    // light | dark | toggle
  cardStyle: "flat",                // flat | bookend | outlined | filled
  hover: "lift",                    // none | lift | glow | colorshift
  borderW: "1px",                   // none | 1px | 2px | 4px
  scale: "compact",                 // compact | comfortable | spacious
}
```

## Form State Shape

```js
{
  courseName, courseNumber, school, instructor, semester,
  courseType,   // one of the 4 CTYPES
  modality,     // one of MODALITIES
  startDate, endDate, weeks,
  meetingDays,  // array of day strings
  meetingTime, location, email, officeHours, objectives,
  assessments,  // [{ name, weight }]
}
```

---

## Font Scale Values (injected into system prompt)

| Scale | body | labels | sm | h1 | h2 | h3 |
|-------|------|--------|----|----|----|----|
| compact | 13px | 11px | 10px | 26px | 17px | 14px |
| comfortable | 15px | 12px | 11px | 30px | 20px | 16px |
| spacious | 16px | 13px | 11px | 34px | 22px | 17px |

Default is **compact** (smallest comfortable per Shar's preference).

---

## Card Style CSS (reference for generated output)

**Flat:** `border: 1px solid #E0E3E8; /* no shadow */`

**Bookend:**
```css
border-left: 4px solid {accent};
border-right: 4px solid {accent};
border-top: 1px solid {accent}40;
border-bottom: 1px solid {accent}40;
box-shadow: 0 8px 24px rgba({primary-rgb}, 0.12), 0 2px 4px rgba({primary-rgb}, 0.08);
```

**Outlined:** `border: {borderW} solid {accent};`

**Filled:** `background: rgba({accent-rgb}, 0.10); border: 1px solid rgba({accent-rgb}, 0.28);`

---

## Roadmap — Next Build Priorities

### Immediate fixes
- [ ] Add `localStorage` save/restore for form state (since artifacts support persistent storage via `window.storage`)
- [ ] Increase `max_tokens` to 8192 for richer generated pages
- [ ] Add a "Regenerate section" option (pass back the full HTML + which section to redo)
- [ ] Add more font pairs — particularly a monospace option for technical courses

### Short-term features
- [ ] **Week-by-week schedule generator** — a separate output that generates the full weekly schedule page (currently CourseForge only builds the course hub/landing page)
- [ ] **Lab Sprint page generator** — generates an individual Lab Sprint HTML page for a given week
- [ ] **Syllabus generator** — full syllabus as a separate output mode
- [ ] **Grade calculator** — generates a standalone grade calculator HTML file
- [ ] **Output bundle** — generate all pages for a course at once (hub + schedule + lab pages)

### Phase 2 productization
- [ ] Replace hardcoded Solano/Scrubs defaults with a neutral "Your School" placeholder
- [ ] Add school name, logo URL, and LMS type (Canvas/Blackboard/D2L) fields
- [ ] Add a "Save Brand Kit" feature using `window.storage` so returning users keep their palette
- [ ] Strip MedMasters eyebrow from the app header, replace with configurable institution name
- [ ] Pricing model: credit pack (5 course hubs = $29) or annual subscription ($99/yr)
- [ ] Integrate into Kajabi via iframe embed on MedMasters Launch Studio page
- [ ] Build a landing page for CourseForge as a standalone product

### Design improvements
- [ ] Bookend card preview in the live strip looks small — render it larger or add a "zoom" view
- [ ] Add a 5th font pair (a monospace or technical option like JetBrains Mono + Source Serif)
- [ ] Add a "Neutral" palette for institutions that just want gray/black/white
- [ ] Theme cards in Quick Themes should show a tiny full-page mockup, not just an icon

---

## File Conventions (generated HTML)

All generated HTML files are named:
```
{courseNumber-lowercase}-{semester-lowercase}-hub.html
```
Example: `bio-004-summer-2026-hub.html`

For atlas/preview files: named simply by topic (e.g., `intro.html`, `thoracic.html`).

All HTML is single-file with embedded CSS and JS. No external dependencies except Google Fonts (linked in `<head>`).

---

## Tech Notes for Continuation

### API call pattern
```js
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,   // consider bumping to 8192
    system: buildSys(branding),
    messages: [{ role: "user", content: buildUser(form) }]
  })
})
```

API key is injected by the Claude platform — never include it in the code.

### Font loading
Fonts are loaded via `useEffect` that appends a `<link>` tag to `document.head`. The `@import` in a CSS string (the previous approach) was not reliable. Always use the `useEffect` + link injection method.

### Output cleaning
Always strip markdown code fences from the API response before rendering:
```js
text.replace(/^```html\s*/, "").replace(/\s*```$/, "").trim()
```

### Persistent storage (for future save/restore)
The artifact platform supports `window.storage.get/set/list` for per-user persistent data across sessions. Use this to save brand kits and form state. Keys must be under 200 chars, no spaces/slashes/quotes.

---

## Related Projects (same ecosystem)

| Project | Description | Location |
|---------|-------------|----------|
| BIO 004 Lab Sprint pages (Wks 1–8) | HTML lab circuit tools | GitHub Pages, drsrennie-stack |
| BIO 004 Course Schedule | Auto-highlight schedule HTML | GitHub Pages |
| BIO 004 Clinical Reasoning Simulator Wk 1 | SJS/TEN patient case | Kajabi iframe |
| Digital Human Anatomy Atlas (19 atlases) | Interactive anatomy atlas series | GitHub Pages + Kajabi |
| STAT Success cohort | 4-week self-paced summer program | Kajabi |
| NCLEX-RN practice ecosystem | 54-item, 25-item, 225-question generator | GitHub Pages |
| Grade Calculator Builder | Multi-mode cumulative final calculator | Artifact |
| ABG Tutor | Classifier + generator | Artifact |

---

## Contact / Ownership

**Dr. Sharilyn Rennie** ("Scrubs")
GitHub: `drsrennie-stack`
Platform: Kajabi at `medmasterscollaborative.com`
Courses: Solano Community College, American River College, Yuba College
Business: MedMasters Collaborative, LLC (edtech) + Be Radical (apparel, Etsy)

---

*Drop this file into a Claude Project as a reference document. Any conversation in that project will have full context to continue building CourseForge without re-explaining the history.*
