// const fs = require('fs');
// const path = require('path');
import env from './env';
import keywords from './keywords';

module.exports = {
    env: env,
    server: {
        // https:
        //     process.env.NODE_ENV === 'development'
        //         ? {
        //               key: fs.readFileSync(
        //                   path.resolve(__dirname, './ssl/privkey.pem')
        //               ),
        //               cert: fs.readFileSync(
        //                   path.resolve(__dirname, './ssl/server.pem')
        //               )
        //           }
        //         : undefined
    },
    serverMiddleware: ['~/server-middleware/headers'],

    /*
     ** Headers of the page
     */
    head: {
        title: `MikuTools - 一个轻量的工具集合`,
        meta: [
            {
                charset: 'utf-8'
            },
            {
                hid: 'msvalidate.01',
                name: 'msvalidate.01',
                content: '3B01D613E431869120208BEE26D7B148'
            },
            {
                hid: 'baidu-site-verification',
                name: 'baidu-site-verification',
                content: 'codeva-UwHkYOnBBO'
            },
            {
                hid: 'viewport',
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'keywords',
                name: 'keywords',
                content: keywords
            },
            {
                hid: 'description',
                name: 'description',
                itemprop: 'description',
                content: '一个轻量的工具集合'
            },
            {
                hid: 'author',
                name: 'author',
                content: 'Ice-Hazymoon'
            },
            {
                name: 'HandheldFriendly',
                content: true
            },
            {
                property: 'og:site_name',
                content: 'MikuTools'
            },
            {
                name: 'mobile-web-app-capable',
                content: 'yes'
            },
            {
                name: 'apple-mobile-web-app-title',
                content: 'MikuTools'
            },
            {
                name: 'apple-mobile-web-app-status-bar-style',
                content: 'white'
            },
            {
                name: 'theme-color',
                content: '#ffffff'
            }
        ],
        link: [
            {
                rel: 'shortcut icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#00adb5',
        height: '4px'
    },

    /*
     ** Global CSS
     */
    css: [
        'normalize.css',
        '~styles/main.scss',
        'eva-icons/style/eva-icons.css'
    ],

    styleResources: {
        scss: ['styles/variables.scss']
    },

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        './plugins/request.js',
        {
            src: './plugins/db.js',
            ssr: false
        },
        {
            src: './plugins/modal.js',
            ssr: false
        },
        {
            src: './components/UI/index.js'
        },
        {
            src: './plugins/shortid.js',
            ssr: false
        },
        {
            src: './plugins/clipboard.js',
            ssr: false
        },
        {
            src: './plugins/vue-lazyload.js',
            ssr: false
        },
        {
            src: './plugins/vuejs-noty.js',
            ssr: false
        },
        {
            src: '~/plugins/localStorage.js',
            ssr: false
        },
        {
            src: '~/plugins/SmoothScroll.js',
            ssr: false
        },
        {
            src: '~/plugins/console.style.js',
            ssr: false
        },
        {
            src: '~/plugins/vue-good-table.js'
        },
        {
            src: '~/plugins/baidupush.js',
            ssr: false
        }
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/style-resources',
        '@nuxtjs/sitemap',
        // [
        //     '@nuxtjs/google-analytics',
        //     {
        //         id: ''
        //     }
        // ],
        [
            'vue-sweetalert2/nuxt',
            {
                confirmButtonColor: '#249ffd',
                animation: false,
                customClass: {
                    popup: 'sweetalert2'
                }
            }
        ]
    ],
    
    /*
     ** Sitemap configuration
     */
    sitemap: {
        hostname: 'https://tools.huhaha.vip', // 替换为实际网站域名
        gzip: true,
        routes: function() {
            try {
                // 使用我们创建的通用路由配置文件
                // 这个文件同时支持ES模块和CommonJS格式的导出
                const { toolRoutes } = require('./utils/routes');
                console.log('Sitemap使用通用路由配置文件，共生成', toolRoutes.length, '个路由');
                return toolRoutes;
            } catch (error) {
                console.error('无法加载路由配置文件，使用默认路由:', error);
                // 失败时使用基本路由
                return ['/', '/autoprefixer', '/timestamp'];
            }
        }
    },
    /*
     ** Axios module configuration
     */
    axios: {
        baseURL: env.axios,
        progress: false
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        postcss: {
            plugins: {
                'postcss-pxtorem': {
                    rootValue: 16,
                    propList: ['*'],
                    selectorBlackList: ['html']
                },
                autoprefixer: {}
            }
        }
    },
    manifest: {
        description: '收集实用的小工具',
        display: 'standalone',
        name: 'MikuTools',
        short_name: 'MikuTools',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        scope: '/',
        lang: 'zh-cn'
    },
    // workbox: {
    //     runtimeCaching: [
    //         {
    //             urlPattern: 'https://mikutools.cdn.hazymoon.vip/.*'
    //         }
    //     ],
    //     offlinePage: '/offline.html',
    //     offlineAssets: ['/offline.html']
    // },
    router: {
        prefetchLinks: false,
        middleware: ['getCurrentTool', 'baidupush']
    }
};
