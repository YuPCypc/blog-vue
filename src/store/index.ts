import { createStore } from 'vuex'

export interface UserState {
    isAuthenticated: boolean
    user: {
        avatar: string
        email: string
        phone: string
        name: string
        bio: string
    } | null
}

interface Post {
    id: number;
    title: string;
    content: string;
}

interface State {
    posts: Post[];
    isAuthenticated: boolean;
    user: UserState['user'] | null;
}

export default createStore<State>({
    state: {
        posts: [],
        isAuthenticated: false,
        user: {
            avatar: 'default_user.png',
            email: 'example@example.com',
            phone: '1234567890',
            name: 'User Name',
            bio: 'User bio'
        }
    },
    mutations: {
        setPosts(state, posts: Post[]) {
            state.posts = posts
        },
        addPost(state, post: Post) {
            state.posts.push(post)
        },
        login(state, user) {
            state.isAuthenticated = true
            state.user = user
        },
        logout(state) {
            state.isAuthenticated = false
            state.user = null
        },
        updateUser(state, user) {
            state.user = user
        }
    },
    actions: {
        fetchPosts({ commit }) {
            // 模拟异步获取数据
            const posts: Post[] = [
                { id: 1, title: 'First Post', content: 'This is the first post.' },
                { id: 2, title: 'Second Post', content: 'This is the second post.' }
            ]
            commit('setPosts', posts)
        },
        createPost({ commit }, post: Post) {
            // 模拟创建新帖子
            commit('addPost', post)
        },
        login({ commit }, user) {
            commit('login', user)
        },
        logout({ commit }) {
            commit('logout')
        },
        updateUser({ commit }, user) {
            commit('updateUser', user)
        }
    },
    modules: {}
})
