<template>
  <div>
    <div class="navbar-container">
      <Navbar/>
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
                <el-menu-item index="1">综合</el-menu-item>
                <el-menu-item index="2">前端技术</el-menu-item>
                <el-menu-item index="3">后端技术</el-menu-item>
                <el-menu-item index="4">人工智能</el-menu-item>
                <el-menu-item index="5">移动端技术</el-menu-item>
                <el-menu-item index="6">底层技术</el-menu-item>
              </el-menu>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card v-for="post in posts" :key="post.id" class="post-card">
              <h3 @click="navigateToPost(post.id)" class="clickable">{{ post.title }}</h3>
              <p @click="navigateToPost(post.id)" class="clickable">{{ post.summary }}</p>
              <div class="post-footer">
                <div class="post-info">
                  <el-avatar :src="post.userRespVO.avatarUri" class="clickable-avatar-inner"
                             @click="navigateToProfile"></el-avatar>
                  <el-link :underline="false" :to="'/user/' + post.authorId" class="user-link">{{ post.userRespVO.nickname }}</el-link>
                </div>
                <span>浏览量: {{ post.viewCount }}</span>
                <el-button @click="toggleFavorite(post.id)" type="primary">
                  <el-icon>
                    <component :is="post.liked ? 'StarFilled' : 'Star'"/>
                  </el-icon>
                  {{ post.liked ? '已收藏' : '收藏' }}
                </el-button>
                <el-button @click="navigateToPost(post.id)" type="primary">
                  <el-icon>
                    <Comment/>
                  </el-icon>
                  评论
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
import {defineComponent, reactive, ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import {Star, StarFilled} from '@element-plus/icons-vue'
import axios from "@/axios";
import {ArticleRespDTO} from '@/models/ArticleRespDTO' // 根据实际路径调整

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Star,
    StarFilled,
  },
  setup() {
    const router = useRouter()

    const posts = reactive<ArticleRespDTO[]>([])
    const recommendedUsers = [
      {id: 1, name: 'User 1'},
      {id: 2, name: 'User 2'},
      {id: 3, name: 'User 3'}
    ]

    const handleMenuSelect = (index: string) => {
      const categoryId = parseInt(index) // 将选择的索引转为数字，假设索引对应类别 ID
      fetchPosts(categoryId)
    }

    const navigateToPost = (postId: number) => {
      router.push({name: 'PostDetail', params: {id: postId}})
    }

    const navigateToProfile = () => {
      // TODO: 跳转到其他用户详情页
    }

    const toggleFavorite = async (postId: number) => {
      const post = posts.find(p => p.id === postId)
      if (post) {
        post.liked = !post.liked
        try {
          await axios.post('/api/favorite', {id: postId, liked: post.liked})
          console.log('Favorite status updated')
        } catch (error) {
          console.error('Error updating favorite status:', error)
        }
      }
    }

    const fetchPosts = async (categoryId: number) => {
      try {
        const response = await axios.post('/api/post/list', {
              categoryId: categoryId,
              page: 1,
              pageSize: 10
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
              }
            }
        )
        console.log('Fetched posts:', response)
        posts.splice(0, posts.length, ...response.data.data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    onMounted(() => {
      fetchPosts(1)
    })

    return {
      posts,
      recommendedUsers,
      handleMenuSelect,
      navigateToPost,
      toggleFavorite,
      navigateToProfile,
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

.clickable-avatar-inner:hover {
  cursor: pointer;
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
