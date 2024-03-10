import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// Register components globally (optional, adjust as needed)
createApp(App)
  .use(router)
  .mount('#app');
