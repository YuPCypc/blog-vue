<!-- Captcha.vue -->
<template>
  <div class="captcha-container">
    <img :src="'data:image/png;base64,' + captchaImage" alt="captcha" @click="getCaptcha" class="captcha-image">
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import axios from '@/axios';

export default defineComponent({
  name: 'Captcha',
  emits: ['updateCaptcha'],
  setup(props, { emit }) {
    const captchaImage = ref('');
    const captchaCode = ref('');

    const getCaptcha = async () => {
      try {
        const response = await axios.get('/captcha/generate');
        captchaImage.value = response.data.image;
        captchaCode.value = response.data.captcha; // 假设服务器返回了验证码文本
        emit('updateCaptcha', captchaCode.value);
      } catch (error) {
        console.error('Failed to get captcha:', error);
      }
    };

    onMounted(() => {
      getCaptcha();
    });

    return {
      captchaImage,
      getCaptcha
    };
  }
});
</script>

<style scoped>
.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.captcha-image {
  cursor: pointer;
  width: 90px;
  height: 35px;
}
</style>
