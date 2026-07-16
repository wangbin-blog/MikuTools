<template>
    <div class="image-to-pdf">
        <div class="content">
        <nya-container title="图片转PDF">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线图片转PDF工具，支持将多张图片合并转换为PDF文件。支持JPG、PNG、WebP等常见图片格式，可调整页面大小和方向。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    @change="handleFilesChange"
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
                        📄
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽图片到此处上传</p>
                        <p class="upload-hint">支持 JPG、PNG、WebP 格式，可多选</p>
                    </div>
                </div>
            </div>

        </nya-container>
            <!-- 设置区域 -->
            <nya-container v-if="files.length > 0" title="转换设置" class="mb-15">
                <div class="pdf-settings">
                    <div class="setting-row">
                        <div class="setting-item">
                            <label>页面大小</label>
                            <nya-select v-model="settings.pageSize" :items="pageOptions" fullwidth>                               
                            </nya-select>
                        </div>

                        <div class="setting-item">
                            <label>页面方向</label>
                            <nya-select v-model="settings.orientation" :items="orientationOptions" fullwidth>
                            </nya-select>
                        </div>
                    </div>

                    <div class="setting-row">
                        <div class="setting-item">
                            <label>图片间距</label>
                            <client-only>
                                <vue-slider 
                                    v-model="settings.margin" 
                                    :min="0" 
                                    :max="50" 
                                    :interval="1"
                                    :tooltip-formatter="val => val + 'mm'"
                                />
                            </client-only>
                            <span>{{ settings.margin }}mm</span>
                        </div>

                        <div class="setting-item">
                            <label>图片质量</label>
                            <client-only>
                                <vue-slider 
                                    v-model="settings.quality" 
                                    :min="1" 
                                    :max="10" 
                                    :interval="1"
                                    :tooltip-formatter="val => Math.round(val * 10) + '%'"
                                />
                            </client-only>
                            <span>{{ Math.round(settings.quality * 10) }}%</span>
                        </div>
                    </div>

                    <div class="setting-group">
                        <nya-checkbox v-model="settings.fitToPage" label="图片适应页面大小">
                            
                        </nya-checkbox>
                        <nya-checkbox v-model="settings.keepAspectRatio" label="保持图片比例">
                            
                        </nya-checkbox>
                    </div>

                    <div class="setting-group">
                    </div>
                </div>

                <div class="action-buttons">
                    <button 
                        type="button" 
                        class="btn-primary"
                        :disabled="loading || files.length === 0"
                        @click="convertToPDF"
                    >
                        {{ loading ? '⏳ 转换中...' : '📄 开始转换' }}
                    </button>
                    <button 
                        type="button" 
                        class="btn-danger"
                        @click="clearFiles"
                    >
                        🗑️ 清空图片
                    </button>
                </div>
            </nya-container>

            <!-- 文件列表 -->
            <nya-container v-if="files.length > 0" title="图片列表" class="mb-15">
                <div class="files-list">
                    <div 
                        v-for="(file, index) in files" 
                        :key="index"
                        class="file-item"
                    >
                        <div class="file-preview">
                            <img :src="file.preview" :alt="file.name">
                        </div>
                        <div class="file-info">
                            <span class="file-name">{{ file.name }}</span>
                            <span class="file-size">{{ formatFileSize(file.size) }}</span>
                        </div>
                        <button 
                            type="button" 
                            class="remove-btn"
                            @click="removeFile(index)"
                        >
                            ❌
                        </button>
                    </div>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>多图合并：</strong>支持将多张图片合并为一个PDF文件</li>
                        <li><strong>格式支持：</strong>支持JPG、PNG、WebP等常见图片格式</li>
                        <li><strong>页面设置：</strong>可选择A4、A3等多种页面大小</li>
                        <li><strong>方向调整：</strong>支持纵向、横向页面方向</li>
                        <li><strong>本地处理：</strong>所有操作在浏览器本地完成，保护隐私</li>
                        <li><strong>一键下载：</strong>转换完成后可直接下载PDF文件</li>
                    </ul>

                    <h4>使用场景：</h4>
                    <ul>
                        <li><strong>文档整理：</strong>将多张图片整理成标准PDF文档</li>
                        <li><strong>证件归档：</strong>将身份证、驾驶证等证件图片转为PDF</li>
                        <li><strong>合同扫描：</strong>将扫描的合同图片合并为PDF文件</li>
                        <li><strong>相册制作：</strong>将照片整理成电子相册PDF</li>
                    </ul>

                    <h4>使用步骤：</h4>
                    <ul>
                        <li>1. 上传需要转换的图片文件（可多选）</li>
                        <li>2. 根据需要调整页面大小、方向等设置</li>
                        <li>3. 点击"开始转换"按钮</li>
                        <li>4. 等待转换完成后自动下载PDF文件</li>
                    </ul>
                </div>
            </nya-container>
    
        </div>
        
</div>
</template>

<script>

