"""Check the generated static site, translations, links and image dimensions.

Run after build.py. Uses only the Python standard library; browser interaction
and visual checks are documented separately in the acceptance report.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import struct

ROOT = Path(__file__).resolve().parent.parent
SITE = json.loads((ROOT / 'data/site.json').read_text())
PAGES = [ROOT / 'index.html', ROOT / 'lab.html', ROOT / 'study.html', *sorted((ROOT / 'categories').glob('*.html')), *sorted((ROOT / 'projects').glob('*.html'))]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.nodes = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

    def matching(self, tag=None, cls=None):
        return [attrs for kind, attrs in self.nodes if (tag is None or kind == tag) and (cls is None or cls in attrs.get('class', '').split())]


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def png_size(path):
    with path.open('rb') as image:
        header = image.read(24)
    require(header[:8] == b'\x89PNG\r\n\x1a\n', str(path) + ': not a PNG')
    return struct.unpack('>II', header[16:24])


require(len(PAGES) == 9, 'Expected nine static pages')
parsed = {path.resolve(): Page(path) for path in PAGES}
link_count = 0
translation_count = 0
for path, page in parsed.items():
    relative = path.relative_to(ROOT)
    ids = [attrs['id'] for _, attrs in page.nodes if 'id' in attrs]
    require(len(ids) == len(set(ids)), f'{relative}: duplicate IDs')
    require(len(page.matching('h1')) == 1, f'{relative}: one h1 required')
    require(len(page.matching('main')) == 1, f'{relative}: one main required')
    require(len(page.matching('nav', 'static-navigation')) == 1 and '<noscript>' in path.read_text(), f'{relative}: missing no-JavaScript navigation')
    require(len(page.matching('a', 'primary-button')) >= (0 if relative.name in ('lab.html','study.html') else 2), f'{relative}: missing static direct actions')
    for tag, attrs in page.nodes:
        for key in ('data-i18n', 'data-i18n-label', 'data-i18n-alt', 'data-full-alt-key'):
            if key in attrs:
                for language in ('zh', 'en'):
                    require(bool(SITE['copy'][language].get(attrs[key])), f'{relative}: missing {language} translation {attrs[key]}')
                translation_count += 1
        if tag == 'img':
            require(all(key in attrs for key in ('alt', 'width', 'height')), f'{relative}: image missing alt or dimensions')
        if tag == 'a' and attrs.get('target') == '_blank':
            require({'noopener', 'noreferrer'} <= set(attrs.get('rel', '').split()), f'{relative}: external link missing rel')
        for key in (('href',) if tag in ('a', 'link') else ('src', 'srcset') if tag in ('img', 'script', 'source') else ()):
            if key not in attrs:
                continue
            url = urlsplit(attrs[key])
            if url.scheme or url.netloc:
                continue
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            require(target.is_file(), f'{relative}: missing local file {attrs[key]}')
            if url.fragment:
                target_page = parsed.get(target)
                require(target_page is not None and any(node.get('id') == unquote(url.fragment) for _, node in target_page.nodes), f'{relative}: missing anchor {attrs[key]}')
            link_count += 1

home = parsed[(ROOT / 'index.html').resolve()]
required_anchors = {'home','work','cloud-drive','cat-outpost','stock-atlas','resources','technology','journal','about','contact'}
require(required_anchors <= {attrs.get('id') for _, attrs in home.nodes}, 'Missing legacy homepage anchors')
require([node['id'] for node in home.matching('article','project-card')] == SITE['home_order'], 'Project order changed')
expected = {'games': ['cat-outpost'], 'websites': ['stock-atlas','cloud-drive'], 'programs': []}
for category, ids in expected.items():
    page = parsed[(ROOT / 'categories' / (category + '.html')).resolve()]
    require([node['id'] for node in page.matching('article','project-card')] == ids, category + ': incorrect projects')
    require(sum('aria-current' in node for node in page.matching('a') if node.get('href','').endswith('categories/' + category + '.html')) >= 1, category + ': missing active category')

for project in SITE['projects']:
    require(png_size(ROOT / 'assets' / project['cover']['image']) == tuple(project['cover']['size']), project['id'] + ': cover dimensions inconsistent')
    require(any(node.get('href') == ('study.html' if project['id']=='cloud-drive' else project['url']) for node in home.matching('a','primary-button')), project['id'] + ': direct URL missing')
for path in (ROOT / 'assets').glob('share-*.png'):
    require(png_size(path) == (1200,630), path.name + ': incorrect social image size')
drive = parsed[(ROOT / 'projects/cloud-drive.html').resolve()]
file_links = [node['href'] for node in drive.matching('a') if node.get('href') in SITE['files']]
require(len(file_links) == 6 and set(file_links) == set(SITE['files']), 'Six original document URLs must be in the static HTML')
study = parsed[(ROOT / 'study.html').resolve()]
require({node.get('href') for node in study.matching('a')} >= set(SITE['files']), 'Study page must retain six file URLs')
print(json.dumps({'pages':len(PAGES), 'local_links_and_assets':link_count, 'translated_attributes':translation_count, 'original_file_links':len(file_links), 'result':'pass'}, ensure_ascii=False))
