<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.svg" alt="Logo" class="logo" @click="navigateToHome">
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-card>
        <h2>用户详情</h2>
        <el-form :model="userForm" label-width="120px" class="user-form">
          <el-form-item label="头像">
            <el-upload
                class="avatar-uploader"
                action="http://localhost:8000/api/upload-avatar"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :data="getFormData"
                :headers="uploadHeaders"
                :with-credentials="true">
              <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" v-model="userForm.bio"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveChanges">保存修改</el-button>
            <el-button type="danger" @click="logout">退出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Profile',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const user = store.state.user;

    const userForm = reactive({
      avatar: user?.avatarUri || '',
      email: user?.email || '',
      phone: user?.phone || '',
      nickname: user?.name || '',
      bio: user?.bio || ''
    });

    const beforeAvatarUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        proxy.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        proxy.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    };

    const handleAvatarSuccess = (response: any) => {
      userForm.avatar = response.avatarUrl;
      localStorage.setItem('jwt', response.token);
      proxy.$message.success('头像上传成功');
    };

    const handleAvatarError = () => {
      proxy.$message.error('头像上传失败');
    };

    const getFormData = (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return formData;
    };

    const uploadHeaders = {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}`
    };

    const saveChanges = () => {
      store.dispatch('updateUser', userForm);
      proxy.$message.success('用户信息已更新');
    };

    const logout = () => {
      localStorage.removeItem('jwt');
      store.commit('logout');
      router.push({ name: 'Home' });
      proxy.$message.success('已退出');
    };

    const navigateToHome = () => {
      router.push({ name: 'Home' });
    };

    return {
      userForm,
      beforeAvatarUpload,
      handleAvatarSuccess,
      handleAvatarError,
      getFormData,
      uploadHeaders,
      saveChanges,
      logout,
      navigateToHome
    };
  }
});
</script>

<style scoped>
.logo {
  height: 50px;
}
.align-right {
  text-align: right;
}
.logo:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.user-form {
  max-width: 600px;
  margin: 0 auto;
}
.avatar-uploader {
  display: block;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 178px;
  text-align: center;
}
</style>
