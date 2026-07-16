<template>
    <footer class="site-footer">
        <div class="footer-brand">
            <span class="footer-logo">
                <i class="eva eva-music-outline"></i>
            </span>
            <strong class="footer-name">小王的工具箱</strong>
            <span class="footer-tagline">一个轻量的工具集合，本地运行，无需登录</span>
        </div>
        <nav class="footer-nav">
            <a href="/">全部工具</a>
            <span class="sep">&middot;</span>
            <a href="/links">友情链接</a>
            <span class="sep">&middot;</span>
            <a href="/setting">设置</a>
            <span class="sep">&middot;</span>
            <a
                href="https://github.com/wangbin-blog/MikuTools"
                target="_blank"
                rel="noopener noreferrer"
            >关于本站</a>
            <span class="sep">&middot;</span>
            <a href="javascript:void(0)" @click="$emit('donate')">支持作者</a>
            <span class="sep">&middot;</span>
            <a href="javascript:void(0)">RSS</a>
        </nav>
        <div class="footer-copyright">
            &copy; 2026 MikuTools &middot; 基于
            <a
                href="https://github.com/Ice-Hazymoon/MikuTools"
                target="_blank"
                rel="noopener noreferrer"
            >MikuTools</a>
            构建
        </div>
    </footer>
</template>

<script>
export default {
    name: 'SiteFooter'
};
</script>

<style lang="scss">
.site-footer {
    margin-top: 30px;
    padding: 28px 20px 24px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    text-align: center;
    color: #888;
    font-size: 13px;
    .footer-brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 14px;
        .footer-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: var(--theme);
            color: #fff;
            i {
                font-size: 16px;
            }
        }
        .footer-name {
            font-size: 15px;
            color: var(--t1);
        }
        .footer-tagline {
            color: #999;
            font-size: 13px;
        }
    }
    .footer-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px 10px;
        margin-bottom: 10px;
        a {
            color: #6a6a6a;
            font-size: 13px;
            text-decoration: none;
            transition: color 0.15s ease;
            &:hover {
                color: var(--theme);
            }
        }
        .sep {
            color: #d0d0d0;
            font-size: 12px;
        }
    }
    .footer-copyright {
        color: #aaa;
        font-size: 12px;
        a {
            color: #aaa;
            text-decoration: none;
            &:hover {
                color: var(--theme);
            }
        }
    }
}

@media (max-width: 700px) {
    .site-footer {
        margin-top: 20px;
        padding: 22px 14px 20px;
        .footer-tagline {
            display: none;
        }
    }
}

body.dark .site-footer {
    background: #1f1f2a;
    border-color: #2a2a3a;
    .footer-name,
    .footer-nav a,
    .footer-copyright a {
        color: #c8c8d0;
    }
}
</style>
