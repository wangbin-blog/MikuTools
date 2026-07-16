<template>
    <div class="image-converter">
        <div class="content">
        <nya-container title="图片格式转换工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片格式转换工具，支持多种格式之间的相互转换，包括 JPG、PNG、WebP、GIF、WBMP、XBM 等格式，保持高质量输出。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
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
                        <p class="upload-hint">支持 JPG、PNG、WebP、GIF、WBMP、XBM 格式</p>
                        <p class="upload-hint">支持批量上传和转换</p>
                    </div>
                </div>
            </div>

        </nya-container>
        
            <!-- 转换设置 -->
            <nya-container v-if="files.length > 0" title="转换设置" class="mb-15">
                <div class="converter-settings">
                    <div class="setting-group">
                        <label>目标格式</label>
                        <nya-select
                            v-model="targetFormat"
                            :items="formatOptions"
                        />
                    </div>
                    <div class="setting-group">
                        <label>输出质量</label>
                        <client-only>
                            <vue-slider 
                                v-model="quality" 
                                :min="0.1" 
                                :max="1" 
                                :interval="0.1"
                                :tooltip-formatter="val => Math.round(val * 100) + '%'"
                            />
                        </client-only>
                        <span>{{ Math.round(quality * 100) }}%</span>
                    </div>
                    <div class="setting-group">
                        <label>批量处理</label>
                        <nya-checkbox
                            v-model="batchProcess"
                            label="所有图片使用相同设置"
                        />
                    </div>
                </div>
                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-primary"
                        @click="convertAll"
                        :disabled="!canConvert"
                    >
                        🔄 开始转换
                    </button>
                    <button 
                        type="button" 
                        class="btn-danger"
                        @click="clearAll"
                    >
                        🗑️ 清空全部
                    </button>
                </div>
            </nya-container>

            <!-- 文件列表 -->
            <nya-container v-if="files.length > 0" title="文件列表" class="mb-15">
                <div class="file-list">
                    <div 
                        v-for="(file, index) in files" 
                        :key="index"
                        class="file-item"
                        :class="{ 'converting': file.status === 'converting', 'completed': file.status === 'completed', 'error': file.status === 'error' }"
                    >
                        <div class="file-info">
                            <div class="file-preview">
                                <img :src="file.preview" :alt="file.name" v-if="file.preview">
                                <div class="file-icon" v-else>{{ getFileIcon(file.type) }}</div>
                            </div>
                            <div class="file-details">
                                <div class="file-name">{{ file.name }}</div>
                                <div class="file-size">{{ formatFileSize(file.size) }}</div>
                                <div class="file-type">{{ file.type.toUpperCase() }}</div>
                            </div>
                        </div>
                        <div class="file-actions">
                            <div v-if="file.status === 'pending'" class="file-status">
                                等待转换
                            </div>
                            <div v-else-if="file.status === 'converting'" class="file-status">
                                <div class="loading-spinner"></div>
                                转换中...
                            </div>
                            <div v-else-if="file.status === 'completed'" class="file-status">
                                ✅ 转换完成
                                <button 
                                    type="button" 
                                    class="jwt-btn jwt-btn-success jwt-btn-sm"
                                    @click="downloadFile(index)"
                                >
                                    📥 下载
                                </button>
                            </div>
                            <div v-else-if="file.status === 'error'" class="file-status">
                                ❌ 转换失败
                                <button 
                                    type="button" 
                                    class="jwt-btn jwt-btn-warning jwt-btn-sm"
                                    @click="retryConvert(index)"
                                >
                                    🔄 重试
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="batch-actions" v-if="allCompleted">
                    <button 
                        type="button" 
                        class="jwt-btn jwt-btn-success"
                        @click="downloadAll"
                    >
                        📦 打包下载全部
                    </button>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>格式支持：</strong>支持 JPG、PNG、WebP、GIF、WBMP、XBM 格式相互转换</li>
                        <li><strong>批量处理：</strong>可一次性转换多张图片</li>
                        <li><strong>质量调节：</strong>可调整输出图片的质量和大小</li>
                        <li><strong>实时预览：</strong>转换前可预览图片效果</li>
                        <li><strong>一键下载：</strong>支持单个或批量下载转换后的图片</li>
                    </ul>

                    <h4>支持格式：</h4>
                    <ul>
                        <li><strong>JPG/JPEG：</strong>有损压缩，适合照片类图片</li>
                        <li><strong>PNG：</strong>无损压缩，支持透明度，适合图标和图形</li>
                        <li><strong>WebP：</strong>Google开发，高压缩率，支持透明度</li>
                        <li><strong>GIF：</strong>支持动画，256色，适合简单动画</li>
                        <li><strong>WBMP：</strong>无线位图格式，黑白图像</li>
                        <li><strong>XBM：</strong>X窗口系统位图格式</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>拖拽或点击上传图片文件</li>
                        <li>选择目标输出格式和质量</li>
                        <li>点击"开始转换"处理图片</li>
                        <li>转换完成后可下载单个或全部文件</li>
                        <li>支持批量上传，提高工作效率</li>
                    </ul>
                </div>
            </nya-container>
    
        </div>
        
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
    name: 'ImageConverter',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        VueSlider
    },
    data() {
        return {
            files: [],
            targetFormat: 'image/png',
            quality: 0.9,
            batchProcess: true,
            isDragOver: false,
            formatOptions: {
                'image/jpeg': 'JPG/JPEG',
                'image/png': 'PNG',
                'image/webp': 'WebP',
                'image/gif': 'GIF',
                'image/wbmp': 'WBMP',
                'image/xbm': 'XBM'
            }
        };
    },
    computed: {
        canConvert() {
            return this.files.length > 0 && !this.files.some(f => f.status === 'converting');
        },
        allCompleted() {
            return this.files.length > 0 && this.files.every(f => f.status === 'completed');
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        handleFileSelect(e) {
            const selectedFiles = Array.from(e.target.files);
            this.addFiles(selectedFiles);
        },
        handleDrop(e) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            this.addFiles(droppedFiles);
            this.isDragOver = false;
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        addFiles(fileList) {
            const imageFiles = fileList.filter(file => file.type.startsWith('image/'));
            
            imageFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.files.push({
                        file: file,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: e.target.result,
                        status: 'pending',
                        result: null
                    });
                };
                reader.readAsDataURL(file);
            });
        },
        async convertAll() {
            for (let i = 0; i < this.files.length; i++) {
                if (this.files[i].status === 'pending' || this.files[i].status === 'error') {
                    await this.convertFile(i);
                }
            }
        },
        async convertFile(index) {
            const file = this.files[index];
            file.status = 'converting';
            
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = file.preview;
                });
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                // 处理透明度
                if (this.targetFormat === 'image/jpeg' || this.targetFormat === 'image/wbmp') {
                    // 为不透明格式添加白色背景
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);
                
                let mimeType = this.targetFormat;
                if (this.targetFormat === 'image/xbm') {
                    mimeType = 'image/x-xbitmap';
                }
                
                const dataUrl = canvas.toDataURL(mimeType, this.quality);
                
                this.files[index].status = 'completed';
                this.files[index].result = dataUrl;
                
                // 更新文件扩展名
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                const newExt = this.getExtension(this.targetFormat);
                this.files[index].convertedName = `${nameWithoutExt}.${newExt}`;
                
            } catch (error) {
                console.error('转换失败:', error);
                this.files[index].status = 'error';
                this.$noty.error(`文件 ${file.name} 转换失败`);
            }
        },
        getExtension(mimeType) {
            const extMap = {
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'image/gif': 'gif',
                'image/wbmp': 'wbm',
                'image/xbm': 'xbm'
            };
            return extMap[mimeType] || 'png';
        },
        downloadFile(index) {
            const file = this.files[index];
            if (file.result && file.convertedName) {
                createDownload(file.result, file.convertedName);
                this.$noty.success(`文件 ${file.convertedName} 下载成功`);
            }
        },
        downloadAll() {
            if (this.allCompleted) {
                this.files.forEach((file, index) => {
                    setTimeout(() => {
                        this.downloadFile(index);
                    }, index * 500); // 延迟下载避免浏览器限制
                });
                this.$noty.success('所有文件开始下载');
            }
        },
        clearAll() {
            this.files = [];
            this.$noty.success('已清空所有文件');
        },
        retryConvert(index) {
            this.convertFile(index);
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        getFileIcon(mimeType) {
            const iconMap = {
                'image/jpeg': '🖼️',
                'image/png': '🖼️',
                'image/webp': '🖼️',
                'image/gif': '🎞️',
                'image/wbmp': '⚫',
                'image/xbm': '⬜'
            };
            return iconMap[mimeType] || '📄';
        }
    }
};
</script>

