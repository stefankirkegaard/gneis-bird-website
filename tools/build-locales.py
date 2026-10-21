"""Generate Danish root pages from the English source pages in en/.
Run from any directory: python3 tools/build-locales.py
"""
from pathlib import Path
import html,json,re
ROOT=Path(__file__).resolve().parents[1]
translations=json.loads((ROOT/'tools/da.json').read_text())
def translate(value):
 decoded=html.unescape(value)
 stripped=decoded.strip()
 if stripped not in translations:return value
 return decoded[:len(decoded)-len(decoded.lstrip())]+html.escape(translations[stripped],quote=False)+decoded[len(decoded.rstrip()):]
for source in (ROOT/'en').glob('*.html'):
 s=source.read_text()
 s=re.sub(r'(?<=>)([^<>]+)(?=<)',lambda m:translate(m[1]),s)
 s=re.sub(r'\b(alt|aria-label|placeholder|data-billing-year|data-billing-month|content)="([^"]*)"',lambda m:m[1]+'="'+translate(m[2]).replace('"','&quot;')+'"',s)
 s=s.replace('<html lang="en">','<html lang="da">')
 s=re.sub(r'href="/en/([^\"]+)"',r'href="/\1"',s)
 # Keep the English language destination and language-alternate URLs in English.
 s=re.sub(r'href="/([^\"]+)" lang="en" hreflang="en" data-language="en" aria-current="true"',r'href="/en/\1" lang="en" hreflang="en" data-language="en"',s)
 s=s.replace('data-language="da"','data-language="da" aria-current="true"')
 s=re.sub(r'(<button class="nav__lang[^>]*>)(.*?)(</button>)',lambda m:m[1]+m[2].replace('<span>EN</span>','<span>DA</span>')+m[3],s,flags=re.S)
 s=s.replace(f'hreflang="en" href="/{source.name}"',f'hreflang="en" href="/en/{source.name}"')
 (ROOT/source.name).write_text(s)
print('Generated Danish versions of',len(list((ROOT/'en').glob('*.html'))),'pages.')
