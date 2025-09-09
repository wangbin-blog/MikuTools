<template>
    <div class="sm4-crypto">
        <nya-container title="国密SM4加密解密">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>SM4是中国国家密码管理局发布的分组密码算法，采用128位密钥和128位分组长度，支持多种工作模式，适用于数据加密保护。</p>
            </div>

            <!-- 操作模式选择 -->
            <div class="tab-buttons mb-15">
                <button 
                    v-for="tab in tabOptions" 
                    :key="tab.value"
                    :class="['tab-button', { active: activeTab === tab.value }]"
                    @click="activeTab = tab.value"
                >
                    {{ tab.label }}
                </button>
            </div>

            <!-- 配置选项 -->
            <div class="config-section mb-15">
                <div class="config-row">
                    <div class="config-item">
                        <label>工作模式</label>
                        <nya-select v-model="mode" fullwidth :items="modeOptions" />
                    </div>
                    <div class="config-item">
                        <label>填充方式</label>
                        <nya-select v-model="padding" fullwidth :items="paddingOptions" />
                    </div>
                    <div class="config-item">
                        <label>输出格式</label>
                        <nya-select v-model="outputFormat" fullwidth :items="formatOptions" />
                    </div>
                </div>
            </div>

            <!-- 密钥输入 -->
            <nya-input v-model="key" fullwidth autocomplete="off" label="密钥 (16字节/32字符Hex)" placeholder="请输入128位密钥，32个十六进制字符" />
            
            <!-- IV输入 (CBC模式) -->
            <nya-input v-if="mode === 'CBC'" v-model="iv" fullwidth autocomplete="off" label="初始化向量 (IV)" placeholder="请输入16字节初始化向量" />
            
            <!-- 内容输入 -->
            <nya-input v-model="content" fullwidth rows="5" type="textarea" :label="activeTab === 'encrypt' ? '待加密内容' : '待解密内容'" :placeholder="activeTab === 'encrypt' ? '请输入要加密的明文内容' : '请输入要解密的密文内容'" />
            
            <br>
            <button
                type="button"
                class="btn-primary"
                @click="handleSM4Operation"
                :disabled="!canProceed"
            >
                {{ activeTab === 'encrypt' ? '开始加密' : '开始解密' }}
            </button>
        </nya-container>

        <nya-container v-show="result" :title="operationTitle">
            <div class="result-section">
                <div class="result-display">
                    <pre>{{ result }}</pre>
                </div>
                <div class="result-info">
                    <div class="info-row">
                        <span>输入长度: {{ inputLength }} 字符</span>
                        <span>输出长度: {{ outputLength }} 字符</span>
                        <span>模式: {{ mode }}</span>
                    </div>
                </div>
                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-success"
                        @click="copyResult"
                    >
                        📋 复制结果
                    </button>
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-info"
                        @click="saveResult"
                    >
                        💾 保存结果
                    </button>
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-warning"
                        @click="clearResult"
                    >
                        🗑️ 清空结果
                    </button>
                </div>
            </div>
        </nya-container>

        <!-- 密钥生成 -->
        <nya-container title="密钥生成" class="mb-15">
            <div class="key-generation">
                <p>生成随机SM4密钥（128位）</p>
                <div class="key-actions">
                    <button
                        type="button"
                        class="jwt-btn jwt-btn-info"
                        @click="generateKey"
                    >
                        🔑 生成密钥
                    </button>
                    <button
                        type="button"
                        class="jwt-btn jwt-btn-secondary"
                        @click="generateIV"
                        v-if="mode === 'CBC'"
                    >
                        🎲 生成IV
                    </button>
                </div>
                <div v-if="generatedKey" class="key-display mt-15">
                    <h4>密钥:</h4>
                    <pre>{{ generatedKey }}</pre>
                </div>
                <div v-if="generatedIV" class="key-display mt-15">
                    <h4>IV:</h4>
                    <pre>{{ generatedIV }}</pre>
                </div>
            </div>
        </nya-container>

        <!-- 工具箱 -->
        <nya-container title="实用工具" class="mb-15">
            <div class="toolbox">
                <div class="tool-grid">
                    <div class="tool-item">
                        <h4>十六进制转换</h4>
                        <nya-input v-model="hexInput" placeholder="输入十六进制字符串" />
                        <button type="button" class="jwt-btn jwt-btn-sm" @click="hexToText">转文本</button>
                        <button type="button" class="jwt-btn jwt-btn-sm" @click="textToHex">转Hex</button>
                    </div>
                    <div class="tool-item">
                        <h4>Base64转换</h4>
                        <nya-input v-model="base64Input" placeholder="输入Base64字符串" />
                        <button type="button" class="jwt-btn jwt-btn-sm" @click="base64ToText">解码</button>
                        <button type="button" class="jwt-btn jwt-btn-sm" @click="textToBase64">编码</button>
                    </div>
                </div>
            </div>
        </nya-container>

        <!-- 使用说明 -->
        <nya-container title="使用说明">
            <div class="instructions">
                <h4>SM4算法特点：</h4>
                <ul>
                    <li><strong>算法类型：</strong>对称分组密码算法</li>
                    <li><strong>分组长度：</strong>128位（16字节）</li>
                    <li><strong>密钥长度：</strong>128位（16字节）</li>
                    <li><strong>工作模式：</strong>支持ECB、CBC、CFB、OFB、CTR</li>
                    <li><strong>标准：</strong>中国国家密码管理局GM/T 0002-2012标准</li>
                </ul>

                <h4>工作模式说明：</h4>
                <ul>
                    <li><strong>ECB：</strong>电子密码本模式，每个分组独立加密</li>
                    <li><strong>CBC：</strong>密码分组链接模式，需要IV，安全性高</li>
                    <li><strong>CFB：</strong>密码反馈模式，可流式加密</li>
                    <li><strong>OFB：</strong>输出反馈模式，可预处理</li>
                    <li><strong>CTR：</strong>计数器模式，可并行处理</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>密钥必须为32个十六进制字符（128位）</li>
                    <li>CBC模式需要16字节的初始化向量(IV)</li>
                    <li>加密结果可选择Hex或Base64格式输出</li>
                    <li>解密时需确保格式与加密时一致</li>
                </ul>
            </div>
        </nya-container>
    </div>
