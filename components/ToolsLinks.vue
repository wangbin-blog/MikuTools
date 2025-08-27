<template>
  <div class="tools-links">    
    <!-- 所有工具链接，按类别用tab卡片展示 -->
    <nya-container title="所有工具" v-if="tools.length > 0">
      <div class="tabs">
        <div 
          v-for="(category, index) in tools" 
          :key="index" 
          class="tab"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
        <i :class="`eva eva-${category.icon}`"></i>
        <span>{{ category.title }}</span>
        </div>
      </div>
      
      <div class="tab-content">
        <div 
          v-for="(category, index) in tools" 
          :key="index"
          class="tab-pane"
          :class="{ active: activeTab === index }"
        >
          <div class="tools-grid">
            <a 
              v-for="tool in category.list" 
              :key="tool.path"
              :href="tool.path"
              class="tool-card"
              :title="tool.head?.description || tool.name"
            >
              <div class="tool-name">{{ tool.name }}</div>
              <div class="tool-desc" v-if="tool.head?.description">
                {{ tool.head.description }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </nya-container>
    
    <!-- 友情链接模块 -->
    <div class="friend-links">
      <div class="friend-links-label">友情链接：</div>
      <div class="friend-links-content">
        <a 
          v-for="(link, index) in friendLinks" 
          :key="index"
          :href="link.link"
          target="_blank"
          rel="noopener noreferrer"
          class="friend-link-item"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ToolsLinks',
    computed: {
        ...mapState(['tools', 'friendLinks'])
    },
    data() {
        return {
            activeTab: 0
        };
    },
    mounted() {
        if (process.browser) {
            require('../assets/fonts/iconfont/iconfont');
        }
    }
};
</script>

<style lang="scss">
.tools-links {
    margin-top: 30px;

    .back-to-home {
        margin-bottom: 20px;
        text-align: center;

        .back-btn {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            color: #222831;
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;

            &:hover {
                background-color: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
            }

            .icon {
                margin-right: 6px;
                width: 16px;
                height: 16px;
            }
        }
    }

    .tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;

        .tab {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 20px;
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.6);

            &:hover {
                background-color: rgba(255, 255, 255, 0.8);
            }

            &.active {
                background-color: rgba(76, 175, 80, 0.8);
                color: white;
            }

            .icon {
                margin-right: 6px;
                width: 16px;
                height: 16px;
            }
        }
    }

    .tab-content {
        .tab-pane {
            display: none;

            &.active {
                display: block;
            }

            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;

                .tool-card {
                    padding: 15px;
                    background-color: rgba(255, 255, 255, 0.8);
                    border-radius: 4px;
                    text-decoration: none;
                    color: #222831;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04),
                            0px 8px 64px 0px rgba(10, 14, 29, 0.08);
                        background-color: rgba(255, 255, 255, 1);
                    }

                    .tool-name {
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 14px;
                        transition: all 0.3s ease;
                    }

                    .tool-card:hover .tool-name {
                        transform: translateY(-1px);
                        color: var(--theme);
                    }

                    .tool-desc {
                        font-size: 12px;
                        color: #666;
                        line-height: 1.4;
                    }
                }
            }
        }
    }

    .friend-links {
        margin-top: 30px;
        padding: 15px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .friend-links-label {
            display: inline-block;
            color: #666;
            margin-right: 10px;
        }

        .friend-links-content {
            display: inline;
        }

        .friend-link-item {
            display: inline-block;
            margin-right: 15px;
            text-decoration: none;
            transition: all 0.3s ease;
            color: #a8aaae;
            &:hover {
                color: var(--theme);
            }
        }
    }
}

@media (max-width: 768px) {
    .tools-links {
        .tabs {
            .tab {
                padding: 6px 12px;
                font-size: 14px;

                .icon {
                    width: 14px;
                    height: 14px;
                }
            }
        }

        .tab-content {
            .tools-grid {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
            }
        }
    }
}
</style>
