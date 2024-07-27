<template>
  <div>
    <h1>Forum</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
      </li>
    </ul>
    <button @click="createNewPost">Create New Post</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { State } from '../store'

export default defineComponent({
  name: 'Forum',
  setup() {
    const store = useStore<State>()

    const posts = computed(() => store.state.posts)

    const fetchPosts = () => {
      store.dispatch('fetchPosts')
    }

    const createNewPost = () => {
      const newPost = { id: posts.value.length + 1, title: 'New Post', content: 'This is a new post.' }
      store.dispatch('createPost', newPost)
    }

    onMounted(() => {
      fetchPosts()
    })

    return {
      posts,
      createNewPost
    }
  }
})
</script>


