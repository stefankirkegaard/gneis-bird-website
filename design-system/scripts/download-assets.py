"""Fetch the public assets referenced by the saved design-system document."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen
import json,re
ROOT=Path(__file__).resolve().parents[1]
ORIGIN='https://nest.trybird.io'
queue=set(['/manifest.json','/favicons/dark-mode.svg','/favicons/light-mode.svg'])
class Assets(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ('link','script','img'):
   u=a.get('src') or a.get('href')
   if u and u.startswith('/') and not u.startswith('//'):queue.add(u)
Assets().feed((ROOT/'source-snapshot/design-system.html').read_text())
for css in (ROOT/'public').rglob('*.css'):
 for u in re.findall(r'url\([\"\']?([^\)\"\']+)',css.read_text()):queue.add(urlparse(urljoin('/'+str(css.relative_to(ROOT/'public')),u)).path)
seen=set()
while queue:
 p=queue.pop()
 if p in seen:continue
 seen.add(p)
 dest=ROOT/'public'/p.lstrip('/')
 if not dest.exists():
  with urlopen(ORIGIN+p) as response:data=response.read()
  dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 if p=='/manifest.json':
  manifest=json.loads(dest.read_text())
  for icon in manifest.get('icons',[]):queue.add(urlparse(urljoin('/manifest.json',icon['src'])).path)
print('Saved',len(seen),'referenced assets.')
