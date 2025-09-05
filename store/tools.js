// 引入通用路由配置文件（为了避免循环依赖，这里只做类型参考，不直接使用其导出值）
// 当你添加新工具时，请确保也在 utils/routes.js 文件中添加对应的路由
// import { toolRoutes } from '../utils/routes';

export const state = () => {
    const tools = [
        {
            title:'JSON 工具',
            icon:'hash',
            list:[
                {
                    name: 'JSON 格式化',
                    path: '/json-convert-format',
                    head: {
                        keywords: ['json,格式化,美化,压缩,验证'],
                        description: '在线JSON格式化'
                    }
                },
                {
                    name: 'JSON 转代码',
                    path: '/json-convert-code',
                    head: {
                        keywords: ['json,转换,代码,typescript,java,python,go,csharp'],
                        description: '在线JSON转代码'
                    }
                },
                {
                    name: 'JSON 转 YAML/TOML',
                    path: '/json-convert-yaml',
                    head: {
                        keywords: ['json,yaml,toml,转换,配置,格式'],
                        description: '在线JSON转YAML/TOML'
                    }
                },
                {
                    name: 'JSON 转 SQL',
                    path: '/json-to-sql',
                    head: {
                        keywords: ['json,sql,mysql,sqlserver,oracle,达梦,转换,数据库'],
                        description: '在线JSON转SQL工具，支持SQL Server、MySQL、Oracle、达梦数据库'
                    }
                },
                {
                    name: 'SQL 转 JSON',
                    path: '/sql-to-json',
                    keywords: ['sql', 'json', '转换', '数据库', 'mysql', 'oracle', 'sqlserver', '达梦'],
                    description: '将SQL脚本转换为JSON格式数据'
                },
                {
                    name: 'JSON 转 CSV/Excel',
                    path: '/json-to-csv',
                    head: {
                        keywords: ['json,csv,excel,转换,xlsx,导出,下载'],
                        description: '在线JSON转CSV/Excel工具，支持多种格式导出'
                    }
                },
                {
                    name: 'JWT 解密/加密',
                    path: '/jwt-tool',
                    head: {
                        keywords: ['jwt,json web token,解密,加密,验证,生成'],
                        description: '在线JWT解密/加密工具'
                    }
                },
            ]
        },
        {
            title:'压缩/格式化',
            icon:'compress',
            list:[
                {
                    name: 'JavaScript/HTML 压缩/格式化',
                    path: '/js-html-formatter',
                    head: {
                        keywords: [
                            'JavaScript压缩',
                            'JavaScript格式化',
                            'HTML压缩',
                            'HTML格式化',
                            '代码压缩',
                            '代码格式化',
                            'JS压缩',
                            'JS格式化',
                            'HTML压缩工具',
                            'HTML格式化工具'
                        ],
                        description: '在线JavaScript/HTML代码压缩与格式化工具'
                    }
                }
            ]
        },
        {
            title: '编程开发',
            icon: 'code-outline',
            list: [
                {
                    name: 'CSS 兼容性处理',
                    path: '/autoprefixer',
                    head: {
                        keywords: ['CSS兼容性处理', 'autoprefixer', 'postcss'],
                        description: '在线CSS兼容性处理'
                    }
                },
                {
                    name: '时间戳转换',
                    path: '/timestamp',
                    head: {
                        keywords: ['时间戳转换', '时间戳获取'],
                        description: '在线时间戳转换|格式化工具'
                    }
                },
                {
                    name: 'URL 格式化',
                    path: '/url_format',
                    head: {
                        keywords: ['URL 格式化', 'URL参数查看'],
                        description: '在线URL格式化'
                    }
                },
                {
                    name: '文本加密解密',
                    path: '/crypto',
                    head: {
                        keywords: [
                            '文本加密解密',
                            '文本哈希计算',
                            'MD5加密',
                            'AES',
                            'DES',
                            'HmacMD5',
                            'HmacSHA1',
                            'HmacSHA256',
                            'HmacSHA512',
                            'RC4',
                            'RC4Drop',
                            'RIPEMD160',
                            'Rabbit',
                            'SHA1',
                            'SHA256',
                            'SHA3',
                            'TripleDES'
                        ],
                        description: '在线文本哈希散列计算'
                    }
                },
                {
                    name: 'Linux 命令查询',
                    path: '/linux_command',
                    head: {
                        keywords: ['Linux命令查询'],
                        description: '在线Linux命令查询'
                    }
                },
                {
                    name: '文本编码解码',
                    path: '/encoding',
                    head: {
                        keywords: [
                            '文本编码解码',
                            '文本base64编码',
                            '社会主义核心价值观加密'
                        ],
                        description: '在线文本编码解码'
                    }
                },
                {
                    name: '执行 Cron 表达式',
                    path: '/crontab',
                    head: {
                        keywords: ['在线执行Cron表达式', '在线模拟Cron表达式'],
                        description: '在线执行Cron表达式'
                    }
                },
                {
                    name: '进制转换',
                    path: '/hexconvert',
                    head: {
                        keywords: [
                            '进制转换',
                            '二进制转换',
                            '八进制转换',
                            '十进制转换',
                            '十六进制转换',
                            '三十二进制转换'
                        ],
                        description: '在线进制转换'
                    }
                },
                {
                    name: 'CIDR 计算',
                    path: '/cidr',
                    head: {
                        keywords: [
                            'CIDR',
                            'IP',
                            '网络ID',
                            'IP地址',
                            '子网掩码',
                            '广播地址'
                        ],
                        description: '在线CIDR计算'
                    }
                },
                {
                    name: 'UserAgent 解析',
                    path: '/ua_parser',
                    head: {
                        keywords: ['在线 UserAgent 解析'],
                        description: 'UserAgent 解析'
                    }
                },
                {
                    name: '前端 CDN 查询',
                    path: '/cdnjs',
                    head: {
                        keywords: [
                            '前端CDN',
                            'CDNJS',
                            'BootCDN',
                            'CSS.NET',
                            'Baomitu CDN',
                            'Staticfile CDN'
                        ],
                        description: '前端CDN库查询'
                    }
                },
                
                {
                    name: '正则大全',
                    path: '/any_rule',
                    head: {
                        keywords: ['正则大全'],
                        description: '正则大全'
                    }
                },
                {
                    name: 'URL 编码/解码',
                    path: '/urlencode',
                    head: {
                        keywords: [
                            'URL编码',
                            'URL解码',
                            'URI编码',
                            'URI解码',
                            '在线URL编码',
                            'URL转码工具'
                        ],
                        description: '在线URL编码/解码工具'
                    }
                },
                {
                    name: 'UUID 生成器',
                    path: '/uuid',
                    head: {
                        keywords: [
                            'UUID生成',
                            'GUID生成',
                            '通用唯一识别码',
                            '随机ID生成',
                            '在线UUID'
                        ],
                        description: '在线UUID生成器'
                    }
                },
                {
                    name: '随机密码生成',
                    path: '/password',
                    head: {
                        keywords: [
                            '随机密码生成',
                            '密码生成器',
                            '强密码生成',
                            '安全密码生成'
                        ],
                        description: '在线随机密码生成器'
                    }
                }
            ]
        },
        {
            title: '图片相关',
            icon: 'image-outline',
            list: [
                {
                    name: '图片裁剪',
                    path: '/image-cropper',
                    head: {
                        keywords: [
                            '图片裁剪',
                            '在线裁剪图片',
                            '图片裁剪工具',
                            '自由裁剪',
                            '固定比例裁剪',
                            '图片编辑',
                            '图片处理',
                            '图片旋转',
                            '图片尺寸调整'
                        ],
                        description: '在线图片裁剪工具，支持自由裁剪、固定比例裁剪，实时预览裁剪效果'
                    }
                },
                {
                    name: '图片压缩',
                    path: '/image-compressor',
                    head: {
                        keywords: [
                            '图片压缩',
                            '图片压缩工具',
                            '在线压缩图片',
                            'JPEG压缩',
                            'PNG压缩',
                            'WebP压缩',
                            '批量压缩图片',
                            '图片瘦身',
                            '图片优化'
                        ],
                        description: '在线图片压缩工具，支持JPEG、PNG、WebP格式批量压缩，保持高质量'
                    }
                },
                {
                    name: '图片格式转换',
                    path: '/image-converter',
                    head: {
                        keywords: [
                            '图片格式转换',
                            '图片转换工具',
                            '在线转换图片格式',
                            'JPG转PNG',
                            'PNG转JPG',
                            'WebP转JPG',
                            'GIF转PNG',
                            '图片格式转换器',
                            '批量图片转换',
                            '图片格式互转'
                        ],
                        description: '在线图片格式转换工具，支持JPG、PNG、WebP、GIF、WBMP、XBM等多种格式相互转换，支持批量处理'
                    }
                },
                {
                    name: '格式转换',
                    path: '/ffmpeg',
                    head: {
                        keywords: ['格式转换'],
                        description: 'ffmpeg 格式转换'
                    }
                },
                {
                    name: '九宫格切图',
                    path: '/img_jiugongge',
                    head: {
                        keywords: ['图片九宫格', '九宫格切图', '九宫格'],
                        description: '图片分割成九宫格'
                    }
                },
                {
                    name: 'Anime 4K',
                    path: '/anime4k',
                    head: {
                        keywords: ['anime'],
                        description: '3毫秒放大你老婆，支持视频/图片。'
                    }
                },
                {
                    name: 'Cyberpunk 2077 图片制作',
                    path: '/cyberpunk2077',
                    head: {
                        keywords: [
                            'Cyberpunk2077',
                            '赛博朋克2077',
                            'Cyberpunk 2077 meme'
                        ],
                        description: '在线Cyberpunk 2077风格图片制作'
                    }
                },
                {
                    name: '令和举牌生成',
                    path: '/linghe',
                    head: {
                        keywords: ['令和举牌风格图片制作'],
                        description: '在线令和举牌风格图片制作'
                    }
                },
                {
                    name: 'ACG 表情包制作',
                    path: '/acg_meme',
                    head: {
                        keywords: [
                            '动漫表情包制作',
                            '表情包制作',
                            '咋百度啊',
                            '啥玩意儿啊'
                        ],
                        description: '在线动漫表情包制作'
                    }
                },
                {
                    name: 'Pornhub 风格Logo',
                    path: '/pornhub_logo',
                    head: {
                        keywords: ['PornHub 风格图片制作', 'PornHub Logo 制作'],
                        description: '在线 PornHub 风格图片制作'
                    }
                },
                {
                    name: 'YouTube 风格Logo',
                    path: '/youtube_logo',
                    head: {
                        keywords: ['YouTube 风格图片制作', 'YouTube Logo 制作'],
                        description: '在线 YouTube 风格图片制作'
                    }
                },
                {
                    name: '视频转 GIF',
                    path: '/video2gif',
                    head: {
                        keywords: ['视频转换GIF图片'],
                        description: '在线视频转换GIF图片'
                    }
                },
                {
                    name: 'GIF 图片分解',
                    path: '/gif_splitter',
                    head: {
                        keywords: ['GIF图片分解'],
                        description: '在线分解GIF图片'
                    }
                },
                {
                    name: '微博生成器',
                    path: '/meme-weibo',
                    head: {
                        keywords: ['微博生成器', '王思聪微博生成器'],
                        description: '在线微博生成器'
                    }
                },
                {
                    name: '抖音风格文字生成',
                    path: '/douyin_text',
                    head: {
                        keywords: ['抖音风格文字生成', '抖音样式文字生成'],
                        description: '在线抖音风格文字生成'
                    }
                },
                {
                    name: '图片编辑',
                    path: '/image_editor',
                    head: {
                        keywords: ['图片编辑器', '图片处理', '表情包制作'],
                        description: '在线图片编辑器'
                    }
                },
                {
                    name: '图片翻转旋转',
                    path: '/image-rotate-flip',
                    head: {
                        keywords: [
                            '图片旋转',
                            '图片翻转',
                            '图片旋转工具',
                            '在线旋转图片',
                            '图片水平翻转',
                            '图片垂直翻转',
                            '图片角度调整',
                            '图片处理',
                            '图片编辑'
                        ],
                        description: '在线图片翻转旋转工具，支持图片旋转、水平翻转、垂直翻转，实时预览效果'
                    }
                },
                {
                    name: '图片背景替换',
                    path: '/image-change-bg',
                    head: {
                        keywords: [
                            '图片背景',
                            '背景替换',
                            '背景色',
                            '透明背景',
                            '渐变背景'
                        ],
                        description: '在线图片背景色替换工具，支持纯色、渐变、透明背景替换，实时预览效果'
                    }
                },
                {
                    name: '图片加水印',
                    path: '/watermark',
                    head: {
                        keywords: [
                            '身份证加水印',
                            '敏感信息加水印',
                            '图片加水印'
                        ],
                        description: '在线身份证加水印'
                    }
                }
            ]
        },
        {
            title: '文字处理',
            icon: 'text-outline',
            list: [
                {
                    name: '文本对比',
                    path: '/textdiff',
                    head: {
                        keywords: ['文本对比', '代码对比'],
                        description: '文本在线对比'
                    }
                },
                {
                    name: '文本去重',
                    path: '/remove_duplicate',
                    head: {
                        keywords: ['文本在线去重', '文本去除重复'],
                        description: '文本在线去重'
                    }
                },
                {
                    name: '数字转大写中文',
                    path: '/number_to_zh',
                    head: {
                        keywords: [
                            '数字转大写中文',
                            '中文金额转换',
                            '人民币转中文',
                            '中文转人民币'
                        ],
                        description: '在线人民币转中文'
                    }
                },
                {
                    name: '富文本编辑器',
                    path: '/rich_text_editor',
                    head: {
                        keywords: ['富文本编辑器'],
                        description: '在线富文本编辑器'
                    }
                },
                {
                    name: 'Markdown 编辑器',
                    path: '/markdown',
                    head: {
                        keywords: ['Markdown编辑器'],
                        description: '在线Markdown编辑器'
                    }
                },
                {
                    name: '摩斯电码转换',
                    path: '/morse',
                    head: {
                        keywords: ['摩斯电码转换', '中文摩斯电码转换'],
                        description: '在线摩斯电码转换'
                    }
                },
                {
                    name: '盲人摸象加解密',
                    path: '/sot1_encrypt',
                    head: {
                        keywords: ['盲人摸象', '转码', '加解密'],
                        description: '在线盲人摸象加解密'
                    }
                },
                {
                    name: '中英文加空格',
                    path: '/text_autospace',
                    head: {
                        keywords: ['中英文加空格'],
                        description: '在线中英文加空格'
                    }
                }
            ]
        },
        {
            title: '其他工具',
            icon: 'layers-outline',
            list: [
                {
                    name: '屏幕录制',
                    path: '/screen_record',
                    head: {
                        keywords: ['屏幕录制', '在线录屏'],
                        description: '在网页上完成录屏'
                    }
                },
                {
                    name: '番茄时钟',
                    path: '/pomodoro_technique',
                    head: {
                        keywords: ['在线番茄时钟', '番茄工作法'],
                        description: '在线番茄时钟'
                    }
                },
                {
                    name: '人生小格',
                    path: '/lifecount',
                    head: {
                        keywords: [
                            '人生小格',
                            '人生进度条',
                            'lifecount',
                            '生命进度'
                        ],
                        description: '人生小格'
                    }
                },
                {
                    name: '随机数生成',
                    path: '/random',
                    head: {
                        keywords: ['在线随机数生成'],
                        description: '在线随机数生成'
                    }
                },
                {
                    name: '图片加包浆',
                    path: '/image_patina',
                    head: {
                        keywords: [
                            '图片做旧',
                            '表情包做旧',
                            '电子包浆',
                            '表情包包浆'
                        ],
                        description: '图片包浆'
                    }
                },
                {
                    name: 'LINE 贴纸下载',
                    path: '/line_sticker_download',
                    head: {
                        keywords: [
                            '怎么下载LINE表情包',
                            '怎么下载LINE贴纸',
                            '怎么保存LINE表情包',
                            'LINE表情包png'
                        ],
                        description: 'LINE贴纸在线下载'
                    }
                },
                {
                    name: '帮你百度',
                    path: '/search_help',
                    head: {
                        keywords: ['帮你百度', '怎么用百度', '怎么用谷歌'],
                        description: '帮你百度'
                    }
                },
                {
                    name: 'SS/R/V2ray 配置解析',
                    path: '/ssr_decode',
                    head: {
                        keywords: [
                            'SSR配置解密',
                            'SS配置解密',
                            'V2ray配置解密'
                        ],
                        description: '在线SSR配置解析'
                    }
                },
                {
                    name: '亲戚关系计算器',
                    path: '/relatives_name',
                    head: {
                        keywords: ['亲戚关系计算器'],
                        description: '在线亲戚关系计算器'
                    }
                },
                {
                    name: '二维码生成/解析',
                    path: '/qrcode_generation',
                    head: {
                        keywords: ['在线二维码生成', '在线二维码内容解析'],
                        description: '二维码生成/解析'
                    }
                },
                {
                    name: '这是什么动漫',
                    path: '/what_anime_is_this',
                    head: {
                        keywords: ['根据截图搜索动漫', 'whatanime'],
                        description: '根据截图搜索动漫'
                    }
                },
                {
                    name: '中国传统色',
                    path: '/china_colors',
                    head: {
                        keywords: ['中国传统色'],
                        description: '中国传统色'
                    }
                },
                {
                    name: '日本传统色',
                    path: '/japan_colors',
                    head: {
                        keywords: ['日本传统色', '日本の伝統色'],
                        description: '日本传统色'
                    }
                },
                {
                    name: '颜色处理',
                    path: '/color',
                    head: {
                        keywords: ['hex转rgb', '颜色代码转换', '在线颜色选择'],
                        description: '在线图片选择'
                    }
                },
                {
                    name: '收款码合并',
                    path: '/universal_pay',
                    head: {
                        keywords: [
                            '免费收款码合并',
                            '免费三码合一',
                            '支付宝收款码合并',
                            '微信收款码合并',
                            'QQ收款码合并'
                        ],
                        description: '在线免费收款码合并'
                    }
                },
                {
                    name: '温度单位转换',
                    path: '/temperature_conversion',
                    head: {
                        keywords: [
                            '温度单位转换',
                            '摄氏度单位转换',
                            '华氏度转单位换',
                            '开氏度单位转换',
                            '兰氏度单位转换',
                            '列氏度单位转换'
                        ],
                        description: '在线国际温度单位转换'
                    }
                },
                {
                    name: '身份证号码',
                    path: '/chinese_id',
                    head: {
                        keywords: [
                            '身份证号码查询',
                            '随机身份证号码生成',
                            '身份证信息查询'
                        ],
                        description: '身份证号码查询/生成'
                    }
                },

                {
                    name: '时区转换器',
                    path: '/time_change',
                    head: {
                        keywords: [
                            '时区转换器',
                            '时区'
                        ],
                        description: '时区转换'
                    }
                }

            ]
        }
    ];

    tools.forEach(i => {
        i.list.forEach(tool => {
            let head = {
                meta: []
            };
            if (!tool.head) {
                tool.head = head;
            }

            head.title = `${tool.head.title ? tool.head.title : tool.name} - ${
                process.env.title
            }`;
            if (tool.head.other) {
                head.meta = head.meta.concat(tool.head.other);
            }
            if (tool.head.keywords) {
                tool.head.keywords = tool.head.keywords.concat([
                    'MikuTools',
                    'Ice-Hazymoon',
                    '在线工具'
                ]);
                head.meta.push({
                    hid: 'keywords',
                    keywords: tool.head.keywords.join(',')
                });
            }
            if (tool.head.description) {
                head.meta.push({
                    name: 'description',
                    content: tool.head.description
                });
            }
            tool.head = head;
            const pinyin = process.env.pinyin;
            if (pinyin) {
                tool.pinyin = pinyin[tool.name];
            }
        });
    });
    return tools;
};