</template>

<script>
const sm4 = require('sm-crypto').sm4;

export default {
    name: 'SM4Crypto',
    head() {
        return {
            title: '国密SM4加密解密工具',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: '在线国密SM4对称加密解密工具，支持多种工作模式，提供密钥生成、格式转换等功能。'
                }
            ]
        };
    },
    data() {
        return {
            activeTab: 'encrypt',
            tabOptions: [
                { label: '加密', value: 'encrypt' },
                { label: '解密', value: 'decrypt' }
            ],
            content: '',
            key: '',
            iv: '',
            mode: 'CBC',
            modeOptions: {
                'CBC': 'CBC模式',
                'ECB': 'ECB模式',
                'CFB': 'CFB模式',
                'OFB': 'OFB模式',
                'CTR': 'CTR模式'
            },
            padding: 'pkcs7',
            paddingOptions: {
                'pkcs7': 'PKCS7填充'
            },
            outputFormat: 'hex',
            formatOptions: {
                'hex': '十六进制',
                'base64': 'Base64'
            },
            result: '',
            generatedKey: '',
            generatedIV: '',
            hexInput: '',
            base64Input: ''
        };
    },
    computed: {
        canProceed() {
            return this.content && this.key && this.isValidKey();
        },
        operationTitle() {
            return this.activeTab === 'encrypt' ? '加密成功' : '解密成功';
        },
        inputLength() {
            return this.content ? this.content.length : 0;
        },
        outputLength() {
            return this.result ? this.result.length : 0;
        }
    },
    methods: {
        isValidKey() {
            return /^[0-9a-fA-F]{32}$/.test(this.key);
        },
        
        handleSM4Operation() {
            if (!this.canProceed) return;
            
            try {
                let result;
                const keyHex = this.key;
                const ivHex = this.iv || '00000000000000000000000000000000';
                
                if (this.activeTab === 'encrypt') {
                    // SM4加密
                    result = sm4.encrypt(this.content, keyHex, {
                        mode: this.mode,
                        iv: ivHex,
                        inputEncoding: 'utf8',
                        outputEncoding: this.outputFormat
                    });
                } else {
                    // SM4解密
                    result = sm4.decrypt(this.content, keyHex, {
                        mode: this.mode,
                        iv: ivHex,
                        inputEncoding: this.outputFormat,
                        outputEncoding: 'utf8'
                    });
                }
                
                this.result = result;
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '操作失败',
                    text: `错误: ${error.message || '请检查密钥和输入格式是否正确'}`
                });
            }
        },
        
        generateKey() {
            const chars = '0123456789abcdef';
            let key = '';
            for (let i = 0; i < 32; i++) {
                key += chars[Math.floor(Math.random() * chars.length)];
            }
            this.generatedKey = key;
            this.key = key;
        },
        
        generateIV() {
            const chars = '0123456789abcdef';
            let iv = '';
            for (let i = 0; i < 32; i++) {
                iv += chars[Math.floor(Math.random() * chars.length)];
            }
            this.generatedIV = iv;
            this.iv = iv;
        },
        
        copyResult() {
            if (this.result) {
                navigator.clipboard.writeText(this.result).then(() => {
                    this.$modal.show('dialog', {
                        title: '复制成功',
                        text: '结果已复制到剪贴板'
                    });
                }).catch(() => {
                    this.$modal.show('dialog', {
                        title: '复制失败',
                        text: '请手动复制结果'
                    });
                });
            }
        },
        
        saveResult() {
            if (this.result) {
                const info = `SM4 ${this.activeTab === 'encrypt' ? '加密' : '解密'}结果\n\n` +
                    `模式: ${this.mode}\n` +
                    `密钥: ${this.key}\n` +
                    (this.iv && this.mode === 'CBC' ? `IV: ${this.iv}\n` : '') +
                    `输入: ${this.content}\n\n` +
                    `结果: ${this.result}\n\n` +
                    `时间: ${new Date().toLocaleString()}`;
                
                const blob = new Blob([info], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sm4_${this.activeTab}_${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        },
        
        clearResult() {
            this.result = '';
        },
        
        hexToText() {
            if (!this.hexInput) return;
            try {
                const hex = this.hexInput.replace(/\s+/g, '');
                let str = '';
                for (let i = 0; i < hex.length; i += 2) {
                    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                }
                this.content = str;
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '转换失败',
                    text: '无效的十六进制字符串'
                });
            }
        },
        
        textToHex() {
            if (!this.content) return;
            this.hexInput = Buffer.from(this.content).toString('hex');
        },
        
        base64ToText() {
            if (!this.base64Input) return;
            try {
                this.content = Buffer.from(this.base64Input, 'base64').toString('utf8');
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '解码失败',
                    text: '无效的Base64字符串'
                });
            }
        },
        
        textToBase64() {
            if (!this.content) return;
            this.base64Input = Buffer.from(this.content).toString('base64');
        }
    }
};
</script>

