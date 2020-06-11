<template>

  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <span>商品分类</span>
      <el-button
        type="primary"
        class="btn"
        @click="dialogFormVisible = true"
      >添加分类</el-button>
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="100"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="分类名称"
        width="300"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.changeFal"
            style="margin-left: 10px"
          >{{ scope.row.cateName }}</span>
          <el-input
            v-else
            v-model="scope.row.cateName"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column
        label="是否启用"
        width="200"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="scope.row.fal"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.changeFal"
            size="mini"
            @click="handleEdit( scope.row)"
          >编辑</el-button>
          <el-button
            type="success"
            size="mini"
            v-else
            @click="editcate(scope.row)"
          >保存</el-button>

          <el-popconfirm
            title="确定删除这个账号吗？"
            @onConfirm="removeCate( scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="danger"
            >删除</el-button>
          </el-popconfirm>
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

    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="分类名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="分类名称"
            style="width:250px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否启用"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="form.value "
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addcate"
        >确 定</el-button>
      </div>
    </el-dialog>

  </el-card>

</template>

<script>
import {
  API_COMMODITY_CATELIST,
  API_COMMODITY_ADDCATE,
  API_COMMODITY_EDITCATE,
  API_COMMODITY_DELCATE
} from "@/api/apis";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 15,
      dialogFormVisible: false,
      form: {
        name: "",
        value: true,
        fal: true
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    handleEdit(row) {
      row.changeFal = !row.changeFal;
      row.fal = false;
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.catelist(this.currentPage, val);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.catelist(val, this.pageSize);
    },
    //渲染商品分类列表
    catelist(currentPage, pageSize) {
      API_COMMODITY_CATELIST(currentPage, pageSize).then(res => {
        this.total = res.data.total;
        res.data.data.forEach(item => {
          item.state = item.state == 1 ? true : false;
          item.changeFal = true;
          item.fal = true;
        });
        this.tableData = res.data.data;
      });
    },
    //添加分类
    addcate() {
      // this.form.name 分类名称的值   this.form.value  是否启用
      // console.log(this.form.name, this.form.value);
      let { name, value } = this.form;
      API_COMMODITY_ADDCATE(name, JSON.stringify(value)).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜您" + res.data.msg,
            type: "success"
          });
          this.catelist(this.currentPage, this.pageSize);
          setTimeout(() => {
            this.dialogFormVisible = false;
          }, 600);
        }
      });
    },
    //编辑分类
    editcate(row) {
      let { id, cateName, state } = row;
      API_COMMODITY_EDITCATE(id, cateName, JSON.stringify(state)).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜您" + res.data.msg,
            type: "success"
          });
          row.changeFal = !row.changeFal;
          this.catelist(this.currentPage, this.pageSize);
        }
      });
    },
    //删除商品类别
    removeCate(row) {
      API_COMMODITY_DELCATE(row.id).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜您" + res.data.msg,
            type: "success"
          });
          //渲染商品分类列表
          this.catelist(this.currentPage, this.pageSize);
        }
      });
    }
  },
  created() {
    //渲染商品分类列表
    this.catelist(this.currentPage, this.pageSize);
  }
};
</script>

<style lang="less" scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn {
    width: 100px;
    text-align: center;
  }
  input {
    width: 220px;
  }
}
</style>