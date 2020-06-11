<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true">
        <el-form-item label="订单号">
          <el-input
            placeholder="订单号"
            v-model="orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input
            placeholder="收货人"
            v-model="consignee"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            placeholder="手机号"
            v-model="phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input
            placeholder="订单状态"
            v-model="orderState"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <template>
            <div class="block">
              <span class="demonstration">选择时间 </span>
              <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="checkOreder"
          >查询</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单信息表格 -->

      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="orderNo"
          label="订单号"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="orderTime"
          label="下单时间"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="consignee"
          label="收货人"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="deliverAddress"
          label="配送地址"
          width="240"
        >
        </el-table-column>
        <el-table-column
          prop="deliveryTime"
          label="送达时间"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="用户备注"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="订单金额"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="orderState"
          label="订单状态"
          width="120"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
            >查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="changeOrder(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->

      <div class="block paging">
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

    <!-- 模态框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="订单号">
          <el-input
            v-model="form.orderNo"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-input
            v-model="form.orderTime"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input
            v-model="form.phone"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input
            v-model="form.consignee"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="送货地址">
          <el-input
            v-model="form.deliverAddress"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="送达时间">
          <el-input
            v-model="form.deliveryTime"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remarks"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input
            v-model="form.orderAmount"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input
            v-model="form.orderState"
            :disabled='form.fal'
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="edit_order"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { API_ORDER_LIST, API_ORDER_SEARCH, API_ORDER_EDIT } from "@/api/apis";
export default {
  data() {
    return {
      //选择时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [],
      // value2: "",
      //订单号
      orderNo: "",
      //收货人
      consignee: "",
      //手机号
      phone: "",
      //订单状态
      orderState: "",
      // 表格数据
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      //模态框
      dialogVisible: false,
      form: {}
    };
  },
  methods: {
    //查看订单详情
    handleClick(row) {
      this.dialogVisible = true;
      this.form = row;
      this.form.fal = true; //禁用
    },
    //编辑订单模态框
    changeOrder(row) {
      this.dialogVisible = true;
      this.form = row;
      this.form.fal = false; //禁用
    },
    //编辑订单信息
    edit_order() {
      this.dialogVisible = false;
      if (this.form.fal) {
        //代表点击的是查看订单详情
        return;
      } else {
        //编辑订单
        let {
          id,
          orderNo,
          orderTime,
          phone,
          consignee,
          deliverAddress,
          deliveryTime,
          remarks,
          orderAmount,
          orderState
        } = this.form;
        API_ORDER_EDIT(
          id,
          orderNo,
          orderTime,
          phone,
          consignee,
          deliverAddress,
          deliveryTime,
          remarks,
          orderAmount,
          orderState
        ).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: "恭喜你，修改订单成功",
              type: "success"
            });
          }
        });
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      //渲染订单列表
      this.orderList(this.currentPage);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      //渲染订单列表
      this.orderList(val);
    },
    //渲染订单列表
    orderList(currentPage) {
      let { orderNo, consignee, phone, orderState, value1 } = this;
      value1 = JSON.stringify(value1);
      API_ORDER_LIST(
        currentPage,
        this.pageSize,
        orderNo,
        consignee,
        phone,
        orderState,
        value1
      ).then(res => {
        // console.log(res);
        this.total = res.data.total;
        this.tableData = res.data.data;
        this.tableData.forEach(i => {
          i.orderTime = this.addZero(this.switchTimeFormat(i.orderTime));
          i.deliveryTime = this.addZero(this.switchTimeFormat(i.deliveryTime));
        });
      });
    },
    //查询
    checkOreder() {
      if (
        !(
          this.orderNo &&
          this.consignee &&
          this.phone &&
          this.orderState &&
          this.value1.length != 0
        )
      ) {
        // 模糊查询
        this.orderList(this.currentPage);
      } else {
        let { orderNo, consignee, phone, orderState, value1 } = this;
        value1 = JSON.stringify(value1);
        //精确查询
        API_ORDER_SEARCH(
          this.currentPage,
          this.pageSize,
          orderNo,
          consignee,
          phone,
          orderState,
          value1
        ).then(res => {
          // console.log(res);
          this.total = res.data.total;
          this.tableData = res.data.data;
        });
      }
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
    //渲染订单列表
    this.orderList(this.currentPage);
  }
};
</script>

<style lang="less" scoped>
.paging {
  margin-top: 50px;
}
</style>