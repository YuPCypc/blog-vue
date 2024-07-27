<script lang="ts">
export default {
  name: 'Person',
  data() {
    return {
      name: '张三',
      age: 18,
      tel: '1234567890',
    }
  },
  methods: {
    showTel() {
      alert(this.tel)
    },
    // 修改电话
    changeTel() {
      this.tel = '1237890'
    },
    // 修改年龄
    changeAge() {
      this.age = 1890
    }
  }
}
</script>

<template>
  <div class="person">
    <h1>姓名：{{ name }}</h1>
    <h1>年龄：{{ age }}</h1>
    <button @click="changeTel">修改电话</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="showTel">显示电话</button>
  </div>
</template>

<style scoped>
.person {
  background: #fff;
  accent-color: #ffa9bf;
  box-shadow: 0 2px 15px rgba(0, 0, 0, .3);
  border-radius: 4px;
  padding: 20px;
}
</style>