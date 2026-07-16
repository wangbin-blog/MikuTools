<template>
    <div class="json-to-sql">
        <div class="content">
        <nya-container title="JSON 转 SQL 工具">
            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入JSON"
                placeholder="请输入JSON字符串，支持数组或对象"
            />
            
            <div class="options-section mb-15">
                <label>选择数据库类型:</label>
                <div class="database-grid">
                    <label v-for="db in databases" :key="db.value" class="database-option">
                        <input
                            v-model="selectedDatabase"
                            type="radio"
                            :value="db.value"
                            @change="generateSQL"
                        />
                        {{ db.label }}
                    </label>
                </div>
            </div>

            <div class="options-section mb-15">
                <label>表名:</label>
                <nya-input
                    v-model="tableName"
                    placeholder="请输入表名，默认为json_data"
                    @input="generateSQL"
                />
            </div>

            <div class="btn-group mb-15">
                <button type="button" class="btn-primary" @click="generateSQL">
                    ✨ 生成SQL
                </button>
                <button type="button" class="btn-danger" @click="clearInput">
                    🗑️ 清空
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText" title="生成的SQL脚本">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea"
                readonly
                label="SQL脚本"
                placeholder="生成的SQL将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="btn-control copy-btn" @click="copyResult">
                    📋 复制SQL
                </button>
                <button type="button" class="btn-control download-btn" @click="downloadResult">
                    ⬇️ 下载SQL文件
                </button>
            </div>
        </nya-container>

        <nya-container v-if="jsonData" title="JSON结构预览">
            <pre class="json-preview">{{ formattedJson }}</pre>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>支持数据库：</strong>SQL Server、MySQL、Oracle、达梦数据库</li>
                <li><strong>输入格式：</strong>支持JSON数组或对象，自动识别字段类型</li>
                <li><strong>字段类型：</strong>自动推断字符串、数字、布尔值、日期等类型</li>
                <li><strong>建表语句：</strong>生成包含主键的CREATE TABLE语句</li>
                <li><strong>插入语句：</strong>为每条数据生成INSERT INTO语句</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>输入JSON：</strong>
                    <code>[{"name":"张三","age":25,"city":"北京","active":true},{"name":"李四","age":30,"city":"上海","active":false}]</code>
                </div>
                <div class="example-item">
                    <strong>生成SQL（MySQL）：</strong>
                    <code>CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  city VARCHAR(255),
  active BOOLEAN
);

INSERT INTO users (name, age, city, active) VALUES ('张三', 25, '北京', 1);
INSERT INTO users (name, age, city, active) VALUES ('李四', 30, '上海', 0);</code>
                </div>
            </div>
        </nya-container>
    
        </div>
        
</div>
</template>

<script>

