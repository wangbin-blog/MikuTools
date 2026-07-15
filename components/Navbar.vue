<template>
    <div class="navbar">
        <header>
            <h1 class="title">
                <nuxt-link to="/">
                    MikuTools
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
        }
    },
    methods: {
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
        grid-template-columns: auto 1fr auto;
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
            .search {
                margin-top: 0;
                margin-bottom: 0;
                padding: 8px 14px;
                border-radius: 6px;
            }
            .nya-container {
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 560px;
                max-width: 90vw;
                z-index: 200;
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
    }
}

@media (max-width: 700px) {
    .navbar {
        header {
            grid-template-columns: auto 1fr;
            gap: 10px;
            padding: 0 12px;
            .title {
                font-size: 16px;
            }
            .navbar-search {
                .search {
                    padding: 6px 10px;
                    i {
                        font-size: 18px;
                        margin-right: 8px;
                    }
                }
                .nya-container {
                    width: 90vw;
                }
            }
            .panel {
                display: none;
            }
        }
    }
}
</style>
