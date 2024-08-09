import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIconModules from '@element-plus/icons-vue';
import FontAwesomeIcon from '@/plugins/fontawesome';

const app = createApp(App);

for (const [key, component] of Object.entries(ElIconModules)) {
    app.component(key, component);
}
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(store);
app.use(router);
app.use(ElementPlus);

store.dispatch('initializeStore').then(() => {
    app.mount('#app');
});
