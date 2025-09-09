<template>
    <div class="stream-cipher">
        <nya-container title="流密码加密/解密工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>流密码加密解密工具，支持RC4和Rabbit算法，提供快速的对称加密功能。</p>
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
                placeholder="请输入密钥"
            />
            
            <div class="form-row mb-15">
                <div class="form-col">
                    <nya-select
                        v-model="algorithm"
                        :items="algorithmOptions"
                        label="算法选择"
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
                @click="processStream"
            >
                {{ activeTab === 'encrypt' ? '开始加密' : '开始解密' }}
            </button>
        </nya-container>

        <nya-container v-show="result" :title="activeTab === 'encrypt' ? '加密结果' : '解密结果'">
            <div class="result-section">
                <div class="result-item">
                    <label>算法信息：</label>
                    <span class="algorithm-info">{{ algorithm }}</span>
                </div>
                <div class="result-item">
                    <label>{{ activeTab === 'encrypt' ? '加密结果：' : '解密结果：' }}</label>
                    <div class="stream-result">
                        <pre>{{ result }}</pre>
                        <button
                            type="button"
                            class="copy-btn mt-15 mr-15"
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
                <h4>流密码特点：</h4>
                <ul>
                    <li><strong>RC4：</strong>Rivest Cipher 4，简单快速，但存在安全漏洞</li>
                    <li><strong>Rabbit：</strong>基于流密码的算法，安全性较好</li>
                    <li><strong>速度快：</strong>适合大量数据加密</li>
                    <li><strong>实现简单：</strong>算法相对简单</li>
                </ul>

                <h4>安全建议：</h4>
                <ul>
                    <li><strong>RC4警告：</strong>已被发现多个安全漏洞，不建议使用</li>
                    <li><strong>推荐使用：</strong>Rabbit算法相对安全</li>
                    <li><strong>最佳选择：</strong>使用AES等现代算法</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>密钥长度影响安全性，越长越安全</li>
                    <li>加密结果可以安全传输</li>
                    <li>建议使用Base64格式便于传输</li>
                </ul>
            </div>
        </nya-container>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
    name: 'StreamCipher',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            activeTab: 'encrypt',
            content: '',
            key: '',
            algorithm: 'RC4',
            useBase64: true,
            result: '',
            tabOptions: {
                encrypt: '加密',
                decrypt: '解密'
            },
            algorithmOptions: {
                'RC4': 'RC4',
                'Rabbit': 'Rabbit'
            }
        };
    },
    watch: {
        algorithm() {
            this.result = '';
        },
        activeTab() {
            this.result = '';
        }
    },
    methods: {
        processStream() {
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

            this.result = '';
            
            try {
                const keyUtf8 = CryptoJS.enc.Utf8.parse(this.key);
                
                if (this.activeTab === 'encrypt') {
                    // 加密
                    let encrypted;
                    if (this.algorithm === 'RC4') {
                        encrypted = CryptoJS.RC4.encrypt(this.content, keyUtf8);
                    } else {
                        encrypted = CryptoJS.Rabbit.encrypt(this.content, keyUtf8);
                    }
                    
                    this.result = this.useBase64 ? 
                        encrypted.ciphertext.toString(CryptoJS.enc.Base64) : 
                        encrypted.toString();
                } else {
                    // 解密
                    let decrypted;
                    if (this.algorithm === 'RC4') {
                        decrypted = CryptoJS.RC4.decrypt(this.content, keyUtf8);
                    } else {
                        decrypted = CryptoJS.Rabbit.decrypt(this.content, keyUtf8);
                    }
                    
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
.stream-cipher {
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
            
            .algorithm-info {
                color: var(--primary-color, #007bff);
                font-weight: 500;
            }
        }
    }

    .stream-result {
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