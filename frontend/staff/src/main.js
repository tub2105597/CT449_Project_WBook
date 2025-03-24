import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import { createPinia } from 'pinia';

import './assets/css/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.mount('#app');
