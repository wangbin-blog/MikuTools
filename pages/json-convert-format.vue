<template>
    <div class="json-convert-format">
        <nya-container title="JSON 格式化工具">
            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入JSON"
                placeholder="请输入JSON字符串"
            />
            
            <div class="btn-group mb-15">
                <button type="button" class="nya-btn" @click="formatInput">
                    格式化
                </button>
                <button type="button" class="nya-btn" @click="minifyInput">
                    压缩
                </button>
                <button type="button" class="nya-btn" @click="validateJSON">
                    验证
                </button>
                <button type="button" class="nya-btn" @click="clearInput">
                    清空
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText" title="格式化结果">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea"
                readonly
                label="结果"
                placeholder="格式化后的JSON将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="nya-btn mr-15" @click="copyResult" :disabled="!outputText">
                    复制结果
                </button>
                <button type="button" class="nya-btn" @click="downloadJSON" :disabled="!outputText">
                    下载JSON
                </button>
            </div>
        </nya-container>

        <nya-container v-if="jsonData" title="JSON结构预览">
            <pre class="json-preview">{{ formattedJson }}</pre>
        </nya-container>

        <nya-container v-if="errorMessage" title="错误信息">
            <div class="error-message">{{ errorMessage }}</div>
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
</template>

<script>
export default {
    name: 'JsonConvertFormat',
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            errorMessage: ''
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
                const cleanData = this.removeNullValues(this.jsonData);
                const sortedData = this.sortObjectKeys(cleanData);
                this.outputText = JSON.stringify(sortedData, null, 2);
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
                const cleanData = this.removeNullValues(this.jsonData);
                const sortedData = this.sortObjectKeys(cleanData);
                this.outputText = JSON.stringify(sortedData);
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin: 20px 0;
    
    :deep(.nya-btn) {
        transition: all 0.2s ease;
        border-radius: 8px;
        font-weight: 600;
        font-size: 15px;
        padding: 12px 24px;
        min-height: 44px;
        
        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
        }
        
        &:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(0, 123, 255, 0.15);
        }
        
        &:disabled {
            background: #e9ecef;
            color: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }
}

:deep(.nya-input) {
    margin-bottom: 20px;
    
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
        
        &:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            outline: none;
        }
        
        &::placeholder {
            color: #6c757d;
            font-style: italic;
        }
    }
}

@media (max-width: 768px) {
    :deep(.nya-container) {
        margin-bottom: 20px;
        padding: 20px;
    }
    
    .btn-group {
        flex-direction: column;
        gap: 12px;
        
        :deep(.nya-btn) {
            width: 100%;
            margin-bottom: 0;
        }
    }
}

@media (max-width: 480px) {
    .json-convert-format {
        padding: 15px;
    }
    
    :deep(.nya-container) {
        padding: 15px;
        border-radius: 8px;
    }
}
</style>