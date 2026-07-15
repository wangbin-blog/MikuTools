#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Fix all remaining skipped pages:
1. acg_meme.vue
2. hide_tool.vue
3. setting.vue
4. number_to_zh.vue
5. image_editor.vue
6. markdown.vue
"""
import os
import re

PAGES_DIR = r"f:/MyGiteeCode/个人网站/MikuTools/pages"

target_files = [
    "acg_meme.vue",
    "hide_tool.vue",
    "setting.vue",
    "number_to_zh.vue",
    "image_editor.vue",
    "markdown.vue",
]

def fix_file(filepath, filename):
    print(f"\n{'='*60}")
    print(f"Processing: {filename}")
    print(f"{'='*60}")
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    original = content
    
    # ===== STEP 1: Template modification =====
    # Find <template> block
    tmpl_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not tmpl_match:
        print("  SKIP: no <template> found")
        return False
    
    tmpl_start = tmpl_match.start()
    tmpl_end = tmpl_match.end()
    tmpl_body = tmpl_match.group(1)
    
    # Check if already has .content wrapper and SiteFooter
    if '<div class="content">' in tmpl_body and '<SiteFooter' in tmpl_body:
        print("  SKIP: already has .content and SiteFooter")
        return False
    
    # Find outer class div: <div class="classname">
    class_name = filename.replace(".vue", "")
    # Look for opening outer div
    outer_open_pattern = rf'<div class="{class_name}">\s*'
    outer_open_match = re.search(outer_open_pattern, tmpl_body)
    if not outer_open_match:
        print(f"  SKIP: no outer div .{class_name} found")
        return False
    
    outer_open_end = outer_open_match.end()
    
    # Find the closing </div> that closes the outer class div (last </div> before </template>)
    last_div_close = tmpl_body.rfind('</div>')
    if last_div_close < outer_open_end + 10:
        print(f"  SKIP: outer div close not found properly (pos={last_div_close})")
        return False
    
    # Now we need to wrap everything between outer_open_end and last_div_close
    # in <div class="content">...</div> and add SiteFooter before the last </div>
    
    prefix = tmpl_body[:outer_open_end]
    suffix = tmpl_body[last_div_close:]
    middle = tmpl_body[outer_open_end:last_div_close]
    
    # Format middle with proper indentation (8 spaces)
    middle_lines = middle.split('\n')
    formatted_lines = []
    for line in middle_lines:
        stripped = line.strip()
        if stripped:
            formatted_lines.append('        ' + stripped)
        else:
            formatted_lines.append('')
    
    formatted_middle = '\n'.join(formatted_lines)
    
    new_middle = f'''        <div class="content">
{formatted_middle}
        </div>
        <SiteFooter @donate="goHome" />
    '''
    
    new_tmpl_body = prefix + new_middle + suffix
    
    # Fix: remove extra trailing </div> if it's duplicated
    # The suffix already has '</div>' which closes the outer class div
    content = content[:tmpl_start] + '<template>' + new_tmpl_body + '</template>' + content[tmpl_end:]
    
    # ===== STEP 2: Script modification =====
    script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
    if not script_match:
        print("  SKIP: no <script> found")
        content = original  # restore
        return False
    
    script_start = script_match.start()
    script_end = script_match.end()
    script_body = script_match.group(1)
    
    new_script_body = script_body
    
    # Check if already has SiteFooter
    if "from '~/components/SiteFooter'" in new_script_body:
        print("  SKIP: already has SiteFooter import")
        content = original  # restore
        return False
    
    # Add import after <script> tag (before first import or before export)
    import_line = "\nimport SiteFooter from '~/components/SiteFooter';\n"
    
    # Find first import statement
    first_import = re.search(r'^import ', new_script_body, re.MULTILINE)
    if first_import:
        new_script_body = new_script_body[:first_import.start()] + import_line + new_script_body[first_import.start():]
    else:
        # Insert before export default
        export_match = re.search(r'^export default', new_script_body, re.MULTILINE)
        if export_match:
            new_script_body = new_script_body[:export_match.start()] + import_line + new_script_body[export_match.start():]
    
    # Add SiteFooter to components
    comp_match = re.search(r'components:\s*\{(.*?)\}', new_script_body, re.DOTALL)
    if comp_match:
        comp_content = comp_match.group(1).strip()
        if 'SiteFooter' not in comp_content:
            if comp_content:
                new_comp = comp_content + ',\n        SiteFooter'
            else:
                new_comp = '        SiteFooter'
            new_script_body = new_script_body[:comp_match.start(1)] + new_comp + new_script_body[comp_match.end(1):]
    else:
        # Add components section after name
        name_match = re.search(r"name:\s*['\"](\w+)['\"]", new_script_body)
        if name_match:
            insert_pos = name_match.end()
            new_script_body = new_script_body[:insert_pos] + ',\n    components: { SiteFooter }' + new_script_body[insert_pos:]
    
    # Add goHome method
    methods_match = re.search(r'methods:\s*\{(.*?)\n\s*\}', new_script_body, re.DOTALL)
    if methods_match:
        methods_body = methods_match.group(1)
        if 'goHome' not in methods_body:
            # Insert before closing brace of methods
            # Find the last method's closing
            closing_brace_pos = methods_match.end(1)
            # Insert the goHome method
            go_home_method = ",\n        goHome() {\n            this.$router.push('/');\n        }\n"
            new_script_body = new_script_body[:closing_brace_pos] + go_home_method + new_script_body[closing_brace_pos:]
    else:
        # Add methods section before closing of export default
        # Find pattern: }\n};\n</script> or }; at end
        # Insert before the closing of export default
        close_pattern = re.search(r'(}\n};\n)</script>', new_script_body)
        if close_pattern:
            new_script_body = new_script_body[:close_pattern.start(1)] + "    ,\n    methods: {\n        goHome() {\n            this.$router.push('/');\n        }\n    }\n" + new_script_body[close_pattern.start(1):]
    
    content = content[:script_start] + '<script>' + new_script_body + '</script>' + content[script_end:]
    
    # ===== STEP 3: Style modification =====
    style_match = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    if not style_match:
        print("  SKIP: no <style> found")
        content = original  # restore
        return False
    
    style_start = style_match.start()
    style_end = style_match.end()
    style_body = style_match.group(1)
    
    new_style_body = style_body
    
    # Remove scoped attribute
    new_style_body = re.sub(r'<style[^>]*scoped[^>]*>', '<style lang="scss">', new_style_body)
    # Re-extract since pattern changed
    style_match2 = re.search(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    new_style_body = style_match2.group(1) if style_match2 else style_body
    
    # Check if already has .content selector
    if f'.{class_name}' in new_style_body and f'.content' in new_style_body:
        print("  SKIP: already has .content style")
        content = original  # restore
        return False
    
    # Add .content selector inside the class block
    # Find .classname { and add .content { ... } right after the opening
    class_selector = rf'\.{class_name}\s*\{{'
    class_match = re.search(class_selector, new_style_body)
    if class_match:
        insert_pos = class_match.end()  # right after the opening {
        content_addition = "\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }"
        new_style_body = new_style_body[:insert_pos] + content_addition + new_style_body[insert_pos:]
    
    content = content[:style_start] + '<style lang="scss">' + new_style_body + '</style>' + content[style_end:]
    
    # Write back
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"  MODIFIED successfully")
    return True


for fname in target_files:
    fpath = os.path.join(PAGES_DIR, fname)
    if os.path.exists(fpath):
        fix_file(fpath, fname)
    else:
        print(f"File not found: {fpath}")
