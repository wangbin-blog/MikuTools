<template>
    <div class="password">
        <nya-container title="随机密码生成">
            <div class="checkbox-group mb-15">
                <nya-checkbox v-model="useLowercase" label="小写字母 (a-z)" />
                <nya-checkbox v-model="useUppercase" label="大写字母 (A-Z)" />
                <nya-checkbox v-model="useNumbers" label="数字 (0-9)" />
                <nya-checkbox v-model="useSymbols" label="特殊字符 (!@#$...)" />
            </div>
            <nya-input v-model.trim="length" class="mb-15" fullwidth type="number" label="密码长度" placeholder="10" autocomplete="off" />
            <nya-input v-if="useSymbols" v-model="customSymbols" class="mb-15" fullwidth label="自定义特殊字符" placeholder="!@#$%^&*()_+-=[]{}|;:,.<>?" autocomplete="off" />
            
            <nya-input v-model.trim="excludeChars" class="mb-15" fullwidth label="排除字符" placeholder="排除的字符，如：0oO1lI" autocomplete="off" />
            
            <nya-input v-model.trim="quantity" class="mb-15" fullwidth type="number" label="生成数量" placeholder="1" autocomplete="off" />
            
            <div class="btn-primary" @click="generatePassword">
                ✨ 生成密码
            </div>
        </nya-container>

        <nya-container v-if="passwords.length" title="生成结果">
            <div class="password-results">
                <div v-for="(password, index) in passwords" :key="index" class="password-item">
                    <pre><div class="password-text">{{ password }}</div></pre>
                    <button class="btn-control copy-btn" @click="copyPassword(password)">复制</button>
                </div>
            </div>
            <div class="nya-btn mt-15" @click="copyAll">
                全部复制
            </div>
        </nya-container>

        <nya-container title="密码强度提示">
            <ul class="tips">
                <li>建议使用包含大小写字母、数字和特殊字符的复杂密码</li>
                <li>密码长度建议至少 12 位以上</li>
                <li>避免使用个人信息作为密码</li>
                <li>定期更换密码，不同网站使用不同密码</li>
            </ul>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'Password',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            length: 16,
            lengthOptions: [8, 12, 16, 20, 24, 32, 48, 64],
            useLowercase: true,
            useUppercase: true,
            useNumbers: true,
            useSymbols: true,
            customSymbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            excludeChars: '',
            quantity: 1,
            passwords: []
        };
    },
    methods: {
        generatePassword() {
            this.passwords = [];
            
            const quantity = parseInt(this.quantity);
            if (isNaN(quantity) || quantity < 1 || quantity > 100) {
                this.$swal({
                    type: 'error',
                    title: '生成失败',
                    text: '请输入1-100之间的生成数量'
                });
                return;
            }

            if (!this.useLowercase && !this.useUppercase && !this.useNumbers && !this.useSymbols) {
                this.$swal({
                    type: 'error',
                    title: '生成失败',
                    text: '请至少选择一种字符类型'
                });
                return;
            }

            const charset = this.buildCharset();
            if (charset.length === 0) {
                this.$swal({
                    type: 'error',
                    title: '生成失败',
                    text: '可用字符集为空，请检查排除字符设置'
                });
                return;
            }

            for (let i = 0; i < quantity; i++) {
                const password = this.generateSinglePassword(charset);
                this.passwords.push(password);
            }
        },
        buildCharset() {
            let charset = '';
            
            if (this.useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
            if (this.useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (this.useNumbers) charset += '0123456789';
            if (this.useSymbols) charset += this.customSymbols || '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            // 排除指定字符
            if (this.excludeChars) {
                const excludeSet = new Set(this.excludeChars.split(''));
                charset = charset.split('').filter(char => !excludeSet.has(char)).join('');
            }
            
            return charset;
        },
        generateSinglePassword(charset) {
            let password = '';
            const charsetLength = charset.length;
            
            for (let i = 0; i < this.length; i++) {
                const randomIndex = Math.floor(Math.random() * charsetLength);
                password += charset[randomIndex];
            }
            
            return password;
        },
        copyPassword(password) {
            this.$copyText(password).then(() => {
                this.$noty.success('密码已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },
        copyAll() {
            if (this.passwords.length === 0) return;
            
            const allPasswords = this.passwords.join('\n');
            this.$copyText(allPasswords).then(() => {
                this.$noty.success('所有密码已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        }
    }
};
</script>

<style lang="scss">
.password {
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
    
    .password-results {
        .password-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            margin-bottom: 8px;
            background-color: var(--bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            
            .password-text {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                word-break: break-all;
                flex: 1;
                margin-right: 10px;
            }
            
        }
    }
    
    .tips {
        padding-left: 20px;
        
        li {
            margin-bottom: 5px;
            color: var(--text);
            font-size: 14px;
        }
    }
    
    .mt-15 {
        margin-top: 15px;
    }
}
</style>