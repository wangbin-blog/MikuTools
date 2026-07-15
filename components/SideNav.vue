<template>
    <aside class="side-nav">
        <button
            type="button"
            class="side-item"
            :class="{ active: activeCategory === 'all' }"
            @click="$emit('select', 'all')"
        >
            <i class="eva eva-grid-outline"></i>
            <span>全部工具</span>
        </button>
        <button
            type="button"
            class="side-item"
            :class="{ active: activeCategory === 'favorites' }"
            @click="$emit('select', 'favorites')"
        >
            <i class="eva eva-bookmark-outline"></i>
            <span>我的收藏</span>
        </button>
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
    gap: 2px;
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
body.dark .side-nav .side-item .cat-count {
    background: #2a2a3a;
    color: #888;
}
</style>
