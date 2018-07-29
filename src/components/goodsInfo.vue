<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <div class="pic-box">
                                <!-- 在数据回来之后才创建 v-show是不可以的(元素一直都在)
                                    这个别人写好的这个组件 没有帮我们实现 数据更新 自动生成的功能
                                 -->
                                <ProductZoomer v-if="imglist.length!=0" :baseImages="images" :base-zoomer-options="zoomerOptions"></ProductZoomer>
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.market_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.sell_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                                <div class="el-input-number el-input-number--small">
                                                    <span role="button" class="el-input-number__decrease" :class="{'is-disabled':buyNum==1}">
                                                        <i @click="buyNum==1?1:buyNum--" class="el-icon-minus"></i>
                                                    </span>
                                                    <span role="button" class="el-input-number__increase" :class="{'is-disabled':buyNum==goodsinfo.stock_quantity}">
                                                        <i @click="buyNum<goodsinfo.stock_quantity?buyNum++:goodsinfo.stock_quantity" class="el-icon-plus"></i>
                                                    </span>
                                                    <div class="el-input el-input--small">
                                                        <!---->
                                                        <input v-model="buyNum" autocomplete="off" size="small" type="text" rows="2" max="60" min="1" validateevent="true" class="el-input__inner" role="spinbutton" aria-valuemax="60" aria-valuemin="1" aria-valuenow="1" aria-disabled="false">
                                                        <!---->
                                                        <!---->
                                                        <!---->
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <button @click="cartAdd" class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                            <Affix>
                                <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                    <ul>
                                        <li>
                                            <a @click="isShowDesc = true" href="javascript:;" :class="{selected:isShowDesc}">商品介绍</a>
                                        </li>
                                        <li>
                                            <a @click="isShowDesc = false" href="javascript:;" :class="{selected:!isShowDesc}">商品评论</a>
                                        </li>
                                    </ul>
                                </div>
                            </Affix>
                            <!-- 直接解析html 是有安全性问题的 -->
                            <div v-html="goodsinfo.content" class="tab-content entry" v-show="isShowDesc">
                            </div>
                            <div class="tab-content" v-show="!isShowDesc">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm" class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea v-model.trim="commentContent" id="txtContent" name="txtContent" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input id="btnSubmit" @click="submitComment" name="submit" type="submit" value="提交评论" class="submit">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p v-if="messageList.length==0" style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);">暂无评论，快来抢沙发吧！</p>
                                        <li v-for="(item, index) in messageList" :key="item.id">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.add_time | cutTime}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="page-box" style="margin: 5px 0px 0px 62px;">
                                        <Page :total="totalCount" :page-size="pageSize" placement='top' show-elevator show-sizer @on-change="pageChange($event)" @on-page-size-change="pageSizeChange($event)" :page-size-opts='[5, 10,15,20]' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="(item, index) in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <router-link :to="`/goodsInfo/`+item.id">
                                                <img :src="item.img_url">
                                            </router-link>
                                        </div>
                                        <div class="txt-box">
                                            <router-link :to="`/goodsInfo/`+item.id">{{item.title}}</router-link>
                                            <span>{{item.add_time | cutTime}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 去顶部 -->
        <BackTop></BackTop>
        <!-- 陪伴他的图片 --> 
        <img class="moveImg" v-if="imglist.length!=0" style="display:none" :src="imglist[0].original_path" alt="">
    </div>
</template>
<script>
// 导入放大镜组件
import ProductZoomer from "vue-product-zoomer";
import $ from 'jquery';

export default {
  name: "goodsinfo",
  data: function() {
    return {
      goodsinfo: {},
      hotgoodslist: [],
      imglist: [],
      // 购买数量
      buyNum: 1,
      // 记录显示哪个区域的变量
      isShowDesc: true,
      // 轮播图的数据
      images: {
        normal_size: []
      },
      // 轮播图的配置
      zoomerOptions: {
        zoomFactor: 2,
        pane: "container-round",
        hoverDelay: 300,
        namespace: "inline-zoomer",
        move_by_click: true,
        scroll_items: 5,
        choosed_thumb_border_color: "#bbdefb"
      },
      // 评论相关的数据
      pageIndex: 1,
      pageSize: 5,
      // 评论数据
      messageList: [],
      //   总条数
      totalCount: 0,
      // 输入的评论内容
      commentContent: ""
    };
  },
  methods: {
    // 抽取的公共的方法 根据id 获取数据
    getgoodsInfo() {
      // 强制初始化
      this.imglist = [];
      // 清空预览图片的数组
      this.images.normal_size = [];

      this.axios
        .get(`site/goods/getgoodsinfo/${this.$route.params.id}`)
        .then(response => {
          this.goodsinfo = response.data.message.goodsinfo;
          this.hotgoodslist = response.data.message.hotgoodslist;
          this.imglist = response.data.message.imglist;
          // 赋值到images中
          this.imglist.forEach((v, i) => {
            this.images.normal_size.push({
              id: v.id,
              url: v.original_path
            });
          });
        })
        .catch(err => {
          // console.log(err);
        });
    },
    // 抽取的公共方法 获取评论信息
    getcomments() {
      // 商品id -> this.$route.params.id
      // pageIndex -> 丢到data中
      // pageSize -> 丢到data中
      this.axios
        .get(
          `site/comment/getbypage/goods/${this.$route.params.id}?pageIndex=${
            this.pageIndex
          }&pageSize=${this.pageSize}`
        )
        .then(response => {
          //   console.log(response);
          this.messageList = response.data.message;
          this.totalCount = response.data.totalcount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 页码改变
    pageChange(page) {
      console.log(page);
      // 保存起来
      this.pageIndex = page;
      // 重新获取数据
      this.getcomments();
    },
    // 页容量改变
    pageSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      // 重新获取数据
      this.getcomments();
    },
    // 发表评论
    /*
        $Message main.js注册 iView组件的时候 自动帮我们挂载到了 Vue的原型上面
        直接通过Vue实例化出来的对象使用
        去两边空格 
            获取内容 .trim()
        非空判断
    */
    submitComment() {
      // 判断是否为空
      if (this.commentContent == "") {
        // this.$Message.error('对方不想跟你说话,并且想你抛出一顿BUG');
        this.$Message.error({
          content: "对方不想理你,并且想你抛出了世界上最好的语言",
          closable: true
        });
        return;
      }
      // 发表评论
      this.axios.post(`site/validate/comment/post/goods/${this.$route.params.id}`,{
          commenttxt:this.commentContent
      }).
      then(response=>{
        //   console.log(response)
        if(response.data.status==0){
            // 成功了
            // 提示用户
            this.$Message.success('评论发表成功!!');
            // 重新获取数据 看到了第三页
            // 去第一页
            this.pageIndex = 1;
            this.getcomments();
        }
      }).catch(err=>{
        //   console.log(err);
      })
      // 清空评论
      this.commentContent='';
    },
    // 加入购物车
    cartAdd(){
        // 获取按钮的位置 $
        /*
            {
                left:xxx,
                top:xxx
            }
        */
        let offset = $('#buyButton .add').offset();
        // 获取购物车的位置
        let cartOffset = $('.icon-cart').offset();
        // console.log(offset);// top left
        $('.moveImg').show().addClass('move').css(offset).animate(cartOffset,1000,()=>{
            $('.moveImg').removeClass('move').hide();
        });
        // 修改vuex中的数据值 
        this.$store.commit('buyGood',{
            goodId:this.$route.params.id, // 商品id
            goodNum:this.buyNum           // 购买的数量
        });
    }
  },
  // 注册组件
  components: {
    ProductZoomer
  },
  // 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
  // 这个生命周期函数中 data methods 中的那些值 还没有设置给 这个组件对象
  beforeCreate() {
    //   console.log(this);
    //   this.getgoodsInfo();
  },
  // 在实例创建完成后被立即调用。
  created() {
    // 获取商品详情
    this.getgoodsInfo();
    // 获取评论信息
    this.getcomments();
    // 打印vuex的值
    console.log('goodsinfo组件')
    console.log(this.$store);
  },
  // beforeMount
  beforeMount() {},
  // 显示出来之后 打印$route
  mounted() {},
  // 观察属性 属性值改变时自动调用
  watch: {
    // to 新值  from 老值
    $route(to, from) {
      // 重新获取商品数据
      this.getgoodsInfo();
      //   重新获取评论数据
      this.getcomments();
    }
  }
};
</script>


<style lang="scss">
/* 指定使用的是sass */
/* 导入字体图标的样式 */
@import url("../../node_modules/font-awesome/css/font-awesome.min.css");
/* .container-zoomer-zoomer-box { */
.inline-zoomer-zoomer-box {
  width: 368px;
}
.pic-box .control-box .thumb-list {
  display: flex;
}
.thumb-list {
  img {
    height: 78px;
    width: 78px;
    margin: 5px;
  }
}
.control i {
  text-align: center;
}
.moveImg{
    width: 40px;
    position: absolute;
    top: 0;
    right: 50px;
}
.moveImg.move{
    transform: scale(.5,.5) rotateZ(3600deg);
    opacity: .4;
    transition: transform 1s,opacity  1s;
}
</style>