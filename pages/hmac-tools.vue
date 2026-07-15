<template>
    <div class="hmac-tools">
        <div class="content">
        <nya-container title="HMAC 加密工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线HMAC（基于哈希的消息认证码）计算工具，支持多种哈希算法，需要密钥参与计算，提供更高的安全性。</p>
            </div>

            <nya-input
                v-model="content"
                fullwidth
                rows="3"
                type="textarea"
                autofocus
                autocomplete="off"
                label="待加密的内容"
                placeholder="请输入要加密的内容"
            />
            
            <nya-input
                v-model="key"
                fullwidth
                autocomplete="off"
                label="密钥 (Secret Key)"
                placeholder="请输入加密密钥"
            />
            
            <br>
            <nya-select
                v-model="algorithm"
                fullwidth
                :items="algorithmOptions"
                label="选择HMAC算法"
            />
            <br>
            
            <button
                type="button"
                class="btn-primary"
                @click="calculateHMAC"
            >
                开始加密
            </button>
        </nya-container>

        <nya-container v-show="result" title="加密结果">
            <div class="result-section">
                <div class="result-item">
                    <label>算法类型：</label>
                    <span class="algorithm-type">Hmac{{ algorithm }}</span>
                </div>
                <div class="result-item">
                    <label>HMAC值：</label>
                    <div class="hmac-result">
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
                <div class="result-item">
                    <label>长度：</label>
                    <span>{{ result ? result.length : 0 }} 字符</span>
                </div>
            </div>
        </nya-container>

        <nya-container title="使用说明">
            <div class="instructions">
                <h4>支持的HMAC算法：</h4>
                <ul>
                    <li><strong>HmacMD5：</strong>使用MD5哈希的HMAC，128位输出</li>
                    <li><strong>HmacSHA1：</strong>使用SHA-1哈希的HMAC，160位输出</li>
                    <li><strong>HmacSHA256：</strong>使用SHA-256哈希的HMAC，256位输出</li>
                    <li><strong>HmacSHA512：</strong>使用SHA-512哈希的HMAC，512位输出</li>
                </ul>

                <h4>HMAC的特点：</h4>
                <ul>
                    <li>需要密钥参与计算，提供认证功能</li>
                    <li>比单独哈希更安全，可验证数据完整性</li>
                    <li>相同的输入使用不同的密钥会产生不同结果</li>
                    <li>广泛用于API签名、数据验证等场景</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>输入要加密的内容和密钥</li>
                    <li>选择适合的HMAC算法</li>
                    <li>密钥越长越安全，建议使用复杂密钥</li>
                    <li>结果可用于数据完整性验证</li>
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
    name: 'HMACTools',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        SiteFooter,
    },
    data() {
        return {
            content: '',
            key: '',
            algorithm: 'SHA256',
            result: '',
            algorithmOptions: {
                'MD5': 'MD5',
                'SHA1': 'SHA-1',
                'SHA256': 'SHA-256',
                'SHA512': 'SHA-512'
            }
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        calculateHMAC() {
            if (!this.content.trim()) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '请输入要加密的内容'
                });
                return;
            }

            if (!this.key.trim()) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '请输入加密密钥'
                });
                return;
            }

            this.result = '';
            
            try {
                let hmacResult = '';
                
                switch (this.algorithm) {
                    case 'MD5':
                        hmacResult = CryptoJS.HmacMD5(this.content, this.key).toString();
                        break;
                    case 'SHA1':
                        hmacResult = CryptoJS.HmacSHA1(this.content, this.key).toString();
                        break;
                    case 'SHA256':
                        hmacResult = CryptoJS.HmacSHA256(this.content, this.key).toString();
                        break;
                    case 'SHA512':
                        hmacResult = CryptoJS.HmacSHA512(this.content, this.key).toString();
                        break;
                    default:
                        hmacResult = CryptoJS.HmacSHA256(this.content, this.key).toString();
                }
                
                this.result = hmacResult;
                this.$noty.success('HMAC计算成功！');
                
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '计算失败',
                    text: `ERROR: ${error.message}`
                });
            }
        },
        
        copyResult() {
            if (!this.result) return;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(this.result).then(() => {
                    this.$noty.success('已复制到剪贴板！');
                }).catch(() => {
                    this.fallbackCopy(this.result);
                });
            } else {
                this.fallbackCopy(this.result);
            }
        },
        
        fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.$noty.success('已复制到剪贴板！');
            } catch (err) {
                this.$noty.error('复制失败，请手动复制');
            }
            
            document.body.removeChild(textArea);
        }
    }
};
</script>

<style lang="scss" scoped>
.hmac-tools {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    .result-section {
        .result-item {
            margin-bottom: 15px;
            
            label {
                font-weight: bold;
                color: var(--text-color);
                margin-right: 10px;
            }
            
            .algorithm-type {
                color: var(--theme-color);
                font-weight: bold;
            }
            
            .hmac-result {
                position: relative;
                background: var(--bg-color-secondary);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                
                pre {
                    margin: 0;
                    font-family: 'Courier New', monospace;
                    word-break: break-all;
                    color: var(--text-color);
                    font-size: 14px;
                }
                
                .copy-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: var(--primary-color, #007bff);
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    
                    &:hover {
                        opacity: 0.8;
                    }
                }
            }
        }
    }
    
    .instructions {
        h4 {
            color: var(--theme-color);
            margin-top: 20px;
            margin-bottom: 10px;
        }
        
        ul {
            margin-left: 20px;
            
            li {
                margin-bottom: 8px;
                color: var(--text-color-secondary);
                line-height: 1.6;
            }
        }
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