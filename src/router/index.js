import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '../components/signup.vue';
import LoginForm from '../components/login.vue';
import WeatherHome from '../components/home.vue'

const routes = [
  { 
    path: '/',
    name:'signup',
    component: SignUp
  },
  { 
    path: '/login',
    name:'login',
    component: LoginForm 
  },
  { 
    path: '/home',
    name:'home',
    component: WeatherHome 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
