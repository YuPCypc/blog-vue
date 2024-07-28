<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.svg" alt="Logo" class="logo">
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
                action=""
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
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
          <el-form-item label="密码">
            <el-input type="password" v-model="userForm.password"></el-input>
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
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Profile',
  setup() {
    const store = useStore()
    const router = useRouter()
    const user = store.state.user

    const userForm = reactive({
      avatar: user?.avatar || '',
      email: user?.email || '',
      phone: user?.phone || '',
      nickname: user?.name || '',
      password: '',
      bio: user?.bio || ''
    })

    const handleAvatarSuccess = (response: any, file: any) => {
      userForm.avatar = URL.createObjectURL(file.raw)
    }

    const beforeAvatarUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

    const saveChanges = () => {
      // TODO: 保存修改后的用户信息
      store.commit('updateUser', userForm)
      this.$message.success('用户信息已更新')
    }

    const logout = () => {
      store.commit('logout')
      router.push({ name: 'Home' })
      this.$message.success('已退出')
    }

    return {
      userForm,
      handleAvatarSuccess,
      beforeAvatarUpload,
      saveChanges,
      logout
    }
  }
})
</script>

<style scoped>
.logo {
  height: 50px;
}
.align-right {
  text-align: right;
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
