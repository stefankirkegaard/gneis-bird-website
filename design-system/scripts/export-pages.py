"""Export section URLs as plain static folders for the existing Bird Vercel site."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
page=(root/'public/design-system.html').read_text()
slugs=['colors','typography','radius','buttons','badges','forms','table','listing','empty-states','loading-states','thinking-orbs','feedback']
(root/'index.html').write_text(page)
for slug in slugs:
 folder=root/slug;folder.mkdir(exist_ok=True);(folder/'index.html').write_text(page)
print('Exported design-system index and 12 section folders.')
