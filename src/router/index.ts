import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'
import About from '../pages/about.vue'

import Canvas from '../components/canvas.vue'
import Echarts from '../components/echarts.vue'
import MapConfig from '../components/mapConfig.vue'
import Three from '../components/three.vue'
import Video from '../components/video.vue'
import VirtualList from '../components/virrtualList.vue'
import DjClub from '../components/djClub.vue'

const routes : Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about/',
        name: 'About',
        component: About,
        children: [
            {
                path: 'canvas',
                name: 'Canvas',
                component: Canvas,
            },
            {
                path: 'echarts',
                name: 'Echarts',
                component: Echarts,
            },
            {
                path: 'mapConfig',
                name: 'MapConfig',
                component: MapConfig,
            },
            {
                path: 'three',
                name: 'Three',
                component: Three,
            },
            {
                path: 'video',
                name: 'Video',
                component: Video,
            },
            {
                path: 'virtualList',
                name: 'VirtualList',
                component: VirtualList,
            },
            {
                path: 'djClub',
                name: 'DjClub',
                component: DjClub,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router