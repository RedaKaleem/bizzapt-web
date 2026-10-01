"""Dependency-free static integration checks. Run: python3 tests/check_site.py."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.elements = []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

pages = {path.name: Page(path) for path in ROOT.glob('*.html')}
for name, page in pages.items():
    ids = [a['id'] for _, a in page.elements if a.get('id')]
    assert not [id for id, count in Counter(ids).items() if count > 1], name
    assert sum(tag == 'h1' for tag, _ in page.elements) == 1, name
    for tag, attrs in page.elements:
        if tag == 'img':
            assert 'alt' in attrs, (name, 'missing alt')
            assert attrs.get('src'), (name, 'empty image source')
        for key in ('href', 'src'):
            value = attrs.get(key)
            if not value:
                continue
            url = urlsplit(value)
            if url.scheme or url.netloc:
                continue
            target = ROOT / unquote(url.path) if url.path else ROOT / name
            assert target.exists(), (name, value, 'missing local file')
            if url.fragment and target.name in pages:
                target_ids = {a.get('id') for _, a in pages[target.name].elements}
                assert unquote(url.fragment) in target_ids, (name, value, 'missing anchor')
        for id in attrs.get('aria-controls', '').split():
            assert id in ids, (name, id, 'missing controlled element')
        for id in (attrs.get('aria-labelledby', '') + ' ' + attrs.get('aria-describedby', '')).split():
            assert id in ids, (name, id, 'missing label')

home = pages['index.html'].elements
assert len([a for _, a in home if a.get('data-node')]) == 6
assert not any('flip-card' in a.get('class', '').split() for _, a in home)
assert len([a for _, a in home if 'floating-module' in a.get('class', '').split()]) == 6
assert not any('orbit-ring' in a.get('class', '').split() for _, a in home)
assert len([a for _, a in home if a.get('data-solution')]) == 6
assert any('field-motion-toggle' in a.get('class', '').split() for _, a in home)
assert any(tag == 'select' and attrs.get('name') == 'accomplishment' for tag, attrs in home)
assert not any(attrs.get('name') == 'service' for _, attrs in home)
assert 'Not sure yet' in (ROOT / 'index.html').read_text()
form = next(attrs for tag, attrs in home if tag == 'form')
assert form['action'] == 'https://formspree.io/f/xzebpoby'
assert form['method'].upper() == 'POST'
panels = [a for _, a in pages['services.html'].elements if 'data-service-world' in a]
assert [a['data-service-world'] for a in panels] == ['launch', 'grow', 'optimize', 'scale']
assert ['hidden' in a for a in panels] == [False, True, True, True]
for old in ('Choose a discipline', 'Service you need', 'Pick a layer'):
    assert not any(old in (ROOT / name).read_text() for name in pages), old
print(f'Passed: {len(pages)} routes, local files/anchors, IDs, ARIA references, network, tabs and form contract.')

node_ids = {a['data-node'] for _, a in home if a.get('data-node')}
assert all(a['data-solution'] in node_ids for _, a in home if a.get('data-solution'))
