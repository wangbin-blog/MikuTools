<template>
    <div class="sm-hash">
        <div class="content">
        <nya-container title="国密SM3哈希算法">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>SM3是中国国家密码管理局发布的密码杂凑算法，输出长度为256位，适用于数字签名、验证、消息认证码等安全应用。</p>
            </div>

            <!-- 输入内容 -->
            <nya-input v-model="content" fullwidth rows="5" type="textarea" autofocus autocomplete="off" label="待处理的内容" placeholder="请输入要计算哈希的内容" />
            
            <!-- 选项设置 -->
            <div class="options-section mb-15">
                <nya-checkbox v-model="uppercase" label="大写字母" />
                <nya-checkbox v-model="hmacMode" label="HMAC模式" />
            </div>
            
            <!-- HMAC密钥输入 -->
            <nya-input v-if="hmacMode" v-model="key" fullwidth autocomplete="off" label="HMAC密钥" placeholder="请输入HMAC密钥" />
            
            <br>
            <button
                type="button"
                class="btn-primary"
                @click="calculateHash"
                :disabled="!content"
            >
                计算SM3哈希
            </button>
        </nya-container>

        <nya-container v-show="result" title="计算结果">
            <div class="result-section">
                <div class="result-display">
                    <pre>{{ result }}</pre>
                </div>
                <div class="result-info">
                    <span class="hash-length">长度: {{ result ? result.length : 0 }} 字符</span>
                    <span class="hash-bits">位数: 256位</span>
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
                        @click="compareHash"
                        :disabled="!result"
                    >
                        🔍 对比哈希
                    </button>
                </div>
            </div>
        </nya-container>

        <!-- 批量处理 -->
        <nya-container title="批量处理" class="mb-15">
            <div class="batch-section">
                <nya-input v-model="batchContent" fullwidth rows="3" type="textarea" label="批量内容" placeholder="请输入多行内容，每行一个" />
                <button
                    type="button"
                    class="jwt-btn jwt-btn-info mt-15"
                    @click="batchCalculate"
                    :disabled="!batchContent"
                >
                    批量计算
                </button>
                <div v-if="batchResults.length > 0" class="batch-results mt-15">
                    <h4>批量结果:</h4>
                    <div class="result-table">
                        <div v-for="(item, index) in batchResults" :key="index" class="result-row">
                            <span class="input-text">{{ item.input }}</span>
                            <span class="hash-result">{{ item.hash }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </nya-container>

        <!-- 使用说明 -->
        <nya-container title="使用说明">
            <div class="instructions">
                <h4>SM3算法特点：</h4>
                <ul>
                    <li><strong>输出长度：</strong>256位（32字节）哈希值</li>
                    <li><strong>安全性：</strong>抗碰撞性、抗原像攻击</li>
                    <li><strong>性能：</strong>比SHA-256更快，适合硬件实现</li>
                    <li><strong>标准：</strong>中国国家密码管理局GM/T 0004-2012标准</li>
                </ul>

                <h4>使用场景：</h4>
                <ul>
                    <li>数字签名和验证</li>
                    <li>消息认证码（MAC）生成</li>
                    <li>数据完整性校验</li>
                    <li>区块链应用</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>输入内容可以是任意文本或二进制数据</li>
                    <li>HMAC模式需要额外密钥，增强安全性</li>
                    <li>批量处理支持多行文本，每行独立计算</li>
                    <li>结果可用于数据完整性验证</li>
                </ul>
            </div>
        </nya-container>

        <!-- 对比模态框 -->
        <div v-if="showCompareModal" class="compare-modal" @click="closeCompareModal">
            <div class="modal-content" @click.stop>
                <h3>哈希值对比</h3>
                <nya-input v-model="compareHashValue" fullwidth placeholder="请输入要对比的哈希值" />
                <div class="compare-result" v-if="compareHashValue">
                    <div :class="['result-status', isMatch ? 'match' : 'no-match']">
                        {{ isMatch ? '✅ 匹配' : '❌ 不匹配' }}
                    
        </div>
        
</div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="jwt-btn jwt-btn-primary" @click="closeCompareModal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

const sm3 = require('sm-crypto').sm3;

export default {
    name: 'SM3Hash',
    head() {
        return {
            title: '国密SM3哈希算法工具',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: '在线国密SM3密码杂凑算法工具，支持SM3哈希计算、HMAC-SM3、批量处理等功能。'
                }
            ]
        };
    },
    components: {
        
    },
    data() {
        return {
            content: '',
            key: '',
            uppercase: false,
            hmacMode: false,
            result: '',
            batchContent: '',
            batchResults: [],
            showCompareModal: false,
            compareHashValue: '',
            isMatch: false
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        calculateHash() {
            if (!this.content) return;
            
            try {
                let hash;
                if (this.hmacMode && this.key) {
                    // HMAC-SM3
                    hash = sm3.hmac(this.key, this.content);
                } else {
                    // 普通SM3
                    hash = sm3(this.content);
                }
                
                this.result = this.uppercase ? hash.toUpperCase() : hash;
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '计算失败',
                    text: `错误: ${error.message || '哈希计算失败'}`
                });
            }
        },
        
        batchCalculate() {
            if (!this.batchContent) return;
            
            const lines = this.batchContent.split('\n').filter(line => line.trim());
            this.batchResults = [];
            
            lines.forEach(line => {
                try {
                    const hash = this.hmacMode && this.key ? 
                        sm3.hmac(this.key, line.trim()) : 
                        sm3(line.trim());
                    
                    this.batchResults.push({
                        input: line.trim(),
                        hash: this.uppercase ? hash.toUpperCase() : hash
                    });
                } catch (error) {
                    this.batchResults.push({
                        input: line.trim(),
                        hash: '计算失败'
                    });
                }
            });
        },
        
        copyResult() {
            if (this.result) {
                navigator.clipboard.writeText(this.result).then(() => {
                    this.$modal.show('dialog', {
                        title: '复制成功',
                        text: '哈希值已复制到剪贴板'
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
                const content = `SM3哈希计算结果\n\n输入内容: ${this.content}\n\n哈希值: ${this.result}\n\n计算时间: ${new Date().toLocaleString()}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sm3_hash_${Date.now()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        },
        
        compareHash() {
            this.showCompareModal = true;
            this.compareHashValue = '';
            this.isMatch = false;
        },
        
        closeCompareModal() {
            this.showCompareModal = false;
            this.compareHashValue = '';
            this.isMatch = false;
        }
    },
    watch: {
        compareHashValue(newVal) {
            if (newVal) {
                this.isMatch = newVal.toLowerCase() === this.result.toLowerCase();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.sm-hash {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    
    .options-section {
        display: flex;
        gap: 20px;
        align-items: center;
    }
    
    .result-section {
        .result-display {
            margin-bottom: 15px;
            
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
        
        .result-info {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #666;
        }
    }
    
    .batch-section {
        .batch-results {
            .result-table {
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 5px;
                
                .result-row {
                    display: flex;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    font-size: 12px;
                    
                    &:last-child {
                        border-bottom: none;
                    }
                    
                    .input-text {
                        flex: 1;
                        font-weight: bold;
                        margin-right: 10px;
                    }
                    
                    .hash-result {
                        flex: 2;
                        font-family: 'Courier New', monospace;
                        word-break: break-all;
                    }
                }
            }
        }
    }
    
    .compare-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        
        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            
            h3 {
                margin: 0 0 20px 0;
                color: #333;
            }
            
            .compare-result {
                margin: 15px 0;
                text-align: center;
                
                .result-status {
                    padding: 10px;
                    border-radius: 5px;
                    font-weight: bold;
                    
                    &.match {
                        background: #d4edda;
                        color: #155724;
                    }
                    
                    &.no-match {
                        background: #f8d7da;
                        color: #721c24;
                    }
                }
            }
            
            .modal-actions {
                text-align: center;
                margin-top: 20px;
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