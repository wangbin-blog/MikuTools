<template>
    <div class="uuid">
        <nya-container title="UUID 生成器">
            <div class="checkbox-group mb-15">
                <nya-checkbox v-model="options.uppercase" label="使用大写字母" />
                <nya-checkbox v-model="options.hyphens" label="包含连字符" />
                <nya-checkbox v-model="options.braces" label="使用大括号" />
                <nya-checkbox v-model="options.quotes" label="使用引号" />
            </div>

            <nya-select v-model="options.version" class="mb-15" :items ="versionList" fullwidth label="UUID 版本">
            </nya-select>

            <nya-input
                v-model="options.count"
                class="mb-15"
                fullwidth
                type="number"
                label="生成数量"
                min="1"
                max="100"
                placeholder="输入生成数量"
            />

            <div class="btn-primary" @click="generateUUIDs">
                ✨ 生成 UUID
            </div>

        </nya-container>
        <nya-container v-if="uuids.length" title="生成结果">
            <div class="result-results">
                <div v-for="(uuid, index) in uuids" :key="index" class="result-item">
                    <pre><div class="result-text">{{ uuid }}</div></pre>
                </div>
            </div>
            <div class="nya-btn" @click="copyAll">全部复制</div>
                <div class="nya-btn" @click="download">下载文本</div>
                <div class="nya-btn" @click="clearAll">清空</div>
        </nya-container>
        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>UUID</strong>：通用唯一识别码，128位数字，用于标识信息</li>
                <li><strong>版本4</strong>：完全随机生成，重复概率极低</li>
                <li><strong>版本1</strong>：基于时间和节点ID生成</li>
                <li><strong>格式选项</strong>：可自定义大小写、连字符、括号等格式</li>
            </ul>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'UUIDGenerator',
    data() {
        return {
            options: {
                uppercase: false,
                hyphens: true,
                braces: false,
                quotes: false,
                version: '4',
                count: 1
            },
            uuids: [],
            versionList: {
                '4': '版本 4 (随机)',
                '1':'版本 1 (基于时间)'
            },
        };
    },
    methods: {
        generateUUIDs() {
            const count = parseInt(this.options.count) || 1;
            if (count < 1 || count > 100) {
                this.$noty.warning('请输入1-100之间的数量');
                return;
            }

            this.uuids = [];
            for (let i = 0; i < count; i++) {
                this.uuids.push(this.generateSingleUUID());
            }
        },

        generateSingleUUID() {
            let uuid;
            if (this.options.version === '1') {
                uuid = this.generateUUIDv1();
            } else {
                uuid = this.generateUUIDv4();
            }

            if (!this.options.hyphens) {
                uuid = uuid.replace(/-/g, '');
            }

            if (this.options.uppercase) {
                uuid = uuid.toUpperCase();
            }

            if (this.options.braces) {
                uuid = `{${uuid}}`;
            }

            if (this.options.quotes) {
                uuid = `"${uuid}"`;
            }

            return uuid;
        },

        generateUUIDv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        generateUUIDv1() {
            // 简化的版本1实现
            const now = new Date().getTime();
            const timeHex = ('0000000000000000' + now.toString(16)).slice(-12);
            const nodeId = ('000000000000' + Math.random().toString(16).slice(2, 8)).slice(-12);
            
            return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(12, 15)}-${
                ('0000' + Math.floor(Math.random() * 0x4000).toString(16)).slice(-4)
            }-${nodeId}`;
        },

        copyAll() {
            if (this.uuids.length === 0) {
                this.$noty.warning('没有可复制的UUID');
                return;
            }
            const allUUIDs = this.uuids.join('\n');
            this.$copyText(allUUIDs).then(() => {
                this.$noty.success(`已复制 ${this.uuids.length} 个UUID`);
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },

        download() {
            if (this.uuids.length === 0) {
                this.$noty.warning('没有可下载的UUID');
                return;
            }
            const content = this.uuids.join('\n');
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `uuid-${new Date().getTime()}.txt`;
            link.click();
            URL.revokeObjectURL(url);
            this.$noty.success('UUID文件已下载');
        },

        clearAll() {
            this.uuids = [];
            this.$noty.success('已清空所有UUID');
        }
    }
};
</script>

<style lang="scss" scoped>
.checkbox-group {
    margin-bottom: 15px;
}

.result-section {
    position: relative;
    
    .result-results {
        .result-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            margin-bottom: 8px;
            background-color: var(--bg);
            border: 1px solid var(--border);
            border-radius: 4px;
            
            .result-text {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                word-break: break-all;
                flex: 1;
                margin-right: 10px;
            }
            
            .copy-btn {
                padding: 4px 8px;
                font-size: 12px;
                background-color: var(--primary);
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                transition: opacity 0.2s;
                
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
}

.uuid {
    .row {
        margin-bottom: 20px;
    }

    .generate-btn {
        margin-top: 24px;
        width: 100%;
    }

    .result-section {
        margin-top: 30px;
        
        h3 {
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
    }

    .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        
        .nya-btn {
            flex: 1;
            min-width: 100px;
            
            @media (max-width: 768px) {
                flex: 1 1 100%;
            }
        }
    }

    .tips {
        padding-left: 20px;
        
        li {
            margin-bottom: 8px;
            line-height: 1.6;
        }
    }
}
</style>