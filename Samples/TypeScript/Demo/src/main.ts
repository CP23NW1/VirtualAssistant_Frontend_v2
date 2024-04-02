import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/pages/LoginPage.vue';
import RegisterPage from './components/pages/RegisterPage.vue';
import VirtualAssistant from './components/pages/VirtualAssistant.vue';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage.vue'
import ResetPasswordPage from './components/pages/ResetPasswordPage.vue'
import * as _ from './logic/main';


const routes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/virtual_assistant', component: VirtualAssistant },
  { path: '/forgot_password', component: ForgotPasswordPage },
  { path: '/reset_password', component: ResetPasswordPage},
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

console.log(router)

const app = createApp(App);

app.use(router);

app.mount('#app');

_