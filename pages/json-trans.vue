<template>
    <div class="json-trans">
        <nya-container title="JSON 转换工具">
            <div class="checkbox-group mb-15">
                <nya-checkbox v-model="options.indent2" label="使用2个空格缩进" />
                <nya-checkbox v-model="options.sortKeys" label="按键名排序" />
                <nya-checkbox v-model="options.removeNull" label="移除null值" />
            </div>

            <nya-input
                v-model="inputText"
                class="mb-15"
                fullwidth
                rows="12"
                type="textarea" 
                autofocus
                label="输入JSON文本"
                placeholder="请输入JSON格式的文本..."
            />

            <div class="btn-group">
                <div class="nya-btn" @click="formatJSON">JSON格式化</div>
                <div class="nya-btn" @click="minifyJSON">JSON压缩</div>
                <div class="nya-btn" @click="escapeJSON">JSON转义</div>
                <div class="nya-btn" @click="unescapeJSON">JSON去转义</div>
                <div class="nya-btn" @click="toYAML">JSON转YAML</div>
                <div class="nya-btn" @click="toTOML">JSON转TOML</div>
                <div class="nya-btn" @click="toJavaEntity">JSON转Java实体</div>
                <div class="nya-btn" @click="toCSharpEntity">JSON转C#实体</div>
                <div class="nya-btn" @click="toPythonClass">JSON转Python类</div>
                <div class="nya-btn" @click="toJsonSchema">JSON转Schema</div>
                <div class="nya-btn" @click="toObjectiveCClass">JSON转ObjectiveC类</div>
                <div class="nya-btn" @click="toCppClass">JSON转C++类</div>
                <div class="nya-btn" @click="toSwiftClass">JSON转Swift类</div>
                <div class="nya-btn" @click="toGoStruct">JSON转Go结构体</div>
                <div class="nya-btn" @click="toRustStruct">JSON转Rust结构体</div>
                <div class="nya-btn" @click="toCrystalStruct">JSON转Crystal类</div>
                <div class="nya-btn" @click="toTypeScript">JSON转TypeScript</div>
            </div>

        </nya-container>

        <nya-container v-if="outputText" title="转换结果">
            <div class="result-section">
                <div class="result-text">{{ outputText }}</div>
                <div class="nya-btn" @click="copyResult">复制结果</div>
                <div class="nya-btn" @click="clearAll">清空</div>
            </div>
        </nya-container>
        <nya-container title="使用说明">
            <ul class="tips">
                <li>支持标准的JSON格式输入</li>
                <li>格式化功能可以美化JSON结构，使其更易读</li>
                <li>压缩功能可以移除所有空格和换行，减小体积</li>
                <li>转义功能会将JSON字符串中的特殊字符进行转义</li>
                <li>去转义功能会将转义后的字符还原</li>
                <li>YAML转换支持标准YAML格式输出</li>
                <li>TOML转换支持标准TOML格式输出</li>
                <li>Java实体转换会根据JSON结构生成对应的Java类，包括getter/setter方法</li>
                <li>C#实体转换会根据JSON结构生成对应的C#类，使用C#命名规范</li>
                <li>Python类转换会根据JSON结构生成对应的Python dataclass，支持类型注解</li>
                <li>JSON Schema转换会根据JSON结构生成对应的JSON Schema验证规范</li>
                <li>Objective-C类转换会根据JSON结构生成对应的Objective-C类，支持字典初始化</li>
                <li>C++类转换会根据JSON结构生成对应的C++类，支持nlohmann::json序列化</li>
                <li>Swift类转换会根据JSON结构生成对应的Swift类，支持Codable协议</li>
                <li>Go结构体转换会根据JSON结构生成对应的Go结构体，支持json标签</li>
                <li>Rust结构体转换会根据JSON结构生成对应的Rust结构体，支持serde序列化</li>
                <li>Crystal类转换会根据JSON结构生成对应的Crystal类，支持JSON.mapping</li>
                <li>TypeScript接口转换会根据JSON结构生成对应的TypeScript接口定义</li>
            </ul>
        </nya-container>

        <nya-container title="示例">
            <div class="examples">
                <div class="example-item">
                    <strong>格式化示例：</strong>
                    <code>{"name":"张三","age":25,"skills":["JavaScript","Vue","Node.js"]}</code>
                </div>
                <div class="example-item">
                    <strong>转义示例：</strong>
                    <code>{"message":"Hello\nWorld","path":"C:\\Program Files"}</code>
                </div>
            </div>
        </nya-container>
    </div>
</template>

