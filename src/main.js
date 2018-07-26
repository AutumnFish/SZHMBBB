import Vue from "vue";
import App from "./App.vue";
// 引入路由模块
import VueRouter from "vue-router";
// 引入index组件
import index from "./components/index.vue";
// 导入ui框架
import ElementUI from "element-ui";
// 导入css
import "element-ui/lib/theme-chalk/index.css";
// 导入懒加载插件
import VueLazyload from "vue-lazyload";
import path from 'path';

// 使用路由中间件
Vue.use(VueRouter);
// 使用ui中间件
Vue.use(ElementUI);
// 使用懒加载中间件
Vue.use(VueLazyload,{
  loading:path.join(__dirname,'./assets/statics/img/01.gif')
});

// 注册路由规则
const router = new VueRouter({
  routes: [
    // 访问的是 / 打到(重定向)
    { path: "/", redirect: "/index" },
    // index 都显示 index这个组件
    {
      path: "/index",
      component: index
    }
  ]
});

// 引入css
import "./assets/statics/site/css/style.css";

Vue.config.productionTip = false;

new Vue({
  // 选择器
  el: "#app",
  // 挂载到vue
  router,
  // 渲染 App组件
  render: h => h(App)
});
