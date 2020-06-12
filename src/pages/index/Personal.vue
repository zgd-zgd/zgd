<template>
  <el-card
    class="box-card"
    :body-style="{paddingTop:0}"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <span>管理员信息</span>
    </div>
    <div class="box">管理员ID：{{list.id}} </div>
    <div class="box">账号：{{list.account}} </div>
    <div class="box">用户组：{{list.userGroup}} </div>
    <div class="box">创建时间：{{list.ctime}} </div>
    <div class="box_img">
      管理员头像：
      <el-upload
        class="avatar-uploader"
        :action="action"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="{id:list.id}"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar img"
        >
        <i
          v-else
          class="el-icon-plus avatar-uploader-icon"
        ></i>
      </el-upload>
    </div>
  </el-card>
</template>

<script>
import { API_ACCOUNT, HEAD_IMG } from "@/api/apis";
export default {
  data() {
    return {
      list: {},
      imageUrl: "",
      // 上传头像路径
      action: HEAD_IMG
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
      // window.location.reload();
      this.$router.push("/index");
      setTimeout(() => {
        this.$router.push("/index/personal");
      }, 60);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //转换时间
    switchTimeFormat(time) {
      const dateTime = new Date(time);
      const year = dateTime.getFullYear();
      const month = dateTime.getMonth() + 1;
      const date = dateTime.getDate();
      const hour = dateTime.getHours();
      const minute = dateTime.getMinutes();
      const second = dateTime.getSeconds();
      return `${year}-${this.addZero(month)}-${this.addZero(
        date
      )} ${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`;
    },
    addZero(v) {
      return v < 10 ? "0" + v : v;
    }
  },
  created() {
    if (!localStorage.getItem("id")) return;
    API_ACCOUNT(localStorage.getItem("id")).then(res => {
      this.list = res.data.accountInfo;
      this.imageUrl = this.list.imgUrl;
      this.list.ctime = this.addZero(this.switchTimeFormat(this.list.ctime));
    });
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .box {
    border-bottom: 1px solid #ccc;
    height: 60px;
    line-height: 60px;
  }
  .box_img {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .img {
      width: 100px;
      height: 100px;
      background: #ccc;
    }
  }
}
</style>