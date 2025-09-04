<template>
    <div class="json-to-csv">
        <nya-container title="JSON 转 CSV/Excel 工具">
            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入JSON"
                placeholder="请输入JSON字符串，支持数组或对象"
            />
            
            <div class="options-section mb-15">
                <label>输出格式:</label>
                <div class="format-grid">
                    <label v-for="format in formats" :key="format.value" class="format-option">
                        <input
                            v-model="selectedFormat"
                            type="radio"
                            :value="format.value"
                            @change="generateOutput"
                        />
                        {{ format.label }}
                    </label>
                </div>
            </div>

            <div class="options-section mb-15">
                <label>文件名:</label>
                <nya-input
                    v-model="fileName"
                    placeholder="请输入文件名，默认为data"
                    @input="generateOutput"
                />
            </div>

            <div class="options-section mb-15">
                <label>CSV分隔符(默认使用逗号, 支持单个字符):</label>
                <div class="input-group">
                    <nya-input
                        v-model="selectedDelimiter"
                        placeholder="请输入分隔符,默认使用逗号, 支持单个字符"
                        @input="generateOutput"
                    />
                </div>
            </div>

            <div class="btn-group mb-15">
                <button type="button" class="btn-primary" @click="generateOutput">
                    ✨ 生成{{ selectedFormat === 'csv' ? 'CSV' : 'Excel' }}
                </button>
                <button type="button" class="btn-danger" @click="clearInput">
                    🗑️ 清空
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText && selectedFormat === 'csv'" title="生成的CSV内容">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea"
                readonly
                label="CSV内容"
                placeholder="生成的CSV将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="btn-control copy-btn" @click="copyResult">
                    📋 复制CSV
                </button>
                <button type="button" class="btn-control download-btn" @click="downloadResult">
                    ⬇️ 下载{{ selectedFormat === 'csv' ? 'CSV' : 'Excel' }}文件
                </button>
            </div>
        </nya-container>

        <nya-container v-if="jsonData" title="JSON结构预览">
            <pre class="json-preview">{{ formattedJson }}</pre>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>支持格式：</strong>CSV、Excel (简单Excel格式，基于CSV转换)</li>
                <li><strong>输入格式：</strong>支持JSON数组或对象，自动识别字段</li>
                <li><strong>CSV分隔符：</strong>支持逗号、分号、制表符等常用分隔符</li>
                <li><strong>自动处理：</strong>自动处理包含特殊字符的字段（如逗号、引号）</li>
                <li><strong>批量转换：</strong>支持多条JSON记录批量转换</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>输入JSON：</strong>
                    <code>[{"name":"张三","age":25,"city":"北京","active":true},{"name":"李四","age":30,"city":"上海","active":false}]</code>
                </div>
                <div class="example-item">
                    <strong>生成CSV：</strong>
                    <code>name,age,city,active
张三,25,北京,true
李四,30,上海,false</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
import createDownload from '../utils/createDownload';

