import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make reveal resilient: only apply opacity: 0 if html has .js class
css = re.sub(r'(\.reveal(?:,\s*\.stagger-grid > div)?\s*\{[^}]+opacity:\s*)0(;\s*transform:[^}]+})', r'\1 1\2', css)

# Wait, instead of complicated regex, let's just append the overrides to styles.css
overrides = '''

/* === RESILIENCY OVERRIDES === */
.reveal, .stagger-grid > div {
    opacity: 1;
    transform: translateY(0);
}

html.js .reveal, html.js .stagger-grid > div {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

html.js .reveal.active, html.js .stagger-grid > div.active {
    opacity: 1;
    transform: translateY(0);
}
'''

css = css.replace('.reveal {', '/* .reveal {') # Disable original reveal block
css = css + overrides

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update index.html to include <script>document.documentElement.classList.add('js');</script> in <head>
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if '<script>document.documentElement.classList.add(\'js\');</script>' not in html:
    html = html.replace('<head>', '<head>\n    <script>document.documentElement.classList.add(\\'js\\');</script>')

# Update canvas z-index and pointer events just in case
html = html.replace('id="hero-canvas" class="absolute inset-0', 'id="hero-canvas" class="absolute inset-0 pointer-events-none -z-10')

# Also fix the terminal intro just in case it blocks
html = html.replace('id="terminal-intro" class="fixed inset-0 z-[100]', 'id="terminal-intro" class="fixed inset-0 z-[100] pointer-events-none')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
