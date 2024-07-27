<template>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { State, Post } from '../store'

export default defineComponent({
  name: 'Post',
  setup() {
    const store = useStore<State>()
    const route = useRoute()

    const post = computed(() => {
      const postId = Number(route.params.id)
      return store.state.posts.find((post: Post) => post.id === postId)
    })

    return {
      post
    }
  }
})
</script>
