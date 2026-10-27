"""Generate the bespoke contact QR as a static SVG, with no runtime dependencies.

Build-only requirement: qrcode. Optional validation: zxing-cpp + Pillow.
"""
from pathlib import Path
import sys
import base64
from urllib.parse import urlencode, quote

local_tools = Path(r"C:\Users\adam-\AppData\Local\Temp\pps-qr-tools")
if local_tools.exists():
    sys.path.insert(0, str(local_tools))
import qrcode

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = "mailto:info@plotperfectstudios.co.uk"
concept = '--concept' in sys.argv
if concept:
    DESTINATION += '?' + urlencode({'subject': 'Free homepage concept', 'body': 'Business:\nWebsite:\nGoals:'}, quote_via=quote)
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0)
qr.add_data(DESTINATION)
qr.make(fit=True)
matrix = qr.get_matrix()
n = len(matrix)
quiet = 4
size = n + quiet * 2
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 {size} {size}" role="img" aria-labelledby="title desc">',
         '<title id="title">' + ('Request a free homepage concept' if concept else 'Email Plot Perfect Studios') + '</title>',
         '<desc id="desc">Scan to open ' + ('a free homepage concept request' if concept else 'an email') + ' to info@plotperfectstudios.co.uk.</desc>',
         f'<rect width="{size}" height="{size}" rx="1.5" fill="#f7f3e9"/>']
finders = [(0, 0), (n-7, 0), (0, n-7)]
for y, row in enumerate(matrix):
    for x, dark in enumerate(row):
        if not dark or any(fx <= x < fx+7 and fy <= y < fy+7 for fx, fy in finders):
            continue
        parts.append(f'<rect x="{x+quiet}" y="{y+quiet}" width="1" height="1" rx=".18" fill="#111b1b"/>')
for x, y in finders:
    x += quiet
    y += quiet
    parts.extend([f'<rect x="{x}" y="{y}" width="7" height="7" rx="1.3" fill="#994421"/>',
                  f'<rect x="{x+1}" y="{y+1}" width="5" height="5" rx=".6" fill="#f7f3e9"/>',
                  f'<rect x="{x+2}" y="{y+2}" width="3" height="3" rx=".45" fill="#111b1b"/>'])
# Keep the badge small and the quiet zone intact; high error correction covers
# the centre modules hidden by the original, unmodified studio logo.
badge_size = n * .24
badge_start = (size - badge_size) / 2
badge_inset = .55
logo_inset = .85
logo = base64.b64encode((ROOT / 'assets/images/PlotPerfectLogoNew.png').read_bytes()).decode('ascii')
parts.extend([
    f'<rect x="{badge_start}" y="{badge_start}" width="{badge_size}" height="{badge_size}" rx="1" fill="#f7f3e9"/>',
    f'<rect x="{badge_start+badge_inset}" y="{badge_start+badge_inset}" width="{badge_size-2*badge_inset}" height="{badge_size-2*badge_inset}" rx=".65" fill="#101415"/>',
    f'<image x="{badge_start+logo_inset}" y="{badge_start+logo_inset}" width="{badge_size-2*logo_inset}" height="{badge_size-2*logo_inset}" href="data:image/png;base64,{logo}" preserveAspectRatio="xMidYMid meet"/>',
    '</svg>'
])
target = ROOT / 'assets' / 'images' / ('concept-qr.svg' if concept else 'contact-qr.svg')
target.write_text(''.join(parts), encoding='utf-8')
print(f'Generated {n} × {n} matrix with a four-module quiet zone: {DESTINATION}')
