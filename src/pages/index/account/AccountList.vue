<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>账号列表</span>
      </div>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="table"
      >
        <el-table-column
          type="selection"
          width="120"
        >
        </el-table-column>
        <el-table-column
          label="账号"
          width="200"
        >
          <template slot-scope="scope"><span v-if="scope.row.vVisible">{{ scope.row.account }}</span>
            <el-input
              v-else
              v-model="scope.row.account"
              disabled
            ></el-input>
          </template>

        </el-table-column>
        <el-table-column
          prop="userGroup"
          label="用户组"
          width="200"
        >
          <template slot-scope="scope"><span v-if="scope.row.vVisible">{{ scope.row.userGroup }}</span>
            <el-input
              v-else
              v-model="scope.row.userGroup"
            ></el-input>
          </template>

        </el-table-column>
        <el-table-column
          prop="date"
          label="创建时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope"><span v-if="scope.row.vVisible">{{ scope.row.ctime }}</span>
            <el-input
              v-else
              v-model="scope.row.ctime"
            ></el-input>
          </template>

        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">

            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              v-if="scope.row.vVisible"
            >编辑</el-button>
            <el-button
              v-else
              size="mini"
              type="success"
              @click="UpdateAcc(scope.$index, scope.row)"
            >保存</el-button>
            <el-popconfirm
              title="确定删除这个账号吗？"
              @onConfirm="removeAcc( scope.row)"
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

      <div style="margin-top: 20px">
        <el-button
          type="danger"
          @click="BatchRemoveAcc"
        >批量删除</el-button>
        <el-button
          type="primary"
          @click="toggleSelection()"
        >取消选择</el-button>
      </div>

    </el-card>
  </div>
</template>

<script>
import {
  API_USERLIST,
  API_REMOVE_ACC,
  API_BATCH_DELETE,
  API_UPDATEACC
} from "@/api/apis";
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      //总条数
      total: 30,
      //每页条数
      pageSize: 5,
      //当前页数
      currentPage: 1
    };
  },

  methods: {
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除账号
    BatchRemoveAcc() {
      let ids = this.$refs.multipleTable.selection.map(item => item.id);
      if (ids.length == 0) {
        this.$message({
          message: "请您先选择需删除的数据",
          type: "warning"
        });
        return;
      }

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_BATCH_DELETE(JSON.stringify(ids)).then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: "恭喜你，删除成功",
                type: "success"
              });
              let Page = Math.ceil((this.total - ids.length) / this.pageSize); //- 选中的个数
              let current = this.currentPage > Page ? Page : this.currentPage;
              this.currentPage = current < 1 ? 1 : current;
              this.accList(this.currentPage, this.pageSize);
            }
          });
        })
        .catch(() => {});
    },
    //编辑
    handleEdit(index, row) {
      console.log(index, row);
      row.vVisible = !row.vVisible;
    },
    //保存编辑的信息
    UpdateAcc(i, row) {
      let { id, account, userGroup } = row;
      API_UPDATEACC(id, account, userGroup).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，修改成功",
            type: "success"
          });
          row.vVisible = !row.vVisible;
        }
      });
    },
    //删除账号
    removeAcc(row) {
      API_REMOVE_ACC(row.id).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "恭喜你，删除成功",
            type: "success"
          });
          let Page = Math.ceil((this.total - 1) / this.pageSize); //删除后计算 总条数-1 / 每页条数  得 新页数
          let current = this.currentPage > Page ? Page : this.currentPage; //当前页数 > 新的页数  代表删除的最后一页的最后条数据 赋值新的页数还是当前页
          this.currentPage = current < 1 ? 1 : current; //小于1代表只有一页
          this.accList(this.currentPage, this.pageSize);
        }
      });
    },

    //分页功能
    //每页条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.accList(this.currentPage, val);
    },
    //当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.accList(val, this.pageSize);
    },
    //渲染账号列表
    accList(currentPage, pageSize) {
      //调用账号列表接口
      API_USERLIST(currentPage, pageSize).then(res => {
        // console.log(res.data);
        let data = res.data;
        this.total = data.total;

        data.data.forEach(item => {
          item.vVisible = true;
          item.ctime = this.addZero(this.switchTimeFormat(item.ctime));
        });
        this.tableData = data.data;
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
    //账号列表渲染

    //获取数据 currentPage:当前页数  pageSize:每页条数
    let { currentPage, pageSize } = this;
    this.accList(currentPage, pageSize);
  }
};
</script>

<style lang="less" scoped>
.table {
  margin-bottom: 20px;
  input {
    height: 30px;
  }
}
</style>