<template>
  <div class="home">
    <el-container>
      <!-- 左边导航 -->
      <el-aside width="300px">
        <el-row class="tac">
          <el-col>
            <el-menu
              :default-active="hash"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color=" #26416C"
              text-color="#fff"
              active-text-color="#ffd04b"
              router
              unique-opened
            >
              <el-menu-item>
                <h1 class="title"><img
                    :src="require('../assets/images/07.jpg')"
                    alt=""
                  >外卖商家中心</h1>
              </el-menu-item>
              <div
                v-for="item in newtreelist"
                :key="item.index"
              >
                <!-- 二级菜单导航 -->
                <el-submenu
                  :index="item.index"
                  v-if="item.children"
                >
                  <template slot="title">
                    <i :class="item.icls"></i>
                    <span>{{item.title}}</span>
                  </template>
                  <el-menu-item
                    v-for="children in item.children"
                    :key="children.index"
                    :index="children.index"
                  >{{children.title}}</el-menu-item>
                </el-submenu>

                <!-- 一级菜单导航 -->
                <el-menu-item
                  :index="item.index"
                  v-else
                >
                  <i :class="item.icls"></i>
                  <span slot="title">{{item.title}}</span>
                </el-menu-item>
              </div>

            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <!-- 右边内容 -->
      <el-container class="home_right">
        <!-- 面包屑导航 -->
        <el-header
          class="home_right_header"
          style="height:80px"
        >
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="item in crumbsList"
              :key="item"
            ><span class="colorFFF">{{item}}</span></el-breadcrumb-item>
          </el-breadcrumb>

          <!-- 个人头像 -->
          <el-dropdown v-if="fal">
            <div class="el-dropdown-link head_img colorFFF">
              {{name}} <img :src="imageUrl">
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><a
                  class="head_A"
                  href="#/index/personal"
                > 个人中心</a></el-dropdown-item>
              <el-dropdown-item><a
                  class="head_A"
                  href="#/index/writeoff"
                >注销</a></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span
            v-html="name"
            v-else
          ></span>
        </el-header>

        <!-- main主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { API_ACCOUNT, API_TOKEN } from "@/api/apis";
