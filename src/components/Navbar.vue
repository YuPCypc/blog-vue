<template>
  <el-header>
    <el-row>
      <el-col :span="4">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" @click="navigateToHome">
      </el-col>
      <el-col :span="12">
        <el-input placeholder="Search..." prefix-icon="el-icon-search"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button>搜索</el-button>
      </el-col>
      <el-col :span="4" class="align-right">
        <el-button v-if="!isAuthenticated" type="primary" @click="navigateToLogin">登陆</el-button>
        <el-button v-if="!isAuthenticated" @click="navigateToRegister">注册</el-button>
        <el-avatar v-if="isAuthenticated" :src="user?.avatarUri" class="clickable-avatar"
                   @click="navigateToProfile"></el-avatar>
      </el-col>
    </el-row>
  </el-header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.state.isAuthenticated);
    const user = computed(() => store.state.user);

    const navigateToLogin = () => {
      router.push({ name: 'Login' });
    };

    const navigateToRegister = () => {
      router.push({ name: 'Register' });
    };

    const navigateToProfile = () => {
      router.push({ name: 'Profile' });
    };

    const navigateToHome = () => {
      router.push({ name: 'Home' });
    };

    return {
      isAuthenticated,
      user,
      navigateToLogin,
      navigateToRegister,
      navigateToProfile,
      navigateToHome,
    };
  },
});
</script>

<style scoped>
.logo {
  height: 50px;
}

.align-right {
  text-align: right;
}

.clickable-avatar {
  cursor: pointer;
}

.logo:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
