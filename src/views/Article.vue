<template>
  <div class="navbar-container">
    <Navbar/>
  </div>
  <div class="title-container">
    <el-input
        v-model="title"
        maxlength="30"
        style="width: 240px"
        placeholder="请输入标题"
        show-word-limit
        type="textarea"
    />
    <el-select
        v-model="category_value"
        placeholder="请选择分类"
        size="large"
        class="title-select-container"
    >
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </div>
  <div class="summary-container">
    <el-input
        v-model="summary"
        maxlength="200"
        style="width: 500px"
        placeholder="请输入内容简介"
        show-word-limit
        type="textarea"
    />
  </div>
  <div>
    <Editor :value="content" :plugins="plugins" @change="handleChange"
            :locale="locale" :uploadImages="uploadImage" class="editor-container"
    />
    <el-button @click="handleSubmit" type="primary" class="editor-button-container">发布</el-button>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, reactive, ref} from 'vue';
import Navbar from "@/components/Navbar.vue";
import {Editor} from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import zhHans from 'bytemd/locales/zh_Hans.json';
import 'bytemd/dist/index.css';
import "highlight.js/styles/vs.css";
import 'juejin-markdown-themes/dist/juejin.min.css';
import highlightssr from '@bytemd/plugin-highlight-ssr'
import highlight from '@bytemd/plugin-highlight'
import axios from "@/axios";

export default defineComponent({
  components: {
    Navbar,
    Editor
  },
  setup() {
    const { proxy } = getCurrentInstance();
    let content = ref('');

    // 配置插件
    const plugins = [
      gfm(),
      highlight(),
      highlightssr(),
    ];
    const locale = zhHans;

    const title = ref('')

    const summary = ref('')

    const category_value = ref('')

    const options = [
      {
        value: '1',
        label: '前端技术',
      },
      {
        value: '2',
        label: '后端技术',
      },
      {
        value: '3',
        label: '人工智能',
      },
      {
        value: '4',
        label: '移动端技术',
      },
      {
        value: '5',
        label: '底层技术',
      },
    ]



    const handleChange = (v: string) => {
      content.value = v;
    };

    const handleSubmit = async () => {
      try {
        const articleForm = {
          title: title.value,
          content: content.value,
          categoryId: category_value.value,
          summary: summary.value,
        };
        console.log(articleForm);
        const response = await axios.post('/api/post/save', articleForm,{
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });

        if(response.data.success){
          proxy.$message.success('发布成功');
        }else{
          proxy.$message.success('发布失败');
        }
      } catch (error) {
        console.error('发布失败:', error);
      }
    };
    const uploadImage = async (file: File) => {
      console.log('files', file)

      return []

    }

    return {
      content,
      plugins,
      handleChange,
      handleSubmit,
      locale,
      uploadImage,
      title,
      options,
      category_value,
      summary,
    };
  },
});
</script>

<style scoped>
.editor-container {
  position: relative;
  top: 30px;
  flex-direction: column;
  z-index: 1001;
}
.editor-button-container{
  position: relative;
  top: 50px;
  flex-direction: column;
}

.title-container {
  margin-top: 100px;
}

.title-select-container{
  margin-left: 50px;
  width: 200px;
}
.summary-container{
  margin-top: 10px;
}


</style>
