<template>
  <div class="box">
    <img
      :src="img"
      alt=""
    >
    <div>
      <p>{{name}}</p>
      <p>{{money}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["img", "name", "money"]
};
</script>

<style lang="less" scoped>
.box {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 30px;
  justify-content: space-between;
  width: 200px;
  img {
    width: 60px;
    height: 60px;
  }
  p {
    text-align: center;
  }
}
</style>