<template>
    <div class="image-rotate-flip">
        <div class="content">
        <nya-container title="图片翻转旋转工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片翻转旋转工具，支持图片旋转、水平翻转、垂直翻转，实时预览效果。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    @change="handleFileSelect"
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
                        🔄
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPEG、PNG、WebP 格式</p>
                    </div>
                </div>
            </div>

        </nya-container>
        
            <!-- 控制面板 -->
            <nya-container v-if="imageSrc" title="旋转控制" class="mb-15">
                <div class="rotate-controls">
                    <div class="control-group">
                        <label>旋转角度</label>
                        <div class="rotate-buttons">
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-primary"
                                @click="rotateImage(-90)"
                            >
                                ↺ -90°
                            </button>
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-primary"
                                @click="rotateImage(90)"
                            >
                                ↻ +90°
                            </button>
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-primary"
                                @click="rotateImage(180)"
                            >
                                ↕ 180°
                            </button>
                        </div>
                    </div>
                    
                    <div class="control-group">
                        <label>翻转操作</label>
                        <div class="flip-buttons">
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-info"
                                @click="flipHorizontal"
                            >
                                ↔ 水平翻转
                            </button>
                            <button 
                                type="button" 
                                class="jwt-btn jwt-btn-info"
                                @click="flipVertical"
                            >
                                ↕ 垂直翻转
                            </button>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>自定义角度</label>
                        <div class="custom-rotate">
                            <client-only>
                                <vue-slider 
                                    v-model="customAngle" 
                                    :min="-180" 
                                    :max="180" 
                                    :interval="1"
                                    @change="applyCustomRotation"
                                />
                            </client-only>
                            <span>{{ customAngle }}°</span>
                        </div>
                    </div>

                    <div class="control-group">
                        <label>输出格式</label>
                        <nya-select
                            v-model="outputFormat"
                            :items="formatOptions"
                        />
                    </div>

                    <div class="control-group">
                        <label>输出质量</label>
                        <client-only>
                            <vue-slider 
                                v-model="quality" 
                                :min="0.1" 
                                :max="1" 
                                :interval="0.1"
                            />
                        </client-only>
                        <span>{{ Math.round(quality * 100) }}%</span>
                    </div>

                    <div class="control-buttons">
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-warning"
                            @click="resetTransform"
                        >
                            🔄 重置变换
                        </button>
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-success"
                            @click="applyAllTransforms"
                        >
                            ✓ 应用变换
                        </button>
                    </div>
                </div>
            </nya-container>

            <!-- 图片预览区域 -->
            <nya-container v-if="imageSrc" title="图片预览">
                <div class="preview-container">
                    <div class="image-wrapper">
                        <img 
                ref="imageRef"
                :src="processedImage || imageSrc" 
                alt="待处理图片"
                class="preview-image"
                :style="imageStyle"
            />
                    </div>
                    <div class="preview-info">
                        <p>原始尺寸: {{ originalWidth }} × {{ originalHeight }} px</p>
                        <p>当前尺寸: {{ currentWidth }} × {{ currentHeight }} px</p>
                        <p>旋转角度: {{ totalRotation }}°</p>
                    </div>
                </div>
                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-success"
                        @click="downloadImage"
                        :disabled="!processedImage"
                    >
                        📥 下载图片
                    </button>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>旋转操作：</strong>支持90°、180°、-90°快速旋转，也支持自定义角度</li>
                        <li><strong>翻转操作：</strong>支持水平翻转和垂直翻转</li>
                        <li><strong>实时预览：</strong>所有操作都能实时预览效果</li>
                        <li><strong>格式转换：</strong>支持输出格式转换和质量调整</li>
                        <li><strong>批量操作：</strong>可组合多种变换操作</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>拖拽或点击上传图片</li>
                        <li>使用旋转按钮进行快速旋转</li>
                        <li>使用滑块进行精确角度调整</li>
                        <li>可组合多种变换效果</li>
                        <li>完成后点击下载保存处理后的图片</li>
                    </ul>
                </div>
            </nya-container>
    
        </div>
        <SiteFooter @donate="goHome" />
</div>
</template>

<script>import SiteFooter from '~/components/SiteFooter';

import createDownload from '~/utils/createDownload.js';
import 'vue-slider-component/theme/default.css';
let VueSlider;
if (process.browser) {
    VueSlider = require('vue-slider-component');
}

