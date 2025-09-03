<template>
    <div class="json-format">
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
                placeholder="请输入需要格式化的JSON字符串"
            />
            
            <div class="btn-group mb-15">
                <button type="button" class="nya-btn mr-15" @click="formatJSON">
                    格式化
                </button>
                <button type="button" class="nya-btn mr-15" @click="minifyJSON">
                    压缩
                </button>
                <button type="button" class="nya-btn mr-15" @click="validateJSON">
                    验证
                </button>
                <button type="button" class="nya-btn" @click="clearAll">
                    清空
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText" title="格式化结果">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                readonly
                label="结果"
                placeholder="格式化结果将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="nya-btn mr-15" @click="copyResult">
                    复制结果
                </button>
                <button type="button" class="nya-btn" @click="downloadResult">
                    下载JSON
                </button>
            </div>
        </nya-container>

        <nya-container v-if="jsonInfo && jsonInfo.valid" title="JSON信息">
            <div class="json-info">
                <p><strong>状态:</strong> <span class="valid">有效</span></p>
                <p><strong>对象数量:</strong> {{ jsonInfo.objectCount }}</p>
                <p><strong>数组数量:</strong> {{ jsonInfo.arrayCount }}</p>
                <p><strong>键值对数量:</strong> {{ jsonInfo.keyCount }}</p>
            </div>
        </nya-container>

        <nya-container v-if="jsonInfo && !jsonInfo.valid" title="错误信息">
            <div class="json-error">
                <p><strong>状态:</strong> <span class="invalid">无效</span></p>
                <p><strong>错误:</strong> {{ outputText }}</p>
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>格式化：</strong>将压缩的JSON字符串格式化为易读的形式</li>
                <li><strong>压缩：</strong>将格式化的JSON压缩为单行，减小体积</li>
                <li><strong>验证：</strong>检查JSON格式是否正确</li>
                <li>支持各种复杂的JSON结构，包括嵌套对象和数组</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>压缩JSON：</strong>
                    <code>{"name":"张三","age":25,"city":"北京"}</code>
                </div>
                <div class="example-item">
                    <strong>格式化后：</strong>
                    <code>{
  "name": "张三",
  "age": 25,
  "city": "北京"
}</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'JsonFormat',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonInfo: null
        };
    },
    methods: {
        formatJSON() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入JSON内容');
                return;
            }
            
            try {
                const parsed = JSON.parse(this.inputText);
                this.outputText = JSON.stringify(parsed, null, 2);
                this.updateJSONInfo(parsed);
                this.$noty.success('JSON格式化成功');
            } catch (error) {
                this.outputText = `JSON格式错误: ${error.message}`;
                this.jsonInfo = { valid: false };
                this.$noty.error('JSON格式错误：' + error.message);
            }
        },
        
        minifyJSON() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入JSON内容');
                return;
            }
            
            try {
                const parsed = JSON.parse(this.inputText);
                this.outputText = JSON.stringify(parsed);
                this.updateJSONInfo(parsed);
                this.$noty.success('JSON压缩成功');
            } catch (error) {
                this.outputText = `JSON格式错误: ${error.message}`;
                this.jsonInfo = { valid: false };
                this.$noty.error('JSON格式错误：' + error.message);
            }
        },
        
        validateJSON() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入JSON内容');
                return;
            }
            
            try {
                const parsed = JSON.parse(this.inputText);
                this.updateJSONInfo(parsed);
                this.$noty.success('JSON格式有效');
            } catch (error) {
                this.jsonInfo = { valid: false };
                this.$noty.error('JSON格式无效：' + error.message);
            }
        },
        
        updateJSONInfo(obj) {
            let objectCount = 0;
            let arrayCount = 0;
            let keyCount = 0;
            
            const count = (data) => {
                if (Array.isArray(data)) {
                    arrayCount++;
                    data.forEach(count);
                } else if (typeof data === 'object' && data !== null) {
                    objectCount++;
                    keyCount += Object.keys(data).length;
                    Object.values(data).forEach(count);
                }
            };
            
            count(obj);
            
            this.jsonInfo = {
                valid: true,
                objectCount,
                arrayCount,
                keyCount
            };
        },
        
        clearAll() {
            this.inputText = '';
            this.outputText = '';
            this.jsonInfo = null;
        },
        
        copyResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可复制的内容');
                return;
            }
            
            this.$copyText(this.outputText).then(() => {
                this.$noty.success('结果已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },
        
        downloadResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可下载的内容');
                return;
            }
            
            this.$createFile(this.outputText, 'formatted.json');
        }
    }
};
</script>

<style lang="scss" scoped>
.json-format {
    .json-info {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        margin: 15px 0;
        
        p {
            margin: 8px 0;
            font-size: 15px;
            line-height: 1.5;
            
            .valid {
                color: #28a745;
                font-weight: 600;
                background: rgba(40, 167, 69, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
            }
            
            .invalid {
                color: #dc3545;
                font-weight: 600;
                background: rgba(220, 53, 69, 0.1);
                padding: 4px 8px;
                border-radius: 4px;
            }
        }
    }
    
    .json-error {
        p {
            margin: 10px 0;
            font-size: 14px;
            
            .invalid {
                color: #dc3545;
                font-weight: 600;
            }
        }
    }
    
    .examples {
        .example-item {
            margin-bottom: 20px;
            
            strong {
                display: block;
                margin-bottom: 8px;
                color: #495057;
                font-size: 16px;
                font-weight: 600;
            }
            
            code {
                display: block;
                padding: 15px;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                border: 1px solid #e9ecef;
                border-radius: 8px;
                font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
                font-size: 14px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-all;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
                
                &:hover {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }
            }
        }
    }
    
    .tips {
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        padding: 15px 20px;
        border-radius: 0 8px 8px 0;
        
        li {
            margin-bottom: 10px;
            line-height: 1.6;
            color: #495057;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            strong {
                color: #007bff;
                font-weight: 600;
            }
        }
    }
    
    // 添加按钮悬停效果
    :deep(.nya-btn) {
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }
    }
    
    // 输入框美化
    :deep(.nya-input) {
        textarea {
            border-radius: 8px;
            border: 1px solid #ced4da;
            transition: all 0.3s ease;
            
            &:focus {
                border-color: #007bff;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
            }
        }
    }
}
</style>