"""For each palette, compute the minimum darkening needed on the WARM and PRIMARY
slots to pass AA (>=4.5:1) on white. Report ΔL (lightness drop) so we can judge
whether the tweak preserves the palette identity. Tag each palette: KEEP / TWEAK / CUT.
"""

import colorsys

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return '#' + ''.join(f'{max(0,min(255,int(c))):02X}' for c in rgb)

def rel_lum(rgb):
    def chan(c):
        c = c / 255.0
        return c/12.92 if c <= 0.03928 else ((c + 0.055)/1.055) ** 2.4
    r, g, b = rgb
    return 0.2126*chan(r) + 0.7152*chan(g) + 0.0722*chan(b)

def contrast(fg, bg):
    L1, L2 = rel_lum(fg), rel_lum(bg)
    lo, hi = sorted((L1, L2))
    return (hi + 0.05) / (lo + 0.05)

WHITE = (255, 255, 255)

def darken_to_aa(hex_color, target=4.5, bg=WHITE):
    """Return (new_hex, dL, ratio) : darken in HSL keeping hue and saturation."""
    rgb = hex_to_rgb(hex_color)
    r, g, b = [x/255 for x in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    if contrast(rgb, bg) >= target:
        return hex_color, 0, contrast(rgb, bg)
    best_l = l
    for step in range(1, 101):
        new_l = max(0, l - step/100)
        nr, ng, nb = colorsys.hls_to_rgb(h, new_l, s)
        new_rgb = (round(nr*255), round(ng*255), round(nb*255))
        if contrast(new_rgb, bg) >= target:
            return rgb_to_hex(new_rgb), round((l - new_l) * 100, 1), round(contrast(new_rgb, bg), 2)
    return None, None, None

PALETTES = [
    ("medmasters",       "MedMasters",         "#0B1530", "#C9A14A", "#8B3A2E", "#5B9AA0", "academic", "Brand default. Locked."),
    ("bronte-ridge",     "Bronte Ridge",       "#09868b", "#3d7c47", "#76c1d4", "#76c1d4", "academic", "Ecology / earth sci."),
    ("atrium",           "Atrium Society",     "#49494b", "#bd8c7d", "#d1bfa7", "#8e8e90", "academic", "Humanities / classical."),
    ("field-notes",      "Field Notes",        "#628078", "#ff3a22", "#c7af6b", "#a4893d", "academic", "Sage. NOT for MedMasters courses (memory rule)."),
    ("cathedral",        "Cathedral",          "#091f36", "#9e363a", "#9e363a", "#4f5f76", "academic", "Lit / theology / philosophy."),
    ("stoneworks",       "Stoneworks",         "#82716e", "#c2b490", "#e4decd", "#acb7ae", "academic", "Art / design history. All-neutral."),
    ("brownstone",       "Brownstone",         "#91684a", "#cd5554", "#cd5554", "#00c07f", "editorial", "Brick + algae. Unusual."),
    ("pharaohs-atelier", "Pharaoh's Atelier",  "#12343b", "#e1b382", "#c89666", "#2d545e", "editorial", "Ancient hist / art hist."),
    ("press-room",       "Press Room",         "#393939", "#FF5A09", "#ec7f37", "#be4f0c", "editorial", "Journalism / comms."),
    ("workshop-yellow",  "Workshop Yellow",    "#1d1e22", "#feda6a", "#feda6a", "#393f4d", "editorial", "Technical / trades / engineering."),
    ("linen-indigo",     "Linen and Indigo",   "#3a4660", "#ed8a63", "#c9af98", "#845007", "warm",      "Fashion / design adjacent."),
    ("picnic-basket",    "Picnic Basket",      "#6B7A8F", "#F7882F", "#F7C331", "#DCC7AA", "warm",      "Bright produce energy."),
    ("studio-audacieux", "Studio Audacieux",   "#101357", "#fbaf08", "#fea49f", "#00a0a0", "cool",      "French confident. Versatile."),
    ("recess",           "Recess",             "#9068be", "#e62739", "#e62739", "#6ed3cf", "cool",      "Pediatric / dental hygiene."),
    ("idle-hands",       "Idle Hands",         "#7c677f", "#9bc400", "#f9c5bd", "#8076a3", "cool",      "Sustainability / climate."),
    ("saturday-funnies", "Saturday Funnies",   "#1400c6", "#beef00", "#ff0028", "#657a00", "bold",      "Comic-book. Marketing/illustration ONLY."),
    ("disco-reactor",    "Disco Reactor",      "#781a44", "#eb1736", "#eb1736", "#5252d4", "bold",      "Synth-wave. Performance arts."),
    ("lightbrite",       "Lightbrite",         "#431c5d", "#e05915", "#cdd422", "#c2dde6", "bold",      "80s toy. Creative arts."),
]

# Acceptable ΔL: if a slot needs more than 25 points of lightness drop in HSL, the palette identity is compromised
DL_ACCEPTABLE = 25.0

def verdict(palette):
    slug, name, p, a, w, c, vibe, note = palette
    # check primary on white (body text)
    rp = contrast(hex_to_rgb(p), WHITE)
    # check warm on white (eyebrow)
    rw = contrast(hex_to_rgb(w), WHITE)
    # check pill (primary on accent)
    rpill = contrast(hex_to_rgb(p), hex_to_rgb(a))

    fixes = []
    # need primary AA?
    if rp < 4.5:
        new_p, dl_p, new_rp = darken_to_aa(p)
        fixes.append(('Primary', p, new_p, dl_p, new_rp))
    # need warm AA?
    if rw < 4.5:
        new_w, dl_w, new_rw = darken_to_aa(w)
        fixes.append(('Warm', w, new_w, dl_w, new_rw))
    # pill: primary on accent : fix by darkening primary further OR darkening accent? Tricky.
    # We'll just FLAG pill fail; CourseForge can render the pill with navy/white text instead of p.p.
    pill_flag = rpill < 4.5

    if not fixes and not pill_flag:
        return ('KEEP', f"clean as-is", [])
    if not fixes and pill_flag:
        return ('KEEP*', f"pill needs engine-side fix (use navy text on accent)", [])
    # All fixable within DL_ACCEPTABLE?
    if all(f[3] is not None and f[3] <= DL_ACCEPTABLE for f in fixes):
        return ('TWEAK', "small darkening preserves identity", fixes)
    return ('CUT', "fix would require >25pt lightness drop, palette identity lost", fixes)


print(f"\n{'Palette':22s} {'Vibe':10s} {'Body':5s} {'Eybrw':5s} {'Pill':5s} {'Verdict':7s} {'Notes'}")
print("="*120)

keep, tweak, cut = [], [], []
for pal in PALETTES:
    slug, name, p, a, w, c, vibe, note = pal
    rp = round(contrast(hex_to_rgb(p), WHITE), 2)
    rw = round(contrast(hex_to_rgb(w), WHITE), 2)
    rpill = round(contrast(hex_to_rgb(p), hex_to_rgb(a)), 2)
    v, reason, fixes = verdict(pal)
    print(f"{name:22s} {vibe:10s} {rp:5.2f} {rw:5.2f} {rpill:5.2f} {v:7s} {reason}")
    for slot, orig, new, dl, nr in fixes:
        print(f"  {slot:8s} {orig} -> {new}  ΔL={dl}  new ratio={nr}")
    if v.startswith('KEEP'):
        keep.append(pal[:8] + (v, reason, fixes))
    elif v == 'TWEAK':
        tweak.append(pal[:8] + (v, reason, fixes))
    else:
        cut.append(pal[:8] + (v, reason, fixes))

print()
print("="*120)
print(f"SUMMARY: {len(keep)} keep, {len(tweak)} tweak, {len(cut)} cut")
print()
print("KEEP (no color changes needed):")
for k in keep:
    print(f"  • {k[1]} ({k[6]}) : {k[8]}, {k[9]}")
print()
print("TWEAK (small darkening preserves identity):")
for t in tweak:
    print(f"  • {t[1]} ({t[6]})")
    for slot, orig, new, dl, nr in t[10]:
        print(f"      {slot}: {orig} -> {new}  ΔL={dl}  new ratio={nr}")
print()
print("CUT (cannot fix without losing palette identity):")
for cc in cut:
    print(f"  • {cc[1]} ({cc[6]}) : {cc[9]}")
    for slot, orig, new, dl, nr in cc[10]:
        if new is None:
            print(f"      {slot}: {orig} -> impossible (color goes near-black before reaching 4.5:1)")
        else:
            print(f"      {slot}: {orig} -> {new}  ΔL={dl}  (over budget)")
