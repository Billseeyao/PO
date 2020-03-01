<template>
  <div id="appp">
    <div id="head" v-if="$route.path!=='/login' && $route.path!=='/'">
      <span class="logo"></span>
      <span class="user" @click="logout">退出登录</span>
    </div>
    <div id="nav" v-if="$route.path!=='/login' && $route.path!=='/'">
      <el-menu
        router
        :default-active="activeRouter"
        class="navMenu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <template v-for="item in navData">
          <el-submenu :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <template v-for="childItem in item.children">
                <!-- <router-link :to="childItem.router"> -->
                <el-menu-item :index="childItem.index">{{childItem.name}}</el-menu-item>
                <!-- </router-link> -->
              </template>
            </el-menu-item-group>
          </el-submenu>
        </template>
      </el-menu>
    </div>
    <div id="nuxt">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      list: [1, 2, 3, 4],
      activeRouter: "",
      navData: [
        {
          name: "客户与供应商管理",
          index: "1",
          icon: "el-icon-location",
          children: []
        },
        {
          name: "产品管理",
          index: "2",
          icon: "el-icon-menu",
          children: []
        },
        {
          name: "订单管理",
          index: "3",
          icon: "el-icon-document",
          children: [
            {
              name: "待审核订单",
              index: "auditOrder"
            },
            {
              name: "订单管理",
              index: "finishOrder"
            }
          ]
        },
        {
          name: "系统管理",
          index: "4",
          icon: "el-icon-setting",
          children: []
        }
      ]
    };
  },
  watch: {
    $route(to) {
      this.activeRouter = to.path.split("/")[1];
    }
  },
  mounted() {
    this.getUrl();
  },
  methods: {
    getUrl() {
     this.activeRouter = window.location.hash.split('/')[1];
      // console.log("url------", url);
    },
    logout() {
      var that = this;
      that.$router.push("/login");
      that.axios
        .post("/jx_manage/user/logout")
        .then(function(res) {
          var res = JSON.parse(res);
          if (res.code == 0) {
            that.$router.push("/login");
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style>
body {
  height: 100%;
}
#appp {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
#app {
  height: 100vh;
  width: 100%;
}
#head {
  display: block;
  height: 60px;
  width: 100%;
  background: #3b8070;
}
#head > .logo {
  margin: 5px;
  display: inline-block;
  width: 50px;
  height: 50px;
  background: url("../static/img/logo.png") no-repeat;
  background-size: 100% 100%;
}
#head > .user {
  width: 60px;
  height: 60px;
  line-height: 60px;
  margin-right: 40px;
  display: block;
  float: right;
  cursor: pointer;
}
#nav {
  height: calc(100% - 60px);
  width: 220px;
  float: left;
  display: block;
}

#nav .navMenu {
  display: block;
  height: 100%;
}
#nav a {
  text-decoration: none;
}
</style>
