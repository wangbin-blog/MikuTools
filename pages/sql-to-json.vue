<template>
  <div class="sql-to-json">
    <nya-container title="SQL 转 JSON 工具">
      <nya-input
        v-model="sqlInput"
        class="mb-15"
        fullwidth
        rows="8"
        type="textarea"
        autofocus
        autocomplete="off"
        label="输入SQL脚本"
        placeholder="请输入SQL脚本，支持INSERT、UPDATE、CREATE TABLE语句"
      />
      
      <div class="options-section mb-15">
        <label>选择数据库类型:</label>
        <div class="database-grid">
          <label v-for="db in databases" :key="db.value" class="database-option">
            <input
              v-model="databaseType"
              type="radio"
              :value="db.value"
            />
            {{ db.label }}
          </label>
        </div>
      </div>

      <div class="btn-group mb-15">
        <button type="button" class="btn-primary" @click="convertToJson">
          ✨ 转换
        </button>
        <button type="button" class="btn-danger" @click="clearInput">
          🗑️ 清空
        </button>
      </div>
    </nya-container>

    <nya-container v-if="jsonOutput" title="生成的JSON数据">
      <nya-input
        v-model="jsonOutput"
        class="mb-15"
        fullwidth
        rows="12"
        type="textarea"
        readonly
        label="JSON数据"
        placeholder="生成的JSON将显示在这里"
      />
      <div class="btn-group">
        <button type="button" class="btn-control copy-btn" @click="copyResult">
          📋 复制JSON
        </button>
        <button type="button" class="btn-control download-btn" @click="downloadJson">
          ⬇️ 下载JSON文件
        </button>
      </div>
    </nya-container>

    <nya-container v-if="jsonData" title="数据预览">
      <pre class="json-preview">{{ formattedJson }}</pre>
    </nya-container>

    <nya-container title="使用说明">
      <ul class="tips">
        <li><strong>支持数据库：</strong>SQL Server、MySQL、Oracle、达梦数据库</li>
        <li><strong>支持语句：</strong>INSERT、UPDATE、CREATE TABLE语句</li>
        <li><strong>类型推断：</strong>自动识别字符串、数字、布尔值、日期等类型</li>
        <li><strong>批量处理：</strong>支持多条INSERT语句同时解析</li>
        <li><strong>数据预览：</strong>实时显示转换结果和JSON结构</li>
      </ul>
    </nya-container>

    <nya-container title="示例">
      <div class="examples">
        <div class="example-item">
          <strong>输入SQL：</strong>
          <code>INSERT INTO users (id, name, age, city) VALUES (1, '张三', 25, '北京'), (2, '李四', 30, '上海');</code>
        </div>
        <div class="example-item">
          <strong>输出JSON：</strong>
          <code>[{"id":1,"name":"张三","age":25,"city":"北京"},{"id":2,"name":"李四","age":30,"city":"上海"}]</code>
        </div>
      </div>
    </nya-container>
  </div>
</template>

