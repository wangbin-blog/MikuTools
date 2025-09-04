<template>
    <div class="jwt-tool">
        <nya-container title="JWT 解密/加密工具">
            <div class="jwt-info mb-15">
                <h3>JWT 简介</h3>
                <p>JWT (JSON Web Token) 是一种开放标准 (RFC 7519)，用于在网络应用环境间安全地将信息作为 JSON 对象传输。</p>
            </div>

            <!-- 输入区域 -->
            <nya-input
                v-model="jwtInput"
                class="mb-15"
                fullwidth
                rows="4"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入JWT Token"
                placeholder="请输入需要解析或加密的JWT Token..."
            />

            <!-- 操作按钮 -->
            <div class="btn-group mb-15">
                <button type="button" class="jwt-btn jwt-btn-info" @click="decodeJWT">
                    🔍 解析JWT
                </button>
                <button type="button" class="jwt-btn jwt-btn-success" @click="validateJWT">
                    ✅ 验证签名
                </button>
                <button type="button" class="jwt-btn jwt-btn-primary" @click="createJWT">
                    🔐 生成JWT
                </button>
                <button type="button" class="jwt-btn jwt-btn-danger" @click="clearAll">
                    🗑️ 清空
                </button>
            </div>


        </nya-container>
        
            <!-- 创建JWT的表单 -->
            <nya-container v-if="showCreateForm" title="创建JWT" class="mb-15">
                <div class="create-form">
                    <nya-input
                        v-model="jwtPayload"
                        class="mb-15"
                        fullwidth
                        rows="6"
                        type="textarea"
                        label="Payload (JSON格式)"
                        placeholder='{"userId": 123, "username": "admin"}'
                    />
                    
                    <nya-input
                        v-model="jwtSecret"
                        class="mb-15"
                        fullwidth
                        type="password"
                        label="密钥 (Secret)"
                        placeholder="请输入用于签名的密钥..."
                    />

                    <nya-select
                        v-model="jwtAlgorithm"
                        class="mb-15"
                        label="算法"
                        :items="algorithmOptions"
                    />

                    <button type="button" class="jwt-btn jwt-btn-success" @click="generateJWT">
                        🚀 生成JWT
                    </button>
                </div>
            </nya-container>

            <!-- 解析结果 -->
            <nya-container v-if="decodedHeader" title="Header" class="mb-15">
                <json-viewer 
                    :value="decodedHeader"
                    :expand-depth="2"
                    copyable
                    boxed
                    sort
                />
            </nya-container>

            <nya-container v-if="decodedPayload" title="Payload" class="mb-15">
                <json-viewer 
                    :value="decodedPayload"
                    :expand-depth="3"
                    copyable
                    boxed
                    sort
                />
            </nya-container>

            <!-- 验证结果 -->
            <nya-container v-if="validationResult" title="验证结果" class="mb-15">
                <div class="validation-result" :class="{ valid: validationResult.valid, invalid: !validationResult.valid }">
                    <p><strong>状态:</strong> {{ validationResult.valid ? '✅ 签名有效' : '❌ 签名无效' }}</p>
                    <p v-if="validationResult.message"><strong>详情:</strong> {{ validationResult.message }}</p>
                </div>
            </nya-container>

            <!-- 生成的JWT -->
            <nya-container v-if="generatedToken" title="生成的JWT" class="mb-15">
                <nya-input
                    v-model="generatedToken"
                    class="mb-15"
                    fullwidth
                    rows="3"
                    type="textarea"
                    readonly
                    label="JWT Token"
                />
                <div class="btn-group mb-15">                    
                    <button type="button" class="jwt-btn jwt-btn-info" @click="copyJWT">
                        📋 复制JWT
                    </button>
                    <button type="button" class="jwt-btn jwt-btn-success" @click="testGeneratedJWT">
                        🧪 测试此JWT
                    </button>
                </div>
            </nya-container>
        <!-- 使用说明 -->
        <nya-container title="使用说明">
            <div class="instructions">
                <h4>功能介绍：</h4>
                <ul>
                    <li><strong>解析JWT：</strong>将JWT Token分解为Header和Payload</li>
                    <li><strong>验证签名：</strong>检查JWT的签名是否有效</li>
                    <li><strong>生成JWT：</strong>创建新的JWT Token</li>
                </ul>
                
                <h4>JWT格式：</h4>
                <p>JWT由三部分组成，用点(.)分隔：</p>
                <code>header.payload.signature</code>
                
                <h4>常用算法：</h4>
                <ul>
                    <li><strong>HS256：</strong>HMAC使用SHA-256（对称加密）</li>
                    <li><strong>RS256：</strong>RSASSA-PKCS1-v1_5使用SHA-256（非对称加密）</li>
                    <li><strong>ES256：</strong>ECDSA使用P-256和SHA-256</li>
                </ul>
            </div>
        </nya-container>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
    name: 'JwtTool',
    data() {
        return {
            jwtInput: '',
            jwtPayload: JSON.stringify({
                userId: 123,
                username: 'admin',
                exp: Math.floor(Date.now() / 1000) + 3600, // 1小时后过期
                iat: Math.floor(Date.now() / 1000)
            }, null, 2),
            jwtSecret: 'your-secret-key',
            jwtAlgorithm: 'HS256',
            decodedHeader: null,
            decodedPayload: null,
            validationResult: null,
            generatedToken: null,
            showCreateForm: false,
            algorithmOptions: { 'HS256':'HS256','HS384': 'HS384','HS512': 'HS512' }
            
        };
    },
    methods: {
        // Base64 URL编码
        base64UrlEncode(str) {
            return btoa(str)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        },

        // Base64 URL解码
        base64UrlDecode(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) {
                str += '=';
            }
            try {
                return atob(str);
            } catch (e) {
                throw new Error('Invalid Base64 encoding');
            }
        },

        // 解析JWT
        decodeJWT() {
            if (!this.jwtInput.trim()) {
                this.$noty.error('请输入JWT Token');
                return;
            }

            try {
                const parts = this.jwtInput.split('.');
                if (parts.length !== 3) {
                    throw new Error('JWT格式错误：必须包含3个部分');
                }

                // 解码Header
                const headerStr = this.base64UrlDecode(parts[0]);
                this.decodedHeader = JSON.parse(headerStr);

                // 解码Payload
                const payloadStr = this.base64UrlDecode(parts[1]);
                this.decodedPayload = JSON.parse(payloadStr);

                // 自动验证签名
                this.validateJWT();

                this.$noty.success('JWT解析成功');
            } catch (error) {
                this.$noty.error('解析失败：' + error.message);
                this.clearDecoded();
            }
        },

        // 验证JWT签名
        validateJWT() {
            if (!this.jwtInput.trim()) {
                this.$noty.error('请输入JWT Token');
                return;
            }

            try {
                const parts = this.jwtInput.split('.');
                if (parts.length !== 3) {
                    throw new Error('JWT格式错误');
                }

                const [header, payload, signature] = parts;
                
                // 解码header获取算法
                const headerObj = JSON.parse(this.base64UrlDecode(header));
                const algorithm = headerObj.alg;

                // 验证需要密钥
                if (!this.jwtSecret) {
                    this.validationResult = {
                        valid: false,
                        message: '需要密钥才能验证签名'
                    };
                    return;
                }

                // 计算签名
                const message = header + '.' + payload;
                let computedSignature;

                switch (algorithm) {
                    case 'HS256':
                        computedSignature = CryptoJS.HmacSHA256(message, this.jwtSecret);
                        break;
                    case 'HS384':
                        computedSignature = CryptoJS.HmacSHA384(message, this.jwtSecret);
                        break;
                    case 'HS512':
                        computedSignature = CryptoJS.HmacSHA512(message, this.jwtSecret);
                        break;
                    default:
                        throw new Error('不支持的算法：' + algorithm);
                }

                const computedSignatureBase64 = this.base64UrlEncode(
                    CryptoJS.enc.Base64.stringify(computedSignature)
                );

                this.validationResult = {
                    valid: computedSignatureBase64 === signature,
                    message: computedSignatureBase64 === signature ? '签名验证通过' : '签名验证失败'
                };

            } catch (error) {
                this.validationResult = {
                    valid: false,
                    message: '验证失败：' + error.message
                };
            }
        },

        // 显示创建JWT表单
        createJWT() {
            this.showCreateForm = !this.showCreateForm;
            if (this.showCreateForm) {
                this.clearDecoded();
                this.validationResult = null;
                this.generatedToken = null;
            }
        },

        // 生成JWT
        generateJWT() {
            try {
                if (!this.jwtPayload.trim()) {
                    this.$noty.error('请输入Payload');
                    return;
                }

                if (!this.jwtSecret.trim()) {
                    this.$noty.error('请输入密钥');
                    return;
                }

                // 验证JSON格式
                const payload = JSON.parse(this.jwtPayload);

                // 创建Header
                const header = {
                    alg: this.jwtAlgorithm,
                    typ: 'JWT'
                };

                // 编码Header和Payload
                const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
                const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

                // 创建签名
                const message = encodedHeader + '.' + encodedPayload;
                let signature;

                switch (this.jwtAlgorithm) {
                    case 'HS256':
                        signature = CryptoJS.HmacSHA256(message, this.jwtSecret);
                        break;
                    case 'HS384':
                        signature = CryptoJS.HmacSHA384(message, this.jwtSecret);
                        break;
                    case 'HS512':
                        signature = CryptoJS.HmacSHA512(message, this.jwtSecret);
                        break;
                }

                const encodedSignature = this.base64UrlEncode(
                    CryptoJS.enc.Base64.stringify(signature)
                );

                // 组合JWT
                this.generatedToken = encodedHeader + '.' + encodedPayload + '.' + encodedSignature;
                this.showCreateForm = false;
                this.$noty.success('JWT生成成功');

            } catch (error) {
                this.$noty.error('生成失败：' + error.message);
            }
        },

        // 复制JWT
        copyJWT() {
            if (this.generatedToken) {
                this.$copyText(this.generatedToken);
                this.$noty.success('JWT已复制到剪贴板');
            }
        },

        // 测试生成的JWT
        testGeneratedJWT() {
            if (this.generatedToken) {
                this.jwtInput = this.generatedToken;
                this.decodeJWT();
            }
        },

        // 清空所有数据
        clearAll() {
            this.jwtInput = '';
            this.jwtPayload = JSON.stringify({
                userId: 123,
                username: 'admin',
                exp: Math.floor(Date.now() / 1000) + 3600,
                iat: Math.floor(Date.now() / 1000)
            }, null, 2);
            this.jwtSecret = 'your-secret-key';
            this.clearDecoded();
            this.validationResult = null;
            this.generatedToken = null;
            this.showCreateForm = false;
            this.$noty.info('已清空');
        },

        // 清空解析结果
        clearDecoded() {
            this.decodedHeader = null;
            this.decodedPayload = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.jwt-tool {
    max-width: 1200px;
    margin: 0 auto;

    .jwt-info {
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 15px;
        
        h3 {
            margin: 0 0 10px 0;
            color: var(--primary-color);
        }
        
        p {
            margin: 0;
            color: var(--text-color);
            line-height: 1.6;
        }
    }

    .create-form {
        .nya-select {
            width: 200px;
        }
    }

    .validation-result {
        padding: 15px;
        border-radius: 8px;
        
        &.valid {
            background: rgba(72, 187, 120, 0.1);
            border: 1px solid #48bb78;
            color: #48bb78;
        }
        
        &.invalid {
            background: rgba(245, 101, 101, 0.1);
            border: 1px solid #f56565;
            color: #f56565;
        }
        
        p {
            margin: 5px 0;
        }
    }

    .instructions {
        h4 {
            color: var(--primary-color);
            margin: 15px 0 10px 0;
        }
        
        ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
        }
        
        code {
            background: var(--bg-color);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
    }

    .btn-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        
        button {
            flex: 1;
            min-width: 120px;
        }
    }

    @media (max-width: 768px) {
        .btn-group {
            flex-direction: column;
            
            button {
                width: 100%;
            }
        }
    }
}
</style>