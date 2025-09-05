<template>
    <div class="watermark">
        <nya-container title="图片加水印">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片水印工具，为您的图片添加文字水印，保护您的图片版权和隐私信息。支持自定义水印文字、字体大小、颜色、透明度和旋转角度。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleChange"
                    style="display: none"
                />
                <div 
                    class="upload-zone"
                    @click="$refs.fileInput.click()"
                    @drop.prevent="handleDrop"
                    @dragover.prevent="handleDragOver"
                    @dragleave.prevent="handleDragLeave"
                    :class="{ 'drag-over': isDragOver }"
                >
                    <div class="upload-icon">
                        💧
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPG、PNG、WebP 格式</p>
                    </div>
                </div>
            </div>

        </nya-container>
        
            <!-- 水印设置 -->
            <nya-container v-if="preview" title="水印设置" class="mb-15">
                <div class="watermark-settings">
                    <div class="setting-group">
                        <label>水印文字</label>
                        <nya-input
                            v-model.trim="options.text"
                            placeholder="仅供 xxx 验证使用"
                            autocomplete="off"
                            fullwidth
                        />
                    </div>

                    <div class="setting-row">
                        <div class="setting-item">
                            <label>字体大小</label>
                            <client-only>
                                <vue-slider 
                                    v-model="options.fontSize" 
                                    :min="10" 
                                    :max="50" 
                                    :interval="1"
                                    :tooltip-formatter="val => val + 'px'"
                                />
                            </client-only>
                            <span>{{ options.fontSize }}px</span>
                        </div>

                        <div class="setting-item">
                            <label>透明度</label>
                            <client-only>
                                <vue-slider 
                                    v-model="options.alpha" 
                                    :min="1" 
                                    :max="10" 
                                    :interval="1"
                                    :tooltip-formatter="val => Math.round(val * 10) + '%'"
                                />
                            </client-only>
                            <span>{{ Math.round(options.alpha * 10) }}%</span>
                        </div>
                    </div>

                    <div class="setting-row">
                        <div class="setting-item">
                            <label>旋转角度</label>
                            <client-only>
                                <vue-slider 
                                    v-model="options.rotate" 
                                    :min="0" 
                                    :max="360" 
                                    :interval="1"
                                    :tooltip-formatter="val => val + '°'"
                                />
                            </client-only>
                            <span>{{ options.rotate }}°</span>
                        </div>

                        <div class="setting-item">
                            <label>文字间距</label>
                            <client-only>
                                <vue-slider 
                                    v-model="options.width" 
                                    :min="0" 
                                    :max="100" 
                                    :interval="1"
                                    :tooltip-formatter="val => val + 'px'"
                                />
                            </client-only>
                            <span>{{ options.width }}px</span>
                        </div>
                    </div>

                    <div class="setting-group">
                        <label>文字颜色</label>
                        <client-only>
                            <compact-picker v-model="colors" @input="updateColor" />
                        </client-only>
                    </div>
                </div>

                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-primary"
                        :disabled="loading || !preview"
                        @click="addWatermark"
                    >
                        {{ loading ? '⏳ 处理中...' : '✨ 添加水印' }}
                    </button>
                    <button 
                        type="button" 
                        class="btn-danger"
                        @click="resetSettings"
                    >
                        🔄 重置设置
                    </button>
                </div>
            </nya-container>

            <!-- 预览区域 -->
            <nya-container v-if="preview" title="预览效果" class="mb-15">
                <div class="preview-container">
                    <div ref="preview" class="preview-wrapper">
                        <img :src="preview" alt="预览图片" class="preview-image">
                        <div class="watermark-overlay" :style="{ background: `url(${svg})` }"></div>
                    </div>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>文字水印：</strong>支持自定义文字内容作为水印</li>
                        <li><strong>样式调节：</strong>可调整字体大小、颜色、透明度、旋转角度</li>
                        <li><strong>实时预览：</strong>调整参数时实时显示效果</li>
                        <li><strong>本地处理：</strong>所有操作在本地完成，保护隐私</li>
                        <li><strong>一键下载：</strong>处理完成后可直接下载带水印图片</li>
                    </ul>

                    <h4>使用场景：</h4>
                    <ul>
                        <li><strong>证件保护：</strong>为身份证、驾驶证等证件添加水印防止滥用</li>
                        <li><strong>版权声明：</strong>为原创作品添加版权信息</li>
                        <li><strong>隐私保护：</strong>防止个人信息被恶意使用</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>上传图片后调整水印参数</li>
                        <li>建议使用半透明效果，不影响原图内容</li>
                        <li>可适当旋转水印角度，增加防伪效果</li>
                        <li>完成后点击"添加水印"按钮下载处理后的图片</li>
                    </ul>
                </div>
            </nya-container>
    </div>
</template>

