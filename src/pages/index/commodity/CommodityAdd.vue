<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品添加</span>

      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="商品名称">
          <el-input
            v-model="form.name"
            placeholder="商品名称"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select
            v-model="form.category"
            placeholder="请选择商品分类"
          >
            <el-option
              v-for="(item,index) in cateList"
              :key="index"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number
            v-model="form.price"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="action"
            list-type="picture-card"
            :on-success="succeed_img"
            :on-remove="remove_img"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog>
            <img
              width="100%"
              :src="imgUrl"
              alt=""
            >
          </el-dialog>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input
            type="textarea"
            v-model="form.goodsDesc"
            class="input"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >添加商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { API_COMMODITY_CATEGORIES, API_GOODS_ADD } from "@/api/apis";
export default {
  data() {
    return {
      form: {
        name: "",
        category: "",
        goodsDesc: "",
        price: 1
      },
      imgUrl: [],
      //商品类别
      cateList: [],
      //
      // action: "http://172.16.4.200:5000/goods/goods_img_upload"
      action: "http://127.0.0.1:5000/goods/goods_img_upload"
    };
  },
  methods: {
    //添加商品
    onSubmit() {
      let { name, category, goodsDesc, price } = this.form;
      let imgUrl = this.imgUrl;
      if (!name || !category || !goodsDesc || !price || imgUrl.length == 0)
        return;
      // console.log(name, category, goodsDesc, price, this.imgUrl);
      API_GOODS_ADD(name, category, price, imgUrl, goodsDesc).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，添加商品成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push("/index/commodityList");
          }, 500);
        }
      });
    },
    //移除图片
    remove_img(file) {
      this.imgUrl.splice(this.imgUrl.indexOf(file.imgUrl), 1);
    },
    //上传图片成功的函数
    succeed_img(file) {
      this.imgUrl.push(file.imgUrl);
    },
    //商品类别
    catelist() {
      API_COMMODITY_CATEGORIES().then(res => {
        this.cateList = res.data.categories;
      });
    }
  },
  created() {
    //渲染商品类别选择
    this.catelist();
  }
};
</script>

<style lang="less" scoped>
.input {
  width: 500px;
}
</style>