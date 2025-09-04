<template>
    <div class="urlencode">
        <nya-container title="URL 编码/解码">
            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="5"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入内容"
                placeholder="请输入要编码或解码的内容"
            />
            
            <div class="btn-group mb-15">
                <button type="button" class="btn-primary mr-15" @click="encodeUrl">
                    URL 编码
                </button>
                <button type="button" class="btn-success mr-15" @click="decodeUrl">
                    URL 解码
                </button>
                <button type="button" class="btn-primary mr-15" @click="encodeURIComponent">
                    URI 组件编码
                </button>
                <button type="button" class="btn-success" @click="decodeURIComponent">
                    URI 组件解码
                </button>
            </div>
            
            <div class="checkbox-group mb-15">
                <nya-checkbox v-model="encodeSpaceAsPlus" label="空格编码为 +" />
                <nya-checkbox v-model="keepCase" label="保持大小写" />
            </div>
        </nya-container>

        <nya-container v-if="result" title="转换结果">
            <div class="result-section">
                <pre class="result-text">{{ result }}</pre>
                <button type="button" class="nya-btn copy-btn" @click="copyResult">
                    复制结果
                </button>
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>URL编码：</strong>将URL中的特殊字符转换为%xx格式，空格转为%20</li>
                <li><strong>URL解码：</strong>将%xx格式的编码转换回原始字符</li>
                <li><strong>URI组件编码：</strong>更严格的编码，适用于URL参数值</li>
                <li><strong>URI组件解码：</strong>解码URI组件编码的内容</li>
                <li>支持中英文、特殊字符、表情符号等各种文本</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>原始文本：</strong>
                    <code>Hello World! 你好世界</code>
                </div>
                <div class="example-item">
                    <strong>URL编码后：</strong>
                    <code>Hello%20World%21%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C</code>
                </div>
                <div class="example-item">
                    <strong>URI组件编码后：</strong>
                    <code>Hello%20World!%20%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'UrlEncode',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            inputText: '',
            result: '',
            encodeSpaceAsPlus: false,
            keepCase: true
        };
    },
    methods: {
        encodeUrl() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入要编码的内容');
                return;
            }
            
            try {
                let encoded = encodeURI(this.inputText);
                if (this.encodeSpaceAsPlus) {
                    encoded = encoded.replace(/%20/g, '+');
                }
                this.result = encoded;
            } catch (error) {
                this.$noty.error('编码失败：' + error.message);
            }
        },
        
        decodeUrl() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入要解码的内容');
                return;
            }
            
            try {
                let decoded = this.inputText;
                if (this.encodeSpaceAsPlus) {
                    decoded = decoded.replace(/\+/g, '%20');
                }
                this.result = decodeURI(decoded);
            } catch (error) {
                this.$noty.error('输入内容不是有效的URL编码格式');
            }
        },
        
        encodeURIComponent() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入要编码的内容');
                return;
            }
            
            try {
                let encoded = encodeURIComponent(this.inputText);
                if (this.encodeSpaceAsPlus) {
                    encoded = encoded.replace(/%20/g, '+');
                }
                this.result = encoded;
            } catch (error) {
                this.$noty.error('编码失败：' + error.message);
            }
        },
        
        decodeURIComponent() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入要解码的内容');
                return;
            }
            
            try {
                let decoded = this.inputText;
                if (this.encodeSpaceAsPlus) {
                    decoded = decoded.replace(/\+/g, '%20');
                }
                this.result = decodeURIComponent(decoded);
            } catch (error) {
                this.$noty.error('输入内容不是有效的URI组件编码格式');
            }
        },
        
        copyResult() {
            if (!this.result) return;
            
            this.$copyText(this.result).then(() => {
                this.$noty.success('结果已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },
        
        clearAll() {
            this.inputText = '';
            this.result = '';
        }
    }
};
</script>

<style lang="scss" scoped>
.urlencode {
    .btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .nya-btn {
            flex: 1;
            min-width: 120px;
            
            @media (max-width: 768px) {
                flex: 1 1 100%;
            }
        }
    }
    
    .checkbox-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 15px;
        
        .nya-checkbox {
            margin-right: 0;
            white-space: nowrap;
        }
    }
    
    .result-section {
        position: relative;
        
        .result-text {
            background-color: var(--bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-all;
            margin-bottom: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 4px 8px;
            font-size: 12px;
        }
    }
    
    .tips {
        padding-left: 20px;
        
        li {
            margin-bottom: 8px;
            line-height: 1.6;
        }
    }
    
    .examples {
        .example-item {
            margin-bottom: 10px;
            
            code {
                display: block;
                background-color: var(--bg);
                border: 1px solid var(--border);
                border-radius: 4px;
                padding: 8px 12px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                margin-top: 5px;
                word-break: break-all;
            }
        }
    }
}
</style>