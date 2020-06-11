<template>
  <div>
    注销页面
  </div>
</template>

<script>
export default {
  created() {
    console.log(22);

    this.$message({
      message: "正在退出登录，欢迎下次再来",
      type: "success"
    });

    this.$router.push("/");
    localStorage.clear();
  }
};
</script>

<style lang="scss" scoped>
</style>