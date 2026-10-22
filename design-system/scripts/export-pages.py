"""Export section URLs as plain static folders for the existing Bird Vercel site."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
page=(root/'public/design-system.html').read_text()
slugs=['colors','typography','radius','buttons','badges','forms','table','listing','empty-states','loading-states','thinking-orbs','feedback']
catalog=json.loads((root/'public/catalog/catalog.json').read_text())
slugs += [item['slug'] for item in catalog['foundations']+catalog['components'] if item['slug'] not in slugs]
(root/'index.html').write_text(page)
for slug in slugs:
 folder=root/slug;folder.mkdir(exist_ok=True);(folder/'index.html').write_text(page)
print(f'Exported design-system index and {len(slugs)} section folders.')
