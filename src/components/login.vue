<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/login.html">会员登录</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <div class="nav-tit">
                        <a class="selected" href="javascript:;">账户登录</a>
                        <i>|</i>
                        <a href="/register.html">免费注册</a>
                    </div>

                    <div id="loginform" name="loginform" class="login-box">
                        <div class="input-box">
                            <input id="txtUserName" v-model="user_name" name="txtUserName" type="text" placeholder="用户名/手机/邮箱" maxlength="50">
                        </div>
                        <div class="input-box">
                            <input id="txtPassword" v-model="password" name="txtPassword" type="password" placeholder="输入登录密码" maxlength="16">
                        </div>
                        <div class="btn-box">
                            <input @click="login" id="btnSubmit" name="btnSubmit" type="submit" value="立即登录">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  // 用户名跟密码的数据
  data: function() {
    return {
    user_name: "admin",
      password: "123"
};
  },
  methods: {
    login() {
      this.axios
        .post("/site/account/login", {
          user_name: this.user_name,
          password: this.password
        })
        .then(response => {
          console.log(response);
          // 提示用户
          if (response.data.status == 1) {
            // 错误
            this.$Message.error(response.data.message);
            this.password = '';
          } else {
            // 成功
            this.$Message.success(response.data.message);
            // 修改 vuex中的数据了
            this.$store.commit('changeLogin',true)
            // 从哪来回哪去
            this.$router.push(this.$store.state.fromPath)
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
</style>


