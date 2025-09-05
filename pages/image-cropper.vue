<template>
    <div class="image-cropper">
        <nya-container title="图片裁剪工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片裁剪工具，支持自由裁剪、固定比例裁剪，可实时预览裁剪效果。</p>
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
                        ✂️
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPEG、PNG、WebP 格式</p>
                    </div>
                </div>
            </div>


        </nya-container>
        
            <!-- 裁剪控制面板 -->
            <nya-container v-if="imageSrc" title="裁剪控制" class="mb-15">
                <div class="cropper-controls">
                    <div class="control-group">
                        <label>裁剪比例</label>
                        <nya-select
                            v-model="aspectRatio"
                            :items="ratioOptions"
                            @change="updateAspectRatio"
                        />
                    </div>
                    <div class="control-group">
                        <label>裁剪质量</label>
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
                    <div class="control-group">
                        <nya-checkbox
                            v-model="maintainAspectRatio"
                            label="锁定比例"
                        />
                    </div>
                    <div class="control-group">
                        <label>输出格式</label>
                        <nya-select
                            v-model="outputFormat"
                            :items="formatOptions"
                        />
                    </div>
                </div>
                <div class="control-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-primary"
                        @click="resetCrop"
                    >
                        🔄 重置裁剪
                    </button>
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-success"
                        @click="rotateImage"
                    >
                        🔄 旋转90°
                    </button>
                </div>
            </nya-container>

            <!-- 裁剪区域 -->
            <nya-container v-if="imageSrc" title="图片裁剪">
                <div class="cropper-container">
                    <div class="cropper-wrapper">
                        <img 
                            ref="imageRef"
                            :src="imageSrc" 
                            alt="待裁剪图片"
                            class="cropper-image"
                            :style="imageStyle"
                        />
                        <div 
                            class="crop-overlay"
                            :style="overlayStyle"
                            @mousedown="startDrag"
                            @mousemove="onDrag"
                            @mouseup="endDrag"
                            @mouseleave="endDrag"
                        >
                            <div 
                                class="crop-box"
                                :style="cropBoxStyle"
                                @mousedown.stop="startResize"
                            >
                                <div class="resize-handles">
                                    <div class="resize-handle resize-handle-nw"></div>
                                    <div class="resize-handle resize-handle-ne"></div>
                                    <div class="resize-handle resize-handle-sw"></div>
                                    <div class="resize-handle resize-handle-se"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="preview-section">
                        <h4>预览</h4>
                        <div class="preview-container" :style="previewContainerStyle">
                            <img 
                                :src="previewSrc" 
                                alt="预览"
                                class="preview-image"
                                v-if="previewSrc"
                            />
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-info"
                        @click="cropImage"
                        :disabled="!canCrop"
                    >
                        ✂️ 开始裁剪
                    </button>
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-success"
                        @click="downloadImage"
                        :disabled="!croppedImage"
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
                        <li><strong>自由裁剪：</strong>可自由调整裁剪区域大小和位置</li>
                        <li><strong>固定比例：</strong>支持多种预设比例裁剪</li>
                        <li><strong>实时预览：</strong>裁剪时实时显示预览效果</li>
                        <li><strong>旋转支持：</strong>支持图片90度旋转</li>
                        <li><strong>格式转换：</strong>支持输出格式转换</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>拖拽或点击上传图片</li>
                        <li>拖动裁剪框调整位置和大小</li>
                        <li>使用角落的拖拽点调整大小</li>
                        <li>选择固定比例进行精确裁剪</li>
                        <li>完成后点击下载保存裁剪图片</li>
                    </ul>
                </div>
            </nya-container>
    </div>
</template>

<script>
import createDownload from '~/utils/createDownload.js';
import 'vue-slider-component/theme/default.css';
let VueSlider;
if (process.browser) {
    VueSlider = require('vue-slider-component');
}

