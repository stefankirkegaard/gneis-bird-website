"""Scope the downloaded assets to /design-system for the shared Bird deployment.
Idempotent: safe to run again after copying fresh assets or updating local hooks.
"""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]/'public'
asset_paths=['/_next/','/_vercel/','/favicons/','/manifest.json','/local.css','/local.js','/palette.css','/palette.json','/sw.js','/apple-icon.png','/icon-light-32x32.png','/icon-dark-32x32.png','/icon.svg']
for p in root.rglob('*'):
 if not p.is_file() or p.suffix not in ['.html','.js','.json','.css']:continue
 s=p.read_text()
 for asset in asset_paths:
  s=re.sub(r'(?<!/design-system)'+re.escape(asset),'/design-system'+asset,s)
 if p.suffix=='.js':s=s.replace('scope:"/",updateViaCache:', 'scope:"/design-system/",updateViaCache:')
 if p.name=='manifest.json':
  m=json.loads(s);m['scope']='/design-system/';s=json.dumps(m,indent=2)+'\n'
 p.write_text(s)
for name in ['insights','speed-insights']:
 p=root/'_vercel'/name/'script.js';p.parent.mkdir(parents=True,exist_ok=True);p.write_text('/* Analytics disabled for this standalone design-system reference. */\n')
print('Design system assets scoped to /design-system.')
