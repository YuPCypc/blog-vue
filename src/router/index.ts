import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Forum from '../views/Forum.vue'
import Post from '../views/Post.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '@/views/Profile.vue'

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
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },

    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

