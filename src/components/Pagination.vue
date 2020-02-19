<template>
  <div>
    <br />
    <br />
    <el-pagination
      :page-sizes="[5,10,20,50]"
      :total="total"
      :page-size="size"
      :current-page="current"
      @size-change="sizeChange"
      @current-change="currentChange"
      background
      layout="sizes,prev,pager,next,jumper"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    current: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 5
    }
  },
  methods: {
    sizeChange (value) {
      this.$emit('sizeChange', value)
    },
    currentChange (value) {
      this.$emit('currentChange', value)
    }
  }
}
</script>
