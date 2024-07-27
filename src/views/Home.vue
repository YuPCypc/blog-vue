<template>
  <div>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.svg" alt="Logo" class="logo">
        </el-col>
        <el-col :span="16">
          <el-input placeholder="Search..." prefix-icon="el-icon-search"></el-input>
        </el-col>
        <el-col :span="4" class="align-right">
          <el-button type="primary">Login</el-button>
          <el-button>Sign Up</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <h3>Hot Topics</h3>
            <el-list>
              <el-list-item v-for="topic in hotTopics" :key="topic.id">
                <router-link :to="`/topic/${topic.id}`">{{ topic.title }}</router-link>
              </el-list-item>
            </el-list>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card v-for="post in posts" :key="post.id" class="post-card">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            <router-link :to="`/post/${post.id}`">Read more...</router-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3>Recommended Users</h3>
            <el-list>
              <el-list-item v-for="user in recommendedUsers" :key="user.id">
                {{ user.name }}
              </el-list-item>
            </el-list>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Home',
  data() {
    return {
      hotTopics: [
        { id: 1, title: 'Vue 3 Tips' },
        { id: 2, title: 'JavaScript Best Practices' },
        { id: 3, title: 'CSS Grid Layout' },
        { id: 4, title: 'CSS Grid Layout' },
        { id: 5, title: 'CSS Grid Layout' }
      ],
      posts: [
        { id: 1, title: 'Post 1', content: 'This is the content of post 1' },
        { id: 2, title: 'Post 2', content: 'This is the content of post 2' },
        { id: 3, title: 'Post 3', content: 'This is the content of post 3' },
        { id: 4, title: 'Post 3', content: 'This is the content of post 3' },
        { id: 5, title: 'Post 3', content: 'This is the content of post 3' }
      ],
      recommendedUsers: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
        { id: 4, name: 'User 3' },
        { id: 5, name: 'User 3' }
      ]
    }
  }
})
</script>

<style scoped>
.logo {
  height: 50px;
}
.align-right {
  text-align: right;
}
.post-card {
  margin-bottom: 20px;
}
</style>

