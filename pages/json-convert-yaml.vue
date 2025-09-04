<template>
    <div class="json-convert-yaml">
        <nya-container title="JSON 转 YAML/TOML 工具">
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
                <button type="button" class="btn-primary" @click="convertToYaml">
                    转YAML
                </button>
                <button type="button" class="btn-success" @click="convertToToml">
                    转TOML
                </button>
                <button type="button" class="btn-danger" @click="clearInput">
                    🗑️ 清空
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText" title="转换结果">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea"
                readonly
                label="转换结果"
                placeholder="转换后的结果将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="btn-control copy-btn mr-15" @click="copyResult" :disabled="!outputText">
                    复制结果
                </button>
                <button type="button" class="btn-control download-btn" @click="downloadResult" :disabled="!outputText">
                    下载文件
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
                <li><strong>功能介绍：</strong>将JSON格式数据转换为YAML或TOML格式，便于配置文件编写</li>
                <li><strong>转换原理：</strong>保持数据结构不变，将JSON语法转换为目标格式语法</li>
                <li><strong>YAML使用场景：</strong>Kubernetes配置、Docker Compose、CI/CD配置文件等</li>
                <li><strong>TOML使用场景：</strong>Rust Cargo配置、Python Poetry、Node.js项目配置等</li>
                <li><strong>特点：</strong>自动排序键名、清理空值、保持数据结构完整性</li>
                <li><strong>兼容性：</strong>完全兼容YAML 1.2和TOML 1.0规范</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>输入JSON：</strong>
                    <code>{"name":"张三","age":25,"skills":["JavaScript","Vue","Node.js"],"address":{"city":"北京","zipcode":"100000"}}</code>
                </div>
                <div class="example-item">
                    <strong>YAML输出：</strong>
                    <code>address:
  city: 北京
  zipcode: '100000'
age: 25
name: 张三
skills:
  - JavaScript
  - Vue
  - Node.js</code>
                </div>
                <div class="example-item">
                    <strong>TOML输出：</strong>
                    <code>address = { city = "北京", zipcode = "100000" }
