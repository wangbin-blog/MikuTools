<template>
    <div class="remove_duplicate">
        <div class="content">
        <nya-container title="文本去重">
            <nya-input v-model.trim="content" fullwidth rows="8" type="textarea" autofocus autocomplete="off" label="待处理的内容" :placeholder="'aaa\naaa'" />
        </nya-container>
        <nya-container v-if="result" title="处理结果">
            <nya-copy :copy="result">
                <div v-text="result"></div>
            </nya-copy>
        </nya-container>
    
        </div>
        <SiteFooter @donate="goHome" />
</div>
</template>

<script>import SiteFooter from '~/components/SiteFooter';

import _ from 'lodash';
export default {
    name: 'RemoveDuplicate',
    head() {
        return this.$store.state.currentTool.head;
    },
    components: {
        SiteFooter,
    },
    data() {
        return {
            content: ''
        };
    },
    computed: {
        result() {
            return _.chain(this.content.split('\n'))
                .uniq()
                .join('\n')
                .value();
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        }
    },
};
</script>
