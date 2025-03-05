import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router';
import axios from 'axios';
import locale from 'element-ui/lib/locale/lang/en';  // 引入 Element 的英文语言包
import VueI18n from 'vue-i18n';

Vue.config.productionTip = false

Vue.use(VueI18n);
Vue.use(ElementUI, { locale });
Vue.use(ElementUI);

const axiosInstance = axios.create({
  baseURL: 'http://localhost', 
});

// 请求拦截器：每次请求都附加JWT
axiosInstance.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;  // 将JWT添加到请求头中
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

// use this.$axios
Vue.prototype.$axios = axiosInstance;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')


