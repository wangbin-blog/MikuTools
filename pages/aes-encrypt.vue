<template>
    <div class="aes-encrypt">
        <div class="content">
        <nya-container title="AES 加密/解密工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>高级加密标准（AES）加密解密工具，支持多种模式和填充方式，提供安全的对称加密功能。</p>
            </div>

            <div class="tab-buttons mb-15">
                <button
                    v-for="(label, key) in tabOptions"
                    :key="key"
                    :class="['tab-button', { active: activeTab === key }]"
                    @click="activeTab = key"
                >
                    {{ label }}
                </button>
            </div>

            <nya-input
                v-model="content"
                class="mb-15"
                fullwidth
                rows="4"
                type="textarea"
                autofocus
                autocomplete="off"
                :label="activeTab === 'encrypt' ? '待加密的内容' : '待解密的内容'"
                :placeholder="activeTab === 'encrypt' ? '请输入要加密的文本' : '请输入要解密的文本'"
            />
            
            <nya-input
                v-model="key"
                fullwidth
                autocomplete="off"
                label="密钥 (Secret Key)"
                placeholder="请输入16/24/32位密钥"
            />
            
            <div class="form-row mb-15">
                <div class="setting-row">
                    <div class="setting-item">
                        <nya-select
                            v-model="keySize"
                            fullwidth
                            :items="keySizeOptions"
                            label="密钥长度"
                        />
                    </div>
                    
                    <div class="setting-item">
                        <nya-select
                            v-model="mode"
                            fullwidth
                            :items="modeOptions"
                            label="加密模式"
                        />
                    </div>
                </div>
            </div>
            
            <button
                type="button"
                class="btn-primary"
                @click="processAES"
            >
                {{ activeTab === 'encrypt' ? '开始加密' : '开始解密' }}
            </button>
        </nya-container>

        <nya-container v-show="result" :title="activeTab === 'encrypt' ? '加密结果' : '解密结果'">
            <div class="result-section">
                <div class="result-item">
                    <label>{{ activeTab === 'encrypt' ? '加密结果：' : '解密结果：' }}</label>
                    <div class="aes-result">
                        <pre>{{ result }}</pre>
                        <button
                            type="button"
                            class="copy-btn"
                            @click="copyResult"
                        >
                            📋 复制
                        </button>
                    </div>
                </div>
                <div class="result-item" v-if="activeTab === 'encrypt'">
                    <label>Base64格式：</label>
                    <div class="aes-result">
                        <pre>{{ base64Result }}</pre>
                        <button
                            type="button"
                            class="copy-btn"
                            @click="copyBase64"
                        >
                            📋 复制
                        </button>
                    </div>
                </div>
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <div class="instructions">
                <h4>AES加密特点：</h4>
                <ul>
                    <li><strong>安全性高：</strong>目前最安全的对称加密算法之一</li>
                    <li><strong>速度快：</strong>硬件和软件实现都很快</li>
                    <li><strong>标准化：</strong>NIST标准，广泛使用</li>
                    <li><strong>密钥长度：</strong>支持128、192、256位密钥</li>
                </ul>

                <h4>加密模式说明：</h4>
                <ul>
                    <li><strong>CBC：</strong>密码分组链接模式，需要IV，安全性高</li>
                    <li><strong>ECB：</strong>电子密码本模式，不需要IV，安全性较低</li>
                    <li><strong>CFB：</strong>密码反馈模式，可流式加密</li>
                    <li><strong>OFB：</strong>输出反馈模式，可流式加密</li>
                    <li><strong>CTR：</strong>计数器模式，可并行加密</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>密钥长度必须与选择匹配：16位(128bit)、24位(192bit)、32位(256bit)</li>
                    <li>加密结果可以安全传输，只有拥有密钥的人才能解密</li>
                    <li>CBC模式推荐使用随机IV增强安全性</li>
                    <li>256位密钥提供最高安全性</li>
                </ul>
            </div>
        </nya-container>
    
        </div>
        
</div>
</template>

<script>

import CryptoJS from 'crypto-js';

