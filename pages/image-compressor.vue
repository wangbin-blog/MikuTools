<template>
    <div class="image-compressor">
        <div class="content">
        <nya-container title="图片压缩工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片压缩工具，支持JPEG、PNG、WebP格式，可批量压缩图片并保持高质量。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    multiple
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
                        📁
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPEG、PNG、WebP 格式</p>
                    </div>
                </div>
            </div>


        </nya-container>
        
            <!-- 压缩选项 -->
            <nya-container v-if="images.length > 0" title="压缩选项" class="mb-15">
                <div class="compress-options">
                    <div class="option-group">
                        <label>图片质量</label>
                        <div class="quality-slider">
                            <client-only>
                                <vue-slider 
                                    v-model="quality" 
                                    :min="0.1" 
                                    :max="1" 
                                    :interval="0.1"
                                    @change="updateAllPreviews"
                                />
                            </client-only>
                            <span>{{ Math.round(quality * 100) }}%</span>
                        </div>
                    </div>
                    <div class="option-group">
                        <nya-select
                            v-model="outputFormat"
                            fullwidth
                            label="输出格式"
                            :items="formatOptions"
                            @change="updateAllPreviews"
                        />
                    </div>
                    <div class="option-group">
                        <nya-checkbox
                            v-model="maintainAspectRatio"
                            label="保持宽高比"
                        />
                    </div>
                    <div class="option-group" v-if="!maintainAspectRatio">
                        <label>最大宽度</label>
                        <nya-input
                            v-model.number="maxWidth"
                            fullwidth
                            type="number"
                            placeholder="不限制"
                        />
                    </div>
                    <div class="option-group" v-if="!maintainAspectRatio">
                        <label>最大高度</label>
                        <nya-input
                            v-model.number="maxHeight"
                            fullwidth
                            type="number"
                            placeholder="不限制"
                        />
                    </div>
                </div>
            </nya-container>

            <!-- 图片列表 -->
            <nya-container v-if="images.length > 0" title="图片列表">
                <div class="image-list">
                    <div 
                        v-for="(image, index) in images" 
                        :key="index"
                        class="image-item"
                    >
                        <div class="image-preview">
                            <img :src="image.preview" :alt="image.name" />
                        </div>
                        <div class="image-info">
                            <div class="info-item">
                                <strong>文件名:</strong> {{ image.name }}
                            </div>
                            <div class="info-item">
                                <strong>原始大小:</strong> {{ formatFileSize(image.originalSize) }}
                            </div>
                            <div class="info-item">
                                <strong>压缩后:</strong> {{ formatFileSize(image.compressedSize) }}
                            </div>
                            <div class="info-item">
                                <strong>压缩率:</strong> {{ calculateCompressionRate(image) }}%
                            </div>
                        </div>
                        <div class="image-actions">
                            <button 
                                type="button" 
                                class="btn-control btn-success"
                                @click="downloadImage(image, index)"
                            >
                                ⬇️ 下载
                            </button>
                            <button 
                                type="button" 
                                class="btn-control btn-danger"
                                @click="removeImage(index)"
                            >
                                🗑️ 删除
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 批量操作 -->
                <div class="batch-actions">
                    <button 
                        type="button" 
                        class="btn-success"
                        @click="downloadAll"
                        :disabled="!canDownloadAll"
                    >
                        ⬇️ 下载全部
                    </button>
                    <button 
                        type="button" 
                        class="btn-danger"
                        @click="clearAll"
                    >
                        🗑️ 清空列表
                    </button>
                </div>
            </nya-container>
            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>批量压缩：</strong>支持多张图片同时压缩</li>
                        <li><strong>格式支持：</strong>JPEG、PNG、WebP格式</li>
                        <li><strong>质量调节：</strong>可调整压缩质量百分比</li>
                        <li><strong>尺寸调整：</strong>可设置最大宽高</li>
                        <li><strong>格式转换：</strong>支持输出格式转换</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>拖拽或点击上传图片</li>
                        <li>调整压缩质量滑块预览效果</li>
                        <li>可单独下载或批量下载压缩图片</li>
                        <li>压缩率会根据图片内容自动调整</li>
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
    name: 'ImageCompressor',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        VueSlider
    ,
        SiteFooter},
    data() {
        return {
            images: [],
            quality: 0.8,
            outputFormat: 'original',
            maintainAspectRatio: true,
            maxWidth: null,
            maxHeight: null,
            isDragOver: false,
            formatOptions: {  'original':'保持原格式' ,'image/jpeg' :'JPEG','image/png' :'PNG','image/webp' :'WebP'}
        };
    },
    computed: {
        canDownloadAll() {
            return this.images.some(img => img.compressedSize > 0);
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        handleFileSelect(event) {
            const files = Array.from(event.target.files);
            this.processFiles(files);
        },

        handleDrop(event) {
            const files = Array.from(event.dataTransfer.files);
            this.processFiles(files);
            this.isDragOver = false;
        },

        handleDragOver() {
            this.isDragOver = true;
        },

        handleDragLeave() {
            this.isDragOver = false;
        },

        async processFiles(files) {
            const imageFiles = files.filter(file => 
                file.type.startsWith('image/') && 
                !file.type.includes('gif') &&
                (file.type.includes('jpeg') || file.type.includes('png') || file.type.includes('webp'))
            );

            for (const file of imageFiles) {
                const imageData = {
                    file,
                    name: file.name,
                    originalSize: file.size,
                    compressedSize: 0,
                    preview: URL.createObjectURL(file),
                    compressedBlob: null
                };
                
                this.images.push(imageData);
                await this.compressImage(imageData);
            }
        },

        async compressImage(imageData) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    let { width, height } = img;

                    // 调整尺寸
                    if (!this.maintainAspectRatio && (this.maxWidth || this.maxHeight)) {
                        if (this.maxWidth && width > this.maxWidth) {
                            height = (height * this.maxWidth) / width;
                            width = this.maxWidth;
                        }
                        if (this.maxHeight && height > this.maxHeight) {
                            width = (width * this.maxHeight) / height;
                            height = this.maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // 绘制图片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 确定输出格式
                    const format = this.outputFormat === 'original' ? imageData.file.type : this.outputFormat;

                    // 压缩图片
                    canvas.toBlob(
                        (blob) => {
                            imageData.compressedBlob = blob;
                            imageData.compressedSize = blob.size;
                            resolve();
                        },
                        format,
                        this.quality
                    );
                };
                img.src = imageData.preview;
            });
        },

        async updateAllPreviews() {
            for (const image of this.images) {
                await this.compressImage(image);
            }
        },

        downloadImage(image, index) {
            if (!image.compressedBlob) return;

            const link = document.createElement('a');
            const extension = this.getFileExtension(image);
            link.href = URL.createObjectURL(image.compressedBlob);
            link.download = `compressed_${index + 1}${extension}`;
            link.click();
        },

        async downloadAll() {
            for (let i = 0; i < this.images.length; i++) {
                if (this.images[i].compressedBlob) {
                    await new Promise(resolve => {
                        setTimeout(() => {
                            this.downloadImage(this.images[i], i);
                            resolve();
                        }, i * 200);
                    });
                }
            }
        },

        getFileExtension(image) {
            switch (this.outputFormat) {
                case 'image/jpeg': return '.jpg';
                case 'image/png': return '.png';
                case 'image/webp': return '.webp';
                default: return '.' + image.name.split('.').pop();
            }
        },

        removeImage(index) {
            URL.revokeObjectURL(this.images[index].preview);
            this.images.splice(index, 1);
        },

        clearAll() {
            this.images.forEach(image => {
                URL.revokeObjectURL(image.preview);
            });
            this.images = [];
            this.$noty.info('已清空所有图片');
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        calculateCompressionRate(image) {
            if (image.originalSize === 0) return 0;
            const rate = ((image.originalSize - image.compressedSize) / image.originalSize) * 100;
            return Math.round(rate);
        }
    },

    beforeDestroy() {
        this.images.forEach(image => {
            URL.revokeObjectURL(image.preview);
        });
    }
};
</script>

