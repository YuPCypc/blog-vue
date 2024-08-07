<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'App'
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}


#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

</style>