export default {
    name: 'AESEncrypt',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        
    },
    data() {
        return {
            activeTab: 'encrypt',
            content: '',
            key: '',
            keySize: '256',
            mode: 'CBC',
            result: '',
            base64Result: '',
            tabOptions: {
                encrypt: '加密',
                decrypt: '解密'
            },
            keySizeOptions: {
                '128': '128位 (16字符)',
                '192': '192位 (24字符)',
                '256': '256位 (32字符)'
            },
            modeOptions: {
                'CBC': 'CBC模式',
                'ECB': 'ECB模式',
                'CFB': 'CFB模式',
                'OFB': 'OFB模式',
                'CTR': 'CTR模式'
            }
        };
    },
    watch: {
        activeTab() {
            this.result = '';
            this.base64Result = '';
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        processAES() {
            if (!this.content.trim()) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '请输入内容'
                });
                return;
            }

            if (!this.key.trim()) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '请输入密钥'
                });
                return;
            }

            const keyLength = parseInt(this.keySize) / 8;
            if (this.key.length !== keyLength) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: `密钥长度必须为${keyLength}个字符`
                });
                return;
            }

            this.result = '';
            this.base64Result = '';
            
            try {
                const keyUtf8 = CryptoJS.enc.Utf8.parse(this.key);
                
                if (this.activeTab === 'encrypt') {
                    // 加密
                    const encrypted = CryptoJS.AES.encrypt(this.content, keyUtf8, {
                        mode: CryptoJS.mode[this.mode],
                        padding: CryptoJS.pad.Pkcs7
                    });
                    
                    this.result = encrypted.toString();
                    this.base64Result = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
                } else {
                    // 解密
                    const decrypted = CryptoJS.AES.decrypt(this.content, keyUtf8, {
                        mode: CryptoJS.mode[this.mode],
                        padding: CryptoJS.pad.Pkcs7
                    });
                    
                    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
                    if (!decryptedStr) {
                        throw new Error('解密失败');
                    }
                    
                    this.result = decryptedStr;
                }
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '错误',
                    text: '操作失败，请检查输入内容或密钥是否正确'
                });
            }
        },
        copyResult() {
            this.$copyText(this.result).then(() => {
                this.$noty.success('已复制到剪贴板');
            });
        },
        copyBase64() {
            this.$copyText(this.base64Result).then(() => {
                this.$noty.success('已复制到剪贴板');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.aes-encrypt {
    .content {
        min-width: 0;
    }
    .tab-buttons {
        display: flex;
        border-bottom: 1px solid var(--border-color, #e1e5e9);
        margin-bottom: 15px;
    }

    .tab-button {
        padding: 10px 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 14px;
        color: var(--text-color-secondary, #666);
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .tab-button:hover {
        color: var(--text-color, #333);
        background-color: var(--bg-color-secondary, #f8f9fa);
    }

    .tab-button.active {
        color: var(--primary-color, #007bff);
        border-bottom-color: var(--primary-color, #007bff);
        font-weight: 500;
    }

    .form-row {
         .setting-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            
            @media (max-width: 768px) {
                flex-direction: column;
                gap: 15px;
            }
            
            .setting-item {
                flex: 1;
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }
            }
        }
    }

    .form-col {
        flex: 1;
    }

    .result-section {
        .result-item {
            margin-bottom: 15px;
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--text-color, #333);
            }
        }
    }

    .aes-result {
        position: relative;
        
        pre {
            background: var(--bg-color-secondary, #f8f9fa);
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: var(--text-color, #333);
        }
        
        .copy-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 10px;
            background: var(--primary-color, #007bff);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            transition: opacity 0.3s ease;
            opacity: 0.8;
            
            &:hover {
                opacity: 1;
            }
        }
    }

    .instructions {
        h4 {
            margin: 15px 0 10px 0;
            color: var(--text-color, #333);
        }
        
        ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
            
            li {
                margin-bottom: 5px;
                line-height: 1.6;
            }
        }
    }

    .mb-15 {
        margin-bottom: 15px;
    }
        // 输入框统一美化
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
}
</style>