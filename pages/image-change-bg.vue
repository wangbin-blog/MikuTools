<template>
    <div class="image-change-bg">
        <div class="content">
        <nya-container title="图片背景色替换工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片背景色替换工具，支持将图片背景替换为纯色、渐变色或透明背景，实时预览效果。</p>
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
                        🎨
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPEG、PNG、WebP 格式，支持透明背景输出</p>
                    </div>
                </div>
            </div>

        </nya-container>
        
            <!-- 控制面板 -->
            <nya-container v-if="imageSrc" title="背景设置" class="mb-15">
                <div class="bg-controls">
                    <div class="control-group">
                        <label>背景类型</label>
                        <nya-select
                            v-model="bgType"
                            :items="bgTypeOptions"
                        />
                    </div>

                    <!-- 纯色背景 -->
                    <div v-if="bgType === 'solid'" class="control-group">
                        <label>背景颜色</label>
                        <div class="color-picker-wrapper">
                            <input 
                                type="color" 
                                v-model="solidColor" 
                                class="color-input"
                            />
                            <span class="color-value">{{ solidColor }}</span>
                        </div>
                    </div>

                    <!-- 渐变背景 -->
                    <div v-if="bgType === 'gradient'" class="control-group">
                        <label>渐变类型</label>
                        <nya-select
                            v-model="gradientType"
                            :items="gradientTypeOptions"
                        />
                    </div>
                    
                    <div v-if="bgType === 'gradient'" class="control-group">
                        <label>起始颜色</label>
                        <div class="color-picker-wrapper">
                            <input 
                                type="color" 
                                v-model="gradientStart" 
                                class="color-input"
                            />
                            <span class="color-value">{{ gradientStart }}</span>
                        </div>
                    </div>

                    <div v-if="bgType === 'gradient'" class="control-group">
                        <label>结束颜色</label>
                        <div class="color-picker-wrapper">
                            <input 
                                type="color" 
                                v-model="gradientEnd" 
                                class="color-input"
                            />
                            <span class="color-value">{{ gradientEnd }}</span>
                        </div>
                    </div>



                    <!-- 背景色容差 -->
                    <div class="control-group">
                        <label>背景色容差</label>
                        <client-only>
                            <vue-slider 
                                v-model="bgColorThreshold" 
                                :min="5" 
                                :max="100" 
                                :interval="1"
                            />
                        </client-only>
                        <span>{{ bgColorThreshold }}</span>
                    </div>

                    <!-- 透明度 -->
                    <div class="control-group">
                        <label>背景透明度</label>
                        <client-only>
                            <vue-slider 
                                v-model="bgOpacity" 
                                :min="0" 
                                :max="1" 
                                :interval="0.1"
                            />
                        </client-only>
                        <span>{{ Math.round(bgOpacity * 100) }}%</span>
                    </div>

                    <!-- 边缘平滑 -->
                    <div class="control-group">
                        <label>边缘平滑</label>
                        <nya-checkbox
                            v-model="edgeSmooth"
                            label="启用边缘平滑处理"
                        />
                    </div>

                    <div v-if="edgeSmooth" class="control-group">
                        <label>平滑强度</label>
                        <client-only>
                            <vue-slider 
                                v-model="edgeSmoothStrength" 
                                :min="1" 
                                :max="10" 
                                :interval="1"
                            />
                        </client-only>
                        <span>{{ edgeSmoothStrength }}</span>
                    </div>

                    <!-- 输出设置 -->
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
                            @click="resetBg"
                        >
                            🔄 重置背景
                        </button>
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-success"
                            @click="applyBackground"
                        >
                            ✓ 应用背景
                        </button>
                    </div>
                </div>
            </nya-container>

            <!-- 图片预览区域 -->
            <nya-container v-if="imageSrc" title="预览效果">
                <div class="preview-container">
                    <div class="preview-wrapper">
                        <div class="image-wrapper">
                            <img 
                                ref="imageRef"
                                :src="processedImage || imageSrc" 
                                alt="待处理图片"
                                class="preview-image"
                            />
                        </div>
                    </div>
                    <div class="preview-info">
                        <p>原始尺寸: {{ originalWidth }} × {{ originalHeight }} px</p>
                        <p>背景类型: {{ bgTypeText }}</p>
                        <p v-if="bgType === 'solid'">背景颜色: {{ solidColor }}</p>
                        <p v-if="bgType === 'gradient'">渐变: {{ gradientStart }} → {{ gradientEnd }}</p>
                        <p>透明度: {{ Math.round(bgOpacity * 100) }}%</p>
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
                        <li><strong>背景替换：</strong>支持纯色、渐变、透明背景替换</li>
                        <li><strong>实时预览：</strong>所有操作都能实时预览效果</li>
                        <li><strong>透明度调节：</strong>支持背景透明度调整</li>
                        <li><strong>边缘平滑：</strong>智能边缘处理，让过渡更自然</li>
                        <li><strong>格式支持：</strong>支持输出为JPEG、PNG、WebP格式</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>拖拽或点击上传图片</li>
                        <li>选择背景类型（纯色/渐变/透明）</li>
                        <li>调整颜色和透明度参数</li>
                        <li>启用边缘平滑获得更好效果</li>
                        <li>完成后点击下载保存处理后的图片</li>
                        <li>PNG格式支持透明背景输出</li>
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
    name: 'ImageChangeBg',
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
            outputFormat: 'image/png',
            quality: 0.9,
            isDragOver: false,
            
            // 背景设置
            bgType: 'solid',
            solidColor: '#ffffff',
            gradientType: 'linear',
            gradientStart: '#ff6b6b',
            gradientEnd: '#4ecdc4',
            bgOpacity: 1,
            edgeSmooth: false,
            edgeSmoothStrength: 5,
            bgColorThreshold: 30,
            
            // 图片尺寸
            originalWidth: 0,
            originalHeight: 0,
            
            bgTypeOptions: {
                'solid': '纯色背景',
                'gradient': '渐变背景',
                'transparent': '透明背景'
            },
            gradientTypeOptions: {
                'linear': '线性渐变',
                'radial': '径向渐变'
            },
            formatOptions: {
                'image/jpeg': 'JPEG',
                'image/png': 'PNG',
                'image/webp': 'WebP'
            }
        };
    },
    computed: {
        bgTypeText() {
            return this.bgTypeOptions[this.bgType];
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
                this.originalImage = img;
                this.updatePreview(); // 图片加载完成后自动应用背景替换
            };
            img.src = src;
        },
        handleBgTypeChange() {
            if (this.bgType === 'transparent') {
                this.outputFormat = 'image/png'; // 透明背景强制使用PNG
            }
        },
        updatePreview() {
            if (!this.originalImage) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.originalWidth;
            canvas.height = this.originalHeight;
            
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 先绘制背景
            if (this.bgType === 'solid') {
                const r = parseInt(this.solidColor.slice(1, 3), 16);
                const g = parseInt(this.solidColor.slice(3, 5), 16);
                const b = parseInt(this.solidColor.slice(5, 7), 16);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.bgOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (this.bgType === 'gradient') {
                let gradient;
                const startR = parseInt(this.gradientStart.slice(1, 3), 16);
                const startG = parseInt(this.gradientStart.slice(3, 5), 16);
                const startB = parseInt(this.gradientStart.slice(5, 7), 16);
                const endR = parseInt(this.gradientEnd.slice(1, 3), 16);
                const endG = parseInt(this.gradientEnd.slice(3, 5), 16);
                const endB = parseInt(this.gradientEnd.slice(5, 7), 16);
                
                const startColor = `rgba(${startR}, ${startG}, ${startB}, ${this.bgOpacity})`;
                const endColor = `rgba(${endR}, ${endG}, ${endB}, ${this.bgOpacity})`;
                
                if (this.gradientType === 'linear') {
                    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                } else {
                    gradient = ctx.createRadialGradient(
                        canvas.width / 2, canvas.height / 2, 0,
                        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
                    );
                }
                
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1, endColor);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else if (this.bgType === 'transparent') {
                // 透明背景 - 使用网格样式
                const patternCanvas = document.createElement('canvas');
                const patternCtx = patternCanvas.getContext('2d');
                patternCanvas.width = 20;
                patternCanvas.height = 20;
                
                patternCtx.fillStyle = '#f0f0f0';
                patternCtx.fillRect(0, 0, 10, 10);
                patternCtx.fillRect(10, 10, 10, 10);
                patternCtx.fillStyle = '#ffffff';
                patternCtx.fillRect(10, 0, 10, 10);
                patternCtx.fillRect(0, 10, 10, 10);
                
                const pattern = ctx.createPattern(patternCanvas, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            // 使用像素级背景替换
            this.replaceBackgroundWithPixelProcessing(ctx, canvas);
            
            this.processedImage = canvas.toDataURL(this.outputFormat, this.quality);
        },
        resetBg() {
            this.bgType = 'solid';
            this.solidColor = '#ffffff';
            this.gradientStart = '#ff6b6b';
            this.gradientEnd = '#4ecdc4';
            this.bgOpacity = 1;
            this.bgColorThreshold = 30;
            this.edgeSmooth = false;
            this.edgeSmoothStrength = 5;
            this.outputFormat = 'image/png';
            this.updatePreview();
        },
        applyBackground() {
            this.updatePreview();
            this.$noty.success('背景色应用成功！');
        },
        replaceBackgroundWithPixelProcessing(ctx, canvas) {
            // 创建临时canvas来处理原图
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            // 绘制原图到临时canvas
            tempCtx.drawImage(this.originalImage, 0, 0);
            
            // 获取像素数据
            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            
            // 检测背景色（使用边缘像素作为参考）
            const bgColor = this.detectBackgroundColor(pixels, canvas.width, canvas.height);
            
            // 根据背景类型处理每个像素
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const index = (y * canvas.width + x) * 4;
                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];
                    const a = pixels[index + 3];
                    
                    // 如果像素接近背景色，则替换为背景
                    if (this.isSimilarColor(r, g, b, bgColor.r, bgColor.g, bgColor.b)) {
                        if (this.bgType === 'transparent') {
                            // 透明背景 - 设置alpha为0
                            pixels[index + 3] = 0;
                        } else if (this.bgType === 'solid') {
                            // 纯色背景
                            const solidR = parseInt(this.solidColor.slice(1, 3), 16);
                            const solidG = parseInt(this.solidColor.slice(3, 5), 16);
                            const solidB = parseInt(this.solidColor.slice(5, 7), 16);
                            
                            pixels[index] = solidR;
                            pixels[index + 1] = solidG;
                            pixels[index + 2] = solidB;
                            pixels[index + 3] = Math.round(a * this.bgOpacity);
                        } else if (this.bgType === 'gradient') {
                            // 渐变背景
                            const gradientColor = this.getGradientColorAt(x, y, canvas.width, canvas.height);
                            pixels[index] = gradientColor.r;
                            pixels[index + 1] = gradientColor.g;
                            pixels[index + 2] = gradientColor.b;
                            pixels[index + 3] = Math.round(a * this.bgOpacity);
                        }
                    }
                }
            }
            
            // 应用处理后的像素数据
            ctx.putImageData(imageData, 0, 0);
        },
        
        detectBackgroundColor(pixels, width, height) {
            // 采样边缘像素来检测背景色
            const samples = [];
            
            // 采样顶部和底部边缘
            for (let x = 0; x < width; x += 10) {
                samples.push(this.getPixelColor(pixels, x, 0, width));
                samples.push(this.getPixelColor(pixels, x, height - 1, width));
            }
            
            // 采样左侧和右侧边缘
            for (let y = 0; y < height; y += 10) {
                samples.push(this.getPixelColor(pixels, 0, y, width));
                samples.push(this.getPixelColor(pixels, width - 1, y, width));
            }
            
            // 找出最常见的颜色作为背景色
            return this.findMostCommonColor(samples);
        },
        
        getPixelColor(pixels, x, y, width) {
            const index = (y * width + x) * 4;
            return {
                r: pixels[index],
                g: pixels[index + 1],
                b: pixels[index + 2],
                a: pixels[index + 3]
            };
        },
        
        findMostCommonColor(colors) {
            const colorMap = new Map();
            
            colors.forEach(color => {
                if (color.a > 0) { // 只考虑不透明像素
                    const key = `${color.r},${color.g},${color.b}`;
                    colorMap.set(key, (colorMap.get(key) || 0) + 1);
                }
            });
            
            let maxCount = 0;
            let mostCommon = colors[0] || { r: 255, g: 255, b: 255 };
            
            colorMap.forEach((count, key) => {
                if (count > maxCount) {
                    maxCount = count;
                    const [r, g, b] = key.split(',').map(Number);
                    mostCommon = { r, g, b };
                }
            });
            
            return mostCommon;
        },
        
        isSimilarColor(r1, g1, b1, r2, g2, b2) {
            const distance = Math.sqrt(
                Math.pow(r1 - r2, 2) + 
                Math.pow(g1 - g2, 2) + 
                Math.pow(b1 - b2, 2)
            );
            return distance < this.bgColorThreshold;
        },
        
        getGradientColorAt(x, y, width, height) {
            const startR = parseInt(this.gradientStart.slice(1, 3), 16);
            const startG = parseInt(this.gradientStart.slice(3, 5), 16);
            const startB = parseInt(this.gradientStart.slice(5, 7), 16);
            const endR = parseInt(this.gradientEnd.slice(1, 3), 16);
            const endG = parseInt(this.gradientEnd.slice(3, 5), 16);
            const endB = parseInt(this.gradientEnd.slice(5, 7), 16);
            
            let ratio;
            if (this.gradientType === 'linear') {
                ratio = (x + y) / (width + height);
            } else {
                const centerX = width / 2;
                const centerY = height / 2;
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                const maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
                ratio = Math.min(distance / maxDistance, 1);
            }
            
            return {
                r: Math.round(startR + (endR - startR) * ratio),
                g: Math.round(startG + (endG - startG) * ratio),
                b: Math.round(startB + (endB - startB) * ratio)
            };
        },
        
        downloadImage() {
            if (!this.processedImage) return;
            
            const extension = this.outputFormat.split('/')[1];
            const fileName = `bg_changed_${this.fileName.split('.')[0]}.${extension}`;
            createDownload(this.processedImage, fileName);
        }
    }
};
</script>

<style lang="scss" scoped>
.image-change-bg {
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

    .bg-controls {
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

            .color-picker-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;

                .color-input {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .color-value {
                    font-family: monospace;
                    font-size: 14px;
                    color: var(--text-color);
                    background: var(--bg-color-secondary);
                    padding: 4px 8px;
                    border-radius: 4px;
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

        .preview-wrapper {
            margin-bottom: 15px;
            border-radius: 8px;
            overflow: hidden;
            display: inline-block;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .image-wrapper {
            display: inline-block;
            padding: 0;
            margin: 0;
        }

        .preview-image {
            max-width: 100%;
            max-height: 500px;
            display: block;
        }

        .preview-info {
            margin-top: 15px;
            
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
        .bg-controls {
            grid-template-columns: 1fr;
        }
    }
}
</style>