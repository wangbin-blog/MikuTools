<template>
    <div class="content">
        <div class="home">
            <Favorites v-show="!navbarSearchText && activeCategory !== 'favorites'" />

            <nya-container
                v-if="activeCategory === 'recent' && recentUsedList.length"
                v-show="!navbarSearchText"
                icon="clock-outline"
                title="最近使用"
            >
                <div class="tool-cards">
                    <div
                        v-for="(tool, index) in recentUsedList"
                        :key="index"
                        class="tool-card"
                        @mouseenter="showFavoriteBtn('recent', index, true)"
                        @mouseleave="showFavoriteBtn('recent', index, false)"
                    >
                        <a
                            :href="tool.path"
                            :target="tool.external ? '_blank' : ($store.state.setting.inNewTab ? '_blank' : '_self')"
                            class="tool-card-link"
                            :rel="tool.external ? 'noopener noreferrer' : ''"
                        >
                            <span class="tool-emoji">{{ getEmoji(tool) }}</span>
                            <div class="tool-infos">
                                <span class="tool-name">{{ tool.name }}</span>
                                <span class="tool-desc">{{ getDesc(tool) }}</span>
                            </div>
                        </a>
                        <button
                            class="favorite-btn"
                            :class="{ active: isFavorite(tool.path) }"
                            @click.stop="toggleFavorite(tool.path)"
                            :style="{ opacity: getShowFavorite('recent', index) ? 1 : 0 }"
                        >
                            ★
                        </button>
                    </div>
                </div>
            </nya-container>

            <nya-container
                v-if="activeCategory === 'recent' && !recentUsedList.length"
                v-show="!navbarSearchText"
                icon="clock-outline"
                title="最近使用"
            >
                <p class="empty-tip">暂无最近使用记录</p>
            </nya-container>

            <nya-container
                v-if="activeCategory === 'favorites' && favoritesList.length"
                v-show="!navbarSearchText"
                icon="star-outline"
                title="我的收藏"
            >
                <div class="tool-cards">
                    <div
                        v-for="(tool, index) in favoritesList"
                        :key="index"
                        class="tool-card"
                        @mouseenter="showFavoriteBtn('favorites', index, true)"
                        @mouseleave="showFavoriteBtn('favorites', index, false)"
                    >
                        <a
                            :href="tool.path"
                            :target="tool.external ? '_blank' : ($store.state.setting.inNewTab ? '_blank' : '_self')"
                            class="tool-card-link"
                            :rel="tool.external ? 'noopener noreferrer' : ''"
                        >
                            <span class="tool-emoji">{{ getEmoji(tool) }}</span>
                            <div class="tool-infos">
                                <span class="tool-name">{{ tool.name }}</span>
                                <span class="tool-desc">{{ getDesc(tool) }}</span>
                            </div>
                        </a>
                        <button
                            class="favorite-btn"
                            :class="{ active: isFavorite(tool.path) }"
                            @click.stop="toggleFavorite(tool.path)"
                            :style="{ opacity: getShowFavorite('favorites', index) ? 1 : 0 }"
                        >
                            ★
                        </button>
                    </div>
                </div>
            </nya-container>

            <nya-container
                v-if="activeCategory === 'favorites' && !favoritesList.length"
                v-show="!navbarSearchText"
                icon="star-outline"
                title="我的收藏"
            >
                <p class="empty-tip">暂无收藏，鼠标划到工具卡片点击右上角星星添加</p>
            </nya-container>

            <nya-container
                v-if="$store.state.setting.hideCategory"
                v-show="!navbarSearchText && activeCategory === 'all'"
                icon="shopping-bag-outline"
                title="工具"
            >
                <div class="tool-cards">
                    <div
                        v-for="(tool, index) in toolsList"
                        :key="index"
                        v-if="showBtn(tool)"
                        class="tool-card"
                        @mouseenter="showFavoriteBtn('all', index, true)"
                        @mouseleave="showFavoriteBtn('all', index, false)"
                    >
                        <a
                            :href="tool.path"
                            :target="tool.external ? '_blank' : ($store.state.setting.inNewTab ? '_blank' : '_self')"
                            class="tool-card-link"
                            :rel="tool.external ? 'noopener noreferrer' : ''"
                        >
                            <span class="tool-emoji">{{ getEmoji(tool) }}</span>
                            <div class="tool-infos">
                                <span class="tool-name">{{ tool.name }}</span>
                                <span class="tool-desc">{{ getDesc(tool) }}</span>
                            </div>
                        </a>
                        <button
                            class="favorite-btn"
                            :class="{ active: isFavorite(tool.path) }"
                            @click.stop="toggleFavorite(tool.path)"
                            :style="{ opacity: getShowFavorite('all', index) ? 1 : 0 }"
                        >
                            ★
                        </button>
                    </div>
                </div>
            </nya-container>

            <template v-else v-show="!navbarSearchText && activeCategory !== 'favorites'">
                <nya-container
                    v-for="(item, index) in filteredCategories"
                    v-show="showSection(item)"
                    :key="index"
                    :icon="item.icon"
                    :title="item.title"
                >
                    <div class="tool-cards">
                        <div
                            v-for="(tool, index2) in item.list"
                            :key="index2"
                            v-if="showBtn(tool)"
                            class="tool-card"
                            @mouseenter="showFavoriteBtn(index, index2, true)"
                            @mouseleave="showFavoriteBtn(index, index2, false)"
                        >
                            <a
                                :href="tool.path"
                                :target="tool.external ? '_blank' : ($store.state.setting.inNewTab ? '_blank' : '_self')"
                                class="tool-card-link"
                                :rel="tool.external ? 'noopener noreferrer' : ''"
                            >
                                <span class="tool-emoji">{{ getEmoji(tool) }}</span>
                                <div class="tool-infos">
                                    <span class="tool-name">{{ tool.name }}</span>
                                    <span class="tool-desc">{{ getDesc(tool) }}</span>
                                </div>
                            </a>
                            <button
                                class="favorite-btn"
                                :class="{ active: isFavorite(tool.path) }"
                                @click.stop="toggleFavorite(tool.path)"
                                :style="{ opacity: getShowFavorite(index, index2) ? 1 : 0 }"
                            >
                                ★
                            </button>
                        </div>
                    </div>
                </nya-container>
            </template>

            <nya-container v-if="false && (activeCategory === 'all' || activeCategory === 'recent')" v-show="!navbarSearchText" title="公告" icon="volume-down-outline">
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

            <!-- <nya-container v-if="!$store.state.setting.hidePay && activeCategory === 'all'" v-show="!navbarSearchText" title="打赏" icon="credit-card-outline"> -->
            <nya-container v-if="false && activeCategory === 'all'" v-show="!navbarSearchText" title="打赏" icon="credit-card-outline">
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
            isMobile: null,
            showFavorite: {}
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
            if (cat === 'all') {
                return all;
            }
            return all.filter(item => item.title === cat);
        },
        navbarSearchText() {
            return this.$store.state.navbarSearchText || '';
        },
        recentUsedList() {
            return (this.$store.state.recentUsed || []).filter(tool => this.showBtn(tool));
        },
        favoritesList() {
            const favorites = this.$store.state.setting.favorites || [];
            let toolsList = [];
            (this.$store.state.tools || []).forEach(item => {
                toolsList = toolsList.concat(item.list);
            });
            return toolsList.filter(tool => favorites.includes(tool.path) && this.showBtn(tool));
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
        },
        getEmoji(tool) {
            if (tool.emoji) return tool.emoji;
            const name = tool.name;
            if (name.includes('JSON')) return '📋';
            if (name.includes('JWT')) return '🔐';
            if (name.includes('SQL')) return '🗄️';
            if (name.includes('图片') || name.includes('图片')) return '🖼️';
            if (name.includes('PDF')) return '📄';
            if (name.includes('加密') || name.includes('解密') || name.includes('密码')) return '🔒';
            if (name.includes('格式') || name.includes('转换')) return '🔄';
            if (name.includes('时间') || name.includes('日期')) return '⏰';
            if (name.includes('计算器')) return '🧮';
            if (name.includes('颜色')) return '🎨';
            if (name.includes('二维码')) return '📱';
            if (name.includes('视频') || name.includes('GIF')) return '🎬';
            if (name.includes('文字') || name.includes('文本')) return '📝';
            if (name.includes('代码') || name.includes('编程')) return '💻';
            if (name.includes('Linux') || name.includes('命令')) return '🐧';
            if (name.includes('URL')) return '🔗';
            if (name.includes('UUID')) return '🔢';
            if (name.includes('房贷')) return '🏠';
            if (name.includes('屏幕')) return '🖥️';
            return '✨';
        },
        getDesc(tool) {
            if (tool.desc) return tool.desc;
            if (tool.head && tool.head.keywords) {
                const keywords = Array.isArray(tool.head.keywords) ? tool.head.keywords : [tool.head.keywords];
                return keywords.slice(0, 3).join('、');
            }
            return '';
        },
        isFavorite(path) {
            return (this.$store.state.setting.favorites || []).includes(path);
        },
        toggleFavorite(path) {
            this.$store.commit('toggleFavorite', path);
        },
        showFavoriteBtn(index, index2, show) {
            const key = `${index}-${index2}`;
            this.$set(this.showFavorite, key, show);
        },
        getShowFavorite(index, index2) {
            const key = `${index}-${index2}`;
            return this.showFavorite[key] || false;
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

    .tool-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .tool-card {
        position: relative;
        flex: 0 0 calc(33.33% - 500px);
        min-width: 200px;
        background: var(--bg-color);
        border-radius: 16px;
        padding: 12px 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.08),
                0px 4px 12px 0px rgba(10, 14, 29, 0.04);
            border-color: var(--theme);
        }

        @media (max-width: 900px) {
            flex: 0 0 calc(50% - 6px);
        }

        @media (max-width: 600px) {
            flex: 0 0 100%;
            min-width: auto;
        }
    }

    .tool-card-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        width: 100%;
        gap: 10px;
    }

    .tool-emoji {
        font-size: 20px;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(var(--theme-rgb), 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .tool-infos {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        min-width: 0;
        width: 100%;
    }

    .tool-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-color);
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }

    .tool-desc {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.4;
        width: 100%;
    }

    .favorite-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        border: none;
        background: transparent;
        font-size: 14px;
        cursor: pointer;
        transition: opacity 0.2s ease;
        color: #ddd;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        &.active {
            color: #fbbf24;
        }

        &:hover {
            color: #fbbf24;
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

body.dark .home {
    .tool-card {
        background: #1a1a2a;
        border-color: #2a2a3a;

        &:hover {
            border-color: var(--theme);
        }
    }

    .tool-name {
        color: #fff;
    }

    .tool-desc {
        color: #666;
    }

    .favorite-btn {
        color: #444;

        &.active,
        &:hover {
            color: #fbbf24;
        }
    }
}
</style>