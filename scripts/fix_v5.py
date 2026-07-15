import os
import re

PAGE_DIR = r"F:\MyGiteeCode\个人网站\MikuTools\pages"
SKIP = {"index.vue", "json-convert-format.vue"}


def process_file(filepath, filename):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<SiteFooter' in content:
        print(f"  SKIP: {filename}")
        return

    # ---- Template ----
    tmpl_match = re.search(r'<template>([\s\S]*?)</template>', content)
    if not tmpl_match:
        print(f"  SKIP (no template): {filename}")
        return
    tmpl_body = tmpl_match.group(1)

    outer_div_m = re.search(r'<div class="([\w\-]+)">', tmpl_body)
    if not outer_div_m:
        print(f"  SKIP (no outer div): {filename}")
        return

    class_name = outer_div_m.group(1)
    # Find the closing "> of the outer div tag
    outer_div_tag_close = tmpl_body.index('">', outer_div_m.start()) + 2

    # Find all nya-container blocks
    containers = []
    pos = 0
    while pos < len(tmpl_body):
        cs = tmpl_body.find('<nya-container', pos)
        if cs == -1:
            break
        ce = tmpl_body.find('</nya-container>', cs)
        if ce == -1:
            break
        containers.append(tmpl_body[cs:ce + len('</nya-container>')])
        pos = ce + len('</nya-container>')

    if not containers:
        print(f"  SKIP (no containers): {filename}")
        return

    first_cont = tmpl_body.index(containers[0])
    last_cont = tmpl_body.rindex(containers[-1])
    last_cont_end = last_cont + len(containers[-1])

    # Find outer </div> - the last </div> in the template body
    outer_div_close = tmpl_body.rfind('</div>')
    if outer_div_close == -1 or outer_div_close < last_cont_end:
        print(f"  SKIP: {filename}")
        return

    # Build prefix (content between outer div > and first container)
    prefix = tmpl_body[outer_div_tag_close:first_cont]

    # Build suffix (content between last container and outer </div>)
    suffix = tmpl_body[last_cont_end:outer_div_close]

    # Format containers with 12-space indentation
    formatted_containers = ''
    for c in containers:
        lines = c.split('\n')
        for l in lines:
            formatted_containers += '            ' + l + '\n'
    formatted_containers = formatted_containers.rstrip('\n')

    # Build new template
    new_tmpl = (
        tmpl_body[:outer_div_tag_close] +
        prefix +
        '\n            <div class="content">' +
        '\n' + formatted_containers + '\n' +
        '            </div>\n' +
        '            <SiteFooter @donate="goHome" />' +
        suffix +
        tmpl_body[outer_div_close:]
    )

    content = content.replace(tmpl_match.group(0), '<template>' + new_tmpl + '</template>')

    # ---- Script ----
    script_m = re.search(r'<script>([\s\S]*?)</script>', content)
    if script_m:
        sb = script_m.group(1)
        if 'import SiteFooter' not in sb:
            sb = "import SiteFooter from '~/components/SiteFooter';\n" + sb
        if 'SiteFooter' not in sb:
            if 'components:' in sb:
                cm = re.search(r'(components:\s*\{)([\s\S]*?)(\})', sb)
                if cm:
                    inner = cm.group(2).rstrip()
                    if inner.strip():
                        sb = sb.replace(cm.group(0), f'{cm.group(1)}{inner},\n        SiteFooter{cm.group(3)}')
                    else:
                        sb = sb.replace(cm.group(0), f'{cm.group(1)}\n        SiteFooter{cm.group(3)}')
            else:
                nm = re.search(r"(name:\s*'[^\']*'),", sb)
                if nm:
                    sb = sb[:nm.end()] + ',\n    components: {\n        SiteFooter\n    },' + sb[nm.end():]
        if 'goHome()' not in sb:
            mm = re.search(r'methods:\s*\{', sb)
            if mm:
                bc, p, found, ep = 0, mm.start(), False, -1
                while p < len(sb):
                    if sb[p] == '{': bc += 1; found = True
                    elif sb[p] == '}':
                        bc -= 1
                        if found and bc == 0: ep = p; break
                    p += 1
                if ep > 0:
                    sb = sb[:ep] + '\n        goHome() {\n            this.$router.push(\'/\');\n        }' + sb[ep:]
        content = content.replace('<script>' + script_m.group(1) + '</script>', '<script>' + sb + '</script>')

    # ---- Style ----
    for sm in reversed(list(re.finditer(r'<style([^>]*)>([\s\S]*?)</style>', content))):
        attrs, sb = sm.groups()
        sb = re.sub(r'\bscoped\b', '', sb)
        cp = rf'\.{re.escape(class_name)}\s*\{{'
        cm = re.search(cp, sb)
        if cm:
            iat = cm.end()
            nb = '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }'
            sb = sb[:iat] + nb + sb[iat:]
        content = content.replace(sm.group(0), f'<style{attrs}>{sb}</style>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  MODIFIED: {filename}")


count = 0
for fn in sorted(os.listdir(PAGE_DIR)):
    if not fn.endswith('.vue') or fn in SKIP:
        continue
    process_file(os.path.join(PAGE_DIR, fn), fn)
    count += 1
print(f"\nDone. Processed {count} files.")
