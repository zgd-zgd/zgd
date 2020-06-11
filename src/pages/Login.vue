<template>
  <div class="login">
    <div class="login_conent">
      <p>天涯后台管理系统</p>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="acc">
          <el-input
            v-model="ruleForm.acc"
            prefix-icon="el-icon-s-custom"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="ruleForm.pwd"
            autocomplete="off"
            prefix-icon="el-icon-s-goods"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          <el-button
            class="log_btn"
            type="primary"
            @click="submitForm('ruleForm')"
          >登录</el-button>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入登录接口API
import { API_LOGIN } from "@/api/apis";

export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    return {
      ruleForm: {
        pwd: "",
        // checkPass: "",
        acc: ""
      },
      rules: {
        pwd: [{ validator: validatePass, trigger: "blur" }],
        acc: [{ validator: checkAge, trigger: "blur" }]
      },
      isLogin: true
    };
  },
  methods: {
    submitForm(formName) {
      if (this.isLogin == false) return;
      this.isLogin = false;
      //防抖节流
      setTimeout(() => {
        this.isLogin = true;
      }, 1500);
      this.$refs[formName].validate(valid => {
        //   验证成功
        if (valid) {
          //获取用户输入的值
          let { acc, pwd } = this.ruleForm;
          //调用登录接口
          API_LOGIN(acc, pwd).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "恭喜你，登录成功",
                type: "success"
              });
              setTimeout(() => {
                this.$router.push("/index/home");
              }, 1000);
              localStorage.id = res.data.id;
              localStorage.role = res.data.role;
              localStorage.token = res.data.token;
            } else {
              this.$message.error("很抱歉登录失败，您输入的密码或者用户错误");
            }
          });
        } else {
          this.$message.error("很抱歉登录失败，您输入的密码或者用户错误");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  background: url("../assets/images/01.jpg");
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_conent {
    width: 360px;
    p {
      text-align: center;
      height: 40px;
      font-size: 30px;
      margin-bottom: 50px;
      color: #fff;
    }
    .el-form-item__label {
      color: #fff;
    }
    .el-input__inner {
      height: 30px;
    }
  }
  .log_btn {
    width: 100%;
  }
}
</style>