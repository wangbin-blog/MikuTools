<template>
    <div class="hash-tools">
        <div class="content">
        <nya-container title="哈希计算工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线哈希计算工具，支持多种哈希算法，包括MD5、SHA系列、RIPEMD160等，可计算文本的哈希值。</p>
            </div>

            <nya-input
                v-model="content"
                fullwidth
                rows="5"
                type="textarea"
                autofocus
                autocomplete="off"
                label="待计算的内容"
                placeholder="请输入要计算哈希的文本内容"
            />
            
            <nya-select
                v-model="hashType"
                fullwidth
                :items="hashOptions"
                label="选择哈希算法"
            />
            <button
                type="button"
                class="btn-primary mt-15"
                @click="calculateHash"
            >
                开始计算
            </button>
        </nya-container>

        <nya-container v-show="result" title="计算结果">
            <div class="result-section">
                <div class="result-item">
                    <label>算法类型：</label>
                    <span class="algorithm-type">{{ hashType }}</span>
                </div>
                <div class="result-item">
                    <label>哈希值：</label>
                    <div class="hash-result">
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
                <h4>支持的哈希算法：</h4>
                <ul>
                    <li><strong>MD5：</strong>128位哈希值，广泛用于数据完整性验证</li>
                    <li><strong>SHA-1：</strong>160位哈希值，安全性高于MD5</li>
                    <li><strong>SHA-256：</strong>256位哈希值，SHA-2系列，安全性高</li>
                    <li><strong>SHA-3：</strong>最新SHA标准，提供不同输出长度</li>
                    <li><strong>RIPEMD-160：</strong>160位哈希值，欧洲设计的算法</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>输入任意文本内容计算哈希值</li>
                    <li>相同输入使用相同算法会得到相同结果</li>
                    <li>哈希值通常用于数据完整性校验</li>
                    <li>不同算法的输出长度和安全性不同</li>
                </ul>
            </div>
        </nya-container>
    
        </div>
        
</div>
</template>

<script>

import CryptoJS from 'crypto-js';
import createDownload from '~/utils/createDownload.js';

export default {
    name: 'HashTools',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        
    },
    data() {
        return {
            content: '',
            hashType: 'MD5',
            result: '',
            hashOptions: {
                'MD5': 'MD5',
                'SHA1': 'SHA-1',
                'SHA256': 'SHA-256',
                'SHA3': 'SHA-3',
                'RIPEMD160': 'RIPEMD-160'
            }
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        calculateHash() {
            if (!this.content.trim()) {
                this.$modal.show('dialog', {
                    title: '提示',
                    text: '请输入要计算哈希的内容'
                });
                return;
            }

            this.result = '';
            
            try {
                let hashResult = '';
                
                switch (this.hashType) {
                    case 'MD5':
                        hashResult = CryptoJS.MD5(this.content).toString();
                        break;
                    case 'SHA1':
                        hashResult = CryptoJS.SHA1(this.content).toString();
                        break;
                    case 'SHA256':
                        hashResult = CryptoJS.SHA256(this.content).toString();
                        break;
                    case 'SHA3':
                        hashResult = CryptoJS.SHA3(this.content).toString();
                        break;
                    case 'RIPEMD160':
                        hashResult = CryptoJS.RIPEMD160(this.content).toString();
                        break;
                    default:
                        hashResult = CryptoJS.MD5(this.content).toString();
                }
                
                this.result = hashResult;
                this.$noty.success('哈希计算成功！');
                
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
.hash-tools {
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
            
            .hash-result {
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