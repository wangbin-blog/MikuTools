<template>
    <div class="pdf-to-image">
        <div class="content">
        <nya-container title="PDF转图片工具">
            <div class="tool-info mb-15">
                <h3>工具介绍</h3>
                <p>在线PDF转图片工具，支持将PDF文件转换为JPG、PNG等格式图片，可设置图片质量和输出格式。</p>
            </div>

            <!-- 上传区域 -->
            <div class="upload-area mb-15">
                <input
                    ref="fileInput"
                    type="file"
                    accept=".pdf"
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
                        📄
                    </div>
                    <div class="upload-text">
                        <p>点击或拖拽PDF文件到此处上传</p>
                        <p class="upload-hint">支持 PDF 格式，最大支持 50MB</p>
                    </div>
                </div>
            </div>

        </nya-container>
        
            <!-- PDF信息 -->
            <nya-container v-if="pdfFile" title="PDF信息" class="mb-15">
                <div class="pdf-info">
                    <div class="info-item">
                        <label>文件名：</label>
                        <span>{{ pdfFile.name }}</span>
                    </div>
                    <div class="info-item">
                        <label>文件大小：</label>
                        <span>{{ formatFileSize(pdfFile.size) }}</span>
                    </div>
                    <div class="info-item">
                        <label>总页数：</label>
                        <span>{{ totalPages }} 页</span>
                    </div>
                </div>
            </nya-container>

            <!-- 转换设置 -->
            <nya-container v-if="pdfFile" title="转换设置" class="mb-15">
                <div class="conversion-settings">
                    <div class="setting-group">
                        <label>输出格式</label>
                        <nya-select
                            v-model="outputFormat"
                            :items="formatOptions"
                        />
                    </div>
                    <div class="setting-group">
                        <label>图片质量</label>
                        <client-only>
                            <vue-slider 
                                v-model="imageQuality" 
                                :min="0.1" 
                                :max="1" 
                                :interval="0.1"
                            />
                        </client-only>
                        <span>{{ Math.round(imageQuality * 100) }}%</span>
                    </div>
                    <div class="setting-group">
                        <label>DPI设置</label>
                        <nya-select
                            v-model="dpiSetting"
                            :items="dpiOptions"
                        />
                    </div>
                    <div class="setting-group">
                        <label>页面范围</label>
                        <div class="page-range">
                            <nya-checkbox
                                v-model="convertAllPages"
                                label="转换所有页面"
                            />
                            <div v-if="!convertAllPages" class="range-input">
                                <nya-input 
                                    type="text" 
                                    v-model="pageRange"
                                    placeholder="支持格式: 1-3,5,7-9"
                                    class="nya-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="setting-buttons">
                    <button 
                        type="button" 
                        class="btn-primary"
                        @click="convertToImages"
                        :disabled="isConverting || !pdfFile"
                    >
                        {{ isConverting ? '转换中...' : '🔄 开始转换' }}
                    </button>
                    <button 
                        type="button" 
                        class="btn-danger"
                        @click="clearFile"
                    >
                        🗑️ 清除文件
                    </button>
                </div>
            </nya-container>

            <!-- 转换结果 -->
            <nya-container v-if="convertedImages.length > 0" title="转换结果" class="mb-15">
                <div class="conversion-results">
                    <div class="results-header">
                        <span>共转换 {{ convertedImages.length }} 张图片</span>
                        <button 
                            type="button" 
                            class="jwt-btn jwt-btn-success"
                            @click="downloadAllImages"
                        >
                            📦 打包下载
                        </button>
                    </div>
                    <div class="images-grid">
                        <div 
                            v-for="(image, index) in convertedImages" 
                            :key="index"
                            class="image-item"
                        >
                            <div class="image-container">
                                <img :src="image.dataUrl" :alt="`第${image.page}页`" />
                                <div class="image-info">
                                    <span>第 {{ image.page }} 页</span>
                                    <button 
                                        type="button" 
                                        class="jwt-btn jwt-btn-sm jwt-btn-info"
                                        @click="downloadSingleImage(image)"
                                    >
                                        📥 下载
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nya-container>

            <!-- 使用说明 -->
            <nya-container title="使用说明">
                <div class="instructions">
                    <h4>功能介绍：</h4>
                    <ul>
                        <li><strong>格式转换：</strong>支持将PDF转换为JPG、PNG格式图片</li>
                        <li><strong>质量调整：</strong>可自定义图片质量和DPI设置</li>
                        <li><strong>页面选择：</strong>支持转换所有页面或指定页面范围</li>
                        <li><strong>批量下载：</strong>支持单张下载或打包下载所有图片</li>
                        <li><strong>实时预览：</strong>转换后可预览每张图片效果</li>
                    </ul>

                    <h4>使用提示：</h4>
                    <ul>
                        <li>上传PDF文件（最大支持50MB）</li>
                        <li>选择输出格式（JPG或PNG）</li>
                        <li>调整图片质量和DPI设置</li>
                        <li>选择需要转换的页面范围</li>
                        <li>点击开始转换并下载结果</li>
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
    name: 'PdfToImage',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        VueSlider
    },
    data() {
        return {
            pdfFile: null,
            isDragOver: false,
            isConverting: false,
            totalPages: 0,
            outputFormat: 'image/jpeg',
            imageQuality: 0.9,
            dpiSetting: 150,
            convertAllPages: true,
            pageRange: '',
            convertedImages: [],
            formatOptions:{'image/jpeg':'JPG格式','image/png':'PNG格式'} ,
            dpiOptions:{'72':'72 DPI','150':'150 DPI','300':'300 DPI','600':'600 DPI'} 
        };
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        handleFileSelect(e) {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                if (file.size > 50 * 1024 * 1024) {
                    this.$noty.error('文件大小不能超过50MB');
                    return;
                }
                this.pdfFile = file;
                this.loadPdf();
            } else {
                this.$noty.error('请选择PDF文件');
            }
        },
        handleDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'application/pdf') {
                    if (file.size > 50 * 1024 * 1024) {
                        this.$noty.error('文件大小不能超过50MB');
                        return;
                    }
                    this.pdfFile = file;
                    this.loadPdf();
                } else {
                    this.$noty.error('请拖拽PDF文件');
                }
            }
            this.isDragOver = false;
        },
        handleDragOver() {
            this.isDragOver = true;
        },
        handleDragLeave() {
            this.isDragOver = false;
        },
        async loadPdf() {
            if (!this.pdfFile) return;

            try {
                // 使用CDN版本的pdf.js
                if (typeof window.pdfjsLib === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                const pdfjsLib = window.pdfjsLib;
                const pdfData = await this.pdfFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                this.totalPages = pdf.numPages;
            } catch (error) {
                console.error('加载PDF失败:', error);
                this.$noty.error('加载PDF失败，请检查文件格式');
            }
        },
        async convertToImages() {
            if (!this.pdfFile) return;

            this.isConverting = true;
            this.convertedImages = [];

            try {
                // 确保pdf.js已加载
                if (typeof window.pdfjsLib === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                        document.head.appendChild(script);
                    });
                }
                const pdfjsLib = window.pdfjsLib;
                const pdfData = await this.pdfFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
                
                const pagesToConvert = this.getPagesToConvert();
                
                for (const pageNum of pagesToConvert) {
                    if (pageNum > this.totalPages) continue;
                    
                    const page = await pdf.getPage(pageNum);
                    const scale = this.dpiSetting / 72; // 将DPI转换为缩放比例
                    const viewport = page.getViewport({ scale });
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    const dataUrl = canvas.toDataURL(this.outputFormat, this.imageQuality);
                    
                    this.convertedImages.push({
                        dataUrl,
                        page: pageNum,
                        name: `${this.pdfFile.name.replace('.pdf', '')}_page_${pageNum}`
                    });
                }
                
                this.$noty.success(`成功转换 ${this.convertedImages.length} 张图片`);
            } catch (error) {
                console.error('转换失败:', error);
                this.$noty.error('转换失败，请重试');
            } finally {
                this.isConverting = false;
            }
        },
        getPagesToConvert() {
            if (this.convertAllPages) {
                return Array.from({ length: this.totalPages }, (_, i) => i + 1);
            }
            
            const pages = [];
            const ranges = this.pageRange.split(',');
            
            for (const range of ranges) {
                const trimmed = range.trim();
                if (trimmed.includes('-')) {
                    const [start, end] = trimmed.split('-').map(Number);
                    for (let i = start; i <= end; i++) {
                        if (i > 0 && i <= this.totalPages) {
                            pages.push(i);
                        }
                    }
                } else {
                    const page = Number(trimmed);
                    if (page > 0 && page <= this.totalPages) {
                        pages.push(page);
                    }
                }
            }
            
            return [...new Set(pages)].sort((a, b) => a - b);
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        downloadSingleImage(image) {
            const extension = this.outputFormat === 'image/jpeg' ? 'jpg' : 'png';
            const fileName = `${image.name}.${extension}`;
            createDownload(image.dataUrl, fileName);
        },
        async downloadAllImages() {
            if (this.convertedImages.length === 0) return;
            
            try {
                const JSZip = await import('jszip');
                const zip = new JSZip();
                
                for (const image of this.convertedImages) {
                    const extension = this.outputFormat === 'image/jpeg' ? 'jpg' : 'png';
                    const fileName = `${image.name}.${extension}`;
                    
                    // 将dataUrl转换为blob
                    const response = await fetch(image.dataUrl);
                    const blob = await response.blob();
                    
                    zip.file(fileName, blob);
                }
                
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(zipBlob);
                
                const zipName = `${this.pdfFile.name.replace('.pdf', '')}_images.zip`;
                createDownload(zipUrl, zipName);
                
                // 清理URL对象
                setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
                
                this.$noty.success('打包下载成功');
            } catch (error) {
                console.error('打包下载失败:', error);
                this.$noty.error('打包下载失败');
            }
        },
        clearFile() {
            this.pdfFile = null;
            this.totalPages = 0;
            this.convertedImages = [];
            this.pageRange = '';
            this.convertAllPages = true;
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = '';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.pdf-to-image {
    .content {
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

    .pdf-info {
        .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            
            label {
                font-weight: bold;
                color: var(--text-color);
                margin-right: 10px;
                min-width: 80px;
            }
            
            span {
                color: var(--theme-color);
            }
        }
    }

    .conversion-settings {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;

        .setting-group {
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

            .page-range {
                .range-input {
                    margin-top: 10px;
                    
                    input {
                        width: 100%;
                        margin-bottom: 5px;
                    }
                    
                    small {
                        color: var(--text-color-secondary);
                        font-size: 12px;
                    }
                }
            }
        }
    }

    .setting-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
    }

    .conversion-results {
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
            
            span {
                color: var(--text-color);
                font-weight: bold;
            }
        }

        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;

            .image-item {
                .image-container {
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    overflow: hidden;
                    transition: transform 0.3s ease;

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    img {
                        width: 100%;
                        height: 150px;
                        object-fit: contain;
                        background: var(--bg-color);
                    }

                    .image-info {
                        padding: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: var(--bg-color-secondary);

                        span {
                            font-size: 14px;
                            color: var(--text-color);
                        }
                    }
                }
            }
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

    @media (max-width: 768px) {
        .conversion-settings {
            grid-template-columns: 1fr;
        }
        
        .images-grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>