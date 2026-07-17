<template>
    <div class="navbar">
        <header>
            <h1 class="title">
                <nuxt-link to="/">
                    小王的工具箱
                </nuxt-link>
            </h1>
            <Search v-model="searchText" @enter="enterFirst" class="navbar-search">
                <template slot-scope="data">
                    <nuxt-link
                        v-for="(tool, index) in data.data"
                        v-show="showBtn(tool)"
                        :key="index"
                        :target="$store.state.setting.inNewTab ? '_blank' : '_self'"
                        :to="tool.path"
                        class="nya-btn"
                    >
                        {{ tool.name }}
                    </nuxt-link>
                </template>
            </Search>
            <div class="navbar-actions">
                <button class="nav-btn theme-toggle" @click="switchTheme" :title="$store.state.dark ? '切换到亮色模式' : '切换到暗色模式'">
                    <i class="eva" :class="$store.state.dark ? 'eva-sun-outline' : 'eva-moon-outline'"></i>
                </button>
                <nuxt-link to="/setting" class="nav-btn" title="设置">
                    <i class="eva eva-settings-outline"></i>
                </nuxt-link>
            </div>
            <Panel />
        </header>
    </div>
</template>

<script>
import Panel from '~/components/Panel';
import Search from '~/components/Search';
export default {
    name: 'Navbar',
    components: {
        Panel,
        Search
    },
    data() {
        return {
            searchText: ''
        };
    },
    watch: {
        searchText(val) {
            this.$store.commit('SET_STORE', {
                key: 'navbarSearchText',
                value: val
            });
        },
        '$route.path'() {
            this.searchText = '';
        }
    },
    methods: {
        switchTheme() {
            this.$store.commit('SET_STORE', {
                key: 'dark',
                value: !this.$store.state.dark
            });
        },
        enterFirst(e) {
            if (this.$store.state.setting.inNewTab) {
                window.open(e.path);
            } else {
                this.$router.push(e.path);
            }
        },
        showBtn(tool) {
            return this.$store.state.setting.hide.indexOf(tool.path) === -1;
        }
    }
};
</script>


<style lang="scss">
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--t2);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    header {
        max-width: 100%;
        margin: 0 auto;
        padding: 0 20px;
        height: 56px;
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: 20px;
        box-sizing: border-box;
        .title {
            margin: 0;
            display: flex;
            align-items: center;
            color: var(--t1);
            cursor: pointer;
            font-size: 20px;
            white-space: nowrap;
            text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.15);
            a {
                color: var(--t1);
                cursor: pointer;
                display: flex;
                align-items: center;
                text-decoration: none;
                &:hover {
                    text-decoration: none;
                }
            }
        }
        .navbar-search {
            max-width: 560px;
            width: 100%;
            justify-self: center;
            position: relative;
            .search {
                margin-top: 0;
                margin-bottom: 0;
                padding: 8px 14px;
                border-radius: 8px;
                border: 1px solid rgba(0, 0, 0, 0.08);
                background: #fff;
                &:hover {
                    border-color: rgba(36, 159, 253, 0.3);
                }
                &.focus {
                    border-color: var(--theme);
                    background: #fff;
                    color: var(--t1);
                    box-shadow: 0 0 0 3px rgba(36, 159, 253, 0.1);
                    transform: none;
                    input {
                        &::placeholder {
                            color: var(--t1);
                        }
                        color: var(--t1);
                    }
                }
            }
            .nya-container {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 0;
                width: 100%;
                max-width: 560px;
                z-index: 200;
                margin-top: 0;
                margin-bottom: 0;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                padding: 12px;
                .nya-title {
                    display: none;
                }
                .nya-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 12px;
                    margin: 4px;
                    border-radius: 6px;
                    background: rgba(0, 0, 0, 0.04);
                    color: var(--t1);
                    text-decoration: none;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    &:hover {
                        background: rgba(36, 159, 253, 0.1);
                        color: var(--theme);
                    }
                }
            }
        }
        .panel {
            margin: 0;
            display: flex;
            align-items: center;
            .login-text {
                white-space: nowrap;
            }
        }
        .navbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            .nav-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                border: none;
                background: transparent;
                color: var(--t1);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 18px;
                &:hover {
                    background: rgba(36, 159, 253, 0.1);
                    color: var(--theme);
                }
                &:active {
                    background: rgba(36, 159, 253, 0.2);
                }
                i {
                    font-size: 18px;
                }
            }
        }
    }
}

@media (max-width: 700px) {
    .navbar {
        header {
            grid-template-columns: auto 1fr auto;
            gap: 10px;
            padding: 0 12px;
            .title {
                font-size: 16px;
            }
            .navbar-search {
                .search {
                    padding: 6px 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    i {
                        font-size: 18px;
                        margin-right: 8px;
                    }
                }
                .nya-container {
                    position: fixed;
                    top: 72px;
                    left: 12px;
                    right: 12px;
                    width: auto;
                    max-width: none;
                    z-index: 200;
                    margin-top: 0;
                    margin-bottom: 0;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    padding: 12px;
                    .nya-title {
                        display: none;
                    }
                }
            }
            .navbar-actions {
                gap: 4px;
                .nav-btn {
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                    i {
                        font-size: 16px;
                    }
                }
            }
            .panel {
                display: none;
            }
        }
    }
}
</style>