export default {
  data() {
    return {
      //默认hash,导航菜单激活
      hash: "",
      //treeList:菜单导航列表
      //index：hash路径
      //title：菜单导航标题
      treeList: [
        {
          index: "/index/home",
          icls: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"]
        },
        {
          index: "/index/order",
          icls: "el-icon-tickets",
          title: "订单管理",
          role: ["super", "normal"]
        },
        {
          index: "/index/commodityList",
          icls: "el-icon-shopping-cart-1",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            {
              index: "/index/commodityList",
              // icls: "el-icon-shopping-cart-1",
              title: "商品列表"
            },
            {
              index: "/index/commodityAdd",
              // icls: "el-icon-shopping-cart-1",
              title: "商品添加"
            },
            {
              index: "/index/commodityClassify",
              // icls: "el-icon-shopping-cart-1",
              title: "商品分类"
            }
          ]
        },
        {
          index: "/index/shop",
          icls: "el-icon-price-tag",
          title: "店铺管理",
          role: ["super"]
        },
        {
          index: "/index/userList",
          icls: "el-icon-s-custom",
          title: "账号管理",
          role: ["super"],
          children: [
            {
              index: "/index/accountList",
              // icls: "el-icon-shopping-cart-1",
              title: "账号列表"
            },
            {
              index: "/index/accountAdd",
              // icls: "el-icon-shopping-cart-1",
              title: "添加账号"
            },
            {
              index: "/index/updatePwd",
              // icls: "el-icon-shopping-cart-1",
              title: "修改密码"
            }
          ]
        },
        {
          index: "/index/commodityStatistics",
          icls: "el-icon-switch-button",
          title: "销售统计",
          role: ["super", "normal"],
          children: [
            {
              index: "/index/commodityStatistics",
              // icls: "el-icon-shopping-cart-1",
              title: "商品统计"
            },
            {
              index: "/index/orderStatistics",
              // icls: "el-icon-shopping-cart-1",
              title: "订单统计"
            }
          ]
        }
      ],
      crumbsList: ["首页"],
      //头像
      imageUrl: "",
      name: "<a href='/'>请先登录账号</a>",
      fal: false,
      role: ""
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath, 123);
      // this.hash = location.hash.slice(1);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath, 456);
    },
    //面包屑导航 数据会根据treeList里的数据发生改变
    bread(val) {
      // val为当前hash值
      //遍历treeList 菜单导航  备注：forEach无法停止循环，可以for等循环 （未改）
      /*  this.treeList.forEach(item => {
        // console.log(val.path);
        // 当菜单导航hash路径==当前hash执行
        if (item.index == val) {
          // console.log("一级", item);
          //crumbsList（面包屑数组）： 将面包屑数组重新赋值
          this.crumbsList = [item.title];
        }
        //item.children:有二级子菜单
        if (item.children) {
          //再次遍历
          item.children.forEach(children => {
            //当二级子菜单中导航路径==当前hash值时执行
            if (children.index == val) {
              //想面包屑数组中加新元素（替换）
              this.crumbsList.splice(1, 1, children.title);
            }
          });
        }
      });*/

      //改  优化  具体参考上面的forEach
      for (let item of this.treeList) {
        if (item.index == val) {
          this.crumbsList = [item.title];
          // return;  不能加 后影响下面代码 因二级菜单的一级标题也是在这段代码获取
          //能力有限
        }
        if (item.children) {
          for (let children of item.children) {
            if (children.index == val) {
              this.crumbsList.splice(1, 1, children.title);
              return;
            }
          }
        }
      }
    },
    //头像
    heda() {
      if (!localStorage.getItem("id")) return;
      API_ACCOUNT(localStorage.getItem("id")).then(res => {
        // console.log(res);
        this.name = "欢迎你，" + res.data.accountInfo.account;
        this.imageUrl = res.data.accountInfo.imgUrl;
        this.fal = true;
      });
    }
  },
  created() {
    //判断token是否在有效期
    API_TOKEN(localStorage.token).then(res => {
      if (res.data.code == 0) {
        //头像
        this.heda();
      } else {
        localStorage.clear();
      }
    });

    // this.hash = location.hash.slice(1);
    //定义hsah==当前页面hash值
    let hash = this.$route.path;

    //默认菜单导航激活
    this.hash = hash;
    // 把this挂在window上
    window.__this = this;

    //初始化时，面包屑导航根据hash显示
    this.bread(hash);

    this.role = localStorage.role;
  },
  watch: {
    $route: {
      handler: val => {
        //item.index:hash路径  val当前hash路径
        //定义hsah==当前页面hash值
        let hash = val.path;

        //hsah发生变化时，面包屑跟着改变
        window.__this.bread(hash);

        //导航菜单默认样式
        window.__this.hash = hash;

        //头像
        window.__this.heda();
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    newtreelist() {
      return this.treeList.filter(i => i.role.includes(this.role));
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
    .tac.el-row {
      height: 100%;
      .el-col.el-col-24 {
        height: 100%;
        .el-menu-vertical-demo.el-menu {
          height: 100%;
        }
      }
    }

    .el-menu {
      border: 0;
    }
  }
  .title {
    font-size: 20px;
    text-indent: 1em;
    img {
      width: 40px;
      margin-right: 10px;
      border-radius: 50%;
    }
    display: flex;
    align-items: center;
  }
  .home_right {
    background: rgb(226, 225, 225);
    .el-header.home_right_header {
      height: 100px;
      background: url("../assets/images/06.jpg") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .head_img {
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-left: 10px;
        }
      }
      .colorFFF {
        color: #fff;
      }
    }
  }
}
.head_A {
  width: 100%;
  height: 100%;
  display: block;
}
</style>