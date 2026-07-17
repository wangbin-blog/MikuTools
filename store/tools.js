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
                    emoji: '📋',
                    desc: '格式化、美化、压缩、验证',
                    head: {
                        keywords: ['json,格式化,美化,压缩,验证'],
                        description: '在线JSON格式化'
                    }
                },
                {
                    name: 'JSON 转代码',
                    path: '/json-convert-code',
                    emoji: '🔧',
                    desc: 'TypeScript、Java、Python、Go、C#',
                    head: {
                        keywords: ['json,转换,代码,typescript,java,python,go,csharp'],
                        description: '在线JSON转代码'
                    }
                },
                {
                    name: 'JSON 转 YAML/TOML',
                    path: '/json-convert-yaml',
                    emoji: '⚙️',
                    desc: '配置文件格式转换',
                    head: {
                        keywords: ['json,yaml,toml,转换,配置,格式'],
                        description: '在线JSON转YAML/TOML'
                    }
                },
                {
                    name: 'JSON 转 SQL',
                    path: '/json-to-sql',
                    emoji: '🗄️',
                    desc: 'MySQL、SQL Server、Oracle、达梦',
                    head: {
                        keywords: ['json,sql,mysql,sqlserver,oracle,达梦,转换,数据库'],
                        description: '在线JSON转SQL工具，支持SQL Server、MySQL、Oracle、达梦数据库'
                    }
                },
                {
                    name: 'SQL 转 JSON',
                    path: '/sql-to-json',
                    emoji: '📊',
                    desc: '数据库脚本转换',
                    keywords: ['sql', 'json', '转换', '数据库', 'mysql', 'oracle', 'sqlserver', '达梦'],
                    description: '将SQL脚本转换为JSON格式数据'
                },
                {
                    name: 'JSON 转 CSV/Excel',
                    path: '/json-to-csv',
                    emoji: '📈',
                    desc: '导出表格文件',
                    head: {
                        keywords: ['json,csv,excel,转换,xlsx,导出,下载'],
                        description: '在线JSON转CSV/Excel工具，支持多种格式导出'
                    }
                },
                {
                    name: 'JWT 解密/加密',
                    path: '/jwt-tool',
                    emoji: '🔐',
                    desc: 'Token验证、生成',
                    head: {
                        keywords: ['jwt,json web token,解密,加密,验证,生成'],
                        description: '在线JWT解密/加密工具'
                    }
                },
            ]
        },
        {
            title: '编程开发',
            icon: 'code-outline',
            list: [
                {
                    name: 'CSS 兼容性处理',
                    path: '/autoprefixer',
                    emoji: '🎨',
                    desc: '自动添加浏览器前缀',
                    head: {
                        keywords: ['CSS兼容性处理', 'autoprefixer', 'postcss'],
                        description: '在线CSS兼容性处理'
                    }
                },
                {
                    name: '时间戳转换',
                    path: '/timestamp',
                    emoji: '⏰',
                    desc: '时间戳与日期互转',
                    head: {
                        keywords: ['时间戳转换', '时间戳获取'],
                        description: '在线时间戳转换|格式化工具'
                    }
                },
                {
                    name: 'URL 格式化',
                    path: '/url_format',
                    emoji: '🔗',
                    desc: '解析和格式化URL',
                    head: {
                        keywords: ['URL 格式化', 'URL参数查看'],
                        description: '在线URL格式化'
                    }
                },
                {
                    name: '文本加密解密',
                    path: '/crypto',
                    emoji: '🔒',
                    desc: 'MD5、AES、DES等算法',
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
                    emoji: '🐧',
                    desc: 'Linux命令速查手册',
                    head: {
                        keywords: ['Linux命令查询'],
                        description: '在线Linux命令查询'
                    }
                },
                {
                    name: '文本编码解码',
                    path: '/encoding',
                    emoji: '🔤',
                    desc: 'Base64、URL编码等',
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
                    emoji: '⏱️',
                    desc: '定时任务表达式解析',
                    head: {
                        keywords: ['在线执行Cron表达式', '在线模拟Cron表达式'],
                        description: '在线执行Cron表达式'
                    }
                },
                {
                    name: '进制转换',
                    path: '/hexconvert',
                    emoji: '🔢',
                    desc: '二/八/十/十六进制转换',
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
                    emoji: '🌐',
                    desc: 'IP地址与子网掩码计算',
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
                    emoji: '📱',
                    desc: '解析浏览器UserAgent',
                    head: {
                        keywords: ['在线 UserAgent 解析'],
                        description: 'UserAgent 解析'
                    }
                },
                {
                    name: '前端 CDN 查询',
                    path: '/cdnjs',
                    emoji: '📦',
                    desc: '快速查找CDN资源',
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
                    emoji: '🔍',
                    desc: '常用正则表达式库',
                    head: {
                        keywords: ['正则大全'],
                        description: '正则大全'
                    }
                },
                {
                    name: 'URL 编码/解码',
                    path: '/urlencode',
                    emoji: '🔐',
                    desc: 'URL字符串编码解码',
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
                    emoji: '🆔',
                    desc: '生成唯一标识符',
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
                    emoji: '🔑',
                    desc: '生成安全随机密码',
                    head: {
                        keywords: [
                            '随机密码生成',
                            '密码生成器',
                            '强密码生成',
                            '安全密码生成'
                        ],
                        description: '在线随机密码生成器'
                    }
                },
                {
                    name: '.gitignore 生成器',
                    path: '/gitignore-generator',
                    emoji: '📝',
                    desc: '生成Git忽略规则文件',
                    head: {
                        keywords: [
                            'gitignore',
                            '生成器',
                            '忽略文件',
                            'git',
                            'Node.js',
                            'Python',
                            'Java',
                            'Vue',
                            'React'
                        ],
                        description: '在线.gitignore生成器，支持多种语言、框架、编辑器的忽略规则配置'
                    }
                }
            ]
        },
        {
            title: '加解密工具',
            icon: 'lock-outline',
            list: [
                {
                    name: '哈希计算工具',
                    path: '/hash-tools',
                    emoji: '🔢',
                    desc: 'MD5、SHA系列哈希计算',
                    head: {
                        keywords: [
                            '哈希计算',
                            'MD5',
                            'SHA1',
                            'SHA256',
                            'SHA3',
                            'RIPEMD160',
                            '哈希值',
                            '校验码',
                            '数据完整性'
                        ],
                        description: '在线哈希计算工具，支持MD5、SHA系列、RIPEMD160等多种哈希算法'
                    }
                },
                {
                    name: 'HMAC 加密工具',
                    path: '/hmac-tools',
                    emoji: '🔐',
                    desc: '消息认证码计算',
                    head: {
                        keywords: [
                            'HMAC',
                            '消息认证码',
                            'HmacMD5',
                            'HmacSHA1',
                            'HmacSHA256',
                            'HmacSHA512',
                            'API签名',
                            '数据认证'
                        ],
                        description: '在线HMAC加密工具，支持多种哈希算法的消息认证码计算'
                    }
                },
                {
                    name: '国密SM2加密/解密',
                    path: '/sm2-crypto',
                    emoji: '🇨🇳',
                    desc: '国密椭圆曲线公钥加密',
                    head: {
                        keywords: [
                            '国密SM2',
                            'SM2加密',
                            'SM2解密',
                            '椭圆曲线加密',
                            '公钥加密',
                            '国密算法',
                            '中国加密标准',
                            'ECC加密'
                        ],
                        description: '在线国密SM2椭圆曲线公钥密码算法加密解密工具，支持密钥生成、加密、解密功能'
                    }
                },
                {
                    name: '国密SM3哈希算法',
                    path: '/sm3-hash',
                    emoji: '🇨🇳',
                    desc: '国密密码杂凑算法',
                    head: {
                        keywords: [
                            '国密SM3',
                            'SM3哈希',
                            'SM3算法',
                            '国密哈希',
                            '中国密码算法',
                            '数据完整性',
                            '数字签名',
                            '消息认证'
                        ],
                        description: '在线国密SM3密码杂凑算法工具，支持SM3哈希计算、HMAC-SM3、批量处理等功能'
                    }
                },
                {
                    name: '国密SM4加密/解密',
                    path: '/sm4-crypto',
                    emoji: '🇨🇳',
                    desc: '国密对称分组加密',
                    head: {
                        keywords: [
                            '国密SM4',
                            'SM4加密',
                            'SM4解密',
                            '国密对称加密',
                            '分组密码',
                            '中国加密标准',
                            '数据加密',
                            '对称加密'
                        ],
                        description: '在线国密SM4对称加密解密工具，支持多种工作模式，提供密钥生成、格式转换等功能'
                    }
                },
                {
                    name: 'AES 加密/解密',
                    path: '/aes-encrypt',
                    emoji: '🔒',
                    desc: '高级加密标准',
                    head: {
                        keywords: [
                            'AES加密',
                            'AES解密',
                            '高级加密标准',
                            '对称加密',
                            '数据加密',
                            '安全传输',
                            'AES-128',
                            'AES-192',
                            'AES-256'
                        ],
                        description: '在线AES加密解密工具，支持多种加密模式和密钥长度'
                    }
                },
                {
                    name: 'DES/TripleDES 加密/解密',
                    path: '/des-encrypt',
                    emoji: '🔑',
                    desc: '传统对称加密算法',
                    head: {
                        keywords: [
                            'DES加密',
                            'TripleDES加密',
                            '3DES加密',
                            'DES解密',
                            'TripleDES解密',
                            '对称加密',
                            '传统加密',
                            '数据加密'
                        ],
                        description: '在线DES和TripleDES加密解密工具，支持传统对称加密算法'
                    }
                },
                {
                    name: '流密码加密/解密',
                    path: '/stream-cipher',
                    emoji: '💧',
                    desc: 'Rabbit、RC4流式加密',
                    head: {
                        keywords: [
                            '流密码',
                            'Rabbit',
                            'RC4',
                            'RC4Drop',
                            '实时加密',
                            '数据流加密',
                            '对称加密',
                            '流式加密'
                        ],
                        description: '在线流密码加密解密工具，支持Rabbit、RC4、RC4Drop等流密码算法'
                    }
                }
            ]
        },
        {
            title: 'PDF 工具',
            icon: 'file-text-outline',
            list: [
                {
                    name: '合并 PDF',
                    path: 'https://bentopdf.huhaha.vip/merge-pdf.html',
                    external: true,
                    emoji: '📑',
                    desc: '多个PDF文件合并',
                    head: {
                        keywords: ['PDF合并', '合并PDF', 'PDF工具'],
                        description: '在线合并PDF文件'
                    }
                },
                {
                    name: '分割 PDF',
                    path: 'https://bentopdf.huhaha.vip/split-pdf.html',
                    external: true,
                    emoji: '✂️',
                    desc: '拆分PDF为多个文件',
                    head: {
                        keywords: ['PDF分割', '分割PDF', 'PDF工具'],
                        description: '在线分割PDF文件'
                    }
                },
                {
                    name: '压缩 PDF',
                    path: 'https://bentopdf.huhaha.vip/compress-pdf.html',
                    external: true,
                    emoji: '📦',
                    desc: '减小PDF文件体积',
                    head: {
                        keywords: ['PDF压缩', '压缩PDF', 'PDF工具'],
                        description: '在线压缩PDF文件大小'
                    }
                },
                {
                    name: 'PDF 编辑',
                    path: 'https://bentopdf.huhaha.vip/edit-pdf.html',
                    external: true,
                    emoji: '✏️',
                    desc: '编辑PDF内容',
                    head: {
                        keywords: ['PDF编辑', '编辑PDF', 'PDF工具'],
                        description: '在线编辑PDF文件'
                    }
                },
                {
                    name: '图片转 PDF',
                    path: 'https://bentopdf.huhaha.vip/image-to-pdf.html',
                    external: true,
                    emoji: '🖼️',
                    desc: '图片合并为PDF',
                    head: {
                        keywords: ['图片转PDF', 'JPG转PDF', 'PNG转PDF'],
                        description: '在线将图片转换为PDF'
                    }
                },
                {
                    name: 'PDF 转图片',
                    path: 'https://bentopdf.huhaha.vip/pdf-to-jpg.html',
                    external: true,
                    emoji: '🖼️',
                    desc: 'PDF页面转图片',
                    head: {
                        keywords: ['PDF转图片', 'PDF转JPG', 'PDF转PNG'],
                        description: '在线将PDF转换为图片'
                    }
                },
                {
                    name: 'PDF OCR',
                    path: 'https://bentopdf.huhaha.vip/ocr-pdf.html',
                    external: true,
                    emoji: '🔍',
                    desc: '识别PDF文字',
                    head: {
                        keywords: ['PDF OCR', 'PDF识别', '文字识别'],
                        description: '在线PDF文字识别'
                    }
                },
                {
                    name: 'PDF 签名',
                    path: 'https://bentopdf.huhaha.vip/sign-pdf.html',
                    external: true,
                    emoji: '✒️',
                    desc: '添加电子签名',
                    head: {
                        keywords: ['PDF签名', '签名PDF', '电子签名'],
                        description: '在线为PDF添加签名'
                    }
                },
                {
                    name: '裁剪 PDF',
                    path: 'https://bentopdf.huhaha.vip/crop-pdf.html',
                    external: true,
                    emoji: '📐',
                    desc: '裁剪PDF页面',
                    head: {
                        keywords: ['PDF裁剪', '裁剪PDF', 'PDF工具'],
                        description: '在线裁剪PDF页面'
                    }
                },
                {
                    name: '提取页面',
                    path: 'https://bentopdf.huhaha.vip/extract-pages.html',
                    external: true,
                    emoji: '📄',
                    desc: '提取指定页面',
                    head: {
                        keywords: ['PDF提取', '提取PDF页面'],
                        description: '在线提取PDF页面'
                    }
                },
                {
                    name: '加密 PDF',
                    path: 'https://bentopdf.huhaha.vip/encrypt-pdf.html',
                    external: true,
                    emoji: '🔒',
                    desc: '设置PDF密码',
                    head: {
                        keywords: ['PDF加密', '加密PDF', 'PDF密码'],
                        description: '在线加密PDF文件'
                    }
                },
                {
                    name: '解密 PDF',
                    path: 'https://bentopdf.huhaha.vip/decrypt-pdf.html',
                    external: true,
                    emoji: '🔓',
                    desc: '解除PDF密码',
                    head: {
                        keywords: ['PDF解密', '解密PDF', 'PDF解锁'],
                        description: '在线解密PDF文件'
                    }
                },
                {
                    name: '删除页面',
                    path: 'https://bentopdf.huhaha.vip/delete-pages.html',
                    external: true,
                    emoji: '🗑️',
                    desc: '删除指定页面',
                    head: {
                        keywords: ['PDF删除页面', '删除PDF页面'],
                        description: '在线删除PDF页面'
                    }
                },
                {
                    name: '旋转 PDF',
                    path: 'https://bentopdf.huhaha.vip/rotate-pdf.html',
                    external: true,
                    emoji: '🔄',
                    desc: '旋转PDF页面',
                    head: {
                        keywords: ['PDF旋转', '旋转PDF'],
                        description: '在线旋转PDF页面'
                    }
                },
                {
                    name: 'PDF 转 Word',
                    path: 'https://bentopdf.huhaha.vip/pdf-to-docx.html',
                    external: true,
                    emoji: '📝',
                    desc: 'PDF转Word文档',
                    head: {
                        keywords: ['PDF转Word', 'Word转换'],
                        description: '在线将PDF转换为Word'
                    }
                },
                {
                    name: 'Word 转 PDF',
                    path: 'https://bentopdf.huhaha.vip/word-to-pdf.html',
                    external: true,
                    emoji: '📄',
                    desc: 'Word转PDF',
                    head: {
                        keywords: ['Word转PDF', '文档转换'],
                        description: '在线将Word转换为PDF'
                    }
                },
                {
                    name: 'PDF 转 Excel',
                    path: 'https://bentopdf.huhaha.vip/pdf-to-excel.html',
                    external: true,
                    emoji: '📊',
                    desc: 'PDF转Excel表格',
                    head: {
                        keywords: ['PDF转Excel', '表格转换'],
                        description: '在线将PDF转换为Excel'
                    }
                },
                {
                    name: 'Excel 转 PDF',
                    path: 'https://bentopdf.huhaha.vip/excel-to-pdf.html',
                    external: true,
                    emoji: '📈',
                    desc: 'Excel转PDF',
                    head: {
                        keywords: ['Excel转PDF', '表格转换'],
                        description: '在线将Excel转换为PDF'
                    }
                }
            ]
        },
        {
            title: '图片工具',
            icon: 'image-outline',
            list: [
                {
                    name: '图片裁剪',
                    path: '/image-cropper',
                    emoji: '✂️',
                    desc: '自由裁剪、比例裁剪',
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
                    emoji: '📦',
                    desc: 'JPEG、PNG、WebP压缩',
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
                    emoji: '🔄',
                    desc: 'JPG/PNG/WebP/GIF互转',
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
                    name: '图片翻转旋转',
                    path: '/image-rotate-flip',
                    emoji: '🔄',
                    desc: '旋转、翻转图片',
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
                    emoji: '🎨',
                    desc: '替换图片背景色',
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
                    emoji: '🔖',
                    desc: '身份证、图片加水印',
                    head: {
                        keywords: [
                            '身份证加水印',
                            '敏感信息加水印',
                            '图片加水印'
                        ],
                        description: '在线身份证加水印'
                    }
                },
                {
                    name: '图片转PDF',
                    path: '/image-to-pdf',
                    emoji: '📄',
                    desc: '多张图片合并转PDF',
                    head: {
                        keywords: [
                            '图片转PDF',
                            '图片转PDF工具',
                            '在线图片转PDF',
                            'JPG转PDF',
                            'PNG转PDF',
                            '图片合并PDF',
                            '多张图片转PDF',
                            '图片转PDF转换器',
                            '在线PDF制作',
                            '图片文档转换'
                        ],
                        description: '在线图片转PDF工具，支持将多张图片合并转换为PDF文件，支持JPG、PNG、WebP等格式，可调整页面大小和方向'
                    }
                },
                {
                    name: 'PDF转图片',
                    path: '/pdf-to-image',
                    emoji: '🖼️',
                    desc: 'PDF页面转图片',
                    head: {
                        keywords: [
                            'PDF转图片',
                            'PDF转图片工具',
                            '在线PDF转图片',
                            'PDF转JPG',
                            'PDF转PNG',
                            'PDF转换图片',
                            'PDF页面转图片',
                            'PDF图片提取',
                            'PDF转图片转换器',
                            'PDF文档转图片'
                        ],
                        description: '在线PDF转图片工具，支持将PDF文件转换为JPG、PNG格式图片，可设置图片质量和DPI，支持批量转换和下载'
                    }
                },
                {
                    name: '格式转换',
                    path: '/ffmpeg',
                    emoji: '🎬',
                    desc: '视频音频格式转换',
                    head: {
                        keywords: ['格式转换'],
                        description: 'ffmpeg 格式转换'
                    }
                },
                {
                    name: '九宫格切图',
                    path: '/img_jiugongge',
                    emoji: '🔲',
                    desc: '图片分割成九宫格',
                    head: {
                        keywords: ['图片九宫格', '九宫格切图', '九宫格'],
                        description: '图片分割成九宫格'
                    }
                },
                {
                    name: 'Anime 4K',
                    path: '/anime4k',
                    emoji: '✨',
                    desc: '图片视频AI放大',
                    head: {
                        keywords: ['anime'],
                        description: '3毫秒放大你老婆，支持视频/图片。'
                    }
                },
                {
                    name: 'Cyberpunk 2077 图片制作',
                    path: '/cyberpunk2077',
                    emoji: '🌃',
                    desc: '赛博朋克风格',
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
                    emoji: '📣',
                    desc: '令和举牌风格',
                    head: {
                        keywords: ['令和举牌风格图片制作'],
                        description: '在线令和举牌风格图片制作'
                    }
                },
                {
                    name: 'ACG 表情包制作',
                    path: '/acg_meme',
                    emoji: '😂',
                    desc: '动漫表情包制作',
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
                    emoji: '🔞',
                    desc: 'PornHub风格Logo',
                    head: {
                        keywords: ['PornHub 风格图片制作', 'PornHub Logo 制作'],
                        description: '在线 PornHub 风格图片制作'
                    }
                },
                {
                    name: 'YouTube 风格Logo',
                    path: '/youtube_logo',
                    emoji: '📺',
                    desc: 'YouTube风格Logo',
                    head: {
                        keywords: ['YouTube 风格图片制作', 'YouTube Logo 制作'],
                        description: '在线 YouTube 风格图片制作'
                    }
                },
                {
                    name: '视频转 GIF',
                    path: '/video2gif',
                    emoji: '🎥',
                    desc: '视频转GIF动图',
                    head: {
                        keywords: ['视频转换GIF图片'],
                        description: '在线视频转换GIF图片'
                    }
                },
                {
                    name: 'GIF 图片分解',
                    path: '/gif_splitter',
                    emoji: '🧩',
                    desc: '分解GIF帧图片',
                    head: {
                        keywords: ['GIF图片分解'],
                        description: '在线分解GIF图片'
                    }
                },
                {
                    name: '微博生成器',
                    path: '/meme-weibo',
                    emoji: '📱',
                    desc: '生成微博截图',
                    head: {
                        keywords: ['微博生成器', '王思聪微博生成器'],
                        description: '在线微博生成器'
                    }
                },
                {
                    name: '抖音风格文字生成',
                    path: '/douyin_text',
                    emoji: '🎵',
                    desc: '抖音风格文字',
                    head: {
                        keywords: ['抖音风格文字生成', '抖音样式文字生成'],
                        description: '在线抖音风格文字生成'
                    }
                },
                {
                    name: '图片编辑',
                    path: '/image_editor',
                    emoji: '🎨',
                    desc: '在线图片编辑器',
                    head: {
                        keywords: ['图片编辑器', '图片处理', '表情包制作'],
                        description: '在线图片编辑器'
                    }
                }
            ]
        },
        {
            title: '文字工具',
            icon: 'text-outline',
            list: [
                {
                    name: '文本对比',
                    path: '/textdiff',
                    emoji: '🔍',
                    desc: '对比两段文本差异',
                    head: {
                        keywords: ['文本对比', '代码对比'],
                        description: '文本在线对比'
                    }
                },
                {
                    name: '文本去重',
                    path: '/remove_duplicate',
                    emoji: '🗑️',
                    desc: '去除重复内容',
                    head: {
                        keywords: ['文本在线去重', '文本去除重复'],
                        description: '文本在线去重'
                    }
                },
                {
                    name: '数字转大写中文',
                    path: '/number_to_zh',
                    emoji: '壹',
                    desc: '数字转中文金额',
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
                    emoji: '📝',
                    desc: '在线文本编辑',
                    head: {
                        keywords: ['富文本编辑器'],
                        description: '在线富文本编辑器'
                    }
                },
                {
                    name: 'Markdown 编辑器',
                    path: '/markdown',
                    emoji: '📄',
                    desc: 'Markdown语法编辑',
                    head: {
                        keywords: ['Markdown编辑器'],
                        description: '在线Markdown编辑器'
                    }
                },
                {
                    name: '摩斯电码转换',
                    path: '/morse',
                    emoji: '··—·',
                    desc: '摩斯电码翻译',
                    head: {
                        keywords: ['摩斯电码转换', '中文摩斯电码转换'],
                        description: '在线摩斯电码转换'
                    }
                },
                {
                    name: '盲人摸象加解密',
                    path: '/sot1_encrypt',
                    emoji: '🔤',
                    desc: '趣味文字加密',
                    head: {
                        keywords: ['盲人摸象', '转码', '加解密'],
                        description: '在线盲人摸象加解密'
                    }
                },
                {
                    name: '中英文加空格',
                    path: '/text_autospace',
                    emoji: '〰️',
                    desc: '自动添加空格',
                    head: {
                        keywords: ['中英文加空格'],
                        description: '在线中英文加空格'
                    }
                },
                {
                    name: '文本处理',
                    path: '/text-processor',
                    emoji: '⚙️',
                    desc: '大小写、简繁转换',
                    head: {
                        keywords: ['文本处理', '文本转换', '大小写转换', '简繁转换', '标点转换', '命名格式'],
                        description: '多功能文本处理工具，支持大小写转换、简繁转换、标点转换、命名格式转换、文本过滤等功能'
                    }
                }
            ]
        },
        {
            title: '其他工具',
            icon: 'layers-outline',
            list: [
                {
                    name: '房贷计算器',
                    path: '/mortgage-calculator',
                    emoji: '🏠',
                    desc: '计算月供、利息',
                    head: {
                        keywords: ['房贷计算器', '房贷计算', '月供计算', '贷款计算', '等额本息', '等额本金'],
                        description: '在线房贷计算器，支持等额本息和等额本金两种还款方式'
                    }
                },
                {
                    name: '屏幕录制',
                    path: '/screen_record',
                    emoji: '📹',
                    desc: '网页录屏工具',
                    head: {
                        keywords: ['屏幕录制', '在线录屏'],
                        description: '在网页上完成录屏'
                    }
                },
                {
                    name: '番茄时钟',
                    path: '/pomodoro_technique',
                    emoji: '🍅',
                    desc: '番茄工作法计时',
                    head: {
                        keywords: ['在线番茄时钟', '番茄工作法'],
                        description: '在线番茄时钟'
                    }
                },
                {
                    name: '人生小格',
                    path: '/lifecount',
                    emoji: '📅',
                    desc: '人生进度可视化',
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
                    emoji: '🎲',
                    desc: '生成随机数',
                    head: {
                        keywords: ['在线随机数生成'],
                        description: '在线随机数生成'
                    }
                },
                {
                    name: '图片加包浆',
                    path: '/image_patina',
                    emoji: '✨',
                    desc: '图片做旧效果',
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
                    emoji: '💬',
                    desc: '下载LINE表情包',
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
                    emoji: '🧐',
                    desc: '趣味搜索工具',
                    head: {
                        keywords: ['帮你百度', '怎么用百度', '怎么用谷歌'],
                        description: '帮你百度'
                    }
                },
                {
                    name: 'SS/R/V2ray 配置解析',
                    path: '/ssr_decode',
                    emoji: '🔗',
                    desc: '代理配置解析',
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
                    emoji: '👨‍👩‍👧',
                    desc: '计算亲戚称呼',
                    head: {
                        keywords: ['亲戚关系计算器'],
                        description: '在线亲戚关系计算器'
                    }
                },
                {
                    name: '二维码生成/解析',
                    path: '/qrcode_generation',
                    emoji: '📱',
                    desc: '生成和解析二维码',
                    head: {
                        keywords: ['在线二维码生成', '在线二维码内容解析'],
                        description: '二维码生成/解析'
                    }
                },
                {
                    name: '这是什么动漫',
                    path: '/what_anime_is_this',
                    emoji: '🎬',
                    desc: '截图搜索动漫',
                    head: {
                        keywords: ['根据截图搜索动漫', 'whatanime'],
                        description: '根据截图搜索动漫'
                    }
                },
                {
                    name: '中国传统色',
                    path: '/china_colors',
                    emoji: '🎨',
                    desc: '中国传统色彩',
                    head: {
                        keywords: ['中国传统色'],
                        description: '中国传统色'
                    }
                },
                {
                    name: '日本传统色',
                    path: '/japan_colors',
                    emoji: '🌸',
                    desc: '日本传统色彩',
                    head: {
                        keywords: ['日本传统色', '日本の伝統色'],
                        description: '日本传统色'
                    }
                },
                {
                    name: '颜色处理',
                    path: '/color',
                    emoji: '🌈',
                    desc: '颜色代码转换',
                    head: {
                        keywords: ['hex转rgb', '颜色代码转换', '在线颜色选择'],
                        description: '在线图片选择'
                    }
                },
                {
                    name: '收款码合并',
                    path: '/universal_pay',
                    emoji: '💳',
                    desc: '多码合一收款',
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
                    emoji: '🌡️',
                    desc: '摄氏度、华氏度转换',
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
                    emoji: '🆔',
                    desc: '身份证查询生成',
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
                    emoji: '🌍',
                    desc: '全球时区转换',
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
