<template>
    <div class="chinese_id">
        <div class="content">
        <nya-container title="身份证号码查询">
            <div class="inputbtn mb-15">
                <nya-input
                    v-model.trim="chineseId"
                    label="请输入身份证号码"
                    :placeholder="placeholder"
                    autocomplete="off"
                    autofocus
                    fullwidth
                />
                <div class="btn-primary ml-15" @click="chineseId = idCard.makeID()">
                    🎲 随机生成
                </div>
            </div>
            
        </nya-container>

        <nya-container v-if="results" title="获取成功">
            <p><b>性别：</b>{{ results.sex }}</p>
            <p><b>年龄：</b>{{ results.age }} 岁</p>
            <p><b>住址：</b>{{ results.address }}</p>
            <p><b>生日：</b>{{ results.birthDay.date }}</p>
            <p><b>农历生日：</b>{{ results.birthDay.nongCn }}</p>
            <p><b>出生周：</b>{{ results.birthDay.week }}</p>
            <p><b>星座：</b>{{ results.birthDay.zodiac }}</p>
            <p><b>生肖：</b>{{ results.birthDay.zodiac_zh }}</p>
        </nya-container>

        <nya-container title="说明">
            <ul class="nya-list">
                <li>若因使用这些随机生成的身份证号码而产生任何问题和纠纷，本网站不承担任何直接或间接的责任！</li>
                <li>所有计算均在本地进行，不会保存您的任何数据</li>
            </ul>
        </nya-container>
    
        </div>
        
</div>
</template>

<script>

import idCard from '~/utils/idCard.js';
export default {
    name: 'ChineseId',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        
    },
    data() {
        return {
            chineseId: '',
            requestIn: false,
            idCard: idCard,
            placeholder: ''
        };
    },
    computed: {
        results() {
            if (this.idCard.checkIdCard(this.chineseId)) {
                return this.idCard.all(this.chineseId);
            } else {
                return '';
            }
        }
    },
    mounted() {
        let id = idCard.makeID();
        this.placeholder = id;
    },
    methods: {
        goHome() {
            this.$router.push('/');
        }
    },
};
</script>

<style lang="scss">
.chinese_id {
    .content {
        padding: 20px 24px;
        min-width: 0;
    }
    .nya-btn {
        margin-top: 15px;
    }
}
</style>