import 'vue-slider-component/theme/default.css';
let VueSlider;
if (process.browser) {
    VueSlider = require('vue-slider-component');
}
export default {
    name: 'ImageToPDF',
    head() {
        return this.$store.state.currentTool.head;
    },
    mounted() {
        this.loadJsPDF();
    },
    components: {
        VueSlider
    },
    data() {
        return {
            files: [],
            settings: {
                pageSize: 'auto',
                orientation: 'auto',
                margin: 10,
                quality: 8,
                fitToPage: true,
                keepAspectRatio: true
            },
            loading: false,
            isDragOver: false,
            pageOptions: {
                'a3': 'A3 (297×420mm)',
                'a5': 'A5 (148×210mm)',
                'letter': 'Letter (8.5×11英寸)',
                'legal': 'Legal (8.5×14英寸)',
                'auto': '自适应图片大小'
            },
            orientationOptions: {
                'portrait': '纵向',
                'landscape': '横向',
                'auto': '自动'
            }
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        loadJsPDF() {
            if (window.jspdf) return;
            
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                window.jspdf = window.jspdf || {};
            };
            document.head.appendChild(script);
        },
        handleFilesChange(e) {
            const files = Array.from(e.target.files);
            this.processFiles(files);
        },
        handleDrop(e) {
            const files = Array.from(e.dataTransfer.files);
            this.processFiles(files);
            this.isDragOver = false;
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        processFiles(fileList) {
            const imageFiles = fileList.filter(file => 
                file.type.startsWith('image/')
            );
            
            if (imageFiles.length === 0) {
                this.$noty.error('请上传图片格式文件');
                return;
            }

            imageFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = e => {
                    this.files.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: e.target.result,
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            });
        },
        removeFile(index) {
            this.files.splice(index, 1);
        },
        clearFiles() {
            this.files = [];
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        async convertToPDF() {
            if (this.files.length === 0) {
                this.$noty.error('请先上传图片');
                return;
            }

            // 确保jsPDF已加载
            if (!window.jspdf || !window.jspdf.jsPDF) {
                this.$noty.error('PDF库加载失败，请刷新页面重试');
                return;
            }

            this.loading = true;

            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: this.settings.orientation === 'auto' ? 
                        (this.settings.pageSize === 'a4' || this.settings.pageSize === 'letter' ? 'portrait' : 'landscape') : 
                        this.settings.orientation,
                    unit: 'mm',
                    format: this.settings.pageSize === 'auto' ? 'a4' : this.settings.pageSize
                });

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = this.settings.margin;

                for (let i = 0; i < this.files.length; i++) {
                    if (i > 0) {
                        pdf.addPage();
                    }

                    const img = new Image();
                    img.src = this.files[i].preview;
                    
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });

                    const imgWidth = img.width;
                    const imgHeight = img.height;
                    const imgRatio = imgWidth / imgHeight;

                    let drawWidth, drawHeight;
                    
                    if (this.settings.fitToPage) {
                        const maxWidth = pageWidth - 2 * margin;
                        const maxHeight = pageHeight - 2 * margin;
                        
                        if (this.settings.keepAspectRatio) {
                            if (maxWidth / maxHeight > imgRatio) {
                                drawHeight = maxHeight;
                                drawWidth = drawHeight * imgRatio;
                            } else {
                                drawWidth = maxWidth;
                                drawHeight = drawWidth / imgRatio;
                            }
                        } else {
                            drawWidth = maxWidth;
                            drawHeight = maxHeight;
                        }
                    } else {
                        drawWidth = imgWidth * 0.264583; // px to mm
                        drawHeight = imgHeight * 0.264583;
                    }

                    const x = (pageWidth - drawWidth) / 2;
                    const y = (pageHeight - drawHeight) / 2;

                    pdf.addImage(
                        img,
                        this.files[i].type.split('/')[1].toUpperCase(),
                        x,
                        y,
                        drawWidth,
                        drawHeight
                    );
                }

                const fileName = `images_to_pdf_${new Date().getTime()}.pdf`;
                pdf.save(fileName);

                this.$noty.success('PDF文件已生成并下载');

            } catch (error) {
                console.error('转换失败:', error);
                this.$noty.error('图片转换PDF失败，请重试');
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style lang="scss">
.image-to-pdf {
    .content {
        min-width: 0;
    }
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

    .pdf-settings {
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
            }
        }

        .setting-group {
            margin-bottom: 15px;
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
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

    .files-list {
        .file-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #fafafa;
            
            &:hover {
                background: #f5f5f5;
            }
            
            .file-preview {
                width: 60px;
                height: 60px;
                margin-right: 15px;
                border-radius: 4px;
                overflow: hidden;
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            
            .file-info {
                flex: 1;
                
                .file-name {
                    display: block;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 5px;
                }
                
                .file-size {
                    display: block;
                    font-size: 14px;
                    color: #666;
                }
            }
            
            .remove-btn {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                opacity: 0.7;
                
                &:hover {
                    opacity: 1;
                }
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