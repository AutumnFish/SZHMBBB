import Vue from "vue";
import App from "./App.vue";
// 引入路由模块
import VueRouter from "vue-router";
// 引入index组件
import index from "./components/index.vue";
import goodsInfo from "./components/goodsInfo.vue";
import buyCar from "./components/buyCar.vue";
import payOrder from "./components/payOrder.vue";
import login from "./components/login.vue";
// 导入ui框架
import ElementUI from "element-ui";
// 导入css
import "element-ui/lib/theme-chalk/index.css";
// 导入懒加载插件
import VueLazyload from "vue-lazyload";
// 引入css
import "./assets/statics/site/css/style.css";
// 引入模块 moment
import moment from "moment";
// 导入 axios模块 目的是让所有组件都可以使用
import axios from "axios";
// 导入iViewUI框架
import iView from "iview";
import "iview/dist/styles/iview.css";
// 导入Vuex
import Vuex from "vuex";

// 正常的服务器
axios.defaults.baseURL = "http://47.106.148.205:8899";
// 设置带上cookie
axios.defaults.withCredentials = true
// 崩溃后的备用服务器
// axios.defaults.baseURL = 'http://127.0.0.1:8848';
// 挂载到Vue的原型上->Vue实例化出来的对象 共用 vue-resource this.$http
Vue.prototype.axios = axios;

// 使用路由中间件 $route
Vue.use(VueRouter);
// 使用ui中间件 $message
Vue.use(ElementUI);
// 使用懒加载中间件
Vue.use(VueLazyload, {
  // 图片当做资源来引入
  loading: require("./assets/statics/img/loading2.gif")
});
// 使用iView $Message
Vue.use(iView);
// 使用Vuex
Vue.use(Vuex);

// 注册路由规则
const router = new VueRouter({
  routes: [
    // 访问的是 / 打到(重定向)
    {
      path: "/",
      redirect: "/index"
    },
    // index 都显示 index这个组件
    {
      path: "/index",
      component: index
    },
    {
      // goodsInfo/:id 参数
      // form表单中的 name属性
      path: "/goodsInfo/:id",
      component: goodsInfo
    },
    {
      path: "/buyCar",
      component: buyCar
    },
    // 支付订单路由
    {
      path: "/payOrder",
      component: payOrder
    },
    // 登录页路由
    {
      path: "/login",
      component: login
    }
  ]
});

// 实例化一个 Vuex的 仓库
let buyList = JSON.parse(window.localStorage.getItem("buyList")) || {};
const store = new Vuex.Store({
  // 状态
  state: {
    // 数量
    // buyList: {}
    buyList,
    // 是否登陆
    isLogin: false,
    // 来的路由
    fromPath:''
  },
  // 类似于computed的属性
  getters: {
    totalCount(state) {
      let num = 0;
      // 遍历对象
      for (const key in state.buyList) {
        // 累加总数
        num += parseInt(state.buyList[key]);
      }
      return num;
    }
  },
  mutations: {
    // info->{goodId:xx,goodNum:xxx}
    // 有就累加 没有就 直接赋值
    buyGood(state, info) {
      if (state.buyList[info.goodId]) {
        // 解决字符串累加问题
        let oldNum = parseInt(state.buyList[info.goodId]);
        oldNum += parseInt(info.goodNum);
        // 重新赋值
        state.buyList[info.goodId] = oldNum;
      } else {
        // 没有 直接赋值这种方法 vue不会跟踪属性
        // state.buyList[info.goodId]=info.goodNum;
        // 需要使用 Vue.set(obj, 'newProp', 123) 替代
        Vue.set(state.buyList, info.goodId, parseInt(info.goodNum));
      }
    },
    // 直接更新 某个id对应的数值
    // {goodId:xx,goodNum:xxx}
    changeCount(state, info) {
      state.buyList[info.goodId] = info.goodNum;
    },
    // 根据id删除数据
    delGoodById(state, id) {
      // 如何删除对象中的某个属性 delete obj[key]
      // delete state.buyList[id];
      // 告诉Vue我已经删除了这个属性
      Vue.delete(state.buyList, id);
    },
    // 修改登陆状态
    changeLogin(state, isLogin) {
      // 直接赋值
      state.isLogin = isLogin;
    },
    // 修改来时的路由
    rememberFromPath(state,path){
      state.fromPath = path;
    }
  }
});


// 注册路由守卫(每次路由跳转时 增加的过滤规则)
// 🥖🥖🥖🥖🥖🥖🥖🥖🥖🥖
router.beforeEach((to, from, next) => {
  // 从哪来
  // console.log(from);
  // 保存数据
  store.commit('rememberFromPath',from.path);
  // 去订单支付页
  if(to.path=='/payOrder'){
    axios
    .get("/site/account/islogin")
    .then(response => {
      console.log(response);
      if (response.data.code == "nologin") {
        console.log("没登录");
        // 打到登录页
        next('/login');
      } else {
        // 登陆了 继续执行即可
        next();
         
      }
    })
    .catch(err => {
      // console.log(err);
    });
  }else{
    // 如果去的不是订单支付页 直接可以访问
    next();
  }
});

// 注册全局过滤器
Vue.filter("cutTime", function(value) {
  return moment(value).format("YYYY年MM月DD日");
});

 


Vue.config.productionTip = false;

new Vue({
  // 选择器
  el: "#app",
  // 挂载到vue
  router,
  // 渲染 App组件
  render: h => h(App),
  // 挂载仓库
  store
});

// 注册一些逻辑
window.onbeforeunload = function() {
  // alert('onbeforeunload');
  // window.localStorage.setItem('onbeforeunload',123);
  window.localStorage.setItem("buyList", JSON.stringify(store.state.buyList));
};
