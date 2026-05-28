"""WCAG 2.2 contrast audit for palette-library-preview.html
Computes contrast ratios for every critical fg/bg pair used by the preview page
chrome and by the 18-palette modal previews (light + dark mode each).
"""

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def composite(fg_rgba, bg_rgb):
    # fg_rgba = (r,g,b,a) where a in [0,1]
    r, g, b, a = fg_rgba
    br, bg_, bb = bg_rgb
    return (
        round(r*a + br*(1-a)),
        round(g*a + bg_*(1-a)),
        round(b*a + bb*(1-a)),
    )

def rel_lum(rgb):
    def chan(c):
        c = c / 255.0
        return c/12.92 if c <= 0.03928 else ((c + 0.055)/1.055) ** 2.4
    r, g, b = rgb
    return 0.2126*chan(r) + 0.7152*chan(g) + 0.0722*chan(b)

def contrast(fg, bg):
    L1 = rel_lum(fg)
    L2 = rel_lum(bg)
    lo, hi = sorted((L1, L2))
    return (hi + 0.05) / (lo + 0.05)

def grade(ratio, large=False):
    aa = 3.0 if large else 4.5
    aaa = 4.5 if large else 7.0
    if ratio >= aaa: return "AAA"
    if ratio >= aa:  return "AA"
    if ratio >= 3.0: return "AA-large"  # ui components / large text
    return "FAIL"

PALETTES = [
    ("medmasters",       "MedMasters",         "#0B1530", "#C9A14A", "#8B3A2E", "#5B9AA0", "academic"),
    ("bronte-ridge",     "Bronte Ridge",       "#09868b", "#3d7c47", "#76c1d4", "#76c1d4", "academic"),
    ("atrium",           "Atrium Society",     "#49494b", "#bd8c7d", "#d1bfa7", "#8e8e90", "academic"),
    ("field-notes",      "Field Notes",        "#628078", "#ff3a22", "#c7af6b", "#a4893d", "academic"),
    ("cathedral",        "Cathedral",          "#091f36", "#9e363a", "#9e363a", "#4f5f76", "academic"),
    ("stoneworks",       "Stoneworks",         "#82716e", "#c2b490", "#e4decd", "#acb7ae", "academic"),
    ("brownstone",       "Brownstone",         "#91684a", "#cd5554", "#cd5554", "#00c07f", "editorial"),
    ("pharaohs-atelier", "Pharaoh's Atelier",  "#12343b", "#e1b382", "#c89666", "#2d545e", "editorial"),
    ("press-room",       "Press Room",         "#393939", "#FF5A09", "#ec7f37", "#be4f0c", "editorial"),
    ("workshop-yellow",  "Workshop Yellow",    "#1d1e22", "#feda6a", "#feda6a", "#393f4d", "editorial"),
    ("linen-indigo",     "Linen and Indigo",   "#3a4660", "#ed8a63", "#c9af98", "#845007", "warm"),
    ("picnic-basket",    "Picnic Basket",      "#6B7A8F", "#F7882F", "#F7C331", "#DCC7AA", "warm"),
    ("studio-audacieux", "Studio Audacieux",   "#101357", "#fbaf08", "#fea49f", "#00a0a0", "cool"),
    ("recess",           "Recess",             "#9068be", "#e62739", "#e62739", "#6ed3cf", "cool"),
    ("idle-hands",       "Idle Hands",         "#7c677f", "#9bc400", "#f9c5bd", "#8076a3", "cool"),
    ("saturday-funnies", "Saturday Funnies",   "#1400c6", "#beef00", "#ff0028", "#657a00", "bold"),
    ("disco-reactor",    "Disco Reactor",      "#781a44", "#eb1736", "#eb1736", "#5252d4", "bold"),
    ("lightbrite",       "Lightbrite",         "#431c5d", "#e05915", "#cdd422", "#c2dde6", "bold"),
]

WHITE   = hex_to_rgb("#FFFFFF")
OFFWHT  = hex_to_rgb("#FAFAF9")
NAVY    = hex_to_rgb("#0B1530")
TERRADK = hex_to_rgb("#8B3A2E")
GOLD    = hex_to_rgb("#C9A14A")
INKMUT  = hex_to_rgb("#5A6573")
RULE    = hex_to_rgb("#DCE0E6")

# Tag chip text colors (from CSS)
TAG_COOL_TXT  = hex_to_rgb("#2E6E75")
TAG_BOLD_TXT  = hex_to_rgb("#8A2C2C")
TAG_WARN_TXT  = hex_to_rgb("#6B5520")

