<template>

  <el-card class="box-card">
    <div
      slot="header"
      class="top"
    >
      <span>店铺管理</span>
    </div>

    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="店铺名称">
        <el-input
          v-model="form.name"
          class="input"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺公告">
        <el-input
          type="textarea"
          v-model="form.bulletin"
          class="input"
          :rows="6"
        ></el-input>
      </el-form-item>

      <el-form-item label="店铺头像">
        <el-upload
          class="avatar-uploader"
          :action="action"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img
            v-if="form.avatar"
            :src="shopimg+form.avatar"
            class="avatar"
            width="120"
            height="120"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          ></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="店铺图片">
        <el-upload
          :action="action"
          list-type="picture-card"
          :on-success="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgArr"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img
            width="100%"
            :src="imgArr"
            alt=""
          >
        </el-dialog>
      </el-form-item>

      <el-form-item label="配送费">
        <el-input
          v-model="form.deliveryPrice"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="配送时间">
        <el-input
          v-model="form.deliveryTime"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="配送描述">
        <el-input
          v-model="form.description"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="店铺评分">
        <el-input
          v-model="form.score"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="销量">
        <el-input
          v-model="form.sellCount"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="活动">
        <el-checkbox-group
          v-model="form.supports"
          style="width:300px"
        >
          <el-checkbox
            v-for="i in supports"
            :key="i"
            :label="i"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="起送价格">
        <el-input
          v-model="form.minPrice"
          class="input"
        ></el-input>
      </el-form-item>

      <el-form-item label="营业时间">
        <el-time-picker
          is-range
          v-model="form.date"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-card>

</template>

<script>
import { API_SHOP_INFO, API_SHOP_EDIT, SHOP_IP, SHOP_IMG } from "@/api/apis";
export default {
  data() {
    return {
      form: {
        supports: []
      },
      imgArr: [],
      supports: [
        "单人精彩套餐",
        "特价饮品8折抢购",
        "VC无限橙果汁全场8折",
        "在线支付满28减5"
      ],
      //店铺图片
      dialogVisible: false,
      dialogVisible1: false,
      //店铺上传图片的地址
      action: SHOP_IP,
      // 渲染图片地址
      shopimg: SHOP_IMG
    };
  },
  methods: {
    //修改店铺信息
    onSubmit() {
      let shopObj = { ...this.form };
      shopObj.pics = JSON.stringify(shopObj.pics);
      shopObj.date = JSON.stringify(shopObj.date);
      shopObj.supports = JSON.stringify(shopObj.supports);
      API_SHOP_EDIT(shopObj).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: "恭喜你，修改成功",
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: "修改失败，请重试！！！",
            type: "error"
          });
        }
      });
    },

    //店铺头像
    handleAvatarSuccess(res) {
      this.form.avatar = res.imgUrl;
    },
    //店铺图片
    //移除图片时触发
    handleRemove(file) {
      //移除图片时，删除要上传图片数组中的相同图片
      let imgurl = !file.response
        ? file.url.substring(file.url.lastIndexOf("/") + 1) //移除原始图片
        : file.response.imgUrl; //移除新加的图片
      this.form.pics.splice(this.form.pics.indexOf(imgurl), 1);
    },
    //图片上传成功时触发
    handlePictureCardPreview(file) {
      //像上传图片的数组中添加
      this.form.pics.push(file.imgUrl);
    },
    //渲染页面数据
    info() {
      API_SHOP_INFO().then(res => {
        //渲染店铺图片
        this.imgArr = res.data.data.pics.map(i => {
          return { url: this.shopimg + i };
        });
        //数据赋值 渲染界面
        this.form = res.data.data;
      });
    }
  },
  created() {
    this.info();
  }
};
</script>

<style lang="less" scoped>
.box-card {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .input {
    width: 450px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}
</style>