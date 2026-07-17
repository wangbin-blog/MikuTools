<template>
    <aside class="side-nav">
        <div class="nav-group">
            <div class="group-title">快捷</div>
            <button
                type="button"
                class="side-item"
                :class="{ active: activeCategory === 'all' }"
                @click="$emit('select', 'all')"
            >
                <i class="eva eva-grid-outline"></i>
                <span>全部工具</span>
                <span class="cat-count">{{ totalToolCount }}</span>
            </button>
            <button
                type="button"
                class="side-item"
                :class="{ active: activeCategory === 'recent' }"
                @click="$emit('select', 'recent')"
            >
                <i class="eva eva-clock-outline"></i>
                <span>最近使用</span>
                <span class="cat-count">{{ recentUsedList.length }}</span>
            </button>
            <button
                type="button"
                class="side-item"
                :class="{ active: activeCategory === 'favorites' }"
                @click="$emit('select', 'favorites')"
            >
                <i class="eva eva-star-outline"></i>
                <span>我的收藏</span>
                <span class="cat-count">{{ favoritesList.length }}</span>
            </button>
        </div>

        <div class="nav-group">
            <div class="group-title">分类</div>
            <button
                v-for="item in visibleCategories"
                :key="item.title"
                type="button"
                class="side-item"
                :class="{ active: activeCategory === item.title }"
                @click="$emit('select', item.title)"
            >
                <i class="eva" :class="'eva-' + item.icon"></i>
                <span>{{ item.title }}</span>
                <span class="cat-count">{{ item.visibleList.length }}</span>
            </button>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'SideNav',
    props: {
        activeCategory: {
            type: String,
            default: 'all'
        }
    },
    computed: {
        totalToolCount() {
            let count = 0;
            (this.$store.state.tools || []).forEach(item => {
                count += item.list.filter(tool => this.showBtn(tool)).length;
            });
            return count;
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
        },
        visibleCategories() {
            return (this.$store.state.tools || [])
                .map(item => ({
                    ...item,
                    visibleList: item.list.filter(tool => this.showBtn(tool))
                }))
                .filter(item => item.visibleList.length);
        }
    },
    methods: {
        showBtn(tool) {
            return this.$store.state.setting.hide.indexOf(tool.path) === -1;
        }
    }
};
</script>

<style lang="scss">
.side-nav {
    position: fixed;
    top: 56px;
    left: 0;
    width: 220px;
    height: calc(100vh - 56px);
    background: #f5f7fa;
    border-right: 1px solid #e8e8e8;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 8px;
    z-index: 50;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    .nav-group {
        .group-title {
            font-size: 12px;
            color: #999;
            padding: 8px 12px 4px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }
    .side-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border: none;
        background: transparent;
        color: var(--t1);
        font-size: 14px;
        border-radius: 8px;
        cursor: pointer;
        text-align: left;
        transition: all 0.15s ease;
        i {
            font-size: 18px;
            flex: 0 0 auto;
        }
        span:not(.cat-count) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .cat-count {
            margin-left: auto;
            font-size: 12px;
            color: #aaa;
            background: #f0f0f0;
            padding: 1px 7px;
            border-radius: 10px;
            flex: 0 0 auto;
        }
        &:hover {
            background: rgba(36, 159, 253, 0.08);
            color: var(--theme);
        }
        &.active {
            background: var(--theme);
            color: #fff;
            font-weight: 500;
            .cat-count {
                background: rgba(255, 255, 255, 0.25);
                color: #fff;
            }
        }
    }
}

@media (max-width: 700px) {
    .side-nav {
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        width: 100%;
        height: auto;
        max-height: 48px;
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 6px 8px;
        z-index: 50;
        gap: 6px;
        .nav-group {
            display: flex;
            align-items: center;
            gap: 6px;
            .group-title {
                display: none;
            }
        }
        .side-item {
            flex: 0 0 auto;
            white-space: nowrap;
            padding: 6px 10px;
            .cat-count {
                display: none;
            }
        }
    }
}

body.dark .side-nav {
    background: #1a1a2a;
    border-right-color: #2a2a3a;
}
body.dark .side-nav .group-title {
    color: #666;
}
body.dark .side-nav .side-item .cat-count {
    background: #2a2a3a;
    color: #888;
}
</style>