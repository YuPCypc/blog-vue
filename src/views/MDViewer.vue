<script lang="ts">
import {defineComponent, onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {Viewer} from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlightssr from '@bytemd/plugin-highlight-ssr';
import highlight from '@bytemd/plugin-highlight';
import axios from '@/axios'; // 确保你已正确配置 axios
import 'juejin-markdown-themes/dist/juejin.min.css';
import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";
import {ElCard, ElRow, ElCol, ElDivider, ElMessage} from 'element-plus';
import Navbar from "@/components/Navbar.vue";
import {ArticleDetailRespDTO, ArticleRespDTO} from '@/models/ArticleRespDTO';
import UserCard from "@/components/UserCard.vue";


export default defineComponent({
  name: 'MDViewer',
  components: {
    UserCard,
    Navbar,
    Viewer,
    ElCard,
    ElRow,
    ElCol,
    ElDivider
  },
  setup() {
    const route = useRoute();
    const id = route.params.id as string;
    const isLiked = ref(false);
    const isFavorite = ref(false);

    const articleData = reactive<ArticleDetailRespDTO>({
      id: '',
      title: '',
      summary: '',
      content: '',
      categoryId: 0,
      userRespVO: {
        id: '',
        nickname: '',
        email: '',
        phone: '',
        bio: '',
        avatarUri: ''
      },
      likeCount: 0,
      viewCount: 0,
      favoriteCount: 0,
      updateTime: ''
    });


    const plugins = [
      gfm(),
      highlight(),
      highlightssr(),
    ];

    const fetchContent = async (id: string) => {
      try {
        const response = await axios.get(`/api/post/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        }); // 替换成你的实际 API 路径
        console.log(response.data);
        articleData.id = id; // 假设返回的数据结构为 { id: '...' }
        articleData.content = response.data.data.content; // 假设返回的数据结构为 { content: '...' }
        articleData.title = response.data.data.title; // 假设返回的数据结构为 { title: '...' }
        articleData.userRespVO.nickname = response.data.data.userRespVO.nickname; // 假设返回的数据结构为 { author: '...' }
        articleData.userRespVO.avatarUri = response.data.data.userRespVO.avatarUri;
        articleData.userRespVO.bio = response.data.data.userRespVO.bio;
        articleData.updateTime = formatDateTime(response.data.data.updateTime);
        articleData.likeCount = response.data.data.likeCount;
        articleData.viewCount = response.data.data.viewCount;
        articleData.favoriteCount = response.data.data.favoriteCount;
        articleData.categoryId = response.data.data.categoryId;
        if(response.data.data.hasThumb) {
          isLiked.value = true;
        }
        if(response.data.data.hasFavour) {
          isFavorite.value = true;
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
      try {
        const response = await axios.put(`/api/post/${id}/view`, null,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        }); // 替换成你的实际 API 路径
      } catch (error) {
        console.error('Failed to increment ViewCount:', error);
      }
    };

    const formatDateTime = (dateTimeString: string): string => {
      const date = new Date(dateTimeString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat('zh-CN', options);
      const parts = formatter.formatToParts(date);

      let formattedDate = '';
      parts.forEach((part) => {
        switch (part.type) {
          case 'year':
            formattedDate += part.value + '年';
            break;
          case 'month':
            formattedDate += part.value + '月';
            break;
          case 'day':
            formattedDate += part.value + '日 ';
            break;
          case 'hour':
          case 'minute':
            formattedDate += part.value + (part.type === 'hour' ? ':' : '');
            break;
          default:
            break;
        }
      });

      return formattedDate;
    };


    onMounted(() => {
      if (id) {
        fetchContent(id);
      }
    });

    watch(() => route.params.id, (newId) => {
      if (newId) {
        fetchContent(newId);
      }
    });

    const showMessage = async (action: string, postId: string) => {
      console.log( postId);
      try {
        if (action === '点赞') {
          await toggleLike(postId);
          isLiked.value = !isLiked.value;
        } else if (action === '收藏') {
          await toggleFavorite(postId);
          isFavorite.value = !isFavorite.value;
        }

        const actionText = isLiked.value || isFavorite.value ? `${action}成功` : `取消${action}成功`;
        ElMessage({
          message: actionText,
          type: 'success',
          duration: 2000,
        });
      } catch (error) {
        ElMessage({
          message: `${action}失败，请重试`,
          type: 'error',
          duration: 2000,
        });
      }
    };

    const toggleLike = async (postId: string) => {
      console.log(postId);
      await axios.put(`/api/post/${postId}/like`,null,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    };

    const toggleFavorite = async (postId: string) => {
      await axios.put(`/api/post/${postId}/collect`,null,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    };

    return {
      plugins,
      articleData,
      showMessage,
      isLiked,
      isFavorite
    };
  },
});
</script>

<template>
  <div class="container">
    <div class="navbar-container">
      <Navbar/>
    </div>
    <el-card class="article-viewer">
      <el-row>
        <el-col :span="24">
          <h1>{{ articleData.title }}</h1> <!-- 显示标题 -->
        </el-col>
      </el-row>
      <div class="article-read-info">
        {{ articleData.updateTime }}
        <span></span>
        浏览量：{{ articleData.viewCount }}
        点赞数：{{ articleData.likeCount }}
        收藏数：{{ articleData.favoriteCount }}
      </div>
      <el-row>
        <el-col :span="24">
          <div class="post-viewer-info">
            <UserCard :user="articleData.userRespVO" class="post-viewer-info-left"></UserCard>

            <el-link :underline="false" :to="'/user/' + articleData.userRespVO.id" class="user-link">
              {{ articleData.userRespVO.nickname }}
            </el-link>
          </div>
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <Viewer :value="articleData.content" :plugins="plugins" class="viewer-container"/>
        </el-col>
        <el-divider></el-divider>
        <el-row :gutter="20" style="margin-top: 10px;">
          <el-col :span="12">
            <el-button type="primary"  @click="showMessage('点赞',articleData.id)" circle>
              <font-awesome-icon :icon="isLiked ? ['fas', 'thumbs-up'] : ['far', 'thumbs-up']"
                                 class="text-blue-500"
                                 style="font-size: 15px;" />
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="warning"  @click="showMessage('收藏',articleData.id)" circle>
              <el-icon>
                <component :is="isFavorite ? 'StarFilled' : 'Star'"/>
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
  background: #e8e8e8;
}

.article-viewer {
  margin: 20px;
  padding: 20px;
  width: 50%;
}

.viewer-container {
  margin-top: 20px;
}

.article-read-info {
  font-size: 14px;
  color: #909399;
}

.post-viewer-info {
  display: flex;
  padding: 10px; /* 内边距 */
}

.post-viewer-info-left {
  margin-right: 10px;
}
</style>
