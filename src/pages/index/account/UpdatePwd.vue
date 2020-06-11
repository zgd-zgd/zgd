<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>修改密码</span>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item
          label="原密码"
          prop="pwd1"
        >
          <el-input
            type="password"
            v-model="ruleForm.pwd1"
            autocomplete="off"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="pwd2"
        >
          <el-input
            type="password"
            v-model="ruleForm.pwd2"
            autocomplete="off"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="pwd3"
        >

          <el-input
            v-model="ruleForm.pwd3"
            type="password"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { API_RAWPWD, API_UPDATEPWD } from "@/api/apis";
export default {
  data() {
    var zpwd1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("旧密码不能为空"));
      } else {
        let id = localStorage.getItem("id");
        let pwd = this.ruleForm.pwd1;
        API_RAWPWD(id, pwd).then(res => {
          console.log(res);
          if (res.data.code == "00") {
            callback();
          } else {
            callback(new Error("旧密码错误"));
          }
        });
      }
    };
    var zpwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("新密码不能为空"));
      } else {
        if (this.ruleForm.pwd3 !== "" && value !== this.ruleForm.pwd3) {
          callback(new Error("新密码与确认密码不一致"));
          return;
        }
        callback();
      }
    };
    var zpwd3 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认密码不能为空"));
      } else {
        if (this.ruleForm.pwd2 !== "" && value !== this.ruleForm.pwd2) {
          callback(new Error("确认密码与新密码不一致"));
          return;
        }
        callback();
      }
    };
    return {
      ruleForm: {
        pwd1: "",
        pwd2: "",
        pwd3: ""
      },
      //验证
      rules: {
        pwd1: [{ validator: zpwd1, trigger: "blur" }],
        pwd2: [{ validator: zpwd2, trigger: "blur" }],
        pwd3: [{ validator: zpwd3, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = localStorage.getItem("id");
          let newPwd = this.ruleForm.pwd3;
          API_UPDATEPWD(id, newPwd).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "恭喜你" + res.data.msg,
                type: "success"
              });
              setTimeout(() => {
                this.$router.push("/");
              }, 2000);
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.input {
  width: 300px;
}
</style>