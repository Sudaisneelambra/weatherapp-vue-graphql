import { createRouter, createWebHistory } from 'vue-router';
// import SignUp from '../views/SignupView.vue';
import SignUp from '../views/SignupView.vue';
import LoginForm from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';

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
    component: HomeView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