<script>
export default {
    name: 'JsonTrans',
    head() {
        return this.$store.state.currentTool.head;
    },
    data() {
        return {
            inputText: '',
            outputText: '',
            options: {
                indent2: true,
                sortKeys: false,
                removeNull: false
            }
        };
    },
    methods: {
        processJSON() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入JSON文本');
                return null;
            }

            try {
                let jsonObj = JSON.parse(this.inputText);
                
                // 处理选项
                if (this.options.removeNull) {
                    jsonObj = this.removeNullValues(jsonObj);
                }
                
                if (this.options.sortKeys && typeof jsonObj === 'object' && jsonObj !== null) {
                    jsonObj = this.sortObjectKeys(jsonObj);
                }
                
                return jsonObj;
            } catch (error) {
                this.$noty.error('JSON格式错误：' + error.message);
                return null;
            }
        },

        formatJSON() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = JSON.stringify(jsonObj, null, this.options.indent2 ? 2 : 4);
            }
        },

        minifyJSON() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = JSON.stringify(jsonObj);
            }
        },

        escapeJSON() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = JSON.stringify(JSON.stringify(jsonObj));
            }
        },

        unescapeJSON() {
            if (!this.inputText.trim()) {
                this.$noty.warning('请输入JSON文本');
                return;
            }

            try {
                // 处理已经被转义的JSON字符串
                let input = this.inputText.trim();
                
                // 如果输入的是被转义的JSON字符串（包含引号包裹）
                if ((input.startsWith('"') && input.endsWith('"')) || (input.startsWith('"') && input.endsWith('"'))) {
                    input = input.slice(1, -1);
                }
                
                // 处理转义字符
                let unescaped = input
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .replace(/\\r/g, '\r')
                    .replace(/\\b/g, '\b')
                    .replace(/\\f/g, '\f')
                    .replace(/\\\//g, '/')
                    .replace(/\\\\/g, '\\');
                
                // 尝试解析去转义后的JSON
                const parsed = JSON.parse(unescaped);
                
                // 应用选项处理
                if (this.options.removeNull) {
                    parsed = this.removeNullValues(parsed);
                }
                
                if (this.options.sortKeys && typeof parsed === 'object' && parsed !== null) {
                    parsed = this.sortObjectKeys(parsed);
                }
                
                this.outputText = JSON.stringify(parsed, null, this.options.indent2 ? 2 : 4);
                
            } catch (error) {
                // 如果解析失败，尝试直接处理转义字符
                let result = this.inputText
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .replace(/\\r/g, '\r')
                    .replace(/\\b/g, '\b')
                    .replace(/\\f/g, '\f')
                    .replace(/\\\//g, '/')
                    .replace(/\\\\/g, '\\');
                
                this.outputText = result;
            }
        },

        toYAML() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToYaml(jsonObj, 0);
            }
        },

        toTOML() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToToml(jsonObj);
            }
        },

        toJavaEntity() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToJavaEntity(jsonObj, 'Root');
            }
        },

        toCSharpEntity() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToCSharpEntity(jsonObj, 'Root');
            }
        },
        toPythonClass() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToPythonClass(jsonObj, 'Root');
            }
        },
        toJsonSchema() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToJsonSchema(jsonObj);
            }
        },
        toObjectiveCClass() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToObjectiveCClass(jsonObj, 'Root');
            }
        },
        toCppClass() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToCppClass(jsonObj, 'Root');
            }
        },
        toSwiftClass() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToSwiftClass(jsonObj, 'Root');
            }
        },
        toGoStruct() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToGoStruct(jsonObj, 'Root');
            }
        },
        toRustStruct() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToRustStruct(jsonObj, 'Root');
            }
        },
        toCrystalStruct() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToCrystalStruct(jsonObj, 'Root');
            }
        },
        toTypeScript() {
            const jsonObj = this.processJSON();
            if (jsonObj !== null) {
                this.outputText = this.jsonToTypeScript(jsonObj, 'Root');
            }
        },

        jsonToJavaEntity(obj, className = 'Root') {
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
            const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            const toPascalCase = (str) => str.split('_').map(word => capitalize(word)).join('');
            
            const classes = new Map();
            
            function generateClass(obj, name) {
                if (Array.isArray(obj)) {
                    if (obj.length > 0) {
                        return generateClass(obj[0], name);
                    }
                    return 'List<Object>';
                }
                
                if (obj === null || obj === undefined) {
                    return 'Object';
                }
                
                if (typeof obj !== 'object') {
                    return getJavaType(obj);
                }
                
                const className = toPascalCase(name);
                if (classes.has(className)) {
                    return className;
                }
                
                const fields = [];
                for (const [key, value] of Object.entries(obj)) {
                    const fieldName = toCamelCase(key);
                    const fieldType = getJavaType(value, key);
                    fields.push(`    private ${fieldType} ${fieldName};`);
                }
                
                const classCode = `public class ${className} {
${fields.join('\n')}

${Object.entries(obj).map(([key, value]) => {
    const fieldName = toCamelCase(key);
    const fieldType = getJavaType(value, key);
    const capitalizedName = capitalize(fieldName);
    return `    public ${fieldType} get${capitalizedName}() {
        return ${fieldName};
    }

    public void set${capitalizedName}(${fieldType} ${fieldName}) {
        this.${fieldName} = ${fieldName};
    }`;
}).join('\n\n')}
}`;
                
                classes.set(className, classCode);
                return className;
            }
            
            function getJavaType(value, key = '') {
                if (value === null || value === undefined) {
                    return 'Object';
                }
                
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        return 'List<Object>';
                    }
                    const itemType = getJavaType(value[0]);
                    return `List<${itemType}>`;
                }
                
                switch (typeof value) {
                    case 'string':
                        return 'String';
                    case 'number':
                        return Number.isInteger(value) ? 'Integer' : 'Double';
                    case 'boolean':
                        return 'Boolean';
                    case 'object':
                        const className = toPascalCase(key);
                        if (typeof value === 'object') {
                            return generateClass(value, key);
                        }
                        return 'Object';
                    default:
                        return 'Object';
                }
            }
            
            generateClass(obj, className);
            
            const allClasses = Array.from(classes.values()).reverse();
            return allClasses.join('\n\n');
        },
        
        jsonToCSharpEntity(obj, className = 'Root') {
            const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
            const toPascalCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
                                           .replace(/^[a-z]/, c => c.toUpperCase());
            const toCamelCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
                                           .replace(/^[A-Z]/, c => c.toLowerCase());
            
            const classes = {};
            
            function getCSharpType(value, fieldName) {
                if (value === null) return 'object';
                if (typeof value === 'string') return 'string';
                if (typeof value === 'number') {
                    return Number.isInteger(value) ? 'int' : 'double';
                }
                if (typeof value === 'boolean') return 'bool';
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List<object>';
                    const elementType = getCSharpType(value[0], fieldName);
                    return `List<${elementType}>`;
                }
                if (typeof value === 'object') {
                    return toPascalCase(fieldName);
                }
                return 'object';
            }
            
            function generateClass(obj, name) {
                if (classes[name]) return;
                
                const fields = [];
                const nestedClasses = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const fieldName = toCamelCase(key);
                    const pascalFieldName = toPascalCase(key);
                    let fieldType;
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            fieldType = 'List<object>';
                        } else if (typeof value[0] === 'object' && value[0] !== null) {
                            const elementClassName = toPascalCase(pascalFieldName);
                            fieldType = `List<${elementClassName}>`;
                            nestedClasses.push({ obj: value[0], name: elementClassName });
                        } else {
                            const elementType = getCSharpType(value[0], pascalFieldName);
                            fieldType = `List<${elementType}>`;
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        const nestedClassName = toPascalCase(pascalFieldName);
                        fieldType = nestedClassName;
                        nestedClasses.push({ obj: value, name: nestedClassName });
                    } else {
                        fieldType = getCSharpType(value, pascalFieldName);
                    }
                    
                    fields.push({ 
                        name: fieldName, 
                        type: fieldType, 
                        pascalName: pascalFieldName,
                        originalName: key 
                    });
                }
                
                classes[name] = fields;
                
                nestedClasses.forEach(({ obj, name }) => generateClass(obj, name));
            }
            
            generateClass(obj, className);
            
            let result = '';
            for (const [className, fields] of Object.entries(classes)) {
                result += `public class ${className}\n{\n`;
                
                fields.forEach(field => {
                    result += `    public ${field.type} ${field.pascalName} { get; set; }\n`;
                });
                
                result += '}\n\n';
            }
            
            return result.trim();
        },
        
        jsonToPythonClass(obj, className = 'Root') {
            const toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
            const toPascalCase = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
                                           .replace(/^[a-z]/, c => c.toUpperCase());
            
            const classes = {};
            
            function getPythonType(value) {
                if (value === null) return 'Any';
                if (typeof value === 'string') return 'str';
                if (typeof value === 'number') {
                    return Number.isInteger(value) ? 'int' : 'float';
                }
                if (typeof value === 'boolean') return 'bool';
                if (Array.isArray(value)) {
                    if (value.length === 0) return 'List[Any]';
                    const elementType = getPythonType(value[0]);
                    return `List[${elementType}]`;
                }
                if (typeof value === 'object') {
                    return 'dict'; // Will be replaced with actual class name
                }
                return 'Any';
            }
            
            function generateClass(obj, name) {
                if (classes[name]) return;
                
                const fields = [];
                const nestedClasses = [];
                
                for (const [key, value] of Object.entries(obj)) {
                    const snakeFieldName = toSnakeCase(key);
                    const pascalFieldName = toPascalCase(key);
                    let fieldType;
                    let actualType;
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                            fieldType = 'List[Any]';
                            actualType = 'List[Any]';
                        } else if (typeof value[0] === 'object' && value[0] !== null) {
                            const elementClassName = toPascalCase(snakeFieldName);
                            fieldType = `List['${elementClassName}']`;
                            actualType = `List[${elementClassName}]`;
                            nestedClasses.push({ obj: value[0], name: elementClassName });
                        } else {
                            const elementType = getPythonType(value[0]);
                            fieldType = `List[${elementType}]`;
                            actualType = `List[${elementType}]`;
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        const nestedClassName = toPascalCase(snakeFieldName);
                        fieldType = `'${nestedClassName}'`;
                        actualType = nestedClassName;
                        nestedClasses.push({ obj: value, name: nestedClassName });
                    } else {
                        fieldType = getPythonType(value);
                        actualType = fieldType;
                    }
                    
                    fields.push({ 
                        name: snakeFieldName, 
                        type: fieldType,
                        actualType: actualType,
                        originalName: key 
                    });
                }
                
                classes[name] = fields;
                
                nestedClasses.forEach(({ obj, name }) => generateClass(obj, name));
            }
            
            generateClass(obj, className);
            
            let result = '';
            
            // Add imports
            result += 'from typing import List, Optional, Any\nfrom dataclasses import dataclass\n\n';
            
            for (const [className, fields] of Object.entries(classes)) {
                result += `@dataclass\nclass ${className}:\n`;
                
                if (fields.length === 0) {
                    result += '    pass\n';
                } else {
                    fields.forEach(field => {
                        result += `    ${field.name}: ${field.actualType}\n`;
                    });
                }
                
                result += '\n';
                
                // Add __post_init__ for nested objects
                const nestedFields = fields.filter(f => f.actualType !== 'str' && 
                                                      f.actualType !== 'int' && 
                                                      f.actualType !== 'float' && 
                                                      f.actualType !== 'bool' &&
                                                      !f.actualType.startsWith('List['));
                
                if (nestedFields.length > 0) {
                    result += `    def __post_init__(self):\n`;
                    nestedFields.forEach(field => {
                        result += `        # Handle ${field.name} initialization\n`;
                        result += `        if isinstance(self.${field.name}, dict):\n`;
                        result += `            self.${field.name} = ${field.actualType}(**self.${field.name})\n`;
                    });
                    result += '\n';
                }
            }
            
            return result.trim();
        },
        
        jsonToJsonSchema(obj, title = 'GeneratedSchema') {
            function inferSchema(value, key = '') {
                if (value === null) {
                    return { type: 'null' };
                }
                
                const type = typeof value;
                
                switch (type) {
                    case 'string':
                        return {
                            type: 'string',
                            ...(value && { examples: [value] })
                        };
                    
                    case 'number':
                        return {
                            type: Number.isInteger(value) ? 'integer' : 'number',
                            ...(value && { examples: [value] })
                        };
                    
                    case 'boolean':
                        return {
                            type: 'boolean',
                            examples: [value]
                        };
                    
                    case 'object':
                        if (Array.isArray(value)) {
                            if (value.length === 0) {
                                return {
                                    type: 'array',
                                    items: {}
                                };
                            }
                            
                            // 推断数组元素类型
                            const elementSchemas = value.map(item => inferSchema(item));
                            const uniqueSchemas = [];
                            
                            // 去重并合并相似类型
                            for (const schema of elementSchemas) {
                                const existing = uniqueSchemas.find(s => 
                                    JSON.stringify(s) === JSON.stringify(schema)
                                );
                                if (!existing) {
                                    uniqueSchemas.push(schema);
                                }
                            }
                            
                            let itemsSchema;
                            if (uniqueSchemas.length === 1) {
                                itemsSchema = uniqueSchemas[0];
                            } else {
                                itemsSchema = {
                                    anyOf: uniqueSchemas
                                };
                            }
                            
                            return {
                                type: 'array',
                                items: itemsSchema,
                                ...(value.length > 0 && { examples: [value] })
                            };
                        } else {
                            // 对象类型
                            const properties = {};
                            const required = [];
                            
                            for (const [key, val] of Object.entries(value)) {
                                properties[key] = inferSchema(val, key);
                                required.push(key);
                            }
                            
                            return {
                                type: 'object',
                                properties,
                                required,
                                ...(Object.keys(value).length === 0 && { 
                                    additionalProperties: false 
                                })
                            };
                        }
                    
                    default:
                        return { type: 'any' };
                }
            }
            
            const schema = {
                '$schema': 'http://json-schema.org/draft-07/schema#',
                '$id': `https://example.com/${title.toLowerCase()}.json`,
                title,
                type: 'object',
                ...inferSchema(obj)
            };
            
            // 如果根对象是数组或基本类型，调整schema结构
            if (obj === null) {
                schema.type = 'null';
            } else if (Array.isArray(obj)) {
                delete schema.properties;
                delete schema.required;
                Object.assign(schema, inferSchema(obj));
            } else if (['string', 'number', 'boolean'].includes(typeof obj)) {
                delete schema.properties;
                delete schema.required;
                Object.assign(schema, inferSchema(obj));
            }
            
            return JSON.stringify(schema, null, 2);
        },
        
        jsonToObjectiveCClass(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getObjectiveCType(value, key, parentClassName) {
                    if (value === null) return 'NSNull *';
                    if (typeof value === 'boolean') return 'BOOL';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'NSInteger' : 'CGFloat';
                    }
                    if (typeof value === 'string') return 'NSString *';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return 'NSArray *';
                        
                        const elementType = getObjectiveCType(value[0], key, parentClassName);
                        if (elementType.includes('*')) {
                            return `NSArray<${elementType}> *`;
                        } else {
                            return 'NSArray *';
                        }
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return `${nestedClassName} *`;
                    }
                    
                    return 'id';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    const imports = new Set(['#import <Foundation/Foundation.h>']);
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getObjectiveCType(value, key, formattedClassName);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                            imports.add(`#import "${nestedClassName}.h"`);
                        }
                        
                        let memoryQualifier = '';
                        if (propertyType.includes('*') && !propertyType.includes('NSNull')) {
                            memoryQualifier = 'nonatomic, strong';
                        } else if (propertyType === 'BOOL' || propertyType === 'NSInteger' || propertyType === 'CGFloat') {
                            memoryQualifier = 'nonatomic, assign';
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key,
                            memoryQualifier: memoryQualifier
                        });
                    }
                    
                    let classDefinition = Array.from(imports).join('\n') + '\n\n';
                    classDefinition += `@interface ${formattedClassName} : NSObject\n\n`;
                    
                    for (const prop of properties) {
                        if (prop.memoryQualifier) {
                            classDefinition += `@property (${prop.memoryQualifier}) ${prop.type} ${prop.name};\n`;
                        } else {
                            classDefinition += `@property ${prop.type} ${prop.name};\n`;
                        }
                    }
                    
                    classDefinition += `\n- (instancetype)initWithDictionary:(NSDictionary *)dict;\n`;
                    classDefinition += `+ (instancetype)objectWithDictionary:(NSDictionary *)dict;\n`;
                    classDefinition += `\n@end\n\n`;
                    
                    // Implementation
                    classDefinition += `@implementation ${formattedClassName}\n\n`;
                    classDefinition += `- (instancetype)initWithDictionary:(NSDictionary *)dict {\n`;
                    classDefinition += `    self = [super init];\n`;
                    classDefinition += `    if (self) {\n`;
                    
                    for (const prop of properties) {
                        const jsonKey = prop.jsonKey;
                        
                        if (prop.type === 'BOOL') {
                            classDefinition += `        _${prop.name} = [dict[@"${jsonKey}"] boolValue];\n`;
                        } else if (prop.type === 'NSInteger') {
                            classDefinition += `        _${prop.name} = [dict[@"${jsonKey}"] integerValue];\n`;
                        } else if (prop.type === 'CGFloat') {
                            classDefinition += `        _${prop.name} = [dict[@"${jsonKey}"] doubleValue];\n`;
                        } else if (prop.type === 'NSString *') {
                            classDefinition += `        _${prop.name} = dict[@"${jsonKey}"] ?: @"";\n`;
                        } else if (prop.type === 'NSNull *') {
                            classDefinition += `        _${prop.name} = dict[@"${jsonKey}"];\n`;
                        } else if (prop.type.includes('NSArray')) {
                            if (prop.type.includes('NSString')) {
                                classDefinition += `        _${prop.name} = dict[@"${jsonKey}"] ?: @[];\n`;
                            } else {
                                classDefinition += `        _${prop.name} = dict[@"${jsonKey}"] ?: @[];\n`;
                            }
                        } else if (prop.type.includes('*')) {
                            // Nested object
                            const nestedClassName = prop.type.replace(' *', '');
                            classDefinition += `        NSDictionary *${prop.name}Dict = dict[@"${jsonKey}"];\n`;
                            classDefinition += `        if ([${prop.name}Dict isKindOfClass:[NSDictionary class]]) {\n`;
                            classDefinition += `            _${prop.name} = [[${nestedClassName} alloc] initWithDictionary:${prop.name}Dict];\n`;
                            classDefinition += `        }\n`;
                        }
                    }
                    
                    classDefinition += `    }\n`;
                    classDefinition += `    return self;\n`;
                    classDefinition += `}\n\n`;
                    
                    classDefinition += `+ (instancetype)objectWithDictionary:(NSDictionary *)dict {\n`;
                    classDefinition += `    return [[self alloc] initWithDictionary:dict];\n`;
                    classDefinition += `}\n\n`;
                    classDefinition += `@end`;
                    
                    classes.set(formattedClassName, classDefinition);
                }
                
                processObject(obj, className);
                
                return Array.from(classes.values()).join('\n\n');
            },
            
            jsonToCppClass(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getCppType(value, key, parentClassName) {
                    if (value === null) return 'std::nullptr_t';
                    if (typeof value === 'boolean') return 'bool';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'int' : 'double';
                    }
                    if (typeof value === 'string') return 'std::string';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return 'std::vector<std::any>';
                        
                        const elementType = getCppType(value[0], key, parentClassName);
                        return `std::vector<${elementType}>`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return nestedClassName;
                    }
                    
                    return 'std::any';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    const includes = new Set(['#include <string>', '#include <vector>', '#include <any>']);
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getCppType(value, key, formattedClassName);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key
                        });
                    }
                    
                    let classDefinition = Array.from(includes).join('\n') + '\n\n';
                    classDefinition += `class ${formattedClassName} {\n`;
                    classDefinition += `public:\n`;
                    classDefinition += `    ${formattedClassName}() = default;\n`;
                    classDefinition += `    ~${formattedClassName}() = default;\n\n`;
                    
                    // Constructor with parameters
                    if (properties.length > 0) {
                        classDefinition += `    ${formattedClassName}(`;
                        const params = properties.map(prop => `const ${prop.type}& ${prop.name}`);
                        classDefinition += params.join(', ');
                        classDefinition += `) : `;
                        const initializers = properties.map(prop => `${prop.name}(${prop.name})`);
                        classDefinition += initializers.join(', ');
                        classDefinition += ` {}\n\n`;
                    }
                    
                    // Getters and setters
                    for (const prop of properties) {
                        const capitalizedName = capitalize(prop.name);
                        
                        classDefinition += `    const ${prop.type}& get${capitalizedName}() const {\n`;
                        classDefinition += `        return ${prop.name};\n`;
                        classDefinition += `    }\n\n`;
                        
                        classDefinition += `    void set${capitalizedName}(const ${prop.type}& value) {\n`;
                        classDefinition += `        ${prop.name} = value;\n`;
                        classDefinition += `    }\n\n`;
                    }
                    
                    // JSON serialization methods
                    classDefinition += `    static ${formattedClassName} fromJson(const nlohmann::json& json) {\n`;
                    classDefinition += `        ${formattedClassName} obj;\n`;
                    
                    for (const prop of properties) {
                        const jsonKey = prop.jsonKey;
                        if (prop.type === 'std::string') {
                            classDefinition += `        if (json.contains("${jsonKey}")) {\n`;
                            classDefinition += `            obj.${prop.name} = json["${jsonKey}"].get<std::string>();\n`;
                            classDefinition += `        }\n`;
                        } else if (prop.type === 'int' || prop.type === 'double' || prop.type === 'bool') {
                            classDefinition += `        if (json.contains("${jsonKey}")) {\n`;
                            classDefinition += `            obj.${prop.name} = json["${jsonKey}"].get<${prop.type}>();\n`;
                            classDefinition += `        }\n`;
                        } else if (prop.type.startsWith('std::vector')) {
                            classDefinition += `        if (json.contains("${jsonKey}")) {\n`;
                            classDefinition += `            obj.${prop.name} = json["${jsonKey}"].get<${prop.type}>();\n`;
                            classDefinition += `        }\n`;
                        } else {
                            // Nested object
                            classDefinition += `        if (json.contains("${jsonKey}")) {\n`;
                            classDefinition += `            obj.${prop.name} = ${prop.type}::fromJson(json["${jsonKey}"]);\n`;
                            classDefinition += `        }\n`;
                        }
                    }
                    
                    classDefinition += `        return obj;\n`;
                    classDefinition += `    }\n\n`;
                    
                    classDefinition += `    nlohmann::json toJson() const {\n`;
                    classDefinition += `        nlohmann::json json;\n`;
                    
                    for (const prop of properties) {
                        if (prop.type === 'std::string' || prop.type === 'int' || prop.type === 'double' || prop.type === 'bool') {
                            classDefinition += `        json["${prop.jsonKey}"] = ${prop.name};\n`;
                        } else if (prop.type.startsWith('std::vector')) {
                            classDefinition += `        json["${prop.jsonKey}"] = ${prop.name};\n`;
                        } else {
                            // Nested object
                            classDefinition += `        json["${prop.jsonKey}"] = ${prop.name}.toJson();\n`;
                        }
                    }
                    
                    classDefinition += `        return json;\n`;
                    classDefinition += `    }\n\n`;
                    
                    // Member variables
                    classDefinition += `private:\n`;
                    for (const prop of properties) {
                        classDefinition += `    ${prop.type} ${prop.name};\n`;
                    }
                    
                    classDefinition += `};`;
                    
                    classes.set(formattedClassName, classDefinition);
                }
                
                processObject(obj, className);
                
                // Add JSON library include at the top
                let result = '#include <nlohmann/json.hpp>\n';
                result += Array.from(classes.values()).join('\n\n');
                return result;
            },

            jsonToSwiftClass(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getSwiftType(value, key, parentClassName) {
                    if (value === null) return 'Any?';
                    if (typeof value === 'boolean') return 'Bool';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'Int' : 'Double';
                    }
                    if (typeof value === 'string') return 'String';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return '[Any]';
                        
                        const elementType = getSwiftType(value[0], key, parentClassName);
                        return `[${elementType}]`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return nestedClassName;
                    }
                    
                    return 'Any';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    const codingKeys = [];
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getSwiftType(value, key, formattedClassName);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key
                        });
                        
                        codingKeys.push(`        case ${propertyName} = "${key}"`);
                    }
                    
                    let classDefinition = `import Foundation\n\n`;
                    
                    // CodingKeys enum
                    if (properties.length > 0) {
                        classDefinition += `struct ${formattedClassName}: Codable {\n`;
                        
                        // Properties
                        for (const prop of properties) {
                            classDefinition += `    let ${prop.name}: ${prop.type}\n`;
                        }
                        
                        classDefinition += `}\n\n`;
                        
                        // CodingKeys
                        classDefinition += `extension ${formattedClassName} {\n`;
                        classDefinition += `    enum CodingKeys: String, CodingKey {\n`;
                        classDefinition += codingKeys.join('\n');
                        classDefinition += `\n    }\n`;
                        classDefinition += `}\n\n`;
                    } else {
                        classDefinition += `struct ${formattedClassName}: Codable {\n`;
                        classDefinition += `}\n\n`;
                    }
                    
                    classes.set(formattedClassName, classDefinition);
                }
                
                processObject(obj, className);
                
                let result = Array.from(classes.values()).join('\n\n');
                return result;
            },

            jsonToGoStruct(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getGoType(value, key) {
                    if (value === null) return 'interface{}';
                    if (typeof value === 'boolean') return 'bool';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'int' : 'float64';
                    }
                    if (typeof value === 'string') return 'string';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return '[]interface{}';
                        
                        const elementType = getGoType(value[0], key);
                        return `[]${elementType}`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return nestedClassName;
                    }
                    
                    return 'interface{}';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    const jsonTags = [];
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getGoType(value, key);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key
                        });
                        
                        jsonTags.push(`\`json:"${key}"\``);
                    }
                    
                    let structDefinition = `type ${formattedClassName} struct {\n`;
                    
                    for (let i = 0; i < properties.length; i++) {
                        const prop = properties[i];
                        const tag = jsonTags[i];
                        structDefinition += `    ${prop.name} ${prop.type} ${tag}\n`;
                    }
                    
                    structDefinition += `}`;
                    
                    classes.set(formattedClassName, structDefinition);
                }
                
                processObject(obj, className);
                
                let result = Array.from(classes.values()).join('\n\n');
                return result;
            },

            jsonToRustStruct(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getRustType(value, key) {
                    if (value === null) return 'Option<serde_json::Value>';
                    if (typeof value === 'boolean') return 'bool';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'i64' : 'f64';
                    }
                    if (typeof value === 'string') return 'String';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return 'Vec<serde_json::Value>';
                        
                        const elementType = getRustType(value[0], key);
                        return `Vec<${elementType}>`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return nestedClassName;
                    }
                    
                    return 'serde_json::Value';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getRustType(value, key);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key
                        });
                    }
                    
                    let structDefinition = `use serde::{Deserialize, Serialize};\n\n`;
                    structDefinition += `#[derive(Debug, Clone, Serialize, Deserialize)]\n`;
                    structDefinition += `pub struct ${formattedClassName} {\n`;
                    
                    for (const prop of properties) {
                        structDefinition += `    pub ${prop.name}: ${prop.type},\n`;
                    }
                    
                    structDefinition += `}`;
                    
                    classes.set(formattedClassName, structDefinition);
                }
                
                processObject(obj, className);
                
                let result = Array.from(classes.values()).join('\n\n');
                return result;
            },

            jsonToCrystalStruct(obj, className = 'Root') {
                const classes = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatClassName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getCrystalType(value, key) {
                    if (value === null) return 'JSON::Any?';
                    if (typeof value === 'boolean') return 'Bool';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'Int64' : 'Float64';
                    }
                    if (typeof value === 'string') return 'String';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return 'Array(JSON::Any)';
                        
                        const elementType = getCrystalType(value[0], key);
                        return `Array(${elementType})`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedClassName = formatClassName(key);
                        return nestedClassName;
                    }
                    
                    return 'JSON::Any';
                }
                
                function processObject(obj, className) {
                    const formattedClassName = formatClassName(className);
                    if (classes.has(formattedClassName)) return;
                    
                    const properties = [];
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getCrystalType(value, key);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedClassName = formatClassName(key);
                            processObject(value, nestedClassName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            jsonKey: key
                        });
                    }
                    
                    let structDefinition = `require "json"\n\n`;
                    structDefinition += `struct ${formattedClassName}\n`;
                    structDefinition += `  JSON.mapping({\n`;
                    
                    for (const prop of properties) {
                        structDefinition += `    ${prop.name}: {type: ${prop.type}, nilable: true},\n`;
                    }
                    
                    structDefinition += `  })\n`;
                    structDefinition += `end`;
                    
                    classes.set(formattedClassName, structDefinition);
                }
                
                processObject(obj, className);
                
                let result = Array.from(classes.values()).join('\n\n');
                return result;
            },

            jsonToTypeScript(obj, className = 'Root') {
                const interfaces = new Map();
                
                function capitalize(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                }
                
                function camelCase(str) {
                    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
                             .replace(/^[A-Z]/, match => match.toLowerCase());
                }
                
                function formatInterfaceName(name) {
                    return capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
                }
                
                function getTypeScriptType(value, key) {
                    if (value === null) return 'null';
                    if (typeof value === 'boolean') return 'boolean';
                    if (typeof value === 'number') {
                        return Number.isInteger(value) ? 'number' : 'number';
                    }
                    if (typeof value === 'string') return 'string';
                    
                    if (Array.isArray(value)) {
                        if (value.length === 0) return 'any[]';
                        
                        const elementType = getTypeScriptType(value[0], key);
                        return `${elementType}[]`;
                    }
                    
                    if (typeof value === 'object') {
                        const nestedInterfaceName = formatInterfaceName(key);
                        return nestedInterfaceName;
                    }
                    
                    return 'any';
                }
                
                function processObject(obj, interfaceName) {
                    const formattedInterfaceName = formatInterfaceName(interfaceName);
                    if (interfaces.has(formattedInterfaceName)) return;
                    
                    const properties = [];
                    
                    for (const [key, value] of Object.entries(obj)) {
                        const propertyName = camelCase(key);
                        const propertyType = getTypeScriptType(value, key);
                        
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                            const nestedInterfaceName = formatInterfaceName(key);
                            processObject(value, nestedInterfaceName);
                        }
                        
                        properties.push({
                            name: propertyName,
                            type: propertyType,
                            optional: false
                        });
                    }
                    
                    let interfaceDefinition = `interface ${formattedInterfaceName} {\n`;
                    
                    for (const prop of properties) {
                        interfaceDefinition += `  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type};\n`;
                    }
                    
                    interfaceDefinition += `}`;
                    
                    interfaces.set(formattedInterfaceName, interfaceDefinition);
                }
                
                processObject(obj, className);
                
                let result = Array.from(interfaces.values()).join('\n\n');
                return result;
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

        jsonToYaml(obj, indentLevel = 0) {
            const indent = '  '.repeat(indentLevel);
            
            if (Array.isArray(obj)) {
                return obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return `${indent}- ${this.jsonToYaml(item, indentLevel + 1).trimStart()}`;
                    } else {
                        return `${indent}- ${this.formatYamlValue(item)}`;
                    }
                }).join('\n');
            } else if (typeof obj === 'object' && obj !== null) {
                const lines = [];
                for (const [key, value] of Object.entries(obj)) {
                    if (typeof value === 'object' && value !== null) {
                        lines.push(`${indent}${key}:`);
                        lines.push(this.jsonToYaml(value, indentLevel + 1));
                    } else {
                        lines.push(`${indent}${key}: ${this.formatYamlValue(value)}`);
                    }
                }
                return lines.join('\n');
            }
            return `${indent}${this.formatYamlValue(obj)}`;
        },

        formatYamlValue(value) {
            if (typeof value === 'string') {
                if (value.includes(' ') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '\\"')}"`;
                }
                return value;
            }
            return value;
        },

        jsonToToml(obj, parentKey = '') {
            const lines = [];
            
            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        lines.push(`[[${parentKey}]]`);
                        lines.push(this.jsonToToml(item, parentKey));
                    } else {
                        lines.push(`${this.formatTomlValue(item)}`);
                    }
                });
            } else if (typeof obj === 'object' && obj !== null) {
                for (const [key, value] of Object.entries(obj)) {
                    if (typeof value === 'object' && value !== null) {
                        if (Array.isArray(value)) {
                            lines.push(`[[${key}]]`);
                            value.forEach(item => {
                                if (typeof item === 'object') {
                                    lines.push(this.jsonToToml(item, key));
                                }
                            });
                        } else {
                            lines.push(`[${key}]`);
                            lines.push(this.jsonToToml(value, key));
                        }
                    } else {
                        lines.push(`${key} = ${this.formatTomlValue(value)}`);
                    }
                }
            }
            return lines.join('\n');
        },

        formatTomlValue(value) {
            if (typeof value === 'string') {
                return `"${value.replace(/"/g, '\\"')}"`;
            } else if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            }
            return value;
        },

        copyResult() {
            if (!this.outputText) return;
            
            this.$copyText(this.outputText).then(() => {
                this.$noty.success('结果已复制到剪贴板');
            }).catch(() => {
                this.$noty.error('复制失败，请手动复制');
            });
        },

        clearAll() {
            this.inputText = '';
            this.outputText = '';
        }
    }
};
</script>

<style lang="scss" scoped>
.json-trans {
    .checkbox-group {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
        
        .nya-checkbox {
            margin-right: 0;
            white-space: nowrap;
        }
    }

    .btn-group {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
    }

    .btn-group .nya-btn {
        margin-top: 0;
        flex: 1;
        min-width: 120px;
        text-align: center;
    }

    .result-section {
        position: relative;
        margin-top: 20px;
        
        .result-text {
            background-color: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            white-space: pre-wrap;
            word-break: break-all;
            margin-bottom: 10px;
            max-height: 400px;
            overflow-y: auto;
            line-height: 1.5;
        }
    }

    .tips {
        padding-left: 20px;
        
        li {
            margin-bottom: 8px;
            line-height: 1.6;
        }
    }

    .examples {
        .example-item {
            margin-bottom: 15px;
            
            strong {
                display: block;
                margin-bottom: 5px;
            }
            
            code {
                display: block;
                background-color: var(--bg);
                border: 1px solid var(--border);
                border-radius: 4px;
                padding: 8px 12px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                word-break: break-all;
            }
        }
    }
}
</style>