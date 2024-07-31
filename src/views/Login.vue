<!-- Login.vue -->
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
          <el-input v-model="captchaInput" placeholder="Enter Captcha" class="captcha-input"></el-input>
          <Captcha ref="captchaComponent" class="captcha-image" @updateCaptcha="updateCaptcha" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ThreeBackground from '@/components/ThreeBackground.vue';
import defaultUserAvatar from '@/assets/default_user.png';
import Captcha from '@/components/Captcha.vue';
import axios from '@/axios'; // 引入配置好的 axios 实例

export default defineComponent({
  name: 'Login',
  components: {
    Captcha,
    ThreeBackground
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const captchaInput = ref('');
    const captchaCode = ref('');  // 保存当前的验证码

    const captchaComponent = ref(null); // 用于引用 Captcha 组件实例

    const updateCaptcha = (newCaptcha: string) => {
      captchaCode.value = newCaptcha;
    };

    const handleSubmit = async () => {
      // 调用验证码验证接口
      try {
        const captchaResponse = await axios.post('/auth/captcha/verify', { captcha: captchaInput.value });
        if (captchaResponse.data) {
          // 验证码验证成功，继续执行登录逻辑
          const loginResponse = await axios.post('/auth/login', { username: username.value, password: password.value });
          if (loginResponse.data.success) {
            const { username,avatar, token } = loginResponse.data.data;
            // 存储 JWT token 到 localStorage
            localStorage.setItem('jwt', token);
            // 更新 Vuex 状态
            store.dispatch('login', {username:username, avatarUri: avatar || defaultUserAvatar });
            router.push('/'); // 跳转回首页
          } else {
            alert('登录失败：' + loginResponse.data.message);
          }
        } else {
          alert('验证码错误');
          // 刷新验证码
          if (captchaComponent.value) {
            captchaComponent.value.getCaptcha();
          }
        }
      } catch (error) {
        console.error('验证码验证失败:', error);
        alert('验证码验证失败');
        // 刷新验证码
        if (captchaComponent.value) {
          captchaComponent.value.getCaptcha();
        }
      }
    };

    return {
      username,
      password,
      captchaInput,
      handleSubmit,
      updateCaptcha,
      captchaComponent // 将 Captcha 组件的引用暴露出去
    };
  }
});
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
.captcha-input{
  width: 260px;
  margin-right: 10px;
}
.captcha-image{
  position: relative;
}
</style>
