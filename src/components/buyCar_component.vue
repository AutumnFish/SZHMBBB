<template>
    <div class="numControl">
        <span class="sub" :class="{disabled:myCount==min}" @click="sub">-</span>
        <input type="number" v-model="myCount">
        <span class="add" :class="{disabled:myCount==max}" @click="add">+</span>
    </div>
</template>

<script>
export default {
  // 接收count
  props: ["count", "max", "min"],
  data: function() {
    return {
      myCount: 0
    };
  },
  created() {
    // 重新保存一份副本
    this.myCount = this.count;
  },
  methods: {
    sub() {
      if (this.myCount == this.min) {
        return;
      }
      this.myCount--;
      //   参数2 抛出一个值
      this.$emit("change",this.myCount);
    },
    add() {
      if (this.myCount == this.max) {
        return;
      }
      this.myCount++;
      this.$emit("change",this.myCount);
    }
  }
};
</script>

<style scoped lang="scss">
.numControl {
  display: flex;
  span {
    border: 1px solid #000;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    // 当 span被禁用时的样式
    &.disabled {
      // 不被允许
      cursor: not-allowed;
    }
  }
  input {
    width: 80px;
    border: 1px solid #000;
  }
}
</style>
