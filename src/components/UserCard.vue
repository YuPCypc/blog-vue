<template>
  <div>
    <el-popover
        placement="top"
        width="200"
        trigger="hover"
        popper-class="wrap"
        v-if="user.avatarUri"
    >
      <template #reference>
        <el-avatar :src="user.avatarUri" class="clickable-avatar-inner"/>
      </template>
      <div class="card">
        <div class="card-header">
          <!-- 这里可以添加额外的内容，比如头像 -->
        </div>
        <div class="card-body">
          <div class="card-body-title">
            <el-avatar :src="user.avatarUri"/>
              <span class="center-content-nickname">{{ user.nickname }}</span>
              <el-button type="primary" round>关注</el-button>
          </div>
          <div class="card-body-sign">
            <p> {{ user.bio || '作者有点忙，还没有简介' }}</p>
          </div>
          <div class="card-footer-bottom">
            <span>粉丝：{{ 10 }}</span>
            <span>获赞：{{ 10 }}</span>
          </div>
        </div>
      </div>
    </el-popover>
    <el-popover
        placement="bottom"
        width="200"
        trigger="hover"
        popper-class="wrap"
        v-else
    >
      <template #reference>
        <el-avatar>{{ user.nickname[0] }}</el-avatar>
      </template>
      <div>
        <p><strong>Nickname:</strong> {{ user.nickname }}</p>
        <p><strong>Email:</strong> {{ user.email || 'N/A' }}</p>
        <p><strong>Phone:</strong> {{ user.phone || 'N/A' }}</p>
        <p><strong>Bio:</strong> {{ user.bio || 'N/A' }}</p>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {UserRespVO} from '@/models/ArticleRespDTO' // Adjust path as needed
import '@/styles/global.css';

export default defineComponent({
  name: 'UserCard',
  props: {
    user: {
      type: Object as () => UserRespVO,
      required: true
    }
  }
})
</script>

<style scoped>

</style>
