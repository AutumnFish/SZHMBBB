import Vue from 'vue'
import App from './App.vue'


// 引入css
import './assets/statics/site/css/style.css';

Vue.config.productionTip = false

new Vue({
  // 选择器
  el:"#app",
  // 渲染 App组件
  render: h => h(App)
})
