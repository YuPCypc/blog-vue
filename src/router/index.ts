import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Forum from '../views/Forum.vue'
import Post from '../views/Post.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/forum',
        name: 'Forum',
        component: Forum
    },
    {
        path: '/post/:id',
        name: 'Post',
        component: Post
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

