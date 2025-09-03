<template>
    <div class="json-convert-code">
        <nya-container title="JSON 转代码工具">
            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="8"
                type="textarea"
                autofocus
                autocomplete="off"
                label="输入JSON"
                placeholder="请输入JSON字符串"
            />
            
            <div class="language-section mb-15">
                <label>选择目标语言:</label>
                <div class="language-grid">
                    <label v-for="lang in languages" :key="lang.value" class="language-option">
                        <input
                            v-model="selectedLanguage"
                            type="radio"
                            :value="lang.value"
                            @change="onLanguageChange"
                        />
                        {{ lang.label }}
                    </label>
                </div>
            </div>
            
            <div class="btn-group mb-15">
                <button type="button" class="nya-btn" @click="convertCode">
                    转换代码
                </button>
            </div>
        </nya-container>

        <nya-container v-if="outputText" title="生成的代码">
            <nya-input
                v-model="outputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea"
                readonly
                label="结果"
                placeholder="生成的代码将显示在这里"
            />
            <div class="btn-group">
                <button type="button" class="nya-btn mr-15" @click="copyResult">
                    复制代码
                </button>
                <button type="button" class="nya-btn" @click="downloadResult">
                    下载文件
                </button>
            </div>
        </nya-container>

        <nya-container v-if="jsonData" title="JSON结构预览">
            <pre class="json-preview">{{ formattedJson }}</pre>
        </nya-container>

        <nya-container title="使用说明">
            <ul class="tips">
                <li><strong>支持语言：</strong>TypeScript、Java、Python、Go、C#、Rust、Swift、Kotlin等12种编程语言</li>
                <li><strong>转换原理：</strong>根据JSON结构生成对应的类和数据类型定义</li>
                <li><strong>使用场景：</strong>API响应建模、数据传输对象定义、配置文件结构等</li>
                <li>自动处理嵌套对象和数组，生成完整的类型定义</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>输入JSON：</strong>
                    <code>{"users":[{"name":"张三","age":25},{"name":"李四","age":30}]}</code>
                </div>
                <div class="example-item">
                    <strong>TypeScript接口：</strong>
                    <code>interface Root {
  users: User[];
}

