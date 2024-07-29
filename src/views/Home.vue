<template>
  <div>
    <div class="navbar-container">
      <Navbar />
    </div>
    <div class="home-page">
      <el-main>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="fixed-sidebar">
              <el-menu
                  default-active="1"
                  class="el-menu-vertical-demo"
                  @select="handleMenuSelect">
                <el-menu-item index="1">最新</el-menu-item>
                <el-menu-item index="2">后端技术</el-menu-item>
                <el-menu-item index="3">前端技术</el-menu-item>
                <el-menu-item index="4">JAVA</el-menu-item>
                <el-menu-item index="5">PYTHON</el-menu-item>
                <el-menu-item index="6">GOLANG</el-menu-item>
                <el-menu-item index="7">VUE</el-menu-item>
                <el-menu-item index="8">REACT</el-menu-item>
              </el-menu>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card v-for="post in posts" :key="post.id" class="post-card">
              <h3 @click="navigateToPost(post.id)" class="clickable">{{ post.title }}</h3>
              <p @click="navigateToPost(post.id)" class="clickable">{{ post.content }}</p>
              <div class="post-footer">
                <router-link :to="`/user/${post.userId}`" class="user-link">{{ post.userName }}</router-link>
                <span>浏览量: {{ post.views }}</span>
                <el-button @click="toggleFavorite" type="primary">
                  <el-icon>
                    <component :is="isFavorited ? 'StarFilled' : 'Star'" />
                  </el-icon>
                  {{ isFavorited ? '已收藏' : '收藏' }}
                </el-button>
                <el-button @click="navigateToPost(post.id)" type="primary">
                  <el-icon>
                    <Comment />
                  </el-icon>
                  {{'评论'}}
                </el-button>
              </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import axios from 'axios'

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Star,
    StarFilled
  },
  setup() {
    const router = useRouter()

    const posts = reactive(Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      content: `This is the content of post ${i + 1}`,
      userId: i % 3 + 1,
      userName: `User ${i % 3 + 1}`,
      views: Math.floor(Math.random() * 1000),
      liked: false
    })))

    const recommendedUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ]

    const handleMenuSelect = (index: string) => {
      console.log('Selected menu item:', index)
      // 根据选择的菜单项加载不同的帖子内容
      // 这里可以根据实际需求发起请求获取对应分类的帖子
    }

    const navigateToPost = (postId: number) => {
      router.push({ name: 'PostDetail', params: { id: postId } })
    }

    const toggleLike = (post: any) => {
      post.liked = !post.liked
      if (post.liked) {
        post.views += 1
      } else {
        post.views -= 1
      }
    }

    const isFavorited = ref(false)

    const toggleFavorite = async () => {
      isFavorited.value = !isFavorited.value
      try {
        const response = await axios.post('/api/favorite', {
          isFavorited: isFavorited.value
        })
        console.log('Response from server:', response.data)
      } catch (error) {
        console.error('Error sending data to server:', error)
      }
    }


    return {
      posts,
      recommendedUsers,
      isFavorited,
      handleMenuSelect,
      navigateToPost,
      toggleLike,
      toggleFavorite,
    }
  }
})
</script>

<style scoped>
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff; /* 背景颜色为白色 */
  border-bottom: 1px solid #dcdfe6; /* 底部边框 */
  width: 100%;
}

.home-page {
  background-color: #f0f0f0; /* 设置背景颜色为浅灰色 */
  min-height: 100vh; /* 设置最小高度为 100% 视口高度 */
  padding: 20px; /* 添加一些内边距 */
}

.fixed-sidebar {
  position: sticky;
  top: 20px;
  background-color: #ffffff; /* 自定义背景色 */
  border: 1px solid #dcdfe6; /* 边框颜色 */
  padding: 20px; /* 内边距 */
}

.post-card {
  margin-bottom: 20px;
}

.clickable {
  cursor: pointer;
  color: #070707;
}

.clickable:hover {
  color: #787b7e;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.user-link {
  color: #050505;
  cursor: pointer;
}

.user-link:hover {
  color: #0978ea;
}

.like {
  cursor: pointer;
  color: #d3dbe3;
}

.like:hover {
  color: #007bff;
}
</style>