<script>
export default {
  name: 'SqlToJson',
  head() {
    return {
      title: 'SQL转JSON工具',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '在线SQL转JSON工具，支持SQL Server、MySQL、Oracle、达梦数据库，自动解析SQL语句生成JSON数据。'
        }
      ]
    };
  },
  data() {
    return {
      databaseType: 'mysql',
      sqlInput: '',
      jsonOutput: '',
      jsonData: null,
      databases: [
        { value: 'mysql', label: 'MySQL' },
        { value: 'sqlserver', label: 'SQL Server' },
        { value: 'oracle', label: 'Oracle' },
        { value: 'dm', label: '达梦数据库' }
      ]
    }
  },
  computed: {
    formattedJson() {
      return this.jsonData ? JSON.stringify(this.jsonData, null, 2) : '';
    }
  },
  watch: {
    sqlInput() {
      this.processInput();
    }
  },
  methods: {
    processInput() {
      if (!this.sqlInput.trim()) {
        this.jsonData = null;
        this.jsonOutput = '';
        return;
      }

      try {
        const result = this.parseSQL(this.sqlInput, this.databaseType);
        this.jsonData = result;
        this.jsonOutput = JSON.stringify(result, null, 2);
      } catch (error) {
        this.jsonData = null;
        this.jsonOutput = '';
        this.$noty.error('SQL解析错误：' + error.message);
      }
    },

    convertToJson() {
      this.processInput();
      if (this.jsonData) {
        this.$noty.success('转换成功！');
      }
    },

    parseSQL(sql, type) {
      if (!sql.trim()) {
        return [];
      }

      const results = [];
      
      // 解析INSERT语句
      const insertRegex = /INSERT\s+INTO\s+(\w+)(?:\s*\(([^)]+)\))?\s+VALUES?\s*([^;]+)/gi;
      let match;
      
      while ((match = insertRegex.exec(sql)) !== null) {
        const [, tableName, columnsStr, valuesStr] = match;
        const columns = columnsStr ? columnsStr.split(',').map(c => c.trim()) : null;
        
        // 解析多值插入
        const values = this.parseMultiValues(valuesStr);
        values.forEach(valueSet => {
          const row = {};
          const parsedValues = this.parseValues(valueSet);
          
          parsedValues.forEach((value, index) => {
            const key = columns ? columns[index] : `column_${index + 1}`;
            row[key] = this.convertValue(value);
          });
          
          results.push(row);
        });
      }

      // 如果没有INSERT语句，尝试解析单行INSERT
      if (results.length === 0) {
        const singleInsertRegex = /INSERT\s+INTO\s+(\w+)(?:\s*\(([^)]+)\))?\s+VALUES?\s*\(([^)]+)\)/gi;
        while ((match = singleInsertRegex.exec(sql)) !== null) {
          const [, tableName, columnsStr, valuesStr] = match;
          const columns = columnsStr ? columnsStr.split(',').map(c => c.trim()) : null;
          const values = this.parseValues(valuesStr);
          
          const row = {};
          values.forEach((value, index) => {
            const key = columns ? columns[index] : `column_${index + 1}`;
            row[key] = this.convertValue(value);
          });
          
          results.push(row);
        }
      }

      if (results.length > 0) {
        return results;
      }

      throw new Error('无法解析SQL语句，请确保包含有效的INSERT语句')
    },

    parseInsertStatements(matches) {
      const data = []
      
      matches.forEach(match => {
        const [, tableName, valuesStr] = match
        const values = this.parseValues(valuesStr)
        
        // 尝试提取列名
        const columnMatch = match[0].match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)/i)
        const columns = columnMatch ? columnMatch[1].split(',').map(c => c.trim()) : null
        
        const row = {}
        values.forEach((value, index) => {
          const key = columns ? columns[index] : `column_${index + 1}`
          row[key] = this.convertValue(value)
        })
        
        data.push(row)
      })
      
      return data
    },

    parseCreateTable(match) {
      const [, tableName, columnsDef] = match
      const columns = columnsDef.split(',').map(col => col.trim())
      
      const schema = {
        table: tableName,
        columns: [],
        sample: {}
      }

      columns.forEach(col => {
        const [name, type] = col.split(/\s+/)
        if (name && type) {
          schema.columns.push({
            name: name.replace(/[`"\[\]]/g, ''),
            type: type.toUpperCase()
          })
          schema.sample[name.replace(/[`"\[\]]/g, '')] = this.getSampleValue(type)
        }
      })

      return [schema]
    },

    parseUpdateStatements(matches) {
      const data = []
      
      matches.forEach(match => {
        const [, tableName, column, value] = match
        data.push({
          table: tableName,
          column: column,
          value: this.convertValue(value)
        })
      })
      
      return data
    },

    parseMultiValues(valuesStr) {
      // 处理多值插入，如 VALUES (1,2,3), (4,5,6)
      const values = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      let parenCount = 0;
      
      for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];
        
        if ((char === '\'' || char === '"') && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (char === '(' && !inQuotes) {
          parenCount++;
        } else if (char === ')' && !inQuotes) {
          parenCount--;
          if (parenCount === 0) {
            current += char;
            values.push(current.trim());
            current = '';
            continue;
          }
        }
        
        current += char;
      }
      
      if (current.trim()) {
        values.push(current.trim());
      }
      
      return values;
    },

    parseValues(valuesStr) {
      // 解析单个括号内的值
      valuesStr = valuesStr.replace(/^\(|\)$/g, '').trim();
      
      const values = [];
      let current = '';
      let inQuotes = false;
      let quoteChar = '';
      
      for (let i = 0; i < valuesStr.length; i++) {
        const char = valuesStr[i];
        
        if ((char === '\'' || char === '"') && !inQuotes) {
          inQuotes = true;
          quoteChar = char;
        } else if (char === quoteChar && inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
          continue;
        }
        
        current += char;
      }
      
      if (current.trim()) {
        values.push(current.trim());
      }
      
      return values;
    },

    convertValue(value) {
      const str = value.trim()
      
      if (str === 'NULL' || str === 'null') return null
      if (str === 'TRUE' || str === 'true') return true
      if (str === 'FALSE' || str === 'false') return false
      
      // 数字
      if (/^-?\d+$/.test(str)) return parseInt(str)
      if (/^-?\d*\.\d+$/.test(str)) return parseFloat(str)
      
      // 字符串（移除引号）
      if ((str.startsWith('\'') && str.endsWith('\'')) || 
          (str.startsWith('"') && str.endsWith('"'))) {
        return str.slice(1, -1)
      }
      
      return str
    },



    formatPreview(data) {
      if (!data || data.length === 0) return '无数据'
      
      const preview = data.slice(0, 3)
      return JSON.stringify(preview, null, 2) + 
             (data.length > 3 ? '\n...（共 ' + data.length + ' 条记录）' : '')
    },

    clearInput() {
      this.sqlInput = ''
      this.jsonOutput = ''
      this.jsonData = null
    },

    copyResult() {
      if (!this.jsonOutput) return
      
      this.$copy(this.jsonOutput).then(() => {
        this.$noty.success('已复制到剪贴板')
      }).catch(() => {
        this.$noty.error('复制失败')
      })
    },

    downloadJson() {
      if (!this.jsonOutput) return
      
      const blob = new Blob([this.jsonOutput], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sql-to-json-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.$noty.success('下载成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.sql-to-json {
  .nya-container {
    margin-bottom: 20px;
  }

  .mb-15 {
    margin-bottom: 15px;
  }

  .options-section {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
    }

    .database-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;

      .database-option {
        display: flex;
        align-items: center;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          border-color: #007bff;
          background-color: #f8f9fa;
        }

        input[type="radio"] {
          margin-right: 8px;
        }
      }
    }
  }

  .btn-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    button {
      margin: 0;
    }
  }

  .json-preview {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .tips {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;

      &:before {
        content: "•";
        position: absolute;
        left: 0;
        color: #007bff;
      }
    }
  }

  .examples {
    .example-item {
      margin-bottom: 15px;

      strong {
        display: block;
        margin-bottom: 5px;
        color: #333;
      }

      code {
        display: block;
        background: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }

  @media (max-width: 768px) {
    .database-grid {
      grid-template-columns: 1fr 1fr !important;
    }

    .btn-group {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
}</style>