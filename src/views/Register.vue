<template>
  <div class="register-container">
    <ThreeBackground />
    <el-card class="register-card">
      <h2>Register</h2>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item>
          <el-input v-model="username" placeholder="Username" />
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="email" type="email" placeholder="Email" />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="password" type="password" placeholder="Password" />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </el-form-item>
        <el-form-item>
          <el-input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
          <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ThreeBackground from '@/components/ThreeBackground.vue';
import axios from '@/axios'; // 引入配置好的 axios 实例
import defaultUserAvatar from '@/assets/default_user.png';

export default defineComponent({
  name: 'Register',
  components: {
    ThreeBackground
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errors = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const validateFields = () => {
      let valid = true;
      errors.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      if (!username.value.trim()) {
        errors.value.username = 'Username is required';
        valid = false;
      }

      if (!email.value.trim()) {
        errors.value.email = 'Email is required';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'Email is invalid';
        valid = false;
      }

      if (!password.value.trim()) {
        errors.value.password = 'Password is required';
        valid = false;
      }

      if (password.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Passwords do not match';
        valid = false;
      }

      return valid;
    };

    const handleSubmit = async () => {
      if (!validateFields()) {
        return;
      }

      try {
        const response = await axios.post('/auth/register', {
          username: username.value,
          email: email.value,
          password: password.value
        });

        // 假设后端返回的数据结构包含 token
        const token = response.data.data.token;
        localStorage.setItem('jwt', token); // 将 JWT token 存储到 localStorage 中

        // 模拟登录逻辑
        const user = {
          name: username.value,
          avatar: defaultUserAvatar // 替换为实际头像链接
        };
        store.dispatch('login', user);
        router.push('/'); // 跳转回首页
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    };

    return {
      username,
      email,
      password,
      confirmPassword,
      errors,
      handleSubmit
    };
  }
});
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

.error-message {
  color: red;
  font-size: 12px;
}
</style>
