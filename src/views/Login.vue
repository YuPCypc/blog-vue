<template>
  <div class="login-container">
    <ThreeBackground />
    <el-card class="login-card">
      <h2>Login</h2>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item>
          <el-input v-model="username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ThreeBackground from '@/components/ThreeBackground.vue'
import defaultUserAvatar from '@/assets/default_user.png'

export default defineComponent({
  name: 'Login',
  components: {
    ThreeBackground
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const password = ref('')

    const handleSubmit = () => {
      // TODO: 添加实际的用户名密码验证逻辑
      const user = {
        name: username.value,
        avatar: defaultUserAvatar // 替换为实际头像链接
      }
      store.dispatch('login', user)
      router.push('/') // 跳转回首页
    }

    return {
      username,
      password,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
  padding: 20px;
}
</style>