def fmt(label, fg, bg, ratio, large=False, note=""):
    g = grade(ratio, large)
    mark = "PASS" if g not in ("FAIL", "AA-large") else ("FAIL" if g == "FAIL" else "AA-large only")
    if large and g == "AA-large":
        mark = "PASS (large)"
    return f"{label:55s} {ratio:5.2f}:1  {g:9s} {mark:18s} {note}"

print("=" * 110)
print("STATIC PAGE CHROME (palette-library-preview.html)")
print("=" * 110)
# body text navy on offwhite
print(fmt("Body navy on offwhite",                NAVY,     OFFWHT,  contrast(NAVY, OFFWHT)))
# eyebrow terra-dark on offwhite
print(fmt("Eyebrow terra-dark on offwhite",       TERRADK,  OFFWHT,  contrast(TERRADK, OFFWHT)))
# ink-muted on offwhite (lede)
print(fmt("Ink-muted on offwhite (lede)",         INKMUT,   OFFWHT,  contrast(INKMUT, OFFWHT)))
# .forge half of wordmark = terra-dark on offwhite (handled above) : 38px so large
print(fmt("Wordmark .forge terra-dark on offwhite (38px large)", TERRADK, OFFWHT, contrast(TERRADK, OFFWHT), large=True))
# gold focus outline on offwhite (UI component)
print(fmt("Gold focus outline on offwhite (UI 3:1)", GOLD,  OFFWHT,  contrast(GOLD, OFFWHT), large=True))
# tag chips: text on composited tinted bg (over white card)
ac_bg = composite((30,61,76,0.08),     WHITE)  # vibe-academic
ed_bg = composite((160,82,45,0.10),    WHITE)  # vibe-editorial
wm_bg = composite((194,115,77,0.14),   WHITE)  # vibe-warm
co_bg = composite((91,154,160,0.18),   WHITE)  # vibe-cool
bo_bg = composite((184,74,74,0.14),    WHITE)  # vibe-bold
wn_bg = composite((184,146,74,0.16),   WHITE)  # vibe-warn
print(fmt("Tag vibe-academic (navy on tint)",     NAVY,     ac_bg,   contrast(NAVY, ac_bg)))
print(fmt("Tag vibe-editorial (terra-dk on tint)",TERRADK,  ed_bg,   contrast(TERRADK, ed_bg)))
print(fmt("Tag vibe-warm (terra-dk on tint)",     TERRADK,  wm_bg,   contrast(TERRADK, wm_bg)))
print(fmt("Tag vibe-cool (#2E6E75 on tint)",      TAG_COOL_TXT,  co_bg, contrast(TAG_COOL_TXT, co_bg)))
print(fmt("Tag vibe-bold (#8A2C2C on tint)",      TAG_BOLD_TXT,  bo_bg, contrast(TAG_BOLD_TXT, bo_bg)))
print(fmt("Tag .warn (#6B5520 on tint)",          TAG_WARN_TXT,  wn_bg, contrast(TAG_WARN_TXT, wn_bg)))

# Hex labels in swatch corners use textColor heuristic : opacity 0.85 black/0.92 white
# Will be folded into the per-palette swatch checks below.

print()
print("=" * 110)
print("SWATCH ROLE LABELS (preview tiles) : textColor() heuristic check")
print("=" * 110)
print(f"{'Palette':22s} {'Role':8s} {'Swatch':10s} {'Heuristic':10s} {'BlkRatio':9s} {'WhtRatio':9s} {'Picks OK?':9s}")
def textcolor_heuristic(rgb):
    # mirrors the JS textColor(): (0.299*r + 0.587*g + 0.114*b)/255
    r,g,b = rgb
    return 'black' if (0.299*r + 0.587*g + 0.114*b)/255 > 0.58 else 'white'