export default {
    name: 'JsonToCSV',
    head() {
        return {
            title: 'JSON转CSV/Excel工具',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: '在线JSON转CSV/Excel工具，支持多种分隔符，自动处理特殊字符，一键下载。'
                }
            ]
        };
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            fileName: 'data',
            selectedFormat: 'csv',
            selectedDelimiter: ',',
            formats: [
                { value: 'csv', label: 'CSV格式' },
                { value: 'excel', label: 'Excel格式' }
            ],

        };
    },
    computed: {
        formattedJson() {
            return this.jsonData ? JSON.stringify(this.jsonData, null, 2) : '';
        }
    },
    watch: {
        inputText() {
            this.processInput();
        },
        fileName() {
            this.generateOutput();
        },
        selectedDelimiter() {
            this.generateOutput();
        }
    },
    methods: {
        processInput() {
            if (!this.inputText.trim()) {
                this.jsonData = null;
                this.outputText = '';
                return;
            }
            
            try {
                this.jsonData = JSON.parse(this.inputText);
                this.generateOutput();
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.$noty.error('JSON格式错误：' + error.message);
            }
        },

        generateOutput() {
            if (!this.jsonData || !this.inputText.trim()) {
                return;
            }

            try {
                const data = Array.isArray(this.jsonData) ? this.jsonData : [this.jsonData];
                if (data.length === 0) {
                    this.outputText = '';
                    this.$noty.warning('没有数据可转换');
                    return;
                }

                // 提取所有字段名
                const allFields = new Set();
                data.forEach(item => {
                    Object.keys(item).forEach(field => allFields.add(field));
                });
                const fields = Array.from(allFields);

                // 生成CSV内容
                const csvContent = this.generateCSV(fields, data);
                this.outputText = csvContent;

            } catch (error) {
                this.outputText = '';
                this.$noty.error('转换失败：' + error.message);
            }
        },

        generateCSV(fields, data) {
            const delimiter = this.selectedDelimiter;
            
            // 添加表头
            const headerLine = fields.map(field => this.escapeCSVField(field, delimiter)).join(delimiter);
            
            // 添加数据行
            const dataLines = data.map(row => {
                return fields.map(field => {
                    const value = row[field];
                    return this.escapeCSVField(this.formatCSVValue(value), delimiter);
                }).join(delimiter);
            });
            
            return [headerLine, ...dataLines].join('\n');
        },

        formatCSVValue(value) {
            if (value === null || value === undefined) {
                return '';
            } else if (typeof value === 'object' && value !== null) {
                // 对于嵌套对象或数组，转为JSON字符串
                return JSON.stringify(value);
            } else if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            } else if (typeof value === 'number') {
                // 保留数字原始格式
                return value.toString();
            } else {
                return value.toString();
            }
        },

        escapeCSVField(field, delimiter) {
            // 如果字段包含分隔符、引号或换行符，则需要用引号包裹
            if (field.includes(delimiter) || field.includes('"') || field.includes('\n') || field.includes('\r')) {
                // 转义字段中的双引号（通过添加另一个双引号）
                const escapedField = field.replace(/"/g, '""');
                return `"${escapedField}"`;
            }
            return field;
        },

        clearInput() {
            this.inputText = '';
            this.outputText = '';
            this.jsonData = null;
            this.fileName = 'data';
            this.selectedFormat = 'csv';
            this.selectedDelimiter = ',';
        },

        copyResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可复制的内容');
                return;
            }
            
            this.$copy(this.outputText).then(() => {
                this.$noty.success('内容已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败');
            });
        },

        downloadResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可下载的内容');
                return;
            }

            const filename = `${this.fileName || 'data'}.${this.selectedFormat}`;
            
            try {
                // 创建Blob对象
                const mimeType = this.selectedFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;';
                
                // 对于Excel，我们仍然使用CSV格式，但更改文件扩展名
                const blob = new Blob(['\ufeff' + this.outputText], { type: mimeType }); // 添加BOM以支持UTF-8编码
                
                // 创建下载链接
                const url = URL.createObjectURL(blob);
                
                // 使用工具函数下载文件
                createDownload(url, filename);
                
                // 清理
                URL.revokeObjectURL(url);
                
                this.$noty.success(`${this.selectedFormat.toUpperCase()}文件已下载`);
            } catch (error) {
                this.$noty.error('下载失败：' + error.message);
            }
        }
    }
};
</script>

<style scoped>
.json-to-csv {
    max-width: 1200px;
    margin: 0 auto;
}

.options-section {
    margin-bottom: 20px;
}

.options-section label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--text-color);
}

.format-grid,
.delimiter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.format-option,
.delimiter-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.format-option:hover,
.delimiter-option:hover {
    border-color: var(--primary-color);
    background: var(--hover-bg);
}

.format-option input[type="radio"],
.delimiter-option input[type="radio"] {
    margin-right: 8px;
}

.json-preview {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 15px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.examples {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.example-item {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 12px;
}

.example-item strong {
    display: block;
    margin-bottom: 8px;
    color: var(--primary-color);
}

.example-item code {
    display: block;
    background: var(--hover-bg);
    padding: 8px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

@media (max-width: 768px) {
    .format-grid,
    .delimiter-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .examples {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .format-grid,
    .delimiter-grid {
        grid-template-columns: 1fr;
    }
}
</style>