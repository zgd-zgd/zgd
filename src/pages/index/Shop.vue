<template>

  <el-card class="box-card">
    <div
      slot="header"
      class="top"
    >
      <span>店铺管理</span>
      <el-button type="primary">保存</el-button>
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
            :src="form.avatar"
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
            label="在线支付满28减5"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="VC无限橙果汁全场8折"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="单人精彩套餐"
            name="type"
          ></el-checkbox>
          <el-checkbox
            label="特价饮品8折抢购"
            name="type"
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
import { API_SHOP_INFO, API_SHOP_EDIT } from "@/api/apis";
export default {
  data() {
    return {
      imgArr: [], //渲染店铺图片
      form: {
        name: "",
        bulletin: "",
        avatar: "",
        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        score: "",
        sellCount: "",
        supports: [],
        pics: "",
        date: "",
        minPrice: 0
      },
      //店铺头像 渲染的jpg
      imageUrl: "",
      //店铺图片
      dialogVisible: false,
      dialogVisible1: false,
      //上传店铺图片的数组
      pics: [],
      //上传头像的jpg
      img: "",
      //营业时间
      // date: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      // action: "http://172.16.4.200:5000/goods/goods_img_upload"
      action: "http://127.0.0.1:5000/shop/upload"
    };
  },
  methods: {
    //修改店铺信息
    onSubmit() {
      let {
        id,
        name,
        bulletin,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date
      } = this.form;
      if (
        !(
          id ||
          name ||
          bulletin ||
          deliveryPrice ||
          deliveryTime ||
          description ||
          score ||
          sellCount ||
          supports
        )
      ) {
        this.$message({
          showClose: true,
          message: "修改失败，填写信息！！！",
          type: "error"
        });
        return;
      }
      //活动多选转换
      supports = JSON.stringify(supports);
      //时间转换
      date = JSON.stringify(date);
      // 店铺图片转换
      let pics = JSON.stringify(this.pics);

      //店铺头像 如xxxxx.jpg
      let imageUrl = this.imageUrl == "" ? this.img : this.imageUrl;
      API_SHOP_EDIT(
        id,
        name,
        bulletin,
        imageUrl,
        deliveryPrice,
        deliveryTime,
        description,
        score,
        sellCount,
        supports,
        date,
        pics
      ).then(res => {
        console.log(res);
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
        this.pics = [];
      });
    },

    //店铺头像
    handleAvatarSuccess(res, file) {
      this.form.avatar = URL.createObjectURL(file.raw);
      this.imageUrl = res.imgUrl;
    },
    //店铺图片
    //移除图片时触发
    handleRemove(file) {
      //移除图片时，删除要上传图片数组中的相同图片
      this.pics.splice(this.pics.indexOf(file.url.slice(34)), 1);
    },
    //图片上传成功时触发
    handlePictureCardPreview(file) {
      this.pics.push(file.imgUrl); //像上传图片的数组中添加
    },
    info() {
      API_SHOP_INFO().then(res => {
        //数据赋值 渲染界面
        this.form = res.data.data;
        //默认头像
        this.img = this.form.avatar;
        //拼接头像地址
        this.form.avatar =
          "http://127.0.0.1:5000/upload/shop/" + this.form.avatar;
        this.form.pics.forEach(i => {
          this.imgArr.push({ url: "http://127.0.0.1:5000/upload/shop/" + i });
          this.pics.push(i);
        });
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
    width: 350px;
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