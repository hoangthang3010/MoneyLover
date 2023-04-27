<template>
  <div>
    <div class="text-center pt-2">
      Em có yêu anh không?
    </div>
    <a-button class="btn btn-yes" @click="isYes = true">
      Có
    </a-button>
    <div ref="refNo" class="p-2 btn btn-no" @mouseover="onHoverNo">
      Không
    </div>
    <a-modal v-model="isYes" title="Ok" @ok="isYes = false">
      <p>Ok :v</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return { isNo: true, isYes: false };
  },
  computed: {
    isAnswer() {
      return this.isNo ? "Có" : "Không";
    },
  },
  methods: {
    onHoverNo() {
      let screenHeight = window.innerHeight;
      let screenWidth = window.innerWidth;
      let top = this.$refs.refNo.getBoundingClientRect().top;
      let left = this.$refs.refNo.getBoundingClientRect().left;
      if (top + 100 > screenHeight) top = 0;
      if (left + 100 > screenWidth) left = 0;
      this.$refs.refNo.style.top = top + 100 + "px";
      this.$refs.refNo.style.left = left + 100 + "px";
    },
  },
};
</script>

<style scoped>
.btn {
  position: fixed;
  top: 50%;
  left: 50%;
}
.btn-yes {
  transform: translateX(calc(-50% - 50px));
}
.btn-no {
  line-height: 1.499;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 0 15px;
  font-size: 14px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border-color: #d9d9d9;
  transform: translateX(calc(-50% + 50px));
}
</style>
