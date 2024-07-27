import { createStore } from 'vuex'

interface Post {
    id: number;
    title: string;
    content: string;
}

interface State {
    posts: Post[];
}

export default createStore<State>({
    state: {
        posts: []
    },
    mutations: {
        setPosts(state, posts: Post[]) {
            state.posts = posts
        },
        addPost(state, post: Post) {
            state.posts.push(post)
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
        }
    },
    modules: {}
})