age = 25
name = "张三"
skills = ["JavaScript", "Vue", "Node.js"]</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'JsonConvertYamlToml',
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            errorMessage: '',
            outputFormat: ''
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
                this.convertToYaml();
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.errorMessage = `JSON格式错误: ${error.message}`;
            }
        },
        
        convertToYaml() {
            if (!this.jsonData) {
                this.errorMessage = '请先输入有效的JSON';
                return;
            }
            
            try {
                const cleanData = this.removeNullValues(this.jsonData);
                const sortedData = this.sortObjectKeys(cleanData);
                this.outputText = this.jsonToYaml(sortedData);
                this.outputFormat = 'yaml';
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = `YAML转换错误: ${error.message}`;
            }
        },
        
        convertToToml() {
            if (!this.jsonData) {
                this.errorMessage = '请先输入有效的JSON';
                return;
            }
            
            try {
                const cleanData = this.removeNullValues(this.jsonData);
                const sortedData = this.sortObjectKeys(cleanData);
                this.outputText = this.jsonToToml(sortedData);
                this.outputFormat = 'toml';
                this.errorMessage = '';
            } catch (error) {
                this.errorMessage = `TOML转换错误: ${error.message}`;
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
            
            const formatName = this.outputFormat === 'toml' ? 'TOML' : 'YAML';
            navigator.clipboard.writeText(this.outputText).then(() => {
                alert(`${formatName}已复制到剪贴板`);
            }).catch(() => {
                alert('复制失败，请手动复制');
            });
        },
        
        downloadResult() {
            if (!this.outputText) return;
            
            const extension = this.outputFormat === 'toml' ? 'toml' : 'yaml';
            const mimeType = this.outputFormat === 'toml' ? 'text/toml' : 'text/yaml';
            const filename = `converted.${extension}`;
            
            const blob = new Blob([this.outputText], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
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
        },
        
        jsonToYaml(obj, indent = 0) {
            const spaces = '  '.repeat(indent);
            
            if (Array.isArray(obj)) {
                return obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return `${spaces}- ${this.jsonToYaml(item, indent + 1).trimStart()}`;
                    } else {
                        return `${spaces}- ${this.formatValue(item)}`;
                    }
                }).join('\n');
            }
            
            if (typeof obj === 'object' && obj !== null) {
                const entries = Object.entries(obj);
                if (entries.length === 0) return '{}';
                
                return entries.map(([key, value]) => {
                    const yamlKey = this.needsQuotes(key) ? `"${key}"` : key;
                    
                    if (typeof value === 'object' && value !== null) {
                        return `${spaces}${yamlKey}:\n${this.jsonToYaml(value, indent + 1)}`;
                    } else {
                        return `${spaces}${yamlKey}: ${this.formatValue(value)}`;
                    }
                }).join('\n');
            }
            
            return this.formatValue(obj);
        },
        
        formatValue(value) {
            if (typeof value === 'string') {
                if (value.includes('\n')) {
                    return `|\n${value.split('\n').map(line => '  ' + line).join('\n')}`;
                }
                return this.needsQuotes(value) ? `"${value}"` : value;
            }
            
            if (typeof value === 'boolean') return value.toString();
            if (typeof value === 'number') return value.toString();
            if (value === null) return 'null';
            
            return value.toString();
        },
        
        jsonToToml(obj, currentPath = '') {
            if (Array.isArray(obj)) {
                return obj.map((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        return `[[${currentPath}]]\n${this.jsonToToml(item, currentPath)}`;
                    } else {
                        return `${this.formatTomlValue(item)}`;
                    }
                }).join('\n');
            }
            
            if (typeof obj === 'object' && obj !== null) {
                const entries = Object.entries(obj);
                if (entries.length === 0) return '';
                
                let toml = '';
                const simpleEntries = [];
                const complexEntries = [];
                
                // 分离简单值和复杂对象
                entries.forEach(([key, value]) => {
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        complexEntries.push([key, value]);
                    } else if (Array.isArray(value)) {
                        if (value.length > 0 && typeof value[0] === 'object') {
                            complexEntries.push([key, value]);
                        } else {
                            simpleEntries.push([key, value]);
                        }
                    } else {
                        simpleEntries.push([key, value]);
                    }
                });
                
                // 处理简单值
                simpleEntries.forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        toml += `${key} = [${value.map(v => this.formatTomlValue(v)).join(', ')}]\n`;
                    } else {
                        toml += `${key} = ${this.formatTomlValue(value)}\n`;
                    }
                });
                
                // 处理复杂对象
                complexEntries.forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        // 数组对象
                        value.forEach(item => {
                            if (typeof item === 'object' && item !== null) {
                                const tableName = currentPath ? `${currentPath}.${key}` : key;
                                toml += `[[${tableName}]]\n`;
                                toml += this.jsonToToml(item, tableName);
                            } else {
                                toml += `${key} = [${this.formatTomlValue(item)}]\n`;
                            }
                        });
                    } else if (typeof value === 'object' && value !== null) {
                        // 普通对象
                        const tableName = currentPath ? `${currentPath}.${key}` : key;
                        toml += `[${tableName}]\n`;
                        toml += this.jsonToToml(value, tableName);
                    }
                });
                
                return toml;
            }
            
            return this.formatTomlValue(obj);
        },
        
        formatTomlValue(value) {
            if (typeof value === 'string') {
                // 处理多行字符串
                if (value.includes('\n')) {
                    return `"""${value}"""`;
                }
                // 处理需要引号的字符串
                if (value.includes(' ') || value.includes('\t') || value.includes('#') || 
                    value.includes('=') || value.includes('\\') || value === '') {
                    return `"${value.replace(/"/g, '\\"')}"`;
                }
                return value;
            }
            
            if (typeof value === 'boolean') return value.toString();
            if (typeof value === 'number') return value.toString();
            if (value === null) return 'null';
            
            return value.toString();
        },
        
        formatValue(value) {
            if (typeof value === 'string') {
                if (value.includes('\n')) {
                    return `|\n${value.split('\n').map(line => '  ' + line).join('\n')}`;
                }
                return this.needsQuotes(value) ? `"${value}"` : value;
            }
            
            if (typeof value === 'boolean') return value.toString();
            if (typeof value === 'number') return value.toString();
            if (value === null) return 'null';
            
            return value.toString();
        },
        
        needsQuotes(str) {
            if (typeof str !== 'string') return false;
            return str.includes(' ') || str.includes('\t') || str.includes('\n') || 
                   str.includes(':') || str.includes('#') || str.includes('{') || 
                   str.includes('}') || str.includes('[') || str.includes(']') ||
                   str.includes(',') || str.includes('&') || str.includes('*') ||
                   str.includes('!') || str.includes('|') || str.includes('>') ||
                   str.includes('"') || str.includes("'") || str === '' ||
                   !isNaN(str) || str === 'true' || str === 'false' ||
                   str === 'null' || str === 'yes' || str === 'no' ||
                   str === 'on' || str === 'off';
        }
    }
};
</script>

<style scoped>
.json-convert-yaml {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.mb-15 {
    margin-bottom: 15px;
}

.mr-15 {
    margin-right: 15px;
}



.btn-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

.btn-group .nya-btn {
    margin: 0;
}

.json-preview {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 15px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    margin: 0;
}

.error-message {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 15px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    margin: 0;
}

.tips {
    margin: 0;
    padding-left: 20px;
}

.tips li {
    margin-bottom: 8px;
    line-height: 1.6;
}

.examples {
    margin: 0;
}

.example-item {
    margin-bottom: 15px;
}

.example-item strong {
    display: block;
    margin-bottom: 5px;
    color: #333;
}

.example-item code {
    display: block;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 10px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-x: auto;
}

@media (max-width: 768px) {
    .json-convert-yaml {
        padding: 10px;
    }
    
    .btn-group {
        flex-direction: column;
        align-items: stretch;
    }
    
    .btn-group .nya-btn {
        width: 100%;
    }
    
    .mr-15 {
        margin-right: 0;
        margin-bottom: 10px;
    }
}
</style>