<style lang="scss" scoped>
.image-compressor {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    .tool-info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;

        h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
        }

        p {
            margin: 0;
            opacity: 0.9;
            line-height: 1.5;
        }
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

    .compress-options {
        .option-group {
            margin-bottom: 20px;

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: var(--text-color);
            }

            .quality-slider {
                display: flex;
                align-items: center;
                gap: 15px;

                .vue-slider {
                    flex: 1;
                    margin: 0;
                }

                span {
                    min-width: 50px;
                    font-weight: bold;
                    color: var(--theme-color);
                }
            }
        }
    }

    .image-list {
        .image-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            margin-bottom: 10px;

            .image-preview {
                flex-shrink: 0;
                width: 80px;
                height: 80px;
                border-radius: 4px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .image-info {
                flex: 1;
                
                .info-item {
                    margin-bottom: 5px;
                    font-size: 14px;
                    color: var(--text-color);
                    
                    strong {
                        color: var(--text-color-secondary);
                    }
                }
            }

            .image-actions {
                display: flex;
                gap: 10px;
                flex-direction: column;

                .jwt-btn {
                    padding: 6px 12px;
                    font-size: 12px;
                }
            }
        }
    }

    .batch-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;
        justify-content: center;

        .jwt-btn {
            padding: 10px 20px;
        }
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

    // 响应式设计
    @media (max-width: 768px) {
        .image-list .image-item {
            flex-direction: column;
            align-items: stretch;
            
            .image-preview {
                width: 100%;
                height: 200px;
            }
            
            .image-actions {
                flex-direction: row;
                justify-content: center;
            }
        }
    }
}
</style>