export default {
    name: 'ImageCropper',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        VueSlider
    },
    data() {
        return {
            imageSrc: '',
            fileName: '',
            aspectRatio: 'free',
            quality: 0.9,
            maintainAspectRatio: false,
            outputFormat: 'image/jpeg',
            isDragOver: false,
            
            // 裁剪相关
            cropBox: {
                x: 0,
                y: 0,
                width: 200,
                height: 200
            },
            imageSize: {
                width: 0,
                height: 0
            },
            isDragging: false,
            isResizing: false,
            dragStart: { x: 0, y: 0 },
            cropStart: { x: 0, y: 0, width: 0, height: 0 },
            
            // 结果
            croppedImage: null,
            previewSrc: '',
            
            ratioOptions: {'free':'自由裁剪','1':'1:1 (正方形)','4/3':'4:3 (标准)','16/9':'16:9 (宽屏)','3/2':'3:2 (相机)','2/3':'2:3 (人像)','210/297':'A4 (210:297)'},
            formatOptions: {  'image/jpeg' :'JPEG','image/png' :'PNG','image/webp' :'WebP'}
        };
    },
    computed: {
        imageStyle() {
            return {
                maxWidth: '100%',
                maxHeight: '500px',
                display: 'block'
            };
        },
        overlayStyle() {
            return {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: this.isDragging ? 'grabbing' : 'grab'
            };
        },
        cropBoxStyle() {
            return {
                position: 'absolute',
                left: this.cropBox.x + 'px',
                top: this.cropBox.y + 'px',
                width: this.cropBox.width + 'px',
                height: this.cropBox.height + 'px',
                border: '2px dashed var(--theme-color)',
                backgroundColor: 'rgba(var(--theme-color-rgb), 0.1)',
                cursor: 'move'
            };
        },
        previewContainerStyle() {
            return {
                width: '200px',
                height: '200px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        },
        canCrop() {
            return this.imageSrc && this.cropBox.width > 0 && this.cropBox.height > 0;
        }
    },
    methods: {
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
                this.getImageSize(e.target.result);
            };
            reader.readAsDataURL(file);
        },
        getImageSize(src) {
            const img = new Image();
            img.onload = () => {
                this.imageSize.width = img.width;
                this.imageSize.height = img.height;
                this.resetCrop();
                this.updatePreview();
            };
            img.src = src;
        },
        resetCrop() {
            const minSize = Math.min(this.imageSize.width, this.imageSize.height);
            this.cropBox = {
                x: (this.imageSize.width - minSize) / 2,
                y: (this.imageSize.height - minSize) / 2,
                width: minSize,
                height: minSize
            };
            this.updatePreview();
        },
        updateAspectRatio() {
            if (this.aspectRatio !== 'free' && this.maintainAspectRatio) {
                const newHeight = this.cropBox.width / this.aspectRatio;
                if (newHeight <= this.imageSize.height) {
                    this.cropBox.height = newHeight;
                } else {
                    this.cropBox.width = this.imageSize.height * this.aspectRatio;
                    this.cropBox.height = this.imageSize.height;
                }
            }
            this.updatePreview();
        },
        startDrag(e) {
            this.isDragging = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
            this.cropStart = { ...this.cropBox };
        },
        onDrag(e) {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;
            
            this.cropBox.x = Math.max(0, Math.min(this.cropStart.x + deltaX, this.imageSize.width - this.cropBox.width));
            this.cropBox.y = Math.max(0, Math.min(this.cropStart.y + deltaY, this.imageSize.height - this.cropBox.height));
            
            this.updatePreview();
        },
        endDrag() {
            this.isDragging = false;
            this.isResizing = false;
        },
        startResize(e) {
            this.isResizing = true;
            this.dragStart = { x: e.clientX, y: e.clientY };
            this.cropStart = { ...this.cropBox };
            e.stopPropagation();
        },
        cropImage() {
            if (!this.canCrop) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = this.cropBox.width;
                canvas.height = this.cropBox.height;
                
                ctx.drawImage(
                    img,
                    this.cropBox.x, this.cropBox.y,
                    this.cropBox.width, this.cropBox.height,
                    0, 0,
                    this.cropBox.width, this.cropBox.height
                );
                
                this.croppedImage = canvas.toDataURL(this.outputFormat, this.quality);
                this.previewSrc = this.croppedImage;
                this.$noty.success('图片裁剪成功！');
            };
            
            img.src = this.imageSrc;
        },
        rotateImage() {
            if (!this.imageSrc) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.height;
                canvas.height = img.width;
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                
                this.imageSrc = canvas.toDataURL();
                this.getImageSize(this.imageSrc);
            };
            
            img.src = this.imageSrc;
        },
        downloadImage() {
            if (!this.croppedImage) return;
            
            const extension = this.outputFormat.split('/')[1];
            const fileName = `cropped_${this.fileName.split('.')[0]}.${extension}`;
            createDownload(this.croppedImage, fileName);
        },
        updatePreview() {
            if (!this.imageSrc) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const previewSize = 200;
                const scale = Math.min(previewSize / this.cropBox.width, previewSize / this.cropBox.height);
                
                canvas.width = previewSize;
                canvas.height = previewSize;
                
                ctx.drawImage(
                    img,
                    this.cropBox.x, this.cropBox.y,
                    this.cropBox.width, this.cropBox.height,
                    0, 0,
                    this.cropBox.width * scale, this.cropBox.height * scale
                );
                
                this.previewSrc = canvas.toDataURL();
            };
            
            img.src = this.imageSrc;
        }
    },
    watch: {
        aspectRatio(newVal) {
            if (newVal !== 'free' && this.maintainAspectRatio) {
                this.updateAspectRatio();
            }
        },
        maintainAspectRatio(newVal) {
            if (newVal && this.aspectRatio !== 'free') {
                this.updateAspectRatio();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.image-cropper {
    .tool-info {
        h3 {
            margin-bottom: 10px;
            color: var(--theme-color);
        }
        p {
            color: var(--text-color);
            line-height: 1.6;
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

    .cropper-controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;

        .control-group {
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: var(--text-color);
            }

            .vue-slider {
                margin: 10px 0;
            }

            span {
                display: inline-block;
                margin-left: 10px;
                font-weight: bold;
                color: var(--theme-color);
            }
        }
    }

    .control-buttons {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        justify-content: center;
    }

    .cropper-container {
        display: grid;
        grid-template-columns: 1fr 250px;
        gap: 20px;
        margin-bottom: 20px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .cropper-wrapper {
            position: relative;
            display: inline-block;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;

            .cropper-image {
                max-width: 100%;
                max-height: 500px;
                display: block;
            }

            .resize-handles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;

                .resize-handle {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: var(--theme-color);
                    border: 1px solid white;
                    pointer-events: auto;
                    cursor: nwse-resize;

                    &.resize-handle-nw { top: -5px; left: -5px; cursor: nw-resize; }
                    &.resize-handle-ne { top: -5px; right: -5px; cursor: ne-resize; }
                    &.resize-handle-sw { bottom: -5px; left: -5px; cursor: sw-resize; }
                    &.resize-handle-se { bottom: -5px; right: -5px; cursor: se-resize; }
                }
            }
        }

        .preview-section {
            h4 {
                color: var(--theme-color);
                margin-bottom: 10px;
            }

            .preview-container {
                width: 200px;
                height: 200px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--bg-color);

                .preview-image {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
            }
        }
    }

    .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
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
}
</style>