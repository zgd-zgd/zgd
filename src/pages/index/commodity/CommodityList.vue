<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>商品列表</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
              class="demo-table-expand"
            >
              <el-form-item label="商品ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <img
                  v-for="img in props.row.imgUrl"
                  :key="img"
                  :src="img"
                  alt=""
                  width="50px"
                  height="50px"
                >
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="所属分类"
          prop="category"
        >
        </el-table-column>
        <el-table-column
          label="商品价格"
          prop="price"
          width='100px'
        >
        </el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="scope">
            <img
              v-for="img in scope.row.imgUrl"
              :key="img"
              :src="img"
              alt=""
              width="50px"
              height="50px"
            >
          </template>
        </el-table-column>
        <el-table-column
          label="商品描述"
          prop="goodsDesc"
        >
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit( scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete( scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div
        class="block"
        style="margin-top:30px"
      >
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      title="修改商品"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
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
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="success_img"
            :file-list="imgArr"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible1">
            <img
              width="100%"
              :src="imgArr"
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
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="GoodsEdit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  API_GOODS_LIST,
  API_GOODS_DEL,
  API_GOODS_EDIT,
  API_COMMODITY_CATEGORIES
} from "@/api/apis";
export default {
  data() {
    return {
      //imgArr:多张图片数组
      imgArr: [],
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogVisible: false,
      form: {
        name: "",
        category: "",
        goodsDesc: "",
        price: 1
      },
      formLabelWidth: "120px",
      imgUrl: "",
      dialogVisible1: false,
      //商品类别
      cateList: [],
      //上传商品路径
      // action: "http://172.16.4.200:5000/goods/goods_img_upload"
      action: "http://127.0.0.1:5000/goods/goods_img_upload",
      //img 需要上传到编辑的图片
      img: []
    };
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.imgArr = [];
    },
    //确认框（是否退出模态框）
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
          this.imgArr = [];
          this.img = [];
        })
        .catch(() => {});
    },
    //删除商品
    handleDelete(row) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_GOODS_DEL(row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "恭喜你，删除成功",
                type: "success"
              });
              let Page = Math.ceil((this.total - 1) / this.pageSize); //- 选中的个数
              let current = this.currentPage > Page ? Page : this.currentPage;
              this.currentPage = current < 1 ? 1 : current;
              this.goodsList(this.currentPage);
            }
          });
        })
        .catch(() => {});
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.goodsList(this.currentPage);
    },
    handleCurrentChange(val) {
      this.goodsList(val);
    },
    //渲染商品列表
    goodsList(currentPage) {
      API_GOODS_LIST(currentPage, this.pageSize).then(res => {
        this.total = res.data.total;
        this.tableData = res.data.data;
        this.tableData.forEach(i => {
          i.ctime = this.addZero(this.switchTimeFormat(i.ctime));
        });
      });
    },

    //确定修改商品
    GoodsEdit() {
      let { name, category, price, goodsDesc, id } = this.form;
      API_GOODS_EDIT(name, category, price, this.img, goodsDesc, id).then(
        res => {
          if (res.data.code == 0) {
            this.$message({
              message: "恭喜你，修改商品成功，正在为您更新商品",
              type: "success"
            });
            this.dialogVisible = false;
            this.img = [];
            this.goodsList(this.currentPage);
            this.imgArr = [];
          }
        }
      );
    },
    //商品类别
    catelist() {
      API_COMMODITY_CATEGORIES().then(res => {
        this.cateList = res.data.categories;
      });
    },

    //图片
    //移除图片触发
    handleRemove(file) {
      // 当移除时返回的jpg; 删除图片
      this.img.splice(this.img.indexOf(file.url.slice(44)), 1);
    },
    // 文件上传时
    handlePictureCardPreview(file) {
      this.imgUrl = file.url;
      this.dialogVisible1 = true;
    },
    //上传成功后触发
    success_img(res) {
      // console.log(res); //需要上传到后台的参数
      this.img.push(res.imgUrl);
    },
    //点击编辑时触发
    handleEdit(row) {
      this.form = row;
      //显示模态框
      this.dialogVisible = true;
      //渲染图片编辑时
      this.form.imgUrl.forEach(i => {
        this.imgArr.push({ url: i });
        this.img.push(i.slice(44)); //得到最初的12333.jpg这中图片
      });
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
    //渲染商品列表
    this.goodsList(this.currentPage);
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

// 上传图片样式
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>