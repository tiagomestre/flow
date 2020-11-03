import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import home from './views/home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: home,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
});

export default router;
