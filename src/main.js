import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import router
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const app = createApp(App);
const pinia = createPinia();

app.use(router); // Sử dụng router
app.use(pinia); // Đăng ký Pinia
app.mount('#app');

