<template>
    <div class="js-html-formatter">
        <nya-container title="JavaScript/HTML 压缩/格式化工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>提供JavaScript和HTML代码的压缩与格式化功能，支持多种压缩选项和格式化风格。</p>
            </div>

            <!-- 工具选择 -->
            <nya-select
                v-model="selectedTool"
                class="mb-15"
                label="选择工具"
                :items="toolOptions"
            />

            <!-- 代码类型选择 -->
            <nya-select
                v-model="codeType"
                class="mb-15"
                label="代码类型"
                :items="codeTypeOptions"
            />
            <div class="checkbox-group mb-15" v-if="selectedTool === 'compress'">
                <nya-checkbox
                        v-model="compressOptions.removeComments"
                        label="移除注释"
                    />
                    <nya-checkbox
                        v-model="compressOptions.removeWhitespace"
                        label="移除多余空白"
                    />
                    <nya-checkbox
                        v-if="codeType === 'js'"
                        v-model="compressOptions.minifyVariables"
                        label="压缩变量名"
                    />
                    <nya-checkbox
                        v-if="codeType === 'js'"
                        v-model="compressOptions.removeConsole"
                        label="移除console语句"
                    />
            </div>
            <div class="checkbox-group mb-15" v-if="selectedTool === 'format'">
                <nya-select
                    v-model="formatOptions.indentSize"
                    :items="indentOptions"
                />
                <nya-checkbox
                    v-model="formatOptions.useTabs"
                    label="使用Tab缩进"
                />
                <nya-checkbox
                    v-model="formatOptions.braceStyle"
                    label="大括号换行"
                />
            </div>
            <!-- 输入区域 -->
            <nya-input
                v-model="inputCode"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入代码"
                placeholder="请输入需要处理的代码..."
            />

            <!-- 操作按钮 -->
            <div class="btn-group mb-15">
                <button type="button" class="btn-primary" @click="formatCode">
                    ✨ 格式化
                </button>
                <button type="button" class="btn-success" @click="compressCode">
                    🗜️ 压缩
                </button>
                <button type="button" class="btn-danger" @click="clearCode">
                    🗑️ 清空
                </button>
                <button type="button" class="btn-control copy-btn" @click="copyResult">
                    📋 复制结果
                </button>
            </div>


        </nya-container>

            <!-- 结果展示 -->
            <nya-container v-if="outputCode" title="处理结果">
                <nya-input
                    v-model="outputCode"
                    class="mb-15"
                    fullwidth
                    rows="8"
                    type="textarea"
                    readonly
                    label="输出代码"
                />
                <div class="result-info">
                    <p>原始大小: {{ originalSize }} 字符</p>
                    <p>处理后大小: {{ outputSize }} 字符</p>
                    <p v-if="selectedTool === 'compress'">
                        压缩率: {{ compressionRatio }}%
                    </p>
                </div>
            </nya-container>
        <!-- 使用说明 -->
        <nya-container title="使用说明">
            <div class="instructions">
                <h4>功能介绍：</h4>
                <ul>
                    <li><strong>格式化：</strong>将压缩的代码格式化为易读的形式</li>
                    <li><strong>压缩：</strong>移除多余字符，减小代码体积</li>
                    <li><strong>支持类型：</strong>JavaScript和HTML代码</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>选择正确的代码类型以获得最佳效果</li>
                    <li>压缩前请备份原始代码</li>
                    <li>可根据需要调整压缩和格式化选项</li>
                </ul>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'JsHtmlFormatter',
    data() {
        return {
            selectedTool: 'format',
            codeType: 'js',
            inputCode: '',
            outputCode: '',
            originalSize: 0,
            outputSize: 0,
            toolOptions: {  'format':'格式化', 'compress' :'压缩'},
            codeTypeOptions:{   'js':'JavaScript', 'html':'HTML' },
            indentOptions: {   2:'2个空格', 4 :'4个空格', 8:'8个空格' },
            compressOptions: {
                removeComments: true,
                removeWhitespace: true,
                minifyVariables: false,
                removeConsole: false
            },
            formatOptions: {
                indentSize: 2,
                useTabs: false,
                braceStyle: false
            }
        };
    },
    computed: {
        compressionRatio() {
            if (this.originalSize === 0) return 0;
            return Math.round(((this.originalSize - this.outputSize) / this.originalSize) * 100);
        }
    },
    methods: {
        formatCode() {
            if (!this.inputCode.trim()) {
                this.$noty.error('请输入需要格式化的代码');
                return;
            }

            this.originalSize = this.inputCode.length;
            
            try {
                if (this.codeType === 'js') {
                    this.outputCode = this.formatJavaScript(this.inputCode);
                } else {
                    this.outputCode = this.formatHTML(this.inputCode);
                }
                
                this.outputSize = this.outputCode.length;
                this.$noty.success('格式化成功');
            } catch (error) {
                this.$noty.error('格式化失败：' + error.message);
            }
        },

        compressCode() {
            if (!this.inputCode.trim()) {
                this.$noty.error('请输入需要压缩的代码');
                return;
            }

            this.originalSize = this.inputCode.length;
            
            try {
                if (this.codeType === 'js') {
                    this.outputCode = this.compressJavaScript(this.inputCode);
                } else {
                    this.outputCode = this.compressHTML(this.inputCode);
                }
                
                this.outputSize = this.outputCode.length;
                this.$noty.success('压缩成功');
            } catch (error) {
                this.$noty.error('压缩失败：' + error.message);
            }
        },

        formatJavaScript(code) {
            // 基本的JavaScript格式化逻辑
            let formatted = code;
            
            // 简单的缩进处理
            const indent = ' '.repeat(this.formatOptions.indentSize);
            let indentLevel = 0;
            
            formatted = formatted
                .replace(/\s+/g, ' ')
                .replace(/\s*{\s*/g, ' {\n' + indent.repeat(indentLevel + 1))
                .replace(/;\s*/g, ';\n' + indent.repeat(indentLevel))
                .replace(/}\s*/g, '\n' + indent.repeat(Math.max(0, indentLevel - 1)) + '}\n');
            
            return formatted.trim();
        },

        formatHTML(code) {
            // 基本的HTML格式化逻辑
            const indent = ' '.repeat(this.formatOptions.indentSize);
            let formatted = code;
            
            // 简单的标签缩进
            formatted = formatted
                .replace(/></g, '>\n<')
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join('\n');
            
            return formatted;
        },

        compressJavaScript(code) {
            let compressed = code;
            
            if (this.compressOptions.removeComments) {
                compressed = compressed.replace(/\/\*[\s\S]*?\*\//g, '');
                compressed = compressed.replace(/\/\/.*$/gm, '');
            }
            
            if (this.compressOptions.removeWhitespace) {
                compressed = compressed.replace(/\s+/g, ' ');
                compressed = compressed.replace(/\s*{\s*/g, '{');
                compressed = compressed.replace(/\s*}\s*/g, '}');
                compressed = compressed.replace(/\s*;\s*/g, ';');
                compressed = compressed.replace(/\s*,\s*/g, ',');
            }
            
            if (this.compressOptions.removeConsole) {
                compressed = compressed.replace(/console\.\w+\([^)]*\);?/g, '');
            }
            
            return compressed.trim();
        },

        compressHTML(code) {
            let compressed = code;
            
            if (this.compressOptions.removeComments) {
                compressed = compressed.replace(/<!--[\s\S]*?-->/g, '');
            }
            
            if (this.compressOptions.removeWhitespace) {
                compressed = compressed.replace(/>\s+</g, '><');
                compressed = compressed.replace(/\s+/g, ' ');
            }
            
            return compressed.trim();
        },

        clearCode() {
            this.inputCode = '';
            this.outputCode = '';
            this.originalSize = 0;
            this.outputSize = 0;
            this.$noty.info('已清空');
        },

        copyResult() {
            if (this.outputCode) {
                this.$copyText(this.outputCode);
                this.$noty.success('结果已复制到剪贴板');
            } else {
                this.$noty.error('没有可复制的内容');
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.js-html-formatter {
    max-width: 1200px;
    margin: 0 auto;

    .tool-info {
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        
        h3 {
            margin: 0 0 10px 0;
            color: var(--primary-color);
        }
        
        p {
            margin: 0;
            color: var(--text-color);
            line-height: 1.6;
        }
    }

    .compress-options,
    .format-options {
        display: flex;
        flex-direction: column;
        gap: 10px;
        
        .nya-checkbox {
            margin-right: 15px;
        }
    }

    .result-info {
        margin-top: 15px;
        padding: 10px;
        background: var(--bg-color);
        border-radius: 8px;
        
        p {
            margin: 5px 0;
            color: var(--text-color);
            font-size: 14px;
        }
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
        
        li {
            margin: 5px 0;
            color: var(--text-color);
            line-height: 1.6;
        }
    }


    @media (max-width: 768px) {
        .btn-group {
            flex-direction: column;
            
            button {
                width: 100%;
            }
        }
        
        .compress-options,
        .format-options {
            flex-direction: column;
        }
    }
}
</style>