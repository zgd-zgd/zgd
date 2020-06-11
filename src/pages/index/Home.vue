<template>
  <div class="homepage">
    <div class="header">
      <OrderBox
        v-for="item in imgList"
        :key="item.id"
        :img='item.img'
        :name='item.name'
        :money='item.money'
      ></OrderBox>
    </div>
    <!-- echarts预留位置 -->
    <el-card class="box-card">
      <div id="echarts_box"></div>
    </el-card>
  </div>
</template>

<script>
import OrderBox from "../../components/OrderBox";
import echarts from "echarts";
import { API_HOME_TOTALDATA } from "@/api/apis";
export default {
  components: {
    OrderBox
  },
  data() {
    return {
      imgList: [
        {
          id: 0,
          img: require("../../assets/images/1.jpg"),
          name: "总订单",
          money: 0
        },
        {
          id: 1,
          img: require("../../assets/images/2.jpg"),
          name: "总销售额",
          money: 0
        },
        {
          id: 2,
          img: require("../../assets/images/3.jpg"),
          name: "今日订单数",
          money: 0
        },
        {
          id: 3,
          img: require("../../assets/images/4.jpg"),
          name: "今日销售额",
          money: 0
        }
      ]
    };
  },
  mounted() {
    // 初始化dom容器;
    var myChart = echarts.init(document.getElementById("echarts_box"));
    myChart.showLoading();
    API_HOME_TOTALDATA().then(res => {
      this.imgList[0].money = res.data.todayOrder;
      this.imgList[1].money = res.data.totalAmount;
      this.imgList[2].money = res.data.todayOrder;
      this.imgList[3].money = res.data.totayAmount;
      let option = {
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单数据", "金额数据"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: res.data.xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单数据",
            type: "line",
            stack: "总量",
            data: res.data.orderData
          },
          {
            name: "金额数据",
            type: "line",
            stack: "总量",
            data: res.data.amountData
          }
        ]
      };
      //渲染图表
      myChart.setOption(option);
      myChart.hideLoading();
    });
  }
};
</script>

<style lang="less" scoped>
.homepage {
  padding-top: 30px;
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
  }
  #echarts_box {
    height: 300px;
  }
}
</style>