import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);
Vue.use(DatePicker);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

