<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>添加账号</span>
      </div>

      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm input"
      >
        <el-form-item
          label="账号"
          prop="user"
        >
          <el-input
            type="text"
            v-model="ruleForm.account"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd"
        >
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户组"
          prop="userGroup"
        >
          <el-select
            v-model="ruleForm.userGroup"
            placeholder="请选择用户组"
          >
            <el-option
              label="超级管理员"
              value="超级管理员"
            ></el-option>
            <el-option
              label="普通管理员"
              value="普通管理员"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { API_USERADD } from "@/api/apis";
export default {
  data() {
    return {
      ruleForm: {
        account: "",
        password: "",
        userGroup: "普通管理员"
      },
      isAddUser: true
    };
  },
  methods: {
    submitForm() {
      if (this.isAddUser == false) return;
      this.isAddUser = false;
      //防抖节流
      setTimeout(() => {
        this.isAddUser = true;
      }, 1500);
      //获取数据
      let { account, password, userGroup } = this.ruleForm;
      //调用添加账号接口
      API_USERADD(account, password, userGroup).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，添加账号成功",
            type: "success"
          });
          setTimeout(() => {
            //跳转账号列表页面
            this.$router.push("/index/accountList");
          }, 1000);
        } else {
          this.$message.error("很抱歉添加失败，请重试");
        }
      });
    },
    //清空
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