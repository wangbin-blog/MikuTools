<template>
    <div class="content">
    <div class="json-convert-format">
        <nya-container title="JSON 格式化工具">
            <div class="checkbox-group mb-15">
                <nya-checkbox v-model="options.sortKeys" label="按键名排序" />
                <nya-checkbox v-model="options.removeNull" label="移除null值" />
                <nya-checkbox v-model="options.indent2" label="使用2个空格缩进" />
            </div>
            
            <div class="btn-group mb-15">
                <div class="btn-row">
                    <div class="btn-primary" @click="formatInput">✨ 格式化 </div>
                    <div class="btn-success" @click="minifyInput">🗜️ 压缩</div>
                    <div class="btn-info" @click="validateJSON">✅ 验证</div>
                </div>
            </div>

            <div class="json-layout">
                <div class="input-section">
                    <div class="input-header">
                        <h3>输入JSON文本</h3>
                        <div class="input-controls">
                            <button class="btn-danger" @click="clearInput">🗑️ 清空 </button>
                        </div>
                    </div>
                    
                    <div class="json-input">
                        <nya-input
                            v-model="inputText"
                            fullwidth
                            rows="31"
                            type="textarea" 
                            autofocus
                            placeholder="请输入JSON格式的文本..."
                        />
                    </div>
                </div>

                <div class="output-section">
                    <div class="output-header">
                        <h3>格式化结果</h3>
                        <div class="output-controls">
                            <button class="btn-control copy-btn" @click="copyResult" :disabled="!outputText">
                                <span>📋</span> 复制
                            </button>
                            <button class="btn-control download-btn" @click="downloadJSON" :disabled="!outputText">
                                <span>⬇️</span> 下载
                            </button>
                        </div>
                    </div>

                    <div v-if="jsonData" class="json-output">
                        <json-viewer 
                            :value="jsonData"
                            :expand-depth="3"
                            copyable
                            boxed
                            sort
                        />
                    </div>
                    <div v-else-if="outputText" class="result-text">{{ outputText }}</div>
                    <div v-else-if="errorMessage" class="error-state">
                        <div class="error-message">{{ errorMessage }}</div>
                    </div>
                    <div v-else class="empty-state">
                        请输入JSON文本并点击格式化按钮
                    </div>
                </div>
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>功能介绍：</strong>提供JSON字符串的格式化、压缩、验证等功能</li>
                <li><strong>格式化：</strong>将压缩的JSON格式化为易读的缩进格式</li>
                <li><strong>压缩：</strong>移除JSON中的所有空白字符，减小文件大小</li>
                <li><strong>验证：</strong>检查JSON字符串的语法是否正确</li>
                <li><strong>排序：</strong>自动按字母顺序排序对象的键名</li>
                <li><strong>清理：</strong>自动移除空值和null值，保持数据清洁</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>输入JSON：</strong>
                    <code>{"name":"张三","age":25,"skills":["JavaScript","Vue","Node.js"]}</code>
                </div>
                <div class="example-item">
                    <strong>格式化结果：</strong>
                    <code>{
  "age": 25,
  "name": "张三",
  "skills": [
    "JavaScript",
    "Vue",
    "Node.js"
  ]
}</code>
                </div>
            </div>
        </nya-container>
    </div>
    
    </div>
</template>

<script>

