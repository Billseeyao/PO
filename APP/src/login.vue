<template>
  <div class="login">
    <div class="form">
      <div class="text">系统登录</div>
      <el-form :model="ruleForm" label-width="0px">
        <el-form-item prop="pass">
          <el-input
            type="text"
            v-model="ruleForm.userName"
            autocomplete="off"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.passWord"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <p v-show="passErrorShow">用户名或密码错误，请重试</p>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="cancel">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
        passWord: ""
      },
      passErrorShow: false
    };
  },
  methods: {
    submitForm() {
      var that = this;
      that.$router.push("/finishOrder");
      that.axios
        .post("/jx_manage/user/login", that.ruleForm)
        .then(function(res) {
          var res = JSON.parse(res);
          if (res.code == 0) {
            that.$router.push("/finishOrder");
          } else {
            that.passErrorShow = true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancel() {
      this.ruleForm.userName = "";
      this.ruleForm.passWord = "";
    }
  }
};
</script>

<style>
.login {
  width: 100%;
  height: 100vh;
  background: url("..\static\img\bg_img10.jpg") no-repeat;
  background-size: 100% 106%;
  padding-top: 14%;
}
.login > div {
  widows: 100%;
  height: 80px;
  text-align: center;
  font-size: 24px;
  font-weight: 800px;
}
.login > .form {
  width: 330px;
  height: 300px;
  background: rgba(255, 255, 255, 0.2);
  /* border: 1px solid #ccc; */
  margin: 0 auto;
  border-radius: 10px;
  padding: 20px 30px;
}
.login > .form > .text {
  widows: 100%;
  height: 70px;
  text-align: center;
  font-size: 34px;
  color: #fff;
  letter-spacing: 5px;
}
.login > .form p {
  margin-top: -20px;
  text-align: left;
  margin-bottom: 10px;
  color: #cc0000;
}
.el-button {
  width: 30%;
}
</style>
