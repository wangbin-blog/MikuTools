<template>
    <div class="sm-crypto">
        <div class="content">
        <nya-container title="国密SM2加密解密">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>SM2是中国国家密码管理局发布的椭圆曲线公钥密码算法，基于ECC椭圆曲线密码学，提供数字签名、密钥交换和公钥加密功能。</p>
            </div>

            <!-- 操作模式选择 -->
            <div class="tab-buttons mb-15">
                <button 
                    v-for="(label, value) in tabOptions" 
                    :key="value"
                    :class="['tab-button', { active: activeTab === value }]"
                    @click="activeTab = value"
                >
                    {{ label }}
                </button>
            </div>

            <!-- 密钥输入区域 -->
            <div v-if="activeTab === 'encrypt'" class="key-section mb-15">
                <nya-input v-model="publicKey" fullwidth rows="3" type="textarea" label="公钥 (Hex格式)" placeholder="请输入SM2公钥，以04开头" />
            </div>
            <div v-if="activeTab === 'decrypt'" class="key-section mb-15">
                <nya-input v-model="privateKey" fullwidth rows="3" type="textarea" label="私钥 (Hex格式)" placeholder="请输入SM2私钥" />
            </div>

            <!-- 内容输入区域 -->
            <nya-input v-model="content" fullwidth rows="5" type="textarea" :label="activeTab === 'encrypt' ? '待加密内容' : '待解密内容'" :placeholder="activeTab === 'encrypt' ? '请输入要加密的明文内容' : '请输入要解密的密文内容'" />
            
            <br>
            <button
                type="button"
                class="btn-primary"
                @click="handleSM2Operation"
                :disabled="!canProceed"
            >
                {{ activeTab === 'encrypt' ? '开始加密' : '开始解密' }}
            </button>
        </nya-container>

        <nya-container v-show="result" :title="operationTitle">
            <pre>{{ result }}</pre>
            <div class="action-buttons mt-15" v-if="result">
                <button 
                    type="button" 
                    class="jwt-btn jwt-btn-success"
                    @click="copyResult"
                >
                    📋 复制结果
                </button>
                <button 
                    v-if="activeTab === 'encrypt'"
                    type="button" 
                    class="jwt-btn jwt-btn-info"
                    @click="saveResult"
                >
                    💾 保存结果
                </button>
            </div>
        </nya-container>

        <!-- 密钥生成 -->
        <nya-container title="密钥生成" class="mb-15">
            <div class="key-generation">
                <p>生成SM2密钥对（基于椭圆曲线secp256k1）</p>
                <button
                    type="button"
                    class="jwt-btn jwt-btn-info"
                    @click="generateKeyPair"
                >
                    🔑 生成密钥对
                </button>
                <div v-if="generatedKeys.publicKey" class="key-display mt-15">
                    <h4>公钥：</h4>
                    <pre>{{ generatedKeys.publicKey }}</pre>
                    <h4>私钥：</h4>
                    <pre>{{ generatedKeys.privateKey }}</pre>
                </div>
            </div>
        </nya-container>

        <!-- 使用说明 -->
        <nya-container title="使用说明">
            <div class="instructions">
                <h4>SM2算法介绍：</h4>
                <ul>
                    <li><strong>安全性：</strong>基于椭圆曲线离散对数问题，安全性高</li>
                    <li><strong>密钥长度：</strong>256位密钥，相当于RSA 3072位安全性</li>
                    <li><strong>应用场景：</strong>数字签名、密钥交换、公钥加密</li>
                    <li><strong>标准：</strong>中国国家密码管理局GM/T 0003-2012标准</li>
                </ul>

                <h4>使用提示：</h4>
                <ul>
                    <li>公钥以04开头，表示未压缩格式</li>
                    <li>加密结果采用Base64编码</li>
                    <li>解密时需要对应的私钥</li>
                    <li>密钥对必须匹配才能成功解密</li>
                </ul>
            </div>
        </nya-container>
    
        </div>
        <SiteFooter @donate="goHome" />
</div>
</template>

<script>import SiteFooter from '~/components/SiteFooter';

const sm2 = require('sm-crypto').sm2;

export default {
    name: 'SM2Crypto',
    head() {
        return {
            title: '国密SM2加密解密工具',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: '在线国密SM2椭圆曲线公钥密码算法加密解密工具，支持SM2密钥生成、加密、解密功能。'
                }
            ]
        };
    },
    components: {
        SiteFooter,
    },
    data() {
        return {
            activeTab: 'encrypt',
            tabOptions: {
                'encrypt': '加密',
                'decrypt': '解密'
            },
            content: '',
            publicKey: '',
            privateKey: '',
            result: '',
            generatedKeys: {
                publicKey: '',
                privateKey: ''
            }
        };
    },
    computed: {
        canProceed() {
            if (this.activeTab === 'encrypt') {
                return this.content && this.publicKey;
            } else {
                return this.content && this.privateKey;
            }
        },
        operationTitle() {
            return this.activeTab === 'encrypt' ? '加密成功' : '解密成功';
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        handleSM2Operation() {
            this.result = '';
            
            try {
                if (this.activeTab === 'encrypt') {
                    // SM2加密
                    const encrypted = sm2.doEncrypt(this.content, this.publicKey, 1);
                    this.result = encrypted;
                } else {
                    // SM2解密
                    const decrypted = sm2.doDecrypt(this.content, this.privateKey, 1);
                    this.result = decrypted;
                }
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '操作失败',
                    text: `错误: ${error.message || '请检查密钥格式是否正确'}`
                });
            }
        },
        
        generateKeyPair() {
            try {
                const keypair = sm2.generateKeyPairHex();
                this.generatedKeys.publicKey = keypair.publicKey;
                this.generatedKeys.privateKey = keypair.privateKey;
                
                // 将公钥填入加密输入框
                if (this.activeTab === 'encrypt') {
                    this.publicKey = keypair.publicKey;
                }
            } catch (error) {
                this.$modal.show('dialog', {
                    title: '生成失败',
                    text: `错误: ${error.message || '密钥生成失败'}`
                });
            }
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
                const blob = new Blob([this.result], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sm2_${this.activeTab}_result.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.sm-crypto {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    
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
    
    .key-section {
        .nya-input {
            margin-bottom: 15px;
        }
    }
    
    .key-generation {
        text-align: center;
        
        p {
            margin-bottom: 15px;
            color: #666;
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
    
    .action-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
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
    
    pre {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 5px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-all;
        margin: 0;
    }
}
</style>