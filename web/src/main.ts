import Vue from 'vue';
import app from './app.vue';

import router from './router';

import './assets/styles/index.css';
import './assets/styles/base.scss';

Vue.config.productionTip = false;

async function main() {
    new Vue({
        router,
        render: h => h(app),
    }).$mount('#app');
}

main();
