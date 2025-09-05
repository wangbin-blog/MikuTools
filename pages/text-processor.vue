<template>
    <div class="text-processor">
        <nya-container title="文本处理工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>多功能文本处理工具，支持大小写转换、标点转换、简繁转换、文本替换、命名格式转换、文本过滤等功能。</p>
            </div>

            <div class="input-section">
                <nya-input
                    v-model="inputText"
                    placeholder="请在此输入需要处理的文本..."
                    type="textarea"
                    rows="8"
                    fullwidth
                    class="mb-15"
                />
                <div class="input-actions">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-secondary"
                        @click="clearInput"
                    >
                        🗑️ 清空输入
                    </button>
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-info"
                        @click="pasteFromClipboard"
                    >
                        📋 粘贴内容
                    </button>
                </div>
            </div>

        </nya-container>
        
            <!-- 处理选项 -->
            <nya-container title="处理选项" >
                <div class="processing-options">
                    <!-- 转换功能下拉选择框 -->
                    <div class="option-group">
                        <div class="replace-section">
                            <nya-select v-model="caseConversion" :items="caseOptions" 
                                class="replace-input" fullwidth @change="handleCaseConversion"></nya-select>
                        
                            <nya-select v-model="punctuationConversion" :items="punctuationOptions" 
                                class="replace-input" fullwidth @change="handlePunctuationConversion"></nya-select>
                            
                            <nya-select v-model="chineseConversion" :items="chineseOptions" 
                                class="replace-input" fullwidth @change="handleChineseConversion"></nya-select>
                            
                            <nya-select v-model="namingConversion" :items="namingOptions" 
                                class="replace-input" fullwidth @change="handleNamingConversion"></nya-select>
                            
                            <nya-select v-model="textFilter" :items="filterOptions" 
                                class="replace-input" fullwidth @change="handleTextFilter"></nya-select>
                        </div>  
                          <h4>文本替换</h4>
                        <div class="replace-section">
                            <nya-input
                                v-model="searchText"
                                placeholder="查找内容"
                                class="replace-input"
                            />
                            <nya-input
                                v-model="replaceText"
                                placeholder="替换为"
                                class="replace-input"
                            />
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-primary"
                                @click="replaceTextContent"
                            >
                                🔄 替换全部
                            </button>
                        </div>                      
                    </div>

                </div>
            </nya-container>

            <!-- 输出区域 -->
            <nya-container title="处理结果" >
                <div class="output-section">
                    <nya-input
                        v-model="outputText"
                        placeholder="处理后的文本将显示在这里..."
                        rows="8"
                        type="textarea"
                        fullwidth
                        readonly
                        class="mb-15"
                    />
                    <div class="output-actions">
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-success"
                            @click="copyToClipboard"
                        >
                            📋 复制结果
                        </button>
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-info"
                            @click="downloadResult"
                        >
                            📥 下载文本
                        </button>
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-secondary"
                            @click="clearOutput"
                        >
                            🗑️ 清空结果
                        </button>
                    </div>
                </div>
            </nya-container>

            <!-- 统计信息 -->
            <nya-container title="统计信息"  v-if="inputText || outputText">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">输入字符数</span>
                        <span class="stat-value">{{ inputText.length }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">输入行数</span>
                        <span class="stat-value">{{ inputText.split('\n').length }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">输入词数</span>
                        <span class="stat-value">{{ inputText.trim().split(/\s+/).filter(word => word.length > 0).length }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">输出字符数</span>
                        <span class="stat-value">{{ outputText.length }}</span>
                    </div>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>大小写转换：</strong>支持全部大写、全部小写、首字母大写、单词首字母大写</li>
                        <li><strong>标点转换：</strong>中英文标点符号相互转换</li>
                        <li><strong>简繁转换：</strong>简体与繁体中文相互转换</li>
                        <li><strong>命名格式：</strong>支持kebab-case、snake_case、camelCase、PascalCase、SNAKE_CASE</li>
                        <li><strong>文本过滤：</strong>去除首尾空格、空行、换行符等</li>
                        <li><strong>文本替换：</strong>自定义查找替换内容</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>在上方输入框中输入或粘贴需要处理的文本</li>
                        <li>点击相应按钮进行文本处理操作</li>
                        <li>处理结果会实时显示在输出区域</li>
                        <li>可下载处理后的文本或直接复制使用</li>
                    </ul>
                </div>
            </nya-container>
    </div>
</template>

<script>
export default {
    name: 'TextProcessor',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            searchText: '',
            replaceText: '',
            caseConversion: '',
            punctuationConversion: '',
            chineseConversion: '',
            namingConversion: '',
            textFilter: '',
            caseOptions: {
                '': '大小写转换',
                'upper': '全部大写',
                'lower': '全部小写',
                'capitalize': '行首字母大写',
                'wordCap': '单词首字母大写'
            },
            punctuationOptions: {
                '': '标点转换',
                'zh2en': '中文标点转英文标点',
                'en2zh': '英文标点转中文标点'
            },
            chineseOptions: {
                '': '简繁转换',
                's2t': '简体转繁体',
                't2s': '繁体转简体'
            },
            namingOptions: {
                '': '命名格式转换',
                'kebab': 'kebab-case',
                'snake': 'snake_case',
                'camel': 'camelCase',
                'pascal': 'PascalCase',
                'upper': 'SNAKE_CASE'
            },
            filterOptions: {
                '': '文本过滤',
                'trim': '去除首尾空格',
                'emptyLines': '去除空行',
                'newlines': '去除换行',
                'all': '清理全部'
            },
            traditionalChars: {
                '万': '萬', '与': '與', '丑': '醜', '专': '專', '业': '業',
                '东': '東', '丢': '丟', '两': '兩', '严': '嚴', '丧': '喪',
                '个': '個', '临': '臨', '为': '為', '丽': '麗', '举': '舉',
                '义': '義', '乐': '樂', '习': '習', '乡': '鄉', '书': '書',
                '买': '買', '乱': '亂', '争': '爭', '于': '於', '亏': '虧',
                '云': '雲', '亚': '亞', '产': '產', '亩': '畝', '亲': '親',
                '亵': '褻', '亸': '嚲', '亿': '億', '仅': '僅', '从': '從',
                '仑': '侖', '仓': '倉', '仪': '儀', '们': '們', '价': '價',
                '众': '眾', '优': '優', '会': '會', '伞': '傘', '伟': '偉',
                '传': '傳', '伤': '傷', '伦': '倫', '伪': '偽', '伯': '伯',
                '佣': '傭', '低': '低', '住': '住', '佐': '佐', '佑': '佑',
                '体': '體', '何': '何', '余': '餘', '佛': '佛', '作': '作',
                '你': '你', '佣': '傭', '佩': '佩', '佬': '佬', '佳': '佳',
                '使': '使', '侄': '侄', '侦': '偵', '侧': '側', '侨': '僑',
                '侩': '儈', '侪': '儕', '侬': '儂', '俭': '儉', '修': '修',
                '俯': '俯', '俱': '俱', '俪': '儷', '债': '債', '倾': '傾',
                '假': '假', '伟': '偉', '停': '停', '健': '健', '侧': '側',
                '偶': '偶', '偷': '偷', '偿': '償', '储': '儲', '催': '催',
                '傲': '傲', '傻': '傻', '像': '像', '僚': '僚', '僧': '僧',
                '僵': '僵', '僻': '僻', '仪': '儀', '亿': '億', '俭': '儉',
                '债': '債', '倾': '傾', '假': '假', '伟': '偉', '停': '停',
                '健': '健', '侧': '側', '偶': '偶', '偷': '偷', '偿': '償',
                '储': '儲', '催': '催', '傲': '傲', '傻': '傻', '像': '像',
                '僚': '僚', '僧': '僧', '僵': '僵', '僻': '僻', '仪': '儀',
                '亿': '億', '俭': '儉', '债': '債', '倾': '傾', '假': '假',
                '伟': '偉', '停': '停', '健': '健', '侧': '側', '偶': '偶',
                '偷': '偷', '偿': '償', '储': '儲', '催': '催', '傲': '傲',
                '傻': '傻', '像': '像', '僚': '僚', '僧': '僧', '僵': '僵',
                '僻': '僻', '仪': '儀', '亿': '億', '俭': '儉', '债': '債',
                '倾': '傾', '假': '假', '伟': '偉', '停': '停', '健': '健',
                '侧': '側', '偶': '偶', '偷': '偷', '偿': '償', '储': '儲',
                '催': '催', '傲': '傲', '傻': '傻', '像': '像', '僚': '僚',
                '僧': '僧', '僵': '僵', '僻': '僻'
            }
        };
    },
    methods: {
        clearInput() {
            this.inputText = '';
        },
        clearOutput() {
            this.outputText = '';
        },
        async pasteFromClipboard() {
            try {
                const text = await navigator.clipboard.readText();
                this.inputText = text;
            } catch (err) {
                this.$noty.error('无法访问剪贴板，请手动粘贴');
            }
        },
        async copyToClipboard() {
            if (!this.outputText) {
                this.$noty.warning('没有内容可复制');
                return;
            }
            try {
                await navigator.clipboard.writeText(this.outputText);
                this.$noty.success('已复制到剪贴板');
            } catch (err) {
                this.$noty.error('复制失败，请手动选择复制');
            }
        },
        downloadResult() {
            if (!this.outputText) {
                this.$noty.warning('没有内容可下载');
                return;
            }
            const blob = new Blob([this.outputText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `processed_text_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        convertCase(type) {
            if (!this.inputText) {
                this.$noty.warning('请先输入文本');
                return;
            }
            let result = '';
            switch (type) {
                case 'upper':
                    result = this.inputText.toUpperCase();
                    break;
                case 'lower':
                    result = this.inputText.toLowerCase();
                    break;
                case 'capitalize':
                    result = this.inputText.replace(/(?:^|\n)\s*(\S)/g, (match, char) => 
                        match.replace(char, char.toUpperCase())
                    );
                    break;
                case 'title':
                    result = this.inputText.replace(/\b\w/g, char => char.toUpperCase());
                    break;
            }
            this.outputText = result;
        },
        convertPunctuation(direction) {
            if (!this.inputText) {
                this.$noty.warning('请先输入文本');
                return;
            }
            let result = this.inputText;
            if (direction === 'zh2en') {
                result = result
                    .replace(/，/g, ',')
                    .replace(/。/g, '.')
                    .replace(/？/g, '?')
                    .replace(/！/g, '!')
                    .replace(/：/g, ':')
                    .replace(/；/g, ';')
                    .replace(/"([^"]*)"/g, '"$1"')
                    .replace(/'([^']*)'/g, "'$1'")
                    .replace(/（/g, '(')
                    .replace(/）/g, ')')
                    .replace(/【/g, '[')
                    .replace(/】/g, ']')
                    .replace(/｛/g, '{')
                    .replace(/｝/g, '}');
            } else {
                result = result
                    .replace(/,/g, '，')
                    .replace(/\./g, '。')
                    .replace(/\?/g, '？')
                    .replace(/!/g, '！')
                    .replace(/:/g, '：')
                    .replace(/;/g, '；')
                    .replace(/"([^"]*)"/g, '「$1」')
                    .replace(/'([^']*)'/g, '『$1』')
                    .replace(/\(/g, '（')
                    .replace(/\)/g, '）')
                    .replace(/\[/g, '【')
                    .replace(/\]/g, '】')
                    .replace(/\{/g, '｛')
                    .replace(/\}/g, '｝');
            }
            this.outputText = result;
        },
        convertChinese(direction) {
            if (!this.inputText) {
                this.$noty.warning('请先输入文本');
                return;
            }
            let result = this.inputText;
            if (direction === 's2t') {
                // 简转繁
                for (let [simplified, traditional] of Object.entries(this.traditionalChars)) {
                    result = result.replace(new RegExp(simplified, 'g'), traditional);
                }
            } else {
                // 繁转简
                for (let [simplified, traditional] of Object.entries(this.traditionalChars)) {
                    result = result.replace(new RegExp(traditional, 'g'), simplified);
                }
            }
            this.outputText = result;
        },
        convertNaming(type) {
            if (!this.inputText) {
                this.$noty.warning('请先输入文本');
                return;
            }
            let text = this.inputText.trim();
            let result = '';
            
            switch (type) {
                case 'kebab':
                    result = text
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
                        .replace(/([A-Z])/g, '-$1')
                        .toLowerCase()
                        .replace(/^-+|-+$/g, '');
                    break;
                case 'snake':
                    result = text
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '_')
                        .replace(/([A-Z])/g, '_$1')
                        .toLowerCase()
                        .replace(/^_+|_+$/g, '');
                    break;
                case 'camel':
                    result = text
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+(.)/g, (_, chr) => chr.toUpperCase())
                        .replace(/([A-Z])/g, (_, chr) => chr.toUpperCase())
                        .replace(/^(.)/, chr => chr.toLowerCase());
                    break;
                case 'pascal':
                    result = text
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+(.)/g, (_, chr) => chr.toUpperCase())
                        .replace(/([A-Z])/g, (_, chr) => chr.toUpperCase())
                        .replace(/^(.)/, chr => chr.toUpperCase());
                    break;
                case 'upper':
                    result = text
                        .toUpperCase()
                        .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '_')
                        .replace(/([a-z])/g, chr => chr.toUpperCase());
                    break;
            }
            this.outputText = result;
        },
        filterText(type) {
            if (!this.inputText) {
                this.$noty.warning('请先输入文本');
                return;
            }
            let result = this.inputText;
            switch (type) {
                case 'trim':
                    result = result.trim();
                    break;
                case 'emptyLines':
                    result = result.replace(/\n\s*\n/g, '\n').replace(/^\s+|\s+$/g, '');
                    break;
                case 'newlines':
                    result = result.replace(/\r\n|\r|\n/g, ' ').replace(/\s+/g, ' ').trim();
                    break;
                case 'all':
                    result = result
                        .replace(/\r\n|\r|\n/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    break;
            }
            this.outputText = result;
        },
        replaceTextContent() {
            if (!this.inputText || !this.searchText) {
                this.$noty.warning('请输入查找内容');
                return;
            }
            this.outputText = this.inputText.replace(
                new RegExp(this.searchText, 'g'), 
                this.replaceText
            );
        },
        handleCaseConversion() {
            if (this.caseConversion) {
                this.convertCase(this.caseConversion);
            }
        },
        handlePunctuationConversion() {
            if (this.punctuationConversion) {
                this.convertPunctuation(this.punctuationConversion);
            }
        },
        handleChineseConversion() {
            if (this.chineseConversion) {
                this.convertChinese(this.chineseConversion);
            }
        },
        handleNamingConversion() {
            if (this.namingConversion) {
                this.convertNaming(this.namingConversion);
            }
        },
        handleTextFilter() {
            if (this.textFilter) {
                this.filterText(this.textFilter);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.text-processor {
    max-width: 1200px;
    margin: 0 auto;
}

.tool-info {
    background: var(--bg-color);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
    
    h3 {
        color: var(--primary-color);
        margin-bottom: 10px;
    }
    
    p {
        color: var(--text-color-secondary);
        line-height: 1.6;
    }
}

.input-section,
.output-section {
    .input-actions,
    .output-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        
        button {
            flex: 1;
            min-width: 120px;
        }
    }
}

.processing-options {
    .option-group {
        margin-bottom: 25px;
        padding: 15px;
        background: var(--bg-color-secondary);
        border-radius: 8px;
        
        h4 {
            color: var(--primary-color);
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 600;
        }
        
        .option-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            
            button {
                padding: 8px 16px;
                font-size: 14px;
                border-radius: 6px;
                transition: all 0.3s ease;
                
                &:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
            }
        }
    }
    
    .replace-section {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        
        .replace-input {
            flex: 1;
            min-width: 200px;
        }
        
        button {
            flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
            flex-direction: column;
            align-items: stretch;
            
            .replace-input,
            button {
                width: 100%;
            }
        }
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    
    .stat-item {
        text-align: center;
        padding: 15px;
        background: var(--bg-color-secondary);
        border-radius: 8px;
        
        .stat-label {
            display: block;
            font-size: 14px;
            color: var(--text-color-secondary);
            margin-bottom: 5px;
        }
        
        .stat-value {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-color);
        }
    }
}

.instructions {
    ul {
        margin: 0;
        padding-left: 20px;
        
        li {
            margin-bottom: 8px;
            color: var(--text-color-secondary);
            line-height: 1.6;
            
            strong {
                color: var(--text-color);
            }
        }
    }
    
    h4 {
        color: var(--primary-color);
        margin: 15px 0 10px 0;
    }
}

.mb-15 {
    margin-bottom: 15px;
}

@media (max-width: 768px) {
    .processing-options {
        .option-buttons {
            flex-direction: column;
            
            button {
                width: 100%;
                margin-bottom: 5px;
            }
        }
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>