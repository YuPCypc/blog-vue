// store/index.js
import { createStore } from 'vuex';
import axios from '@/axios';

export default createStore({
    state: {
        user: null,
        isAuthenticated: false,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isAuthenticated = true;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
        updateUser(state, updatedUser) {
            state.user = { ...state.user, ...updatedUser };
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    actions: {
        login({ commit }, user) {
            commit('setUser', user);
        },
        logout({ commit }) {
            commit('logout');
            localStorage.removeItem('jwt'); // 清除 localStorage 中的 JWT 令牌
        },
        updateUser({ commit }, updatedUser) {
            commit('updateUser', updatedUser);
        },
        async initializeStore({ commit }) {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    // 发送请求到后端，JWT 作为查询参数
                    const response = await axios.get('/auth/verify-token', {
                        params: {
                            token: token
                        }
                    });
                    if (response.data.success) {
                        const user = { username: response.data.data.username };
                        const newToken = response.data.data.token;
                        localStorage.setItem('jwt', newToken);
                        commit('setUser', user);
                    } else {
                        commit('clearUser');
                        localStorage.removeItem('jwt');
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    commit('clearUser');
                    localStorage.removeItem('jwt');
                }
            }
        }

    },
});

