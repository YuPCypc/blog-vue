<template>
  <div class="common-layout">
    <el-header class="fixed-header">
      <el-row class="header-row" type="flex" align="middle">
        <el-col :span="3">
          <img src="@/assets/logo.svg" alt="Logo" class="logo" @click="navigateToHome">
        </el-col>

        <el-col :span="9">
          <el-menu
              class="el-menu-demo"
              mode="horizontal"
          >
            <el-menu-item v-if="isAuthenticated" index="1">首页</el-menu-item>
            <el-menu-item v-if="isAuthenticated" index="2">学习</el-menu-item>
            <el-menu-item v-if="isAuthenticated" index="3">资源</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6">

          <div class="input-button-container">
            <el-input placeholder="Search..." prefix-icon="el-icon-search"></el-input>
            <el-button><el-icon><Search /></el-icon>搜索</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="right-aligned-container">
            <div class="button-avatar-container">
              <el-button v-if="!isAuthenticated" type="primary" @click="navigateToLogin">登陆</el-button>
              <el-button v-if="!isAuthenticated" @click="navigateToRegister">注册</el-button>
              <el-button v-if="isAuthenticated" type="primary" @click="navigateToArticle">写文章</el-button>
              <el-avatar v-if="isAuthenticated" :src="user?.avatarUri" class="clickable-avatar" @click="navigateToProfile"></el-avatar>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import {useStore} from 'vuex';
import {useRouter} from 'vue-router';
import { Search } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'Navbar',
  components: {
    Search
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.state.isAuthenticated);
    const user = computed(() => store.state.user);

    const navigateToLogin = () => {
      router.push({name: 'Login'});
    };

    const navigateToRegister = () => {
      router.push({name: 'Register'});
    };

    const navigateToProfile = () => {
      router.push({name: 'Profile'});
    };

    const navigateToArticle = () => {
      router.push({name: 'Article'});
    }

    const navigateToHome = () => {
      router.push({name: 'Home'});
    };

    return {
      isAuthenticated,
      user,
      navigateToLogin,
      navigateToRegister,
      navigateToProfile,
      navigateToArticle,
      navigateToHome,
    };
  },
});
</script>

<style scoped>
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保导航栏在页面上的其他内容之上 */
  background-color: #ffffff; /* 可选，设置背景颜色以确保内容可读 */
  border-bottom: 1px solid #ddd; /* 可选，设置边框以区分导航栏 */
}

.header-row {
  height: 100%; /* 使行的高度占满整个导航栏 */
}

.logo {
  height: 50px;
}

.centered-content {
  display: flex;
  align-items: center;
  justify-content: center; /* 居中对齐内容 */
}

.input-button-container {
  display: flex;
  align-items: center;
}

.button-avatar-container {
  display: flex;
  align-items: center;
  gap: 10px; /* 设置间距，可以根据需要调整 */
}

.right-aligned-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px; /* 可根据需要调整 */
}

.clickable-avatar {
  cursor: pointer;
  margin-left: 10px;
}

.clickable-avatar:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.logo:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
