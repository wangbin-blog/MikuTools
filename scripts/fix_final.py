#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Final fix for all remaining files that batch script missed.
Handles each file individually based on its structure.
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

def fix_acg_meme(content, filename):
    """acg_meme.vue - no nya-container wrapper issue, has regular structure."""
    class_name = "acg_meme"
    
    # Check if already has .content and SiteFooter
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    # Template: wrap content in .content div and add SiteFooter
    tmpl_match = re.search(r'(<template>\s*<div class="' + class_name + '">)(.*?)(</div>\s*</template>)', content, re.DOTALL)
    if not tmpl_match:
        print(f"  ERROR: no template match")
        return content, False
    
    # Find the last </div> in template body (before </template>)
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    # Find first <div class="acg_meme">
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    
    # Find the last </div> that closes the outer class div
    # This is the last </div> before </template>
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early: {last_div_close} <= {outer_open_pos}")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    # Indent middle content
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    
    # Build new template body
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script: add SiteFooter import, component, method
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        # Add import
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        # Add to components
        comp_match = re.search(r'(components:\s*\{)(.*?)(\})', script_body, re.DOTALL)
        if comp_match:
            comp_inner = comp_match.group(2).strip()
            if 'SiteFooter' not in comp_inner:
                new_comp = comp_inner.rstrip(',') + ',\n        SiteFooter'
                script_body = script_body[:comp_match.start(2)] + new_comp + script_body[comp_match.end(2):]
        else:
            # Add components section
            name_match = re.search(r'(name:\s*\'AcgMeme\',)', script_body)
            if name_match:
                pos = name_match.end()
                script_body = script_body[:pos] + '\n    components: { SiteFooter },' + script_body[pos:]
        
        # Add goHome method
        methods_match = re.search(r'(methods:\s*\{)(.*?)(\n\s*\})', script_body, re.DOTALL)
        if methods_match:
            methods_inner = methods_match.group(2)
            if 'goHome' not in methods_inner:
                # Find the last method's closing
                close_pos = methods_match.start(3)
                go_home = ',\n        goHome() {\n            this.$router.push(\'/\');\n        }'
                script_body = script_body[:close_pos] + go_home + script_body[close_pos:]
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style: add .content selector
    style_match = re.search(r'(<style lang="scss">)(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        # Add .content inside .acg_meme block
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


def fix_hide_tool(content, filename):
    """hide_tool.vue - similar structure to acg_meme but no nested content wrapper."""
    class_name = "hide_tool"
    
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script modifications
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        comp_match = re.search(r'(components:\s*\{)(.*?)(\})', script_body, re.DOTALL)
        if comp_match:
            comp_inner = comp_match.group(2).strip()
            if 'SiteFooter' not in comp_inner:
                new_comp = comp_inner.rstrip(',') + ',\n        SiteFooter'
                script_body = script_body[:comp_match.start(2)] + new_comp + script_body[comp_match.end(2):]
        
        methods_match = re.search(r'(methods:\s*\{)(.*?)(\n\s*\})', script_body, re.DOTALL)
        if methods_match:
            close_pos = methods_match.start(3)
            go_home = ',\n        goHome() {\n            this.$router.push(\'/\');\n        }'
            script_body = script_body[:close_pos] + go_home + script_body[close_pos:]
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style modifications
    style_match = re.search(r'(<style lang="scss">)(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


def fix_setting(content, filename):
    """setting.vue - has SetBackground component, needs special handling."""
    class_name = "setting"
    
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script modifications
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        comp_match = re.search(r'(components:\s*\{)(.*?)(\})', script_body, re.DOTALL)
        if comp_match:
            comp_inner = comp_match.group(2).strip()
            if 'SiteFooter' not in comp_inner:
                new_comp = comp_inner.rstrip(',') + ',\n        SiteFooter'
                script_body = script_body[:comp_match.start(2)] + new_comp + script_body[comp_match.end(2):]
        
        methods_match = re.search(r'(methods:\s*\{)(.*?)(\n\s*\})', script_body, re.DOTALL)
        if methods_match:
            close_pos = methods_match.start(3)
            go_home = ',\n        goHome() {\n            this.$router.push(\'/\');\n        }'
            script_body = script_body[:close_pos] + go_home + script_body[close_pos:]
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style modifications
    style_match = re.search(r'(<style lang=[\'"]scss)[^>]*>(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


def fix_number_to_zh(content, filename):
    """number_to_zh.vue - simple structure, multiple nya-containers."""
    class_name = "number_to_zh"
    
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script modifications
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        # Add components section if missing
        if 'components:' not in script_body:
            name_match = re.search(r"(name:\s*['\"]NumberToZh['\"],)", script_body)
            if name_match:
                pos = name_match.end()
                script_body = script_body[:pos] + '\n    components: { SiteFooter },' + script_body[pos:]
        
        methods_match = re.search(r'(methods:\s*\{)(.*?)(\n\s*\})', script_body, re.DOTALL)
        if methods_match:
            close_pos = methods_match.start(3)
            go_home = ',\n        goHome() {\n            this.$router.push(\'/\');\n        }'
            script_body = script_body[:close_pos] + go_home + script_body[close_pos:]
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style modifications
    style_match = re.search(r'(<style lang=[\'"]scss)[^>]*>(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


def fix_image_editor(content, filename):
    """image_editor.vue - no nya-container, uses div#tui-image-editor."""
    class_name = "image_editor"
    
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script modifications
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        # Add components section
        if 'components:' not in script_body:
            name_match = re.search(r"(name:\s*['\"]ImageEditor['\"],)", script_body)
            if name_match:
                pos = name_match.end()
                script_body = script_body[:pos] + '\n    components: { SiteFooter },' + script_body[pos:]
        
        # Add goHome method after mounted or before closing of export default
        close_pattern = re.search(r'(}\n};\n)</script>', script_body)
        if close_pattern:
            go_home = '    ,\n    methods: {\n        goHome() {\n            this.$router.push(\'/\');\n        }\n    }\n' + close_pattern.group(1)
            script_body = script_body.replace(close_pattern.group(1), go_home)
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style modifications
    style_match = re.search(r'(<style lang="scss">)(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


def fix_markdown(content, filename):
    """markdown.vue - no nya-container, uses mavon-editor."""
    class_name = "markdown"
    
    if '<SiteFooter' in content:
        print(f"  SKIP: already done")
        return content, False
    
    template_body_start = content.index('<template>') + len('<template>')
    template_body_end = content.rfind('</template>')
    template_body = content[template_body_start:template_body_end]
    
    outer_div_open = re.search(r'<div class="' + class_name + '">', template_body)
    if not outer_div_open:
        print(f"  ERROR: no outer div")
        return content, False
    
    outer_open_pos = outer_div_open.end()
    last_div_close = template_body.rfind('</div>')
    if last_div_close <= outer_open_pos:
        print(f"  ERROR: last div close too early")
        return content, False
    
    prefix = template_body[:outer_open_pos]
    middle = template_body[outer_open_pos:last_div_close]
    suffix = template_body[last_div_close:]
    
    lines = middle.split('\n')
    indented = []
    for line in lines:
        if line.strip():
            indented.append('        ' + line.strip())
        else:
            indented.append(line)
    
    new_middle = '\n'.join(indented)
    new_template = prefix + '\n        <div class="content">\n' + new_middle + '\n        </div>\n        <SiteFooter @donate="goHome" />\n    ' + suffix
    
    new_content = content[:template_body_start] + new_template + content[template_body_end:]
    
    # Script modifications
    script_match = re.search(r'(<script>)(.*?)(</script>)', new_content, re.DOTALL)
    if script_match:
        script_start = script_match.start()
        script_end = script_match.end()
        script_body = script_match.group(2)
        
        script_body = "\nimport SiteFooter from '~/components/SiteFooter';\n" + script_body
        
        # Add components section
        if 'components:' not in script_body:
            name_match = re.search(r"(name:\s*['\"]Markdown['\"],)", script_body)
            if name_match:
                pos = name_match.end()
                script_body = script_body[:pos] + '\n    components: { SiteFooter },' + script_body[pos:]
        
        # Add goHome method
        close_pattern = re.search(r'(}\n};\n)</script>', script_body)
        if close_pattern:
            go_home = '    ,\n    methods: {\n        goHome() {\n            this.$router.push(\'/\');\n        }\n    }\n' + close_pattern.group(1)
            script_body = script_body.replace(close_pattern.group(1), go_home)
        
        new_content = new_content[:script_start] + '<script>' + script_body + '</script>' + new_content[script_end:]
    
    # Style modifications
    style_match = re.search(r'(<style lang="scss">)(.*?)(</style>)', new_content, re.DOTALL)
    if style_match:
        style_start = style_match.start()
        style_end = style_match.end()
        style_body = style_match.group(2)
        
        class_pattern = r'(\.' + class_name + r'\s*\{)'
        class_match = re.search(class_pattern, style_body)
        if class_match:
            insert_pos = class_match.end()
            style_body = style_body[:insert_pos] + '\n    .content {\n        padding: 20px 24px;\n        min-width: 0;\n    }' + style_body[insert_pos:]
        
        new_content = new_content[:style_start] + '<style lang="scss">' + style_body + '</style>' + new_content[style_end:]
    
    return new_content, True


# Dispatch fixers
fixers = {
    "acg_meme.vue": fix_acg_meme,
    "hide_tool.vue": fix_hide_tool,
    "setting.vue": fix_setting,
    "number_to_zh.vue": fix_number_to_zh,
    "image_editor.vue": fix_image_editor,
    "markdown.vue": fix_markdown,
}

for fname in target_files:
    fpath = os.path.join(PAGES_DIR, fname)
    if not os.path.exists(fpath):
        print(f"File not found: {fname}")
        continue
    
    fixer = fixers.get(fname)
    if not fixer:
        print(f"No fixer for: {fname}")
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    print(f"Processing: {fname}")
    new_content, changed = fixer(content, fname)
    
    if changed:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  MODIFIED successfully")
    elif not changed:
        pass  # Already logged in fixer function