<script>
import createDownload from '~/utils/createDownload.js';
import domtoimage from 'dom-to-image';
import 'vue-slider-component/theme/default.css';
import { Compact } from 'vue-color';
let VueSlider;
if (process.browser) {
    VueSlider = require('vue-slider-component');
}
export default {
    name: 'Watermark',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        'compact-picker': Compact,
        VueSlider
    },
    data() {
        return {
            colors: '#000000',
            results: '',
            preview: '',
            loading: false,
            options: {
                fontSize: 13,
                text: '仅供 xxx 验证使用',
                alpha: 5,
                color: '#000000',
                rotate: 23,
                width: 10
            },
            n: null,
            watermark: null,
            isDragOver: false,
            fileName: ''
        };
    },
    computed: {
        svg() {
            let width =
                this.options.fontSize * this.options.text.split('').length;
            width = width + (this.options.width / 100) * width;

            let svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${width}px">
                <text x="50%" y="50%"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    stroke="${this.options.color}"
                    opacity="${this.options.alpha / 10}"
                    transform="translate(${width / 2}, ${width / 2}) rotate(${
                this.options.rotate
            }) translate(-${width / 2}, -${width / 2})"
                    font-weight="100"
                    font-size="${this.options.fontSize}"
                    font-family="microsoft yahe"
                    >
                    ${this.options.text}
                </text>
            </svg>`;
            return (
                'data:image/svg+xml;base64,' +
                Buffer.from(svgText).toString('base64')
            );
        }
    },
    methods: {
        handleChange(e) {
            const files = e.target.files;
            if (!files.length) return false;
            this.processFile(files[0]);
        },
        handleDrop(e) {
            const files = e.dataTransfer.files;
            if (!files.length) return false;
            this.processFile(files[0]);
            this.isDragOver = false;
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        processFile(file) {
            if (!/image\/.*/.test(file.type)) {
                this.$noty.error('上传失败: 请上传图片格式文件');
                return false;
            }
            this.fileName = file.name;
            this.file = file;
            this.docs = [];
            this.preview = URL.createObjectURL(file);
        },
        addWatermark() {
            this.loading = true;
            domtoimage
                .toPng(this.$refs.preview)
                .then(e => {
                    this.results = e;
                    this.loading = false;
                    createDownload(e, 'watermark_' + (this.fileName || new Date().getTime()) + '.png');
                    this.$noty.success('水印添加成功，已自动下载');
                })
                .catch(err => {
                    this.loading = false;
                    this.$noty.error('生成失败: ' + err);
                });
        },
        resetSettings() {
            this.options = {
                fontSize: 13,
                text: '仅供 xxx 验证使用',
                alpha: 5,
                color: '#000000',
                rotate: 23,
                width: 10
            };
            this.colors = '#000000';
        },
        updateColor(val) {
            this.options.color = val.hex8;
        }
    }
};
</script>

<style lang="scss">
.watermark {


    .upload-area {
        .upload-zone {
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: #fafafa;
            
            &:hover {
                border-color: #667eea;
                background: #f5f5ff;
            }
            
            &.drag-over {
                border-color: #667eea;
                background: #f0f0ff;
                transform: scale(1.02);
            }
            
            .upload-icon {
                font-size: 48px;
                margin-bottom: 10px;
            }
            
            .upload-text {
                p {
                    margin: 5px 0;
                    color: #666;
                    
                    &.upload-hint {
                        font-size: 14px;
                        color: #999;
                    }
                }
            }
        }
    }

    .watermark-settings {
        .setting-group {
            margin-bottom: 20px;
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }
        }
        
        .setting-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            
            @media (max-width: 768px) {
                flex-direction: column;
                gap: 15px;
            }
            
            .setting-item {
                flex: 1;
                
                label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                }
                
                span {
                    display: inline-block;
                    margin-top: 5px;
                    font-size: 14px;
                    color: #667eea;
                    font-weight: 600;
                }
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        margin-top: 25px;
        
        @media (max-width: 768px) {
            flex-direction: column;
        }
        
        .jwt-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            
            &.jwt-btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                
                &:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }
                
                &:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
            }
            
            &.jwt-btn-secondary {
                background: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
                
                &:hover {
                    background: #e5e5e5;
                    transform: translateY(-1px);
                }
            }
        }
    }

    .preview-container {
        .preview-wrapper {
            position: relative;
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
            background: #f9f9f9;
            
            .preview-image {
                width: 100%;
                height: auto;
                display: block;
            }
            
            .watermark-overlay {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background-size: 100px 100px;
            }
        }
    }

    .instructions {
        h4 {
            color: #333;
            margin: 15px 0 10px 0;
            font-size: 16px;
            
            &:first-child {
                margin-top: 0;
            }
        }
        
        ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
            
            li {
                margin: 5px 0;
                line-height: 1.6;
                color: #555;
                
                strong {
                    color: #667eea;
                }
            }
        }
    }

    // 响应式设计
    @media (max-width: 768px) {
        .nya-container {
            padding: 15px;
        }
    }
}
</style>
