import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/developers',
        name: 'Developers',
        component: () => import('@/views/Developers.vue'),
    },
    {
        path: '/jobs',
        name: 'Jobs',
        component: () => import('@/views/Jobs.vue'),
    },
    {
        path: '/job',
        name: 'Job Details',
        component: () => import('@/views/JobDetails.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
