import re

with open('ui/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

print('=== HTML TAG BALANCE ===')
for tag in ['div', 'section', 'aside', 'main', 'footer', 'nav', 'table', 'tr', 'td', 'th']:
    opens = len(re.findall(r'<' + tag + r'[\s>]', content))
    closes = len(re.findall(r'</' + tag + r'>', content))
    if opens != closes:
        print(f'  MISMATCH: <{tag}> opens={opens} closes={closes} diff={opens-closes}')

# Check for referenced but undefined functions
print()
print('=== ONCLICK HANDLER ANALYSIS ===')
onclick_calls = re.findall(r'onclick="([a-zA-Z_0-9]+)\(', content)
unique_calls = sorted(set(onclick_calls))

script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
script_content = script_match.group(1) if script_match else ''

missing_fns = []
for fn in unique_calls:
    if (f'function {fn}' not in script_content and 
        f'{fn} = function' not in script_content and
        f'{fn} = ' not in script_content):
        missing_fns.append(fn)

if missing_fns:
    print(f'  MISSING ({len(missing_fns)}):')
    for m in missing_fns:
        print(f'    - {m}()')
else:
    print('  All onclick functions defined.')

# Check for getElementById references to non-existent DOM ids
print()
print('=== MISSING DOM ELEMENT IDS ===')
id_refs = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", content)
unique_refs = sorted(set(id_refs))
id_defs = set(re.findall(r'id="([^"]+)"', content))

missing_ids = [i for i in unique_refs if i not in id_defs]
if missing_ids:
    print(f'  MISSING ({len(missing_ids)}):')
    for m in missing_ids:
        print(f'    - #{m}')
else:
    print('  All referenced IDs exist.')

# Check for unclosed modals  
print()
print('=== MODAL OVERLAY CHECK ===')
modal_opens = re.findall(r'<div class="modal-overlay" id="([^"]+)">', content)
modal_closes = content.count('</div>\n  </div>')
print(f'  Modal overlays found: {len(modal_opens)}')
for m in modal_opens:
    print(f'    - #{m}')

# Check for orphan HTML outside proper structure
print()
print('=== ORPHAN HTML CHECK ===')
# Find HTML between </div>\n\n (end of modal) and next <!-- or <div or <script
# Look for lines that start with HTML tags but are between modals incorrectly
lines = content.split('\n')
in_script = False
for i, line in enumerate(lines):
    stripped = line.strip()
    if '<script>' in stripped:
        in_script = True
    if '</script>' in stripped:
        in_script = False
    if not in_script and stripped and not stripped.startswith('//') and not stripped.startswith('<!--'):
        # Check for orphan closing tags
        if stripped in ['</div>', '</div>\r'] and i > 0:
            prev = lines[i-1].strip() if i > 0 else ''
            next_line = lines[i+1].strip() if i+1 < len(lines) else ''
            # If prev is also a closing tag and next starts something new
            # that might indicate orphaned structure
            pass

# Check if Three.js CDN is present
print()
print('=== CDN SCRIPT TAGS ===')
cdns = re.findall(r'<script src="([^"]+)"', content)
for c in cdns:
    print(f'  - {c}')

# Check for specific crash-causing patterns
print()
print('=== POTENTIAL CRASH CAUSES ===')
# 1. switchSetup references part-name-badge which doesn't exist
if 'part-name-badge' in content and 'id="part-name-badge"' not in content:
    print('  CRASH: switchSetup() references #part-name-badge but it does not exist in DOM!')

# 2. toggleDualCanvas references btn-toggle-dual
if 'btn-toggle-dual' in content and 'id="btn-toggle-dual"' not in content:
    print('  CRASH: toggleDualCanvas() references #btn-toggle-dual but it does not exist!')

# 3. Check for togglePlay/toggleHeatmap
if 'togglePlay' in content and 'function togglePlay' not in content:
    print('  CRASH: togglePlay() called but not defined!')
if 'toggleHeatmap' in content and 'function toggleHeatmap' not in content:
    print('  CRASH: toggleHeatmap() called but not defined!')

# 4. Check fat/audit/showroom modal functions that reference deleted modals
for modal_id in ['fat-benchmark-modal', 'as9100-audit-modal', 'showroom-modal', 'golden-master-modal']:
    if f"'{modal_id}'" in content and f'id="{modal_id}"' not in content:
        print(f'  CRASH: JS references #{modal_id} but modal was removed!')

# 5. Check for menu-item 'open' class CSS
if '.menu-item.open' not in content and 'toggleMenu' in content:
    print('  MISSING: .menu-item.open CSS class not defined (menus wont show)!')

print()
print('=== DONE ===')
