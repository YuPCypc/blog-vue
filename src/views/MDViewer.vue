<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {Viewer} from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlightssr from '@bytemd/plugin-highlight-ssr';
import highlight from '@bytemd/plugin-highlight';
import axios from '@/axios'; // 确保你已正确配置 axios
import 'juejin-markdown-themes/dist/juejin.min.css';
import "bytemd/dist/index.css";
import "highlight.js/styles/default.css";
import {ElCard, ElRow, ElCol, ElDivider, ElMessage, ElPagination} from 'element-plus';
import Navbar from "@/components/Navbar.vue";
import {ArticleDetailRespDTO, CommentRespDTO} from '@/models/ArticleRespDTO';
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
    ElDivider,
    ElPagination
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
      updateTime: '',
    });
    const commentData = reactive<CommentRespDTO[]>([]);
    const currentPage = ref(1);
    const totalComments = ref(0);
    const pageSize = 5;
    const isFetching = ref(false);
    let replyingCommentId = ref('0');

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
        if (response.data.data.hasThumb) {
          isLiked.value = true;
        }
        if (response.data.data.hasFavour) {
          isFavorite.value = true;
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
      try {
        await axios.put(`/api/post/${id}/view`, null, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        }); // 替换成你的实际 API 路径
      } catch (error) {
        console.error('Failed to increment ViewCount:', error);
      }
      await fetchComments(id, currentPage.value);
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
      console.log(postId);
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
      await axios.put(`/api/post/${postId}/like`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    };

    const toggleFavorite = async (postId: string) => {
      await axios.put(`/api/post/${postId}/collect`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    };

    const newComment = reactive({
      content: '',
      parentId: null as string | null,
      rootCommentId: null as string | null,
    });

    const replyContent = reactive({
      content: '',
      parentId: null as string | null,
      rootCommentId: null as string | null,
    });

    let parentId = ref<string | null>(null);
    let rootCommentId = ref<string | null>(null);

    const submitComment = async () => {
      if (!newComment.content.trim()) {
        ElMessage({
          message: '评论内容不能为空',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      try {
        const response = await axios.post(`/api/comments`, {
          articleId: articleData.id,
          content: newComment.content,
          rootCommentId: newComment.rootCommentId,
          replyCommentId: '-1',
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        console.log("comment: ", response);
        ElMessage({
          message: '评论成功',
          type: 'success',
          duration: 2000,
        });
        await fetchComments(articleData.id, 1); // 重新获取第一页的评论
        newComment.content = '';
        newComment.parentId = null;
        newComment.rootCommentId = null;
      } catch (error) {
        ElMessage({
          message: '评论失败，请重试',
          type: 'error',
          duration: 2000,
        });
      }
    };

    const replyToComment = (commentId: string) => {
      if (replyingCommentId.value == '0') {
        replyingCommentId.value = commentId;
      } else if(replyingCommentId.value == commentId) {
        replyingCommentId.value = '0';
      }
      replyContent.parentId = commentId;
      const rootComment = commentData.find(comment => comment.id === commentId);
      replyContent.rootCommentId = rootComment?.id || '0';
    };

    const toggleLikeComment = async (commentId: string) => {
      try {
        await axios.post(`/api/comments/like`, {
          commentId: commentId,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        await fetchComments(articleData.id, currentPage.value); // 重新获取当前页的评论列表，更新点赞数
      } catch (error) {
        ElMessage({
          message: '点赞失败，请重试',
          type: 'error',
          duration: 2000,
        });
      }
    };

    const handlePageChange = (page: number) => {
      currentPage.value = page;
      fetchComments(articleData.id, page);
    };

    const fetchComments = async (articleId: string, page: number) => {
      try {
        if (isFetching.value) return;
        isFetching.value = true;
        const response = await axios.post('/api/comments/list', {
          articleId: articleId,
          currentPage: page,
          pageSize: pageSize,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        commentData.splice(0, commentData.length, ...response.data.data.records);
        totalComments.value = response.data.data.total;
      } catch (error) {
        ElMessage({
          message: '获取评论失败，请重试',
          type: 'error',
          duration: 2000,
        });
      } finally {
        isFetching.value = false;
      }
    };

    const submitReply = async (commentId: string) => {
      // 处理回复逻辑
      if (!replyContent.content.trim()) {
        ElMessage({
          message: '评论内容不能为空',
          type: 'warning',
          duration: 2000,
        });
        return;
      }
      console.log(replyContent.content);
      try {
        const response = await axios.post(`/api/comments`, {
          articleId: articleData.id,
          content: replyContent.content,
          rootCommentId: replyContent.rootCommentId,
          replyCommentId: commentId,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        console.log("comment: ", response);
        ElMessage({
          message: '评论成功',
          type: 'success',
          duration: 2000,
        });
        await fetchComments(articleData.id, 1); // 重新获取第一页的评论
        // 清空回复框并隐藏
        replyContent.content = '';
        replyContent.parentId = null;
        replyContent.rootCommentId = null;
        replyingCommentId.value = '0';
      } catch (error) {
        ElMessage({
          message: '评论失败，请重试',
          type: 'error',
          duration: 2000,
        });
      }


    };

    return {
      articleData,
      commentData,
      newComment,
      submitComment,
      replyToComment,
      toggleLike,
      toggleFavorite,
      showMessage,
      toggleLikeComment,
      plugins,
      isLiked,
      isFavorite,
      currentPage,
      totalComments,
      pageSize,
      handlePageChange,
      formatDateTime,
      replyingCommentId,
      replyContent,
      submitReply
    };
  }
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
            <el-button type="primary" @click="showMessage('点赞',articleData.id)" circle>
              <font-awesome-icon :icon="isLiked ? ['fas', 'thumbs-up'] : ['far', 'thumbs-up']"
                                 class="text-blue-500"
                                 style="font-size: 15px;"/>
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="warning" @click="showMessage('收藏',articleData.id)" circle>
              <el-icon>
                <component :is="isFavorite ? 'StarFilled' : 'Star'"/>
              </el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-row>
    </el-card>

    <!-- 评论区 -->
    <el-card class="comment-section">
      <h2>评论区</h2>
      <!-- 评论输入框 -->
      <el-row>
        <el-col :span="24">
          <el-input
              type="textarea"
              placeholder="写下你的评论..."
              v-model="newComment.content"
              rows="4"
          />
        </el-col>
        <el-col :span="24" style="margin-top: 10px;">
          <el-button type="primary" @click="submitComment">发表评论</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>

      <!-- 评论列表 -->
      <el-row v-for="comment in commentData" :key="comment.id">
        <el-col :span="24">
          <div class="comment-item-user">
            <UserCard :user="comment.userRespVO" class="post-viewer-info-left"></UserCard>
            <el-link :underline="false" :to="'/user/' + comment.userRespVO.id" class="user-link">
              {{ comment.userRespVO.nickname }}
            </el-link>
          </div>
          <div class="comment-footer">
            <div class="comment-content">{{ comment.content }}</div>
            <span class="comment-date-info">{{ formatDateTime(comment.createdAt) }}</span>

            <el-button @click="toggleLikeComment(comment.id)" type="text" size="small" class="comment-like">
              <font-awesome-icon :icon="['fas', 'thumbs-up']"/>
              {{ comment.commentLikeCount }}
            </el-button>
            <el-link @click="replyToComment(comment.id)">回复</el-link>
            <div v-if="replyingCommentId === comment.id" class="reply-input-container">
              <el-input
                  type="textarea"
                  placeholder="写下你的回复..."
                  v-model="replyContent.content"
                  rows="3"
                  class="reply-input"
              />
              <div class="reply-button-container">
                <el-button type="primary" @click="submitReply(comment.id)">发送</el-button>
              </div>
            </div>
          </div>
          <!-- 子评论 -->
          <div v-if="comment.subComments && comment.subComments.length > 0" >
            <el-row v-for="subComment in comment.subComments" :key="subComment.id" class="sub-comments">
              <el-col :span="24" class="sub-comment-item">
                <div class="comment-item-user">
                  <UserCard :user="subComment.userRespVO" class="post-viewer-info-left"></UserCard>
                  <el-link :underline="false" :to="'/user/' + subComment.userRespVO.id" class="user-link">
                    {{ subComment.userRespVO.nickname }}
                  </el-link>
                </div>
                <div class="comment-footer">
                  <div class="comment-content">{{ subComment.content }}</div>
                  <span class="comment-date-info">{{ formatDateTime(subComment.createdAt) }}</span>
                  <el-button @click="toggleLikeComment(subComment.id)" type="text" size="small" class="comment-like">
                    <font-awesome-icon :icon="['fas', 'thumbs-up']"/>
                    {{ subComment.commentLikeCount }}
                  </el-button>
                  <el-link @click="replyToComment(comment.id)">回复</el-link>
                  <div v-if="replyingCommentId === subComment.id" class="reply-input-container">
                    <el-input
                        type="textarea"
                        placeholder="写下你的回复..."
                        v-model="replyContent.content"
                        rows="3"
                        class="reply-input"
                    />
                    <div class="reply-button-container">
                      <el-button type="primary" @click="submitReply(subComment.id)">发送</el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-divider></el-divider>
      </el-row>

      <!-- 分页 -->
      <el-pagination
          background
          layout="prev, pager, next"
          :total="totalComments"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handlePageChange">
      </el-pagination>
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
  flex-direction: column;
  align-items: center;
  background: #e8e8e8;
  padding: 20px;
}

.article-viewer, .comment-section {
  width: 70%; /* 将宽度设置为相同 */
  margin-top: 20px;
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

.comment-item-user {
  display: flex;
}

.comment-content {
  margin-left: 50px;
  font: 20px 'Microsoft YaHei';
}

.comment-date-info {
  margin-left: 50px;
  font-size: 12px;
  margin-right: 10px;
  color: #999;
}

.comment-like {
  margin-left: 10px;
  margin-right: 20px;
}

.post-viewer-info-left {
  margin-right: 10px;
}
.reply-input-container {
  margin-top: 10px;
  margin-left: 10px;
  width: 60%;
  position: relative;
}

.reply-input {
  width: 100%;
  padding-right: 90px; /* 给输入框右边留出空间放置按钮 */
  box-sizing: border-box; /* 确保padding不会影响宽度 */
}

.reply-button-container {
  position: absolute;
  bottom: 0; /* 距离底部5px */
  right: 0;  /* 距离右边5px */
}

.sub-comments {
  margin-top: 10px;
  margin-left: 50px;
  padding: 10px;
  width: 85%;
  border-radius: 10px;
  background: #f9edff;

}

</style>

