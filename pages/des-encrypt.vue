<template>
    <div class="des-encrypt">
        <div class="content">
        <nya-container title="DES 加密/解密工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>数据加密标准（DES）加密解密工具，虽然已被AES取代，但在某些旧系统中仍有使用。</p>
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
                placeholder="请输入8位密钥"
            />
            
            <div class="form-row mb-15">
                <div class="form-col">
                    <nya-select
                        v-model="mode"
                        :items="modeOptions"
                        label="加密模式"
                    />
                </div>
                <div class="form-col">
                    <nya-checkbox
                        v-model="useBase64"
                        label="使用Base64输出"
                    />
                </div>
            </div>
            
            <button
                type="button"
                class="btn-primary"
                @click="processDES"
            >
                {{ activeTab === 'encrypt' ? '开始加密' : '开始解密' }}
            </button>
        </nya-container>

        <nya-container v-show="result" :title="activeTab === 'encrypt' ? '加密结果' : '解密结果'">
            <div class="result-section">
                <div class="result-item">
                    <label>{{ activeTab === 'encrypt' ? '加密结果：' : '解密结果：' }}</label>
                    <div class="des-result">
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
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <div class="instructions">
                <h4>DES加密特点：</h4>
                <ul>
                    <li><strong>密钥长度：</strong>固定64位（实际56位有效）</li>
                    <li><strong>块大小：</strong>64位</li>
                    <li><strong>历史地位：</strong>曾经是最广泛使用的加密算法</li>
                    <li><strong>现状：</strong>已被AES取代，不再安全</li>
                </ul>

                <h4>使用警告：</h4>
                <ul>
                    <li><strong>⚠️ 不安全：</strong>DES已被现代计算机破解</li>
                    <li><strong>仅用于：</strong>兼容旧系统或学习目的</li>
                    <li><strong>推荐：</strong>请使用AES加密</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>密钥长度必须为8个字符</li>
                    <li>加密结果可以安全传输</li>
                    <li>建议使用Base64格式便于传输</li>
                </ul>
            </div>
        </nya-container>
    
        </div>
        <SiteFooter @donate="goHome" />
</div>
</template>

<script>import SiteFooter from '~/components/SiteFooter';

import CryptoJS from 'crypto-js';

export default {
    name: 'DESEncrypt',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        SiteFooter,
    },
    data() {
        return {
            activeTab: 'encrypt',
            content: '',
            key: '',
            mode: 'CBC',
            useBase64: true,
            result: '',
            tabOptions: {
                encrypt: '加密',
                decrypt: '解密'
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
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        processDES() {
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

            if (this.key.length !== 8) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '密钥长度必须为8个字符'
                });
                return;
            }

            this.result = '';
            
            try {
                const keyUtf8 = CryptoJS.enc.Utf8.parse(this.key);
                
                if (this.activeTab === 'encrypt') {
                    // 加密
                    const encrypted = CryptoJS.DES.encrypt(this.content, keyUtf8, {
                        mode: CryptoJS.mode[this.mode],
                        padding: CryptoJS.pad.Pkcs7
                    });
                    
                    this.result = this.useBase64 ? 
                        encrypted.ciphertext.toString(CryptoJS.enc.Base64) : 
                        encrypted.toString();
                } else {
                    // 解密
                    const decrypted = CryptoJS.DES.decrypt(this.content, keyUtf8, {
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
        }
    }
};
</script>

<style lang="scss" scoped>
.des-encrypt {
    .content {
        padding: 20px 24px;
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
        display: flex;
        gap: 15px;
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

    .des-result {
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