export default {
    name: 'JsonConvertFormat',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {},
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            errorMessage: '',
            options: {
                indent2: true,
                sortKeys: false,
                removeNull: false
            }
        };
    },
    computed: {
        formattedJson() {
            return this.jsonData ? JSON.stringify(this.jsonData, null, 2) : '';
        }
    },
    watch: {
        inputText() {
            this.handleInput();
        }
    },
    methods: {
        handleInput() {
            this.errorMessage = '';
            if (!this.inputText.trim()) {
                this.jsonData = null;
                this.outputText = '';
                return;
            }
            
            try {
                this.jsonData = JSON.parse(this.inputText);
                this.formatInput();
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.errorMessage = `JSON格式错误: ${error.message}`;
            }
        },
        
        formatInput() {
            if (!this.jsonData) {
                this.validateJSON();
                return;
            }
            
            try {
                let processedData = this.jsonData;
                
                if (this.options.removeNull) {
                    processedData = this.removeNullValues(processedData);
                }
                
                if (this.options.sortKeys) {
                    processedData = this.sortObjectKeys(processedData);
                }
                
                // 格式化时保持jsonData用于json-viewer显示
                this.jsonData = processedData;
                this.outputText = JSON.stringify(processedData, null, this.options.indent2 ? 2 : 4);
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = `格式化错误: ${error.message}`;
            }
        },
        
        minifyInput() {
            if (!this.jsonData) {
                this.validateJSON();
                return;
            }
            
            try {
                let processedData = this.jsonData;
                
                if (this.options.removeNull) {
                    processedData = this.removeNullValues(processedData);
                }
                
                if (this.options.sortKeys) {
                    processedData = this.sortObjectKeys(processedData);
                }
                
                this.outputText = JSON.stringify(processedData);
                this.jsonData = null; // 清空jsonData，让压缩结果显示在文本容器中
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = `压缩错误: ${error.message}`;
            }
        },
        
        validateJSON() {
            if (!this.inputText.trim()) {
                this.errorMessage = '请输入JSON字符串';
                return;
            }
            
            try {
                const parsed = JSON.parse(this.inputText);
                this.jsonData = parsed;
                this.formatInput();
                this.errorMessage = 'JSON格式正确 ✓';
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.errorMessage = `JSON格式错误: ${error.message}`;
            }
        },
        
        clearInput() {
            this.inputText = '';
            this.outputText = '';
            this.jsonData = null;
            this.errorMessage = '';
        },
        
        copyResult() {
            if (!this.outputText) return;
            
            navigator.clipboard.writeText(this.outputText).then(() => {
                alert('JSON已复制到剪贴板');
            }).catch(() => {
                alert('复制失败，请手动复制');
            });
        },
        
        downloadJSON() {
            if (!this.outputText) return;
            
            const blob = new Blob([this.outputText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        
        // 工具函数
        removeNullValues(obj) {
            if (Array.isArray(obj)) {
                return obj.filter(item => item !== null && item !== undefined)
                    .map(item => typeof item === 'object' ? this.removeNullValues(item) : item);
            } else if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== null && value !== undefined) {
                        newObj[key] = typeof value === 'object' ? this.removeNullValues(value) : value;
                    }
                }
                return newObj;
            }
            return obj;
        },
        
        sortObjectKeys(obj) {
            if (Array.isArray(obj)) {
                return obj.map(item => typeof item === 'object' ? this.sortObjectKeys(item) : item);
            } else if (typeof obj === 'object' && obj !== null) {
                const sorted = {};
                Object.keys(obj).sort().forEach(key => {
                    sorted[key] = typeof obj[key] === 'object' ? this.sortObjectKeys(obj[key]) : obj[key];
                });
                return sorted;
            }
            return obj;
        }
    }
};
</script>

<style scoped>
.json-convert-format {
    /* max-width: 1200px; */
    margin: 0 auto;
    /* padding: 20px; */
}

.checkbox-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 15px;
    
    :deep(.nya-checkbox) {
        margin-right: 0;
        white-space: nowrap;
    }
}

.mb-15 {
    margin-bottom: 15px;
}

.mr-15 {
    margin-right: 15px;
}

