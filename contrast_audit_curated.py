"""Post-curation audit: verify the 6-palette curated library passes AA on white
for the three critical pairs (body p.p, eyebrow p.w, pill p.p on p.a).
"""

def hex_to_rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0,2,4))
def rl(rgb):
    def c(x): x=x/255.0; return x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4
    return 0.2126*c(rgb[0]) + 0.7152*c(rgb[1]) + 0.0722*c(rgb[2])
def cr(a,b):
    L=sorted((rl(a),rl(b))); return (L[1]+0.05)/(L[0]+0.05)
def g(r,large=False):
    aa=3.0 if large else 4.5; aaa=4.5 if large else 7.0
    return "AAA" if r>=aaa else ("AA" if r>=aa else ("AA-large" if r>=3 else "FAIL"))

WHITE=hex_to_rgb("#FFFFFF")

PALETTES = [
    ("MedMasters",        "#0B1530","#C9A14A","#8B3A2E","#5B9AA0","academic"),
    ("Field Notes",       "#5E7A73","#ff3a22","#897334","#a4893d","academic"),
    ("Pharaoh's Atelier", "#12343b","#e1b382","#9E6B39","#2d545e","editorial"),
    ("Press Room",        "#393939","#FF5A09","#BF5712","#be4f0c","editorial"),
    ("Linen and Indigo",  "#3a4660","#ed8a63","#946F4E","#845007","warm"),
    ("Saturday Funnies",  "#1400c6","#beef00","#EB0025","#657a00","bold"),
]

print(f"{'Palette':22s} {'Body p.p/wh':14s} {'Eybrw p.w/wh':14s} {'Pill p.p/p.a':14s} {'Cool p.c/wh':14s} {'Slots distinct?'}")
print("="*120)
all_pass = True
for name,p,a,w,c,vibe in PALETTES:
    rp = cr(hex_to_rgb(p), WHITE)
    rw = cr(hex_to_rgb(w), WHITE)
    rpill = cr(hex_to_rgb(p), hex_to_rgb(a))
    rc = cr(hex_to_rgb(c), WHITE)
    slots_unique = len({p.lower(),a.lower(),w.lower(),c.lower()})==4
    body = f"{rp:5.2f} {g(rp):7s}"
    eyebrow = f"{rw:5.2f} {g(rw):7s}"
    pill = f"{rpill:5.2f} {g(rpill):7s}"
    cool = f"{rc:5.2f} {g(rc):7s}"
    distinct = "yes" if slots_unique else "NO"
    if rp<4.5 or rw<4.5: all_pass=False
    print(f"{name:22s} {body:14s} {eyebrow:14s} {pill:14s} {cool:14s} {distinct}")

print()
print("="*120)
print(f"All body + eyebrow pairs pass AA on white? {'YES' if all_pass else 'NO'}")
print()
print("Pill check note: Saturday Funnies pill (navy on lime) and MedMasters pill (navy on gold)")
print("must use the listed Accent color as the pill background. If they fail above, the engine")
print("should render the pill with white text instead of p.p in those cases.")
