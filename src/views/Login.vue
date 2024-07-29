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
          <Captcha class="captcha-image" @updateCaptcha="updateCaptcha" />
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

    const updateCaptcha = (newCaptcha: string) => {
      captchaCode.value = newCaptcha;
    };

    const handleSubmit = async () => {
      // 调用验证码验证接口
      try {
        const response = await axios.post('/captcha/verify', { captcha: captchaInput.value });
        if (response.data) {
          // 验证码验证成功，继续执行登录逻辑
          const user = {
            name: username.value,
            avatar: defaultUserAvatar // 替换为实际头像链接
          };
          store.dispatch('login', user);
          router.push('/'); // 跳转回首页
        } else {
          alert('验证码错误');
        }
      } catch (error) {
        console.error('验证码验证失败:', error);
        alert('验证码验证失败');
      }
    };

    return {
      username,
      password,
      captchaInput,
      handleSubmit,
      updateCaptcha
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
