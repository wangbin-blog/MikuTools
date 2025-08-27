<template>
    <div class="setting">
        <SetBackground />

        <nya-container title="工具隐藏">
            <Search v-model="searchText" @enter="enterFirst">
                <template slot-scope="data">
                    <button
                        v-for="tool in data.data"
                        :key="tool.path"
                        type="button"
                        class="nya-btn"
                        :class="handleClass(tool.path)" @click="hide(tool.path)"
                    >
                        {{ tool.name }}
                    </button>
                </template>
            </Search>

            <div v-show="!searchText" class="tool-list">
                <div v-for="(item, index) in $store.state.tools" :key="index">
                    <div class="category-title">{{ item.name }}</div>
                    <div class="tools">
                        <button
                            v-for="tool in item.list"
                            :key="tool.path"
                            type="button"
                            class="nya-btn"
                            :class="handleClass(tool.path)" @click="hide(tool.path)"
                        >
                            {{ tool.name }}
                        </button>
                    </div>
                    <hr>
                </div>
            </div>
            
            <div class="nya-subtitle">
                如果你不希望某些工具在首页显示，可以点击工具名称进行隐藏
            </div>
        </nya-container>

        <nya-container title="自定义 CSS">
            <nya-input :value="$store.state.setting.css" fullwidth rows="5" type="textarea" autocomplete="off" placeholder=".navbar{display: none}" @change="handleChange('setting.css', $event.target.value)" />
        </nya-container>

        <nya-container title="自定义 JS">
            <nya-input :value="$store.state.setting.js" fullwidth rows="5" type="textarea" autocomplete="off" placeholder="alert('欢迎使用 MikuTools')" @change="handleChange('setting.js', $event.target.value)" />
        </nya-container>

        <nya-container title="其他设置">
            <nya-checkbox :checked="$store.state.setting.hideNotice" label="隐藏公告" @change="handleChange('setting.hideNotice', $event)" />
            <nya-checkbox :checked="$store.state.setting.hideCategory" label="隐藏分类" @change="handleChange('setting.hideCategory', $event)" />
            <nya-checkbox :checked="$store.state.setting.hidePay" label="隐藏打赏" @change="handleChange('setting.hidePay', $event)" />
            <nya-checkbox :checked="$store.state.setting.inNewTab" label="新标签打开工具" @change="handleChange('setting.inNewTab', $event)" />
            <nya-checkbox :checked="$store.state.setting.animations" label="启用过渡动画" @change="handleChange('setting.transition', $event)" />
        </nya-container>

        <nya-container title="导出配置">
            <div class="nya-subtitle">
                可将当前网站配置移动到其他设备使用
            </div>
            <nya-copy :copy="config">
                <div v-text="config"></div>
            </nya-copy>
            <div class="nya-btn" @click="importConfig">
                导入配置
            </div>
            <div class="nya-btn" @click="clearCache">
                清除数据
            </div>
        </nya-container>
    </div>
</template>

<script>
import SetBackground from '../components/SetBackground';
import Search from '../components/Search';
import _ from 'lodash';

export default {
    name: 'Setting',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        SetBackground,
        Search
    },
    data() {
        return {
            syncIng: false,
            searchText: ''
        };
    },
    computed: {
        config() {
            return Buffer.from(
                JSON.stringify({
                    setting: this.$store.state.setting,
                    dark: this.$store.state.dark
                })
            ).toString('base64');
        }
    },
    methods: {
        enterFirst(e) {
            this.hide(e.path);
        },
        hide(path) {
            if (['/hide_tool', '/links'].includes(path)) {
                this.$noty.error('操作失败: 该项目无法隐藏');
                return false;
            }
            let hide = _.chain(this.$store.state.setting.hide);
            let flag = hide.indexOf(path).value();
            if (flag === -1) {
                hide.push(path).value();
            } else {
                hide.pull(path).value();
            }
            this.$store.commit('SET_STORE', {
                key: 'setting.hide',
                value: hide.value()
            });
        },
        handleClass(path) {
            return {
                hide: this.$store.state.setting.hide.indexOf(path) !== -1
            };
        },
        handleChange(key, value) {
            this.$store.commit('SET_STORE', {
                key,
                value
            });
        },
        importConfig() {
            let config = prompt('请粘贴配置信息');
            try {
                config = JSON.parse(Buffer.from(config, 'base64').toString());
            } catch (error) {
                this.$noty.error('配置信息无效，请重新确认');
                return false;
            }
            this.$store.commit('SET_STORE', {
                key: 'setting',
                value: config.setting
            });
            this.$store.commit('SET_STORE', {
                key: 'dark',
                value: config.dark
            });
            this.init();
            this.$noty.success('导入成功');
        },
        clearCache() {
            localStorage.removeItem('mikudb');
            localStorage.removeItem('miku_vuex');
            alert('清除成功，即将刷新页面');
            window.location.reload();
        }
    }
};
</script>

<style lang='scss'>
.setting {
    .nya-checkbox {
        margin-right: 15px;
    }
    .nya-btn {
        margin-top: 15px;
    }
    .nya-copy {
        margin-bottom: 0;
    }
    
    /* 工具隐藏相关样式 */
    .tool-list {
        margin-top: 10px;
    }
    
    .category-title {
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 5px;
        color: var(--theme);
    }
    
    .tools {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
    
    .nya-container {
        .nya-btn {
            margin: 5px;
            font-weight: normal;
            padding: 5px 10px;
            &.hide {
                opacity: 0.5;
            }
            @media (max-width: 600px) {
                margin: 5px;
                width: calc(50% - 10px);
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
