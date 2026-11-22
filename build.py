"""Build app.js + index.html from src/Main.dc.html. Run: python3 build.py"""
import re, json, hashlib, os
ROOT = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(ROOT, 'src/Main.dc.html'), encoding='utf-8').read()
js = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', s, re.S).group(1)
a = s.index('<x-dc>') + len('<x-dc>'); b = s.rindex('</x-dc>')
tpl = s[a:b]
js = js.replace("'/_blob/b80ebe0a61d2cfedb9088a43ef50dde6'", "'./data/archive.json'")
assert "required: false, google: false" in js, 'auth default not found'
js = js.replace("required: false, google: false", "required: true, google: true")
rt = open(os.path.join(ROOT, 'src/runtime.js'), encoding='utf-8').read()
app = "(function(){\n'use strict';\n" + rt + "\nconst __TEMPLATE = " + json.dumps(tpl) + ";\n" + js + "\n;__mount(Component, __TEMPLATE, document.getElementById('root'));\n})();\n"
open(os.path.join(ROOT, 'app.js'), 'w', encoding='utf-8').write(app)
v = hashlib.sha1(app.encode()).hexdigest()[:10]
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(f'''<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Navinus ERP</title>
<meta name="robots" content="noindex">
</head>
<body>
<div id="root"></div>
<script src="./app.js?v={v}"></script>
</body>
</html>
''')
print('built app.js', len(app), 'bytes, v=' + v)