<style scoped>
.image-converter {
    .content {
        min-width: 0;
    }
    
}


.upload-area {
    margin-bottom: 20px;
}

.upload-zone {
    border: 2px dashed var(--border-color);
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-color);
}

.upload-zone:hover {
    border-color: var(--theme-color);
    background: rgba(var(--theme-color-rgb), 0.05);
}

.upload-zone.drag-over {
    border-color: var(--theme-color);
    background: rgba(var(--theme-color-rgb), 0.1);
    transform: scale(1.02);
}

.upload-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.upload-text p {
    margin: 5px 0;
    color: var(--text-color);
}

.upload-hint {
    font-size: 14px;
    color: var(--text-color-secondary);
}

.converter-settings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.setting-group label {
    font-weight: 600;
    color: var(--text-color);
}

.action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background: var(--bg-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.file-item:hover {
    border-color: var(--theme-color);
    box-shadow: 0 2px 8px rgba(var(--theme-color-rgb), 0.1);
}

.file-item.converting {
    border-color: var(--theme-color);
    background: rgba(var(--theme-color-rgb), 0.05);
}

.file-item.completed {
    border-color: #52c41a;
    background: rgba(82, 196, 26, 0.05);
}

.file-item.error {
    border-color: #ff4d4f;
    background: rgba(255, 77, 79, 0.05);
}

.file-info {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
}

.file-preview {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    background: var(--bg-color-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-icon {
    font-size: 24px;
}

.file-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-weight: 600;
    color: var(--text-color);
    font-size: 14px;
}

.file-size, .file-type {
    font-size: 12px;
    color: var(--text-color-secondary);
}

.file-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.file-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--theme-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.batch-actions {
    margin-top: 20px;
    text-align: center;
}

.jwt-btn-sm {
    padding: 4px 8px;
    font-size: 12px;
    min-height: 28px;
}

.instructions {
    color: var(--text-color);
}

.instructions h4 {
    color: var(--theme-color);
    margin: 15px 0 10px 0;
}

.instructions ul {
    margin: 10px 0;
    padding-left: 20px;
}

.instructions li {
    margin: 5px 0;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .converter-settings {
        grid-template-columns: 1fr;
    }
    
    .file-item {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
    
    .file-info {
        flex-direction: column;
        text-align: center;
    }
    
    .file-actions {
        justify-content: center;
    }
}
</style>