.json-preview {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    overflow-x: auto;
    font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    
    code {
        background: transparent;
        padding: 0;
        border: none;
        font-size: inherit;
        line-height: inherit;
    }
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    padding: 15px;
    font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.examples {
    .example-item {
        margin-bottom: 25px;
        
        strong {
            display: block;
            margin-bottom: 12px;
            color: #2c3e50;
            font-size: 16px;
            font-weight: 600;
            line-height: 1.4;
        }
        
        code {
            display: block;
            padding: 18px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
            color: #495057;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
    }
}

.tips {
    background: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 20px 25px;
    border-radius: 0 8px 8px 0;
    margin: 20px 0;
    
    li {
        margin-bottom: 12px;
        line-height: 1.7;
        color: #495057;
        font-size: 15px;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        strong {
            color: #007bff;
            font-weight: 600;
        }
    }
}

.btn-group {
    margin: 15px 0;
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    overflow: visible;
}

.btn-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    transition: background-color 0.2s;
}

.btn-group-header:hover {
    background: #f1f3f4;
}

.toggle-icon {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s;
}

.toggle-icon.rotated {
    transform: rotate(180deg);
}

.btn-container {
    padding: 10px;
}

.btn-container.collapsed {
    padding-bottom: 0;
}

.btn-row {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.btn-row:last-child {
    margin-bottom: 0;
}

.btn-row .nya-btn {
    margin: 0;
    flex: 1;
    min-width: 80px;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: center;
    text-decoration: none;
    display: inline-block;
    line-height: 1.4;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.btn-row .nya-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.btn-row .nya-btn:hover::before {
    left: 100%;
}

.btn-row .nya-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-row .nya-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-row .nya-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-row .nya-btn.success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
}

.btn-row .nya-btn.warning {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
}

.btn-row .nya-btn.info {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
}

.btn-row .nya-btn.danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
}

.json-layout {
    display: flex;
    gap: 20px;
    min-height: 500px;
}

.input-section {
    flex: 1;
    min-width: 0;
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}

.input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e1e5e9;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
}

.input-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.input-controls {
    display: flex;
    gap: 10px;
}

.json-input {
    flex: 1;
    /* padding: 15px; */
    overflow: auto;
    max-height: 600px;
}

.json-input :deep(textarea) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    max-height: 550px;
    overflow-y: hidden;
}

.output-section {
    flex: 1;
    min-width: 0;
    background: #fff;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
}

.output-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #e1e5e9;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
}

.output-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.output-controls {
    display: flex;
    gap: 10px;
}

.output-controls {
    display: flex;
    gap: 8px;
}

.control-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.control-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.control-btn:hover::before {
    left: 100%;
}

.copy-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.download-btn {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
}

.control-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:disabled {
    background: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.json-output {
    flex: 1;
    padding: 15px;
    overflow: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    max-height: 600px;
}

.result-text {
    flex: 1;
    padding: 15px;
    overflow: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 600px;
}

.empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-style: italic;
}

.error-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
}

:deep(.nya-input) {
    margin-bottom: 0;
    
    textarea {
        border-radius: 8px;
        border: 1px solid #ced4da;
        transition: all 0.2s ease;
        font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
        line-height: 1.6;
        font-size: 14px;
        padding: 15px;
        background: #fff;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        overflow-y: hidden;
        
        &:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            outline: none;
        }
        
        &::placeholder {
            color: #6c757d;
            font-style: italic;
        }
        
        &::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
        
        &::-webkit-scrollbar-thumb {
            background: transparent;
        }
    }
}

@media (max-width: 768px) {
    .json-layout {
        flex-direction: column;
        gap: 15px;
    }
    
    .input-section,
    .output-section {
        min-height: 300px;
    }
    
    .input-header,
    .output-header {
        padding: 12px 15px;
    }
    
    .json-input,
    .json-output,
    .result-text {
        padding: 12px;
        font-size: 12px;
    }
    
    .checkbox-group {
        gap: 10px;
    }
    
    .btn-row {
        gap: 6px;
        margin-bottom: 6px;
    }
    
    .btn-row .nya-btn {
        padding: 5px 10px;
        font-size: 11px;
        min-width: 70px;
    }
    
    .btn-group-header {
        padding: 8px 12px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .json-convert-format {
        padding: 15px;
    }
    
    .input-controls,
    .output-controls {
        flex-wrap: wrap;
        gap: 5px;
    }
    
    .input-controls button,
    .output-controls button {
        padding: 4px 8px;
        font-size: 11px;
    }
    
    .btn-row {
        flex-direction: column;
        gap: 4px;
    }
    
    .btn-row .nya-btn {
        width: 100%;
        min-width: auto;
    }
}
</style>