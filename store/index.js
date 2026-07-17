import _ from 'lodash';
import env from '../env';

export const state = () => ({
    dark: false,
    noticeId: false,
    inFrames: false,
    currentTool: null,
    disabledMouseWheel: false,
    ads: true,
    loaded: false,
    navbarSearchText: '',
    recentUsed: [],
    setting: {
        animations: true,
        hide: [],
        favorites: [],
        hideCategory: false,
        hidePay: false,
        hideNotice: false,
        css: '',
        js: '',
        inNewTab: false,
        bg: {
            type: 'none',
            upload: {
                url: '',
                deleteUrl: ''
            },
            customUrl: '',
            blur: 4,
            opacity: 50,
            transparentEl: true
        }
    },
    globalLoading: false,
    welcome: true,
    isMobile: {},
    env: env,
    syncTime: 0,
    // 友情链接数据
    friendLinks: [
        {
            name: '博客',
            link: ' https://huhaha.vip'
        },
        {
            name: '导航',
            link: ' https://nav.huhaha.vip'
        }
    ]
});

const disabledMouseWheel = e => e.stopPropagation();
export const mutations = {
    SET_STORE(state, n) {
        if (_.isArray(n.value)) {
            n.value = Array.from(n.value);
        }
        if (_.isObject(n.value)) {
            n.value = _.chain(n.value)
                .assign()
                .value();
        }
        state = _.chain(state)
            .set(n.key, n.value)
            .value();
    },
    loadingComponent(state, n) {
        state.globalLoading = n;
    },
    switchTheme(state, n) {
        if (n !== undefined) {
            state.dark = n;
        } else {
            state.dark = !state.dark;
        }
    },
    disabledMouseWheel(state, type) {
        if (type) {
            document.addEventListener('wheel', disabledMouseWheel, {
                passive: true
            });
        } else {
            document.removeEventListener('wheel', disabledMouseWheel, {
                passive: true
            });
        }
        state.disabledMouseWheel = type;
    },
    addRecentUsed(state, tool) {
        if (!tool || !tool.path) return;
        const index = state.recentUsed.findIndex(item => item.path === tool.path);
        if (index > -1) {
            state.recentUsed.splice(index, 1);
        }
        state.recentUsed.unshift(tool);
        if (state.recentUsed.length > 20) {
            state.recentUsed = state.recentUsed.slice(0, 20);
        }
    },
    toggleFavorite(state, path) {
        const index = state.setting.favorites.indexOf(path);
        if (index > -1) {
            state.setting.favorites.splice(index, 1);
        } else {
            state.setting.favorites.push(path);
        }
    }
};