<style lang="scss" scoped>
.sm4-crypto {
    .tab-buttons {
        display: flex;
        gap: 10px;
        
        .tab-button {
            padding: 10px 20px;
            border: 1px solid #ddd;
            background: #fff;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
                background: #f8f9fa;
            }
            
            &.active {
                background: #007bff;
                color: #fff;
                border-color: #007bff;
            }
        }
    }
    
    .config-section {
        .config-row {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            
            .config-item {
                flex: 1;
                min-width: 150px;
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #333;
                }
            }
        }
    }
    
    .key-generation {
        text-align: center;
        
        p {
            margin-bottom: 15px;
            color: #666;
        }
        
        .key-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .key-display {
            text-align: left;
            
            h4 {
                margin: 10px 0 5px 0;
                color: #333;
                font-size: 14px;
            }
            
            pre {
                background: #f8f9fa;
                padding: 10px;
                border-radius: 4px;
                font-size: 12px;
                word-break: break-all;
                margin: 0;
            }
        }
    }
    
    .toolbox {
        .tool-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            
            .tool-item {
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                
                h4 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 16px;
                }
                
                .jwt-btn-sm {
                    padding: 5px 10px;
                    font-size: 12px;
                    margin: 5px 5px 0 0;
                }
            }
        }
    }
    
    .result-section {
        .result-info {
            margin: 15px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
            
            .info-row {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: #666;
                justify-content: space-between;
                
                span {
                    flex: 1;
                    text-align: center;
                }
            }
        }
        
        .result-display {
            pre {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                font-size: 14px;
                line-height: 1.5;
                word-break: break-all;
                margin: 0;
                font-family: 'Courier New', monospace;
            }
        }
    }
    
    .instructions {
        ul {
            margin: 0;
            padding-left: 20px;
            
            li {
                margin-bottom: 8px;
                line-height: 1.6;
                color: #555;
            }
        }
        
        h4 {
            margin: 15px 0 10px 0;
            color: #333;
            font-size: 16px;
        }
    }
}
</style>