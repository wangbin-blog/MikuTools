<template>
    <div class="gitignore-generator">
        <div class="content">
            <nya-container title=".gitignore 生成器">
                <div class="tool-info mb-15">
                    <p>在线生成 .gitignore 文件，支持多种语言、框架、编辑器的忽略规则配置。</p>
                </div>

                <nya-input
                    v-model="searchText"
                    class="mb-15"
                    fullwidth
                    label="搜索"
                    placeholder="搜索语言/框架/工具...（如 python, vue, vscode）"
                    :append-icon="searchText ? 'eva-close-outline' : ''"
                    @click:append="searchText = ''"
                />

                <div class="options-container">
                    <div v-for="(group, groupKey) in filteredOptions" :key="groupKey" class="option-group">
                        <div class="group-label">{{ group.label }}</div>
                        <div class="options-wrap">
                            <button
                                v-for="option in group.items"
                                :key="option.key"
                                class="option-btn"
                                :class="{ active: selectedOptions.includes(option.key) }"
                                @click="toggleOption(option.key)"
                            >
                                {{ option.label }}
                            </button>
                        </div>
                    </div>
                </div>
            </nya-container>

            <nya-container title="生成结果" class="mb-15">
                <pre class="result-content">{{ generatedContent }}</pre>
                <div class="btn-group mt-15">
                    <button type="button" class="btn-info" @click="copyResult">
                        📋 {{ copySuccess ? '已复制' : '复制内容' }}
                    </button>
                    <button type="button" class="btn-primary" @click="downloadFile">
                        📥 下载文件
                    </button>
                </div>
            </nya-container>

            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>多选支持：</strong>可以选择多个分类的规则组合生成 .gitignore</li>
                        <li><strong>实时预览：</strong>选择选项后实时显示生成结果</li>
                        <li><strong>复制下载：</strong>支持一键复制和下载 .gitignore 文件</li>
                    </ul>

                    <h4>常用规则：</h4>
                    <ul>
                        <li><strong>Node.js：</strong>忽略 node_modules、dist、build 等</li>
                        <li><strong>Python：</strong>忽略 __pycache__、.venv、*.pyc 等</li>
                        <li><strong>VS Code：</strong>忽略 .vscode 目录（保留配置文件）</li>
                        <li><strong>macOS：</strong>忽略 .DS_Store、.Trashes 等系统文件</li>
                    </ul>
                </div>
            </nya-container>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GitignoreGenerator',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            searchText: '',
            selectedOptions: [],
            copySuccess: false,
            options: {
                common: {
                    label: '通用 / 常见产物',
                    items: [
                        { key: 'archive', label: '压缩包' },
                        { key: 'compiled', label: '编译 / 目标文件' },
                        { key: 'logs', label: '日志' },
                        { key: 'temp', label: '临时 / 备份' },
                        { key: 'secrets', label: '环境变量 / 密钥' }
                    ]
                },
                language: {
                    label: '语言 / 运行时',
                    items: [
                        { key: 'nodejs', label: 'Node.js' },
                        { key: 'python', label: 'Python' },
                        { key: 'java', label: 'Java' },
                        { key: 'go', label: 'Go' },
                        { key: 'rust', label: 'Rust' },
                        { key: 'csharp', label: 'C# / .NET' },
                        { key: 'cpp', label: 'C / C++' },
                        { key: 'php', label: 'PHP' },
                        { key: 'ruby', label: 'Ruby' }
                    ]
                },
                framework: {
                    label: '框架',
                    items: [
                        { key: 'nextjs', label: 'Next.js' },
                        { key: 'nuxt', label: 'Nuxt' },
                        { key: 'vue', label: 'Vue / Vite' },
                        { key: 'astro', label: 'Astro' },
                        { key: 'django', label: 'Django' },
                        { key: 'laravel', label: 'Laravel' },
                        { key: 'springboot', label: 'Spring Boot' },
                        { key: 'android', label: 'Android' },
                        { key: 'flutter', label: 'Flutter / Dart' },
                        { key: 'unity', label: 'Unity' }
                    ]
                },
                build: {
                    label: '构建 / 包管理',
                    items: [
                        { key: 'gradle', label: 'Gradle' },
                        { key: 'maven', label: 'Maven' },
                        { key: 'yarn', label: 'Yarn (Berry)' },
                        { key: 'terraform', label: 'Terraform' },
                        { key: 'docker', label: 'Docker' }
                    ]
                },
                ai: {
                    label: 'AI 工具',
                    items: [
                        { key: 'cursor', label: 'Cursor' },
                        { key: 'copilot', label: 'GitHub Copilot' },
                        { key: 'doubao', label: '豆包' },
                        { key: 'ernie', label: '文心一言' },
                        { key: 'tongyi', label: '通义千问' },
                        { key: 'xinghuo', label: '讯飞星火' }
                    ]
                },
                editor: {
                    label: '编辑器 / IDE',
                    items: [
                        { key: 'vscode', label: 'VS Code' },
                        { key: 'jetbrains', label: 'JetBrains (IDEA/PyCharm...)' },
                        { key: 'vim', label: 'Vim' },
                        { key: 'sublime', label: 'Sublime Text' },
                        { key: 'emacs', label: 'Emacs' }
                    ]
                },
                os: {
                    label: '操作系统',
                    items: [
                        { key: 'macos', label: 'macOS' },
                        { key: 'windows', label: 'Windows' },
                        { key: 'linux', label: 'Linux' }
                    ]
                }
            },
            gitignoreRules: {
                archive: [
                    '# Generated by 365工具箱 · .gitignore 生成器',
                    '',
                    '### 压缩包 ###',
                    '*.zip',
                    '*.tar',
                    '*.tar.gz',
                    '*.tgz',
                    '*.gz',
                    '*.bz2',
                    '*.xz',
                    '*.rar',
                    '*.7z',
                    '*.iso'
                ],
                compiled: [
                    '',
                    '### 编译 / 目标文件 ###',
                    '*.o',
                    '*.obj',
                    '*.a',
                    '*.lib',
                    '*.so',
                    '*.dylib',
                    '*.dll',
                    '*.exe',
                    '*.out',
                    '*.class'
                ],
                logs: [
                    '',
                    '### 日志 ###',
                    '*.log',
                    'logs/',
                    '*.log.*'
                ],
                temp: [
                    '',
                    '### 临时 / 备份 ###',
                    '*.tmp',
                    '*.temp',
                    '*.bak',
                    '*.old',
                    '*.orig',
                    '*.swp',
                    '*~',
                    '.cache/'
                ],
                secrets: [
                    '',
                    '### 环境变量 / 密钥 ###',
                    '.env',
                    '.env.local',
                    '.env.*.local',
                    '*.pem',
                    '*.key',
                    '*.p12',
                    '*.keystore',
                    'secrets.*',
                    'credentials.json'
                ],
                nodejs: [
                    '',
                    '### Node.js ###',
                    'node_modules/',
                    'npm-debug.log*',
                    'yarn-debug.log*',
                    'yarn-error.log*',
                    'pnpm-debug.log*',
                    '.npm',
                    '.eslintcache',
                    '.node_repl_history',
                    'dist/',
                    'build/',
                    'coverage/',
                    '.nyc_output'
                ],
                python: [
                    '',
                    '### Python ###',
                    '__pycache__/',
                    '*.py[cod]',
                    '*$py.class',
                    '.Python',
                    'develop-eggs/',
                    'downloads/',
                    'eggs/',
                    '.eggs/',
                    '*.egg-info/',
                    '*.egg',
                    '.installed.cfg',
                    '.pytest_cache/',
                    '.mypy_cache/',
                    '.ruff_cache/',
                    '.coverage',
                    '.coverage.*',
                    'htmlcov/',
                    '.tox/',
                    '.venv/',
                    'venv/',
                    'env/',
                    'ENV/',
                    '.ipynb_checkpoints'
                ],
                java: [
                    '',
                    '### Java ###',
                    '*.jar',
                    '*.war',
                    '*.ear',
                    '*.nar',
                    'hs_err_pid*',
                    'replay_pid*',
                    'target/',
                    '.mtj.tmp/'
                ],
                go: [
                    '',
                    '### Go ###',
                    '*.exe~',
                    '*.test',
                    'go.work',
                    'go.work.sum',
                    'vendor/',
                    'bin/'
                ],
                rust: [
                    '',
                    '### Rust ###',
                    '/target/',
                    '**/*.rs.bk',
                    'Cargo.lock',
                    '*.pdb'
                ],
                csharp: [
                    '',
                    '### C# / .NET ###',
                    'obj/',
                    '*.user',
                    '*.suo',
                    '*.userosscache',
                    '*.sln.docstates',
                    '[Dd]ebug/',
                    '[Rr]elease/',
                    'x64/',
                    'x86/',
                    '.vs/'
                ],
                cpp: [
                    '',
                    '### C / C++ ###',
                    '*.app',
                    '*.gch',
                    '*.pch',
                    'cmake-build-*/',
                    'CMakeCache.txt',
                    'CMakeFiles/'
                ],
                php: [
                    '',
                    '### PHP ###',
                    '/vendor/',
                    'composer.phar',
                    '.phpunit.result.cache'
                ],
                ruby: [
                    '',
                    '### Ruby ###',
                    '*.gem',
                    '*.rbc',
                    '/.bundle/',
                    '/vendor/bundle',
                    '/log/*',
                    '/tmp/*',
                    '.byebug_history',
                    '*.rbi'
                ],
                nextjs: [
                    '',
                    '### Next.js ###',
                    '.next/',
                    'out/',
                    'next-env.d.ts',
                    '.vercel'
                ],
                nuxt: [
                    '',
                    '### Nuxt ###',
                    '.nuxt/',
                    '.output/',
                    '.nitro',
                    '.cache'
                ],
                vue: [
                    '',
                    '### Vue / Vite ###',
                    'dist-ssr/',
                    '*.local',
                    '.vite/'
                ],
                astro: [
                    '',
                    '### Astro ###',
                    '.astro/'
                ],
                django: [
                    '',
                    '### Django ###',
                    'db.sqlite3',
                    'db.sqlite3-journal',
                    '/media/',
                    '/staticfiles/',
                    'local_settings.py'
                ],
                laravel: [
                    '',
                    '### Laravel ###',
                    '/node_modules/',
                    '/public/build/',
                    '/public/hot',
                    '/public/storage',
                    '/storage/*.key',
                    '.env.backup',
                    'Homestead.yaml',
                    'Homestead.json'
                ],
                springboot: [
                    '',
                    '### Spring Boot ###',
                    '!.mvn/wrapper/maven-wrapper.jar',
                    'HELP.md',
                    'application-local.yml',
                    'application-local.properties'
                ],
                android: [
                    '',
                    '### Android ###',
                    '*.iml',
                    '.gradle/',
                    'local.properties',
                    '.idea/',
                    'captures/',
                    '*.apk',
                    '*.aab',
                    '*.ap_',
                    '*.dex',
                    '.cxx/'
                ],
                flutter: [
                    '',
                    '### Flutter / Dart ###',
                    '.dart_tool/',
                    '.packages',
                    '.pub-cache/',
                    '.pub/',
                    '.flutter-plugins',
                    '.flutter-plugins-dependencies'
                ],
                unity: [
                    '',
                    '### Unity ###',
                    '[Ll]ibrary/',
                    '[Tt]emp/',
                    '[Oo]bj/',
                    '[Bb]uild/',
                    '[Bb]uilds/',
                    '[Ll]ogs/',
                    '[Uu]serSettings/',
                    '*.csproj',
                    '*.sln'
                ],
                gradle: [
                    '',
                    '### Gradle ###',
                    '!gradle/wrapper/gradle-wrapper.jar',
                    '!**/src/main/**/build/',
                    '!**/src/test/**/build/'
                ],
                maven: [
                    '',
                    '### Maven ###',
                    'pom.xml.tag',
                    'pom.xml.releaseBackup',
                    'pom.xml.versionsBackup',
                    'release.properties',
                    'dependency-reduced-pom.xml'
                ],
                yarn: [
                    '',
                    '### Yarn (Berry) ###',
                    '.yarn/*',
                    '!.yarn/patches',
                    '!.yarn/plugins',
                    '!.yarn/releases',
                    '!.yarn/versions',
                    '.pnp.*'
                ],
                terraform: [
                    '',
                    '### Terraform ###',
                    '.terraform/',
                    '*.tfstate',
                    '*.tfstate.*',
                    'crash.log',
                    '*.tfvars',
                    '*.tfvars.json',
                    'override.tf',
                    'override.tf.json',
                    '.terraformrc',
                    'terraform.rc'
                ],
                docker: [
                    '',
                    '### Docker ###',
                    'docker-compose.override.yml',
                    '.docker/'
                ],
                cursor: [
                    '',
                    '### Cursor ###',
                    '.cursor/',
                    '.cursor.cache/',
                    '.cursor.state/',
                    'cursor-*.log'
                ],
                copilot: [
                    '',
                    '### GitHub Copilot ###',
                    '.copilot/',
                    '.copilot-chat/',
                    '.copilot-workspace/'
                ],
                doubao: [
                    '',
                    '### 豆包 ###',
                    '.doubao/',
                    '.doubao.cache/',
                    'doubao-*.log'
                ],
                ernie: [
                    '',
                    '### 文心一言 ###',
                    '.ernie/',
                    '.ernie.cache/',
                    '.ernie-chat/'
                ],
                tongyi: [
                    '',
                    '### 通义千问 ###',
                    '.tongyi/',
                    '.tongyi.cache/',
                    '.aliyun-ai/'
                ],
                xinghuo: [
                    '',
                    '### 讯飞星火 ###',
                    '.xinghuo/',
                    '.xinghuo.cache/',
                    '.iflytek-ai/'
                ],
                vscode: [
                    '',
                    '### VS Code ###',
                    '.vscode/*',
                    '!.vscode/settings.json',
                    '!.vscode/tasks.json',
                    '!.vscode/launch.json',
                    '!.vscode/extensions.json',
                    '*.code-workspace',
                    '.history/'
                ],
                jetbrains: [
                    '',
                    '### JetBrains (IDEA/PyCharm…) ###',
                    '*.ipr',
                    '*.iws',
                    '.idea_modules/'
                ],
                vim: [
                    '',
                    '### Vim ###',
                    '*.swo',
                    '.netrwhist',
                    'Session.vim',
                    'tags'
                ],
                sublime: [
                    '',
                    '### Sublime Text ###',
                    '*.sublime-workspace',
                    '*.sublime-project'
                ],
                emacs: [
                    '',
                    '### Emacs ###',
                    '\\#*\\#',
                    '.\\#*',
                    '.emacs.desktop',
                    '.emacs.desktop.lock',
                    '*.elc'
                ],
                macos: [
                    '',
                    '### macOS ###',
                    '.DS_Store',
                    '.AppleDouble',
                    '.LSOverride',
                    '._*',
                    '.Spotlight-V100',
                    '.Trashes',
                    '.fseventsd',
                    '.DocumentRevisions-V100',
                    '.VolumeIcon.icns'
                ],
                windows: [
                    '',
                    '### Windows ###',
                    'Thumbs.db',
                    'Thumbs.db:encryptable',
                    'ehthumbs.db',
                    'ehthumbs_vista.db',
                    'Desktop.ini',
                    '$RECYCLE.BIN/',
                    '*.lnk',
                    '*.stackdump'
                ],
                linux: [
                    '',
                    '### Linux ###',
                    '.fuse_hidden*',
                    '.directory',
                    '.Trash-*',
                    '.nfs*'
                ]
            }
        };
    },
    computed: {
        filteredOptions() {
            if (!this.searchText) return this.options;
            const search = this.searchText.toLowerCase();
            const filtered = {};
            for (const [key, group] of Object.entries(this.options)) {
                const filteredItems = group.items.filter(item =>
                    item.label.toLowerCase().includes(search) ||
                    item.key.toLowerCase().includes(search)
                );
                if (filteredItems.length) {
                    filtered[key] = { ...group, items: filteredItems };
                }
            }
            return filtered;
        },
        generatedContent() {
            if (this.selectedOptions.length === 0) {
                return '# Generated by 365工具箱 · .gitignore 生成器\n\n# 请选择左侧选项以生成 .gitignore 文件';
            }
            const lines = [];
            this.selectedOptions.forEach(key => {
                if (this.gitignoreRules[key]) {
                    lines.push(...this.gitignoreRules[key]);
                }
            });
            return lines.join('\n').trim();
        }
    },
    methods: {
        toggleOption(key) {
            const index = this.selectedOptions.indexOf(key);
            if (index > -1) {
                this.selectedOptions.splice(index, 1);
            } else {
                this.selectedOptions.push(key);
            }
        },
        async copyResult() {
            try {
                await navigator.clipboard.writeText(this.generatedContent);
                this.copySuccess = true;
                this.$noty.success('已复制到剪贴板');
                setTimeout(() => {
                    this.copySuccess = false;
                }, 2000);
            } catch (err) {
                const textarea = document.createElement('textarea');
                textarea.value = this.generatedContent;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.copySuccess = true;
                this.$noty.success('已复制到剪贴板');
                setTimeout(() => {
                    this.copySuccess = false;
                }, 2000);
            }
        },
        downloadFile() {
            const blob = new Blob([this.generatedContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '.gitignore';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.$noty.success('文件下载成功');
        }
    }
};
</script>

<style lang="scss" scoped>
.gitignore-generator {
    .content {
        min-width: 0;
    }

    .options-container {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .option-group {
            .group-label {
                font-size: 12px;
                color: #999;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }

            .options-wrap {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .option-btn {
                padding: 8px 16px;
                border: 1px solid #e8e8e8;
                border-radius: 20px;
                background: #fff;
                color: #666;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;

                &:hover {
                    border-color: var(--theme);
                    color: var(--theme);
                }

                &.active {
                    background: var(--theme);
                    border-color: var(--theme);
                    color: #fff;
                }
            }
        }
    }

    .result-content {
        padding: 16px;
        margin: 0;
        background: #1a1a2e;
        color: #e0e0e0;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 400px;
        overflow-y: auto;
        border-radius: 8px;
    }

    .instructions {
        h4 {
            color: var(--primary-color);
            margin: 15px 0 10px 0;
        }

        ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
        }

        code {
            background: var(--bg-color);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
    }
}

body.dark .gitignore-generator {
    .option-group {
        .group-label {
            color: #666;
        }

        .option-btn {
            background: #1a1a2a;
            border-color: #2a2a3a;
            color: #aaa;

            &:hover {
                border-color: var(--theme);
                color: var(--theme);
            }

            &.active {
                background: var(--theme);
                border-color: var(--theme);
                color: #fff;
            }
        }
    }
}
</style>