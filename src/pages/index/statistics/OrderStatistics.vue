<template>
  <div class="order">
    <div class="block">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="Time"
      >
      </el-date-picker>
      <el-button
        type="primary"
        @click="onSubmit"
      >查询</el-button>
    </div>

    <el-card class="box-card">
      <div id="echarts_box"></div>
    </el-card>
  </div>
</template>

<script>
import { API_ORDER_ORDERTOTAL } from "@/api/apis";
import echarts from "echarts";
export default {
  data() {
    return {
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
      value1: [new Date(2020, 4, 9, 10, 10), new Date(2020, 5, 15, 10, 10)]
    };
  },
  methods: {
    onSubmit() {
      this.ordertotal();
    },
    //渲染报表
    ordertotal() {
      // 初始化dom容器;
      var myChart = echarts.init(document.getElementById("echarts_box"));
      myChart.showLoading();
      API_ORDER_ORDERTOTAL(JSON.stringify(this.value1)).then(res => {
        let dateArr = []; //下单时间
        let moneyArr = []; //下单金额
        res.data.data.forEach(item => {
          dateArr.push(this.addZero(this.switchTimeFormat(item.orderTime)));
          moneyArr.push(item.orderAmount);
        });
        let option = {
          title: {
            text: "订单金额"
          },
          legend: {
            data: ["订单金额"]
          },
          tooltip: {
            trigger: "axis"
          },
          xAxis: {
            type: "category",
            data: dateArr
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "订单金额",
              data: moneyArr,
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(220, 220, 220, 0.8)"
              }
            }
          ]
        };
        //渲染图表
        myChart.setOption(option);
        myChart.hideLoading();
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
  mounted() {
    this.ordertotal();
  }
};
</script>

<style lang="less" scoped>
.order {
  .box-card {
    #echarts_box {
      height: 500px;
    }
  }
  .Time {
    margin: 0 16px 20px;
  }
}
</style>