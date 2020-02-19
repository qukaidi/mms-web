<template>
  <div class="d2-container-full">
    <div v-if="$slots.header" class="d2-container-full__header" ref="header">
      <slot name="header"/>
    </div>
    <div class="d2-container-full__body" ref="body">
      <slot/>
    </div>
    <div class="d2-container-full__footer" ref="footer">
      <Footer></Footer>
    </div>
  </div>
</template>

<script>
import Footer from './footer.vue'
import scroll from './mixins/normal'
export default {
  name: 'd2-container-full',
  components: {
    Footer
  },
  mixins: [
    scroll
  ],
  mounted () {
    // 增加滚动事件监听
    this.addScrollListener()
  },
  beforeDestroy () {
    // 移除滚动事件监听
    this.removeScrollListener()
  }
}
</script>
