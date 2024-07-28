<template>
  <div class="register-container">
    <ThreeBackground />
    <el-card class="register-card">
      <h2>Register</h2>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item>
          <el-input v-model="username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="email" type="email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="confirmPassword" type="password" placeholder="Confirm Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ThreeBackground from '@/components/ThreeBackground.vue'

export default defineComponent({
  name: 'Register',
  components: {
    ThreeBackground
  },
  setup() {
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const handleSubmit = () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!')
        return
      }
      console.log('Username:', username.value)
      console.log('Email:', email.value)
      console.log('Password:', password.value)
      // 在这里处理注册逻辑
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      handleSubmit
    }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.register-card {
  width: 400px;
  padding: 20px;
}
</style>
