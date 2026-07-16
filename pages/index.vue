<template>
    <div class="content">
        <div class="home">
            <Favorites v-show="!navbarSearchText" />

            <nya-container
                v-if="$store.state.setting.hideCategory"
                v-show="!navbarSearchText && (activeCategory === 'all' || activeCategory === 'favorites')"
                icon="shopping-bag-outline"
                title="工具"
            >
                <template v-for="(tool, index2) in toolsList">
                    <nuxt-link
                        v-if="showBtn(tool)"
                        :key="index2"
                        :title="tool.name"
                        :to="tool.path"
                        class="nya-btn"
                        :class="[tool.hot, {'badge': tool.hot}]"
                    >
                        {{ tool.name }}
                    </nuxt-link>
                </template>
            </nya-container>

            <template v-else v-show="!navbarSearchText">
                <nya-container
                    v-for="(item, index) in filteredCategories"
                    v-show="showSection(item)"
                    :key="index"
                    :icon="item.icon"
                    :title="item.title"
                >
                    <template v-for="(tool, index2) in item.list">
                        <nuxt-link
                            v-if="showBtn(tool)"
                            :key="index2"
                            :target="$store.state.setting.inNewTab ? '_blank' : '_self'"
                            :title="tool.name"
                            :to="tool.path"
                            class="nya-btn"
                            :class="[tool.hot, {'badge': tool.hot}]"
                        >
                            {{ tool.name }}
                        </nuxt-link>
                    </template>
                </nya-container>
            </template>

            <nya-container v-if="!$store.state.setting.hideNotice && activeCategory === 'all'" v-show="!navbarSearchText" title="公告" icon="volume-down-outline">
                <ul class="nya-list">
                    <li>本项目基于 <a href="https://github.com/Ice-Hazymoon/MikuTools" target="_blank" rel="noopener noreferrer">MikuTools</a> 构建而成</li>
                    <li>
                        <div class="badge-info">
                            <span class="badge hot">热门</span> <span class="badge vip">VIP</span> <span class="badge new">新功能</span> <span class="badge recommend">推荐</span>
                        </div>
                    </li>
                    <li><b>欢迎将本站收藏到收藏夹，以便以后使用</b></li>
                    <li>
                        本站域名：<a
                            :href="$store.state.env.url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >{{ $store.state.env.domain }}</a>
                    </li>
                    <li v-if="$store.state.isMobile.any">
                        如果遇到无法使用或者样式问题，请更换浏览器后重试，推荐使用 Chrome 浏览器，对 iOS 设备兼容性可能不太好
                    </li>
                </ul>
            </nya-container>

            <nya-container v-if="!$store.state.setting.hidePay && activeCategory === 'all'" v-show="!navbarSearchText" title="打赏" icon="credit-card-outline">
                <ul class="pay">
                    <li>
                        <img src="../assets/weixin.png" alt="weixin">
                        <div class="name">
                            微信
                        </div>
                    </li>
                    <li>
                        <img src="../assets/alipay.png" alt="alipay">
                        <div class="name">
                            支付宝
                        </div>
                    </li>
                </ul>
            </nya-container>
        </div>

    </div>
</template>

<script>
import Favorites from '~/components/Favorites';
import Welcome from '~/components/Welcome';
export default {
    name: 'Home',
    components: {
        Favorites,
        Welcome
    },
    head() {
        return {
            title: this.title
        };
    },
    data() {
        return {
            title: `${process.env.title} - ${process.env.description}`,
            isMobile: null
        };
    },
    computed: {
        toolsList() {
            let arr = [];
            this.$store.state.tools.forEach(tool => {
                arr = arr.concat(tool.list);
            });
            return arr;
        },
        activeCategory() {
            return this.$route.query.cat || 'all';
        },
        filteredCategories() {
            const cat = this.activeCategory;
            const all = this.$store.state.tools || [];
            if (cat === 'all' || cat === 'favorites') {
                return all;
            }
            return all.filter(item => item.title === cat);
        },
        navbarSearchText() {
            return this.$store.state.navbarSearchText || '';
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },
        showSection(item) {
            return !(
                item.list.filter(i => {
                    return (
                        this.$store.state.setting.hide.indexOf(i.path) !== -1
                    );
                }).length === item.list.length
            );
        },
        showBtn(tool) {
            return this.$store.state.setting.hide.indexOf(tool.path) === -1;
        }
    }
};
</script>

<style lang="scss">
.content {
    min-width: 0;
}
.home {
    span.mb {
        display: block;
        margin-bottom: 15px;
    }
    table {
        width: 100%;
        table-layout: auto;
    }
    ._ad {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .nya-btn {
        position: relative;
        margin: 7px;
        width: calc(20% - 14px);
        text-align: center;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: all 0.3s ease;
        background-color: transparent;
        font-size: 18px;
        border-radius: 4px;
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04),
                0px 8px 64px 0px rgba(10, 14, 29, 0.08);
        }
        @media (max-width: 1050px) {
            width: calc(25% - 14px);
        }
        @media (max-width: 900px) {
            width: calc(100% / 3 - 14px);
        }
        @media (max-width: 700px) {
            box-shadow: none;
            margin: 5px;
            width: calc(50% - 10px);
        }
    }
    .pay {
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-around;
        li {
            margin: 0;
            list-style: none;
            padding: 10px;
            .name {
                text-align: center;
                font-size: 25px;
                font-weight: bold;
                margin-top: 5px;
            }
            img {
                width: 200px;
                max-width: 100%;
            }
        }
    }
    .badge {
        &::after {
            content: '';
            position: absolute;
            top: 5px;
            right: 5px;
            color: #fff;
            font-weight: lighter;
            text-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.2);
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        &.new::after {
            background-color: var(--theme-success);
        }
        &.hot::after {
            background-color: var(--theme-danger);
        }
        &.vip::after {
            background-color: #f79817;
        }
        &.recommend::after {
            background-color: var(--theme);
        }
    }
    .badge-info {
        display: inline-flex;
        align-items: center;
        .badge {
            display: inline-flex;
            margin-right: 10px;
            align-items: center;
            &::after {
                position: relative;
                left: auto;
                margin-left: 10px;
                top: auto;
                display: inline-block;
            }
        }
    }
}
</style>