export default {
    name: 'ImageRotateFlip',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        VueSlider
    ,
        SiteFooter},
    data() {
        return {
            imageSrc: '',
            fileName: '',
            originalImage: null,
            processedImage: null,
            outputFormat: 'image/jpeg',
            quality: 0.9,
            isDragOver: false,
            
            // 变换参数
            rotation: 0,
            customAngle: 0,
            flipH: false,
            flipV: false,
            
            // 图片尺寸
            originalWidth: 0,
            originalHeight: 0,
            currentWidth: 0,
            currentHeight: 0,
            
            formatOptions: {
                'image/jpeg': 'JPEG',
                'image/png': 'PNG',
                'image/webp': 'WebP'
            }
        };
    },
    computed: {
        totalRotation() {
            return this.rotation + this.customAngle;
        },
        imageStyle() {
            return {
                maxWidth: '100%',
                maxHeight: '500px',
                display: 'block',
                margin: '0 auto'
            };
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        handleFileSelect(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
                this.fileName = file.name;
            }
        },
        handleDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                this.loadImage(files[0]);
                this.fileName = files[0].name;
            }
            this.isDragOver = false;
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        loadImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imageSrc = e.target.result;
                this.processedImage = e.target.result;
                this.getImageSize(e.target.result);
            };
            reader.readAsDataURL(file);
        },
        getImageSize(src) {
            const img = new Image();
            img.onload = () => {
                this.originalWidth = img.width;
                this.originalHeight = img.height;
                this.currentWidth = img.width;
                this.currentHeight = img.height;
                this.originalImage = img;
            };
            img.src = src;
        },
        rotateImage(angle) {
            this.rotation += angle;
            this.applyAllTransforms();
        },
        flipHorizontal() {
            this.flipH = !this.flipH;
            this.applyAllTransforms();
        },
        flipVertical() {
            this.flipV = !this.flipV;
            this.applyAllTransforms();
        },
        applyCustomRotation() {
            this.applyAllTransforms();
        },
        resetTransform() {
            this.rotation = 0;
            this.customAngle = 0;
            this.flipH = false;
            this.flipV = false;
            this.processedImage = this.imageSrc;
            this.currentWidth = this.originalWidth;
            this.currentHeight = this.originalHeight;
        },
        applyAllTransforms() {
            if (!this.originalImage) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const totalAngle = this.totalRotation * Math.PI / 180;
            const cos = Math.abs(Math.cos(totalAngle));
            const sin = Math.abs(Math.sin(totalAngle));
            
            // 计算旋转后的画布尺寸
            const newWidth = this.originalWidth * cos + this.originalHeight * sin;
            const newHeight = this.originalWidth * sin + this.originalHeight * cos;
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // 移动到画布中心
            ctx.translate(newWidth / 2, newHeight / 2);
            
            // 应用旋转
            ctx.rotate(totalAngle);
            
            // 应用翻转
            const scaleX = this.flipH ? -1 : 1;
            const scaleY = this.flipV ? -1 : 1;
            ctx.scale(scaleX, scaleY);
            
            // 绘制图片
            ctx.drawImage(
                this.originalImage,
                -this.originalWidth / 2,
                -this.originalHeight / 2,
                this.originalWidth,
                this.originalHeight
            );
            
            this.processedImage = canvas.toDataURL(this.outputFormat, this.quality);
            this.currentWidth = newWidth;
            this.currentHeight = newHeight;
        },
        downloadImage() {
            if (!this.processedImage) return;
            
            const extension = this.outputFormat.split('/')[1];
            const fileName = `rotated_${this.fileName.split('.')[0]}.${extension}`;
            createDownload(this.processedImage, fileName);
        }
    }
};
</script>

<style lang="scss" scoped>
.image-rotate-flip {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    

    .upload-area {
        .upload-zone {
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover, &.drag-over {
                border-color: var(--theme-color);
                background-color: rgba(var(--theme-color-rgb), 0.05);
            }

            .upload-icon {
                font-size: 48px;
                margin-bottom: 15px;
                color: var(--text-color);
            }

            .upload-text {
                p {
                    margin: 5px 0;
                    color: var(--text-color);
                    
                    &.upload-hint {
                        font-size: 14px;
                        color: var(--text-color-secondary);
                    }
                }
            }
        }
    }

    .rotate-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;

        .control-group {
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: var(--text-color);
            }

            .rotate-buttons, .flip-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .custom-rotate {
                display: flex;
                align-items: center;
                gap: 15px;

                .vue-slider {
                    flex: 1;
                }

                span {
                    font-weight: bold;
                    color: var(--theme-color);
                    min-width: 50px;
                }
            }
        }
    }

    .control-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }

    .preview-container {
        text-align: center;

        .image-wrapper {
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px;
            background: var(--bg-color-secondary);
        }

        .preview-image {
            max-width: 100%;
            max-height: 500px;
            border-radius: 4px;
        }

        .preview-info {
            p {
                margin: 5px 0;
                color: var(--text-color);
                font-size: 14px;
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    }

    .instructions {
        h4 {
            color: var(--theme-color);
            margin-bottom: 10px;
        }

        ul {
            margin-bottom: 20px;
            
            li {
                margin-bottom: 5px;
                color: var(--text-color);
                line-height: 1.6;
            }
        }
    }

    @media (max-width: 768px) {
        .rotate-controls {
            grid-template-columns: 1fr;
        }
        
        .rotate-buttons, .flip-buttons {
            flex-direction: column;
        }
    }
}
</style>