export default {
    name: 'JsonToSQL',
    head() {
        return {
            title: 'JSON转SQL工具',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: '在线JSON转SQL工具，支持SQL Server、MySQL、Oracle、达梦数据库，自动生成建表和插入语句。'
                }
            ]
        };
    },
    components: {
        
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            tableName: 'json_data',
            selectedDatabase: 'mysql',
            databases: [
                { value: 'mysql', label: 'MySQL' },
                { value: 'sqlserver', label: 'SQL Server' },
                { value: 'oracle', label: 'Oracle' },
                { value: 'dameng', label: '达梦数据库' }
            ]
        };
    },
    computed: {
        formattedJson() {
            return this.jsonData ? JSON.stringify(this.jsonData, null, 2) : '';
        }
    },
    watch: {
        inputText() {
            this.processInput();
        },
        tableName() {
            this.generateSQL();
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },

        processInput() {
            if (!this.inputText.trim()) {
                this.jsonData = null;
                this.outputText = '';
                return;
            }
            
            try {
                this.jsonData = JSON.parse(this.inputText);
                this.generateSQL();
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.$noty.error('JSON格式错误：' + error.message);
            }
        },

        generateSQL() {
            if (!this.jsonData || !this.inputText.trim()) {
                return;
            }

            try {
                let data = Array.isArray(this.jsonData) ? this.jsonData : [this.jsonData];
                if (data.length === 0) {
                    this.outputText = '-- 没有数据';
                    return;
                }

                const table = this.tableName || 'json_data';
                const columns = this.extractColumns(data);
                const createTableSQL = this.generateCreateTableSQL(table, columns);
                const insertSQL = this.generateInsertSQL(table, columns, data);

                this.outputText = `${createTableSQL}\n\n${insertSQL}`;
            } catch (error) {
                this.outputText = '';
                this.$noty.error('生成SQL失败：' + error.message);
            }
        },

        extractColumns(data) {
            const columns = {};
            data.forEach(item => {
                Object.keys(item).forEach(key => {
                    const value = item[key];
                    const sqlType = this.inferSQLType(value);
                    
                    if (!columns[key] || this.getTypePriority(sqlType) > this.getTypePriority(columns[key])) {
                        columns[key] = sqlType;
                    }
                });
            });
            return columns;
        },

        inferSQLType(value) {
            if (value === null || value === undefined) return 'VARCHAR(255)';
            
            const type = typeof value;
            switch (type) {
                case 'string':
                    if (this.isDate(value)) return 'DATETIME';
                    if (this.isEmail(value)) return 'VARCHAR(320)';
                    return `VARCHAR(${Math.max(255, value.length * 2)})`;
                case 'number':
                    return Number.isInteger(value) ? 'INT' : 'DECIMAL(10,2)';
                case 'boolean':
                    return this.selectedDatabase === 'mysql' ? 'BOOLEAN' : 
                           this.selectedDatabase === 'sqlserver' ? 'BIT' : 'NUMBER(1)';
                default:
                    return 'VARCHAR(255)';
            }
        },

        getTypePriority(type) {
            const priorities = {
                'NUMBER(1)': 1, 'BIT': 1, 'BOOLEAN': 1,
                'INT': 2,
                'DECIMAL(10,2)': 3,
                'DATETIME': 4,
                'VARCHAR(320)': 5,
                'VARCHAR(255)': 6
            };
            return priorities[type] || 7;
        },

        isDate(value) {
            const date = new Date(value);
            return date instanceof Date && !isNaN(date) && value.length >= 8;
        },

        isEmail(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        },

        generateCreateTableSQL(table, columns) {
            const columnDefs = Object.keys(columns).map(col => {
                const type = this.adaptTypeForDatabase(columns[col]);
                return `  ${this.quoteIdentifier(col)} ${type}`;
            });

            let sql = '';
            switch (this.selectedDatabase) {
                case 'mysql':
                    sql = `CREATE TABLE \`${table}\` (\n  \`id\` INT AUTO_INCREMENT PRIMARY KEY,\n${columnDefs.join(',\n')}\n);`;
                    break;
                case 'sqlserver':
                    sql = `CREATE TABLE [${table}] (\n  [id] INT IDENTITY(1,1) PRIMARY KEY,\n${columnDefs.join(',\n')}\n);`;
                    break;
                case 'oracle':
                    sql = `CREATE TABLE "${table.toUpperCase()}" (\n  "ID" NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,\n${columnDefs.map(def => def.toUpperCase()).join(',\n')}\n);`;
                    break;
                case 'dameng':
                    sql = `CREATE TABLE "${table.toUpperCase()}" (\n  "ID" INT IDENTITY(1,1) PRIMARY KEY,\n${columnDefs.map(def => def.toUpperCase()).join(',\n')}\n);`;
                    break;
            }
            return sql;
        },

        generateInsertSQL(table, columns, data) {
            const cols = Object.keys(columns);
            const quotedCols = cols.map(col => this.quoteIdentifier(col));
            
            return data.map(row => {
                const values = cols.map(col => {
                    const value = row[col];
                    if (value === null || value === undefined) {
                        return 'NULL';
                    } else if (typeof value === 'string') {
                        return `'${value.replace(/'/g, "''")}'`;
                    } else if (typeof value === 'boolean') {
                        return this.selectedDatabase === 'mysql' ? (value ? 1 : 0) :
                               this.selectedDatabase === 'sqlserver' ? (value ? 1 : 0) :
                               value ? 1 : 0;
                    } else {
                        return value;
                    }
                });

                switch (this.selectedDatabase) {
                    case 'mysql':
                        return `INSERT INTO \`${table}\` (${quotedCols.join(', ')}) VALUES (${values.join(', ')});`;
                    case 'sqlserver':
                        return `INSERT INTO [${table}] (${quotedCols.join(', ')}) VALUES (${values.join(', ')});`;
                    case 'oracle':
                        return `INSERT INTO "${table.toUpperCase()}" (${quotedCols.map(c => c.toUpperCase()).join(', ')}) VALUES (${values.join(', ')});`;
                    case 'dameng':
                        return `INSERT INTO "${table.toUpperCase()}" (${quotedCols.map(c => c.toUpperCase()).join(', ')}) VALUES (${values.join(', ')});`;
                }
            }).join('\n');
        },

        adaptTypeForDatabase(sqlType) {
            switch (this.selectedDatabase) {
                case 'mysql':
                    return sqlType.replace('BOOLEAN', 'TINYINT(1)').replace('DECIMAL(10,2)', 'DECIMAL(10,2)');
                case 'sqlserver':
                    return sqlType.replace('BOOLEAN', 'BIT').replace('DATETIME', 'DATETIME2');
                case 'oracle':
                    return sqlType.replace('VARCHAR', 'VARCHAR2').replace('INT', 'NUMBER').replace('DATETIME', 'DATE');
                case 'dameng':
                    return sqlType.replace('VARCHAR', 'VARCHAR').replace('INT', 'INTEGER').replace('DATETIME', 'TIMESTAMP');
                default:
                    return sqlType;
            }
        },

        quoteIdentifier(name) {
            switch (this.selectedDatabase) {
                case 'mysql':
                    return `\`${name}\``;
                case 'sqlserver':
                    return `[${name}]`;
                case 'oracle':
                case 'dameng':
                    return `"${name.toUpperCase()}"`;
                default:
                    return name;
            }
        },

        clearInput() {
            this.inputText = '';
            this.outputText = '';
            this.jsonData = null;
            this.tableName = 'json_data';
        },

        copyResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可复制的SQL');
                return;
            }
            
            this.$copy(this.outputText).then(() => {
                this.$noty.success('SQL已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败');
            });
        },

        downloadResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可下载的SQL');
                return;
            }

            const filename = `${this.tableName}_${this.selectedDatabase}.sql`;
            const blob = new Blob([this.outputText], { type: 'text/sql' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.$noty.success('SQL文件已下载');
        }
    }
};
</script>

<style scoped>
.json-to-sql {
    .content {
        min-width: 0;
    }
    
}

.options-section {
    margin-bottom: 20px;
}

.options-section label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--text-color);
}

.database-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
}

.database-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.database-option:hover {
    border-color: var(--primary-color);
    background: var(--hover-bg);
}

.database-option input[type="radio"] {
    margin-right: 8px;
}

.json-preview {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 15px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 14px;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.examples {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.example-item {
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 12px;
}

.example-item strong {
    display: block;
    margin-bottom: 8px;
    color: var(--primary-color);
}

.example-item code {
    display: block;
    background: var(--hover-bg);
    padding: 8px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

@media (max-width: 768px) {
    .database-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .examples {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .database-grid {
        grid-template-columns: 1fr;
    }
}
</style>