interface User {
  name: string;
  age: number;
}</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'JsonConvertCode',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            jsonData: null,
            selectedLanguage: 'typescript',
            languages: [
                { value: 'typescript', label: 'TypeScript 接口' },
                { value: 'java', label: 'Java 类' },
                { value: 'python', label: 'Python 数据类' },
                { value: 'go', label: 'Go 结构体' },
                { value: 'csharp', label: 'C# 类' },
                { value: 'rust', label: 'Rust 结构体' },
                { value: 'swift', label: 'Swift 结构体' },
                { value: 'kotlin', label: 'Kotlin 数据类' },
                { value: 'flow', label: 'Flow 类型' },
                { value: 'elm', label: 'Elm 类型' },
                { value: 'ruby', label: 'Ruby 类' },
                { value: 'pike', label: 'Pike 类' }
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
        }
    },
    methods: {
        processInput() {
            if (!this.inputText.trim()) {
                this.jsonData = null;
                this.outputText = '';
                return;
            }
            
            try {
                this.jsonData = JSON.parse(this.inputText);
                this.convertCode();
            } catch (error) {
                this.jsonData = null;
                this.outputText = '';
                this.$noty.error('JSON格式错误：' + error.message);
            }
        },
        
        onLanguageChange() {
            // 只在有输入内容时才转换
            if (this.inputText.trim() && this.jsonData) {
                this.convertCode();
            }
        },
        
        convertCode() {
            if (!this.jsonData || !this.inputText.trim()) {
                // 不显示警告，只在有输入时转换
                return;
            }
            
            try {
                const cleanData = this.removeNullValues(this.jsonData);
                const sortedData = this.sortObjectKeys(cleanData);
                
                switch (this.selectedLanguage) {
                    case 'typescript':
                        this.outputText = this.jsonToTypeScript(sortedData);
                        break;
                    case 'java':
                        this.outputText = this.jsonToJava(sortedData);
                        break;
                    case 'python':
                        this.outputText = this.jsonToPython(sortedData);
                        break;
                    case 'go':
                        this.outputText = this.jsonToGo(sortedData);
                        break;
                    case 'csharp':
                        this.outputText = this.jsonToCSharp(sortedData);
                        break;
                    case 'rust':
                        this.outputText = this.jsonToRust(sortedData);
                        break;
                    case 'swift':
                        this.outputText = this.jsonToSwift(sortedData);
                        break;
                    case 'kotlin':
                        this.outputText = this.jsonToKotlin(sortedData);
                        break;
                    case 'flow':
                        this.outputText = this.jsonToFlow(sortedData);
                        break;
                    case 'elm':
                        this.outputText = this.jsonToElm(sortedData);
                        break;
                    case 'ruby':
                        this.outputText = this.jsonToRuby(sortedData);
                        break;
                    case 'pike':
                        this.outputText = this.jsonToPike(sortedData);
                        break;
                    default:
                        this.outputText = '未知转换类型';
                }
                
                if (this.outputText && !this.outputText.startsWith('JSON') && !this.outputText.startsWith('转换错误')) {
                    this.$noty.success('代码转换成功');
                }
            } catch (error) {
                this.outputText = '';
                this.$noty.error('转换错误：' + error.message);
            }
        },
        
        // 通用工具函数
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        
        camelCase(str) {
            return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                     .replace(/^[A-Z]/, match => match.toLowerCase());
        },
        
        snakeCase(str) {
            return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
        },
        
        formatClassName(name) {
            return this.capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
        },
        
        formatTypeName(name) {
            return this.capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
        },
        
        removeNullValues(obj) {
            if (Array.isArray(obj)) {
                return obj.filter(item => item !== null && item !== undefined)
                    .map(item => typeof item === 'object' ? this.removeNullValues(item) : item);
            } else if (typeof obj === 'object' && obj !== null) {
                const newObj = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value !== null && value !== undefined) {
                        newObj[key] = typeof value === 'object' ? this.removeNullValues(value) : value;
                    }
                }
                return newObj;
            }
            return obj;
        },
        
        sortObjectKeys(obj) {
            if (Array.isArray(obj)) {
                return obj.map(item => typeof item === 'object' ? this.sortObjectKeys(item) : item);
            } else if (typeof obj === 'object' && obj !== null) {
                const sorted = {};
                Object.keys(obj).sort().forEach(key => {
                    sorted[key] = typeof obj[key] === 'object' ? this.sortObjectKeys(obj[key]) : obj[key];
                });
                return sorted;
            }
            return obj;
        },
        
        // 各种语言转换方法
        jsonToTypeScript(obj, interfaceName = 'Root') {
            const interfaces = new Map();
            
            const getTypeScriptType = (value) => {
                if (value === null) return 'any';
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
                if (typeof value === 'string') return 'string';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'any[]';
                    const elementType = getTypeScriptType(value[0]);
                    return `${elementType}[]`;
                }
                
                if (typeof value === 'object') {
                    return this.formatTypeName('Object');
                }
                
                return 'any';
            };
            
            const processObject = (obj, interfaceName) => {
                const formattedName = this.formatTypeName(interfaceName);
                if (interfaces.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = key.includes('-') ? `'${key}'` : key;
                    let propertyType = getTypeScriptType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatTypeName(key);
                        processObject(value, nestedName);
                        propertyType = nestedName;
                    }
                    
                    const optional = value === null ? '?' : '';
                    properties.push(`  ${propertyName}${optional}: ${propertyType};`);
                }
                
                let interfaceDefinition = `interface ${formattedName} {\n`;
                interfaceDefinition += properties.join('\n');
                interfaceDefinition += '\n}';
                
                interfaces.set(formattedName, interfaceDefinition);
            };
            
            processObject(obj, interfaceName);
            return Array.from(interfaces.values()).join('\n\n');
        },
        
        jsonToJava(obj, className = 'Root') {
            const classes = new Map();
            
            const getJavaType = (value) => {
                if (value === null) return 'Object';
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List<Object>';
                    const elementType = getJavaType(value[0]);
                    return `List<${elementType}>`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'Object';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.camelCase(key);
                    const propertyType = getJavaType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `public class ${formattedName} {\n`;
                
                for (const prop of properties) {
                    classDefinition += `    private ${prop.type} ${prop.name};\n`;
                }
                
                classDefinition += '\n';
                
                for (const prop of properties) {
                    const capitalizedName = this.capitalize(prop.name);
                    classDefinition += `    public ${prop.type} get${capitalizedName}() {\n`;
                    classDefinition += `        return ${prop.name};\n`;
                    classDefinition += `    }\n\n`;
                    
                    classDefinition += `    public void set${capitalizedName}(${prop.type} ${prop.name}) {\n`;
                    classDefinition += `        this.${prop.name} = ${prop.name};\n`;
                    classDefinition += `    }\n\n`;
                }
                
                classDefinition += '}';
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },
        
        jsonToPython(obj, className = 'Root') {
            const classes = new Map();
            
            const getPythonType = (value) => {
                if (value === null) return 'Any';
                if (typeof value === 'boolean') return 'bool';
                if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
                if (typeof value === 'string') return 'str';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List[Any]';
                    const elementType = getPythonType(value[0]);
                    return `List[${elementType}]`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'Any';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.snakeCase(key);
                    const propertyType = getPythonType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `from typing import List, Any\nfrom dataclasses import dataclass\n\n@dataclass\nclass ${formattedName}:\n`;
                
                for (const prop of properties) {
                    classDefinition += `    ${prop.name}: ${prop.type}\n`;
                }
                
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },
        
        jsonToGo(obj, structName = 'Root') {
            const structs = new Map();
            
            const getGoType = (value) => {
                if (value === null) return 'interface{}';
                if (typeof value === 'boolean') return 'bool';
                if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
                if (typeof value === 'string') return 'string';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return '[]interface{}';
                    const elementType = getGoType(value[0]);
                    return `[]${elementType}`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'interface{}';
            };
            
            const processObject = (obj, structName) => {
                const formattedName = this.formatClassName(structName);
                if (structs.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.capitalize(key);
                    const propertyType = getGoType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key,
                        jsonTag: key
                    });
                }
                
                let structDefinition = `type ${formattedName} struct {\n`;
                
                for (const prop of properties) {
                    structDefinition += `    ${prop.name} ${prop.type} \`json:"${prop.jsonTag}"\`\n`;
                }
                
                structDefinition += '}';
                structs.set(formattedName, structDefinition);
            };
            
            processObject(obj, structName);
            return Array.from(structs.values()).join('\n\n');
        },
        
        jsonToCSharp(obj, className = 'Root') {
            const classes = new Map();
            
            const getCSharpType = (value) => {
                if (value === null) return 'object';
                if (typeof value === 'boolean') return 'bool';
                if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
                if (typeof value === 'string') return 'string';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List<object>';
                    const elementType = getCSharpType(value[0]);
                    return `List<${elementType}>`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'object';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.capitalize(key);
                    const propertyType = getCSharpType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `public class ${formattedName}\n{\n`;
                
                for (const prop of properties) {
                    classDefinition += `    public ${prop.type} ${prop.name} { get; set; }\n`;
                }
                
                classDefinition += '}';
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },
        
        jsonToRust(obj, structName = 'Root') {
            const structs = new Map();
            
            const getRustType = (value) => {
                if (value === null) return 'Option<String>';
                if (typeof value === 'boolean') return 'bool';
                if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'Vec<String>';
                    const elementType = getRustType(value[0]);
                    return `Vec<${elementType}>`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'String';
            };
            
            const processObject = (obj, structName) => {
                const formattedName = this.formatClassName(structName);
                if (structs.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.snakeCase(key);
                    const propertyType = getRustType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let structDefinition = `#[derive(Debug, Serialize, Deserialize)]\n`;
                structDefinition += `pub struct ${formattedName} {\n`;
                
                for (const prop of properties) {
                    structDefinition += `    #[serde(rename = "${prop.originalKey}")]\n`;
                    structDefinition += `    pub ${prop.name}: ${prop.type},\n`;
                }
                
                structDefinition += '}';
                structs.set(formattedName, structDefinition);
            };
            
            processObject(obj, structName);
            return Array.from(structs.values()).join('\n\n');
        },
        
        jsonToSwift(obj, structName = 'Root') {
            const structs = new Map();
            
            const getSwiftType = (value) => {
                if (value === null) return 'String?';
                if (typeof value === 'boolean') return 'Bool';
                if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return '[String]';
                    const elementType = getSwiftType(value[0]);
                    return `[${elementType}]`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'String';
            };
            
            const processObject = (obj, structName) => {
                const formattedName = this.formatClassName(structName);
                if (structs.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.capitalize(key);
                    const propertyType = getSwiftType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let structDefinition = `struct ${formattedName}: Codable {\n`;
                
                for (const prop of properties) {
                    structDefinition += `    let ${prop.name}: ${prop.type}\n`;
                }
                
                structDefinition += '}';
                structs.set(formattedName, structDefinition);
            };
            
            processObject(obj, structName);
            return Array.from(structs.values()).join('\n\n');
        },
        
        jsonToKotlin(obj, className = 'Root') {
            const classes = new Map();
            
            const getKotlinType = (value) => {
                if (value === null) return 'String?';
                if (typeof value === 'boolean') return 'Boolean';
                if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List<String>';
                    const elementType = getKotlinType(value[0]);
                    return `List<${elementType}>`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'String';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.capitalize(key);
                    const propertyType = getKotlinType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `import kotlinx.serialization.*\n\n@Serializable\ndata class ${formattedName}(\n`;
                
                for (const prop of properties) {
                    classDefinition += `    val ${prop.name}: ${prop.type},\n`;
                }
                
                classDefinition += ')';
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },
        
        jsonToFlow(obj, typeName = 'Root') {
            const types = new Map();
            
            const getFlowType = (value) => {
                if (value === null) return '?string';
                if (typeof value === 'boolean') return 'boolean';
                if (typeof value === 'number') return 'number';
                if (typeof value === 'string') return 'string';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'Array<string>';
                    const elementType = getFlowType(value[0]);
                    return `Array<${elementType}>`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'string';
            };
            
            const processObject = (obj, typeName) => {
                const formattedName = this.formatClassName(typeName);
                if (types.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = key;
                    let propertyType = getFlowType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                        propertyType = nestedName;
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let typeDefinition = `type ${formattedName} = {\n`;
                
                for (const prop of properties) {
                    typeDefinition += `  ${prop.name}: ${prop.type};\n`;
                }
                
                typeDefinition += '};';
                types.set(formattedName, typeDefinition);
            };
            
            processObject(obj, typeName);
            return Array.from(types.values()).join('\n\n');
        },

        jsonToElm(obj, typeName = 'Root') {
            const types = new Map();
            
            const getElmType = (value) => {
                if (value === null) return 'Maybe String';
                if (typeof value === 'boolean') return 'Bool';
                if (typeof value === 'number') return 'Float';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List String';
                    const elementType = getElmType(value[0]);
                    return `List ${elementType}`;
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'String';
            };
            
            const processObject = (obj, typeName) => {
                const formattedName = this.formatClassName(typeName);
                if (types.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.camelCase(key);
                    const propertyType = getElmType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                        propertyType = nestedName;
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let typeDefinition = `type alias ${formattedName} =\n    { `;
                
                const propertyStrings = properties.map(prop => `${prop.name} : ${prop.type}`);
                typeDefinition += propertyStrings.join('\n    , ');
                typeDefinition += '\n    }';
                types.set(formattedName, typeDefinition);
            };
            
            processObject(obj, typeName);
            return Array.from(types.values()).join('\n\n');
        },

        jsonToRuby(obj, className = 'Root') {
            const classes = new Map();
            
            const getRubyType = (value) => {
                if (value === null) return 'String';
                if (typeof value === 'boolean') return 'Boolean';
                if (typeof value === 'number') return 'Float';
                if (typeof value === 'string') return 'String';
                
                if (Array.isArray(value)) {
                    return 'Array';
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'String';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.snakeCase(key);
                    const propertyType = getRubyType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `class ${formattedName}\n  include ActiveModel::Model\n  include ActiveModel::Attributes\n`;
                
                for (const prop of properties) {
                    classDefinition += `  attribute :${prop.name}, :${prop.type.toLowerCase()}\n`;
                }
                
                classDefinition += 'end';
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },

        jsonToPike(obj, className = 'Root') {
            const classes = new Map();
            
            const getPikeType = (value) => {
                if (value === null) return 'string';
                if (typeof value === 'boolean') return 'bool';
                if (typeof value === 'number') return 'float';
                if (typeof value === 'string') return 'string';
                
                if (Array.isArray(value)) {
                    return 'array';
                }
                
                if (typeof value === 'object') {
                    return this.formatClassName('Object');
                }
                
                return 'string';
            };
            
            const processObject = (obj, className) => {
                const formattedName = this.formatClassName(className);
                if (classes.has(formattedName)) return;
                
                const properties = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const propertyName = this.snakeCase(key);
                    const propertyType = getPikeType(value);
                    
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        const nestedName = this.formatClassName(key);
                        processObject(value, nestedName);
                    }
                    
                    properties.push({
                        name: propertyName,
                        type: propertyType,
                        originalKey: key
                    });
                }
                
                let classDefinition = `class ${formattedName} {\n`;
                
                for (const prop of properties) {
                    classDefinition += `  ${prop.type} ${prop.name};\n`;
                }
                
                classDefinition += '}';
                classes.set(formattedName, classDefinition);
            };
            
            processObject(obj, className);
            return Array.from(classes.values()).join('\n\n');
        },

        copyResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可复制的内容');
                return;
            }
            
            navigator.clipboard.writeText(this.outputText).then(() => {
                this.$noty.success('代码已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },

        downloadResult() {
            if (!this.outputText) {
                this.$noty.warning('没有可下载的内容');
                return;
            }
            
            const extensionMap = {
                typescript: 'ts',
                java: 'java',
                python: 'py',
                go: 'go',
                csharp: 'cs',
                rust: 'rs',
                swift: 'swift',
                kotlin: 'kt',
                flow: 'js',
                elm: 'elm',
                ruby: 'rb',
                pike: 'pike'
            };
            
            const extension = extensionMap[this.selectedLanguage] || 'txt';
            const filename = `generated_code.${extension}`;
            
            const blob = new Blob([this.outputText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
}
</script>

<style lang="scss" scoped>
.json-convert-code {
    // 与项目保持一致的容器样式
    :deep(.nya-container) {
        margin-bottom: 25px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid #e9ecef;
        
        .nya-container-title {
            font-size: 20px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e9ecef;
        }
    }
    
    .language-section {
        margin-bottom: 25px;
        
        label {
            display: block;
            margin-bottom: 15px;
            font-weight: 600;
            color: #2c3e50;
            font-size: 16px;
            line-height: 1.5;
        }
        
        .language-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;
            margin-top: 15px;
        }
        
        .language-option {
            display: flex;
            align-items: center;
            padding: 14px 18px;
            background: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            color: #495057;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
            
            &:hover {
                background: #f8f9fa;
                border-color: #007bff;
                transform: translateY(-1px);
                box-shadow: 0 2px 6px rgba(0, 123, 255, 0.12);
            }
            
            &:has(input[type="radio"]:checked) {
                background: linear-gradient(135deg, #e7f3ff 0%, #cce7ff 100%);
                border-color: #007bff;
                color: #0056b3;
                font-weight: 600;
            }
            
            input[type="radio"] {
                margin-right: 10px;
                accent-color: #007bff;
                transform: scale(1.1);
            }
        }
    }
    
    .json-preview {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        overflow-x: auto;
        font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
        
        code {
            background: transparent;
            padding: 0;
            border: none;
            font-size: inherit;
            line-height: inherit;
        }
    }
    
    .examples {
        .example-item {
            margin-bottom: 25px;
            
            strong {
                display: block;
                margin-bottom: 12px;
                color: #2c3e50;
                font-size: 16px;
                font-weight: 600;
                line-height: 1.4;
            }
            
            code {
                display: block;
                padding: 18px;
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
                font-size: 14px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-word;
                color: #495057;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }
        }
    }
    
    .tips {
        background: #f8f9fa;
        border-left: 4px solid #007bff;
        padding: 20px 25px;
        border-radius: 0 8px 8px 0;
        margin: 20px 0;
        
        li {
            margin-bottom: 12px;
            line-height: 1.7;
            color: #495057;
            font-size: 15px;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            strong {
                color: #007bff;
                font-weight: 600;
            }
        }
    }
    
    .btn-group {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
        margin: 20px 0;
        
        :deep(.nya-btn) {
            transition: all 0.2s ease;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            padding: 12px 24px;
            min-height: 44px;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
            }
            
            &:active {
                transform: translateY(0);
                box-shadow: 0 2px 6px rgba(0, 123, 255, 0.15);
            }
        }
    }
    
    // 输入框统一美化
    :deep(.nya-input) {
        margin-bottom: 20px;
        
        textarea {
            border-radius: 8px;
            border: 1px solid #ced4da;
            transition: all 0.2s ease;
            font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
            line-height: 1.6;
            font-size: 14px;
            padding: 15px;
            background: #fff;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
            
            &:focus {
                border-color: #007bff;
                box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                outline: none;
            }
            
            &::placeholder {
                color: #6c757d;
                font-style: italic;
            }
        }
    }
    
    // 响应式设计优化
    @media (max-width: 768px) {
        :deep(.nya-container) {
            margin-bottom: 20px;
            padding: 20px;
        }
        
        .language-grid {
            grid-template-columns: 1fr;
            gap: 10px;
        }
        
        .language-option {
            padding: 12px 16px;
            font-size: 14px;
        }
        
        .btn-group {
            flex-direction: column;
            gap: 12px;
            
            :deep(.nya-btn) {
                width: 100%;
                margin-bottom: 0;
            }
        }
    }
    
    @media (max-width: 480px) {
        :deep(.nya-container) {
            padding: 15px;
            border-radius: 8px;
        }
        
        .language-option {
            padding: 10px 14px;
            font-size: 13px;
        }
    }
}
</style>