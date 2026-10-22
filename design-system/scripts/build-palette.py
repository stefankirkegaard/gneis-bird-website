"""Generate reusable brand variables from the color reference in public/palette.json."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
groups=json.loads((root/'public/palette.json').read_text())
lines=['/* Generated from palette.json by python3 scripts/build-palette.py. */',':root {']
for group in groups:
 for family in group['families']:
  for name,value in family['colors']:
   assert re.fullmatch('#[0-9A-F]{6}',value)
   slug=re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
   lines.append(f'  --bird-{slug}: {value};')
lines.extend(['  --bird-white: #FFFFFF;','}',''])
(root/'public/palette.css').write_text('\n'.join(lines))
print('Generated 38 brand colors and white.')
