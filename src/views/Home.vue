<template>
  <div class="navbar-container">
    <Navbar/>
  </div>
  <div class="scroll-container" @scroll="handleScroll" ref="scrollContainer">
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
                <div class="post-viewer-info">
                  <UserCard :user="post.userRespVO" class="post-viewer-info-left"></UserCard>
                  <el-link :underline="false" :to="'/user/' + post.authorId" class="user-link">
                    {{ post.userRespVO.nickname }}
                  </el-link>
                </div>
                <span>浏览量: {{ post.viewCount }}</span>
                <el-button @click="toggleFavorite(post.id)" type="primary">
                  <el-icon>
                    <component :is="post.likeCount ? 'StarFilled' : 'Star'"/>
                  </el-icon>
                  {{ post.likeCount ? '已收藏' : '收藏' }}
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
import {defineComponent, reactive, ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import {Star, StarFilled} from '@element-plus/icons-vue';
import axios from "@/axios";
import {ArticleRespDTO} from '@/models/ArticleRespDTO';
import UserCard from "@/components/UserCard.vue";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Star,
    StarFilled,
    UserCard,
  },
  setup() {
    const router = useRouter();
    const posts = reactive<ArticleRespDTO[]>([]);
    let categoryId= ref(1);
    const recommendedUsers = [
      {id: 1, name: 'User 1'},
      {id: 2, name: 'User 2'},
      {id: 3, name: 'User 3'}
    ];
    const currentPage = ref(1);
    const isFetching = ref(false);
    const scrollContainer = ref<HTMLElement | null>(null);

    const handleMenuSelect = (index: string) => {
      categoryId.value = parseInt(index);
      fetchPosts(categoryId.value, 1);
      currentPage.value = 1;
    };

    const navigateToPost = (postId: string) => {
      router.push({name: 'ArticleViewer', params: {id: postId}});
    };

    const toggleFavorite = async (postId: string) => {
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.likeCount = !post.likeCount;
        try {
          await axios.post('/api/favorite', {id: postId, liked: post.likeCount});
          console.log('Favorite status updated');
        } catch (error) {
          console.error('Error updating favorite status:', error);
        }
      }
    };

    const fetchPosts = async (categoryId: number, page: number) => {
      try {
        if (isFetching.value) return;
        isFetching.value = true;
        const response = await axios.post('/api/post/list', {
          categoryId: categoryId,
          currentPage: page,
          pageSize: 5,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        console.log(response);
        if (page === 1) {
          posts.splice(0, posts.length, ...response.data.data.records);
        } else {
          posts.push(...response.data.data.records);
        }
        isFetching.value = false;
      } catch (error) {
        console.error('Error fetching posts:', error);
        isFetching.value = false;
      }
    };

    const handleScroll = () => {
      const container = scrollContainer.value;
      if (container) {
        const {scrollTop, scrollHeight, clientHeight} = container;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          currentPage.value += 1;
          fetchPosts(categoryId.value, currentPage.value);
        }
      }
    };

    onMounted(() => {
      fetchPosts(1, 1);
    });

    return {
      posts,
      recommendedUsers,
      handleMenuSelect,
      navigateToPost,
      toggleFavorite,
      handleScroll,
      scrollContainer,
    };
  }
});
</script>

<style scoped>

html{
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 禁止 body 滚动 */
}

.navbar-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  width: 100%;
}

.scroll-container {
  height: calc(100vh - 56px); /* 设置容器高度，减去导航栏高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  margin: 0;
  padding: 0;
}

.home-page {
  background-color: #f0f0f0;
  min-height: 100vh;

}

.fixed-sidebar {
  position: sticky;
  top: 20px;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  padding: 20px;
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

.post-viewer-info {
  display: flex;
  padding: 10px; /* 内边距 */
}
.post-viewer-info-left {
  margin-right: 10px;
}
</style>