swatch_fails = []
for slug, name, p, a, w, c, vibe in PALETTES:
    for role, hexv in (("Primary",p),("Accent",a),("Warm",w),("Cool",c)):
        rgb = hex_to_rgb(hexv)
        pick = textcolor_heuristic(rgb)
        # actual rendered text is rgba(0,0,0,0.72) or rgba(255,255,255,0.92)
        eff_black = composite((0,0,0,0.72), rgb)
        eff_white = composite((255,255,255,0.92), rgb)
        cb = contrast(eff_black, rgb)
        cw = contrast(eff_white, rgb)
        chosen_ratio = cb if pick == 'black' else cw
        best = 'black' if cb > cw else 'white'
        ok = "yes" if (chosen_ratio >= 4.5) else ("AA-large" if chosen_ratio >= 3.0 else "NO")
        if ok == "NO" or pick != best and (cb < 4.5 or cw < 4.5):
            swatch_fails.append((slug, role, hexv, pick, cb, cw))
        # only print fails to keep noise low
        if chosen_ratio < 4.5:
            print(f"{name:22s} {role:8s} {hexv:10s} {pick:10s} {cb:5.2f}    {cw:5.2f}    {ok}")

print()
print("=" * 110)
print("MODAL PREVIEWS : LIGHT MODE (per palette)")
print("=" * 110)
print("Critical text pairs:  body p.p on white | eyebrow p.w on white | pill text p.p on p.a | grade labels p.{a,w,c} on white")
print()

def show_palette_light(name, p, a, w, c):
    rgbP = hex_to_rgb(p); rgbA = hex_to_rgb(a); rgbW = hex_to_rgb(w); rgbC = hex_to_rgb(c)
    rows = [
        ("body p.p on white",       rgbP, WHITE, False),
        ("eyebrow p.w on white",    rgbW, WHITE, False),  # 10px small caps : strict
        ("pill text p.p on p.a",    rgbP, rgbA,  False),  # 10px
        ("grade label p.a on white",rgbA, WHITE, False),
        ("grade label p.w on white",rgbW, WHITE, False),
        ("grade label p.c on white",rgbC, WHITE, False),
    ]
    fails = []
    for lbl, fg, bg, large in rows:
        r = contrast(fg, bg)
        g = grade(r, large)
        if g in ("FAIL", "AA-large"):
            fails.append((lbl, r, g))
    if fails:
        print(f"  {name:24s}  {len(fails)} fails:")
        for lbl, r, g in fails:
            print(f"      {lbl:32s} {r:5.2f}:1  {g}")
    return fails

light_fails = {}
for slug, name, p, a, w, c, vibe in PALETTES:
    f = show_palette_light(name, p, a, w, c)
    if f: light_fails[name] = f

print()
print("=" * 110)
print("MODAL PREVIEWS : DARK MODE (per palette)")
print("=" * 110)
print("bg = p.p   fg = white   eyebrow = p.w on p.p   grade labels = p.{a,w,c} on dark card (rgba(255,255,255,0.06) over p.p)")
print()

def show_palette_dark(name, p, a, w, c):
    rgbP = hex_to_rgb(p); rgbA = hex_to_rgb(a); rgbW = hex_to_rgb(w); rgbC = hex_to_rgb(c)
    cardBg = composite((255,255,255,0.06), rgbP)
    muted  = composite((255,255,255,0.72), rgbP)
    rows = [
        ("body white on p.p",        WHITE,  rgbP,   False),
        ("muted text on p.p",        muted,  rgbP,   False),
        ("eyebrow p.w on p.p",       rgbW,   rgbP,   False),
        ("pill text p.p on p.a",     rgbP,   rgbA,   False),
        ("grade label p.a on card",  rgbA,   cardBg, False),
        ("grade label p.w on card",  rgbW,   cardBg, False),
        ("grade label p.c on card",  rgbC,   cardBg, False),
    ]
    fails = []
    for lbl, fg, bg, large in rows:
        r = contrast(fg, bg)
        g = grade(r, large)
        if g in ("FAIL", "AA-large"):
            fails.append((lbl, r, g))
    if fails:
        print(f"  {name:24s}  {len(fails)} fails:")
        for lbl, r, g in fails:
            print(f"      {lbl:32s} {r:5.2f}:1  {g}")
    return fails

dark_fails = {}
for slug, name, p, a, w, c, vibe in PALETTES:
    f = show_palette_dark(name, p, a, w, c)
    if f: dark_fails[name] = f

print()
print("=" * 110)
print("SUMMARY")
print("=" * 110)
print(f"Palettes with light-mode preview fails: {len(light_fails)}/{len(PALETTES)}")
print(f"Palettes with dark-mode preview fails:  {len(dark_fails)}/{len(PALETTES)}")
print()
print("Note: the preview-page chrome is checked separately above.")
print("Static page chrome must pass AA; modal previews are demonstrations of how each palette would")
print("be used and surface palette-level accessibility problems before they ship into CourseForge.")
