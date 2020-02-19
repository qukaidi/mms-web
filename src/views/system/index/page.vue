<template>
  <d2-container class="page">
    <template slot="header">物料管理系统后台网站</template>
    <div ref="material" style="width: 95%;height:70vh;"></div>
  </d2-container>
</template>

<script>
import {
  fetchList
} from '@api/material.js'
import echarts from 'echarts'
import Options from './echartOptions.js'
import echartsThemeData from './echarts.theme.json'

export default {
  data () {
    return {
      chartInstance: null
    }
  },
  mounted () {
    this.initEchart()
    fetchList().then(res => {
      var xname = []
      var arr1 = []
      var arr2 = []
      res.data.forEach(item => {
        if (item.nowNum >= 0 && item.minNum >= 0) {
          xname.push(item.name)
          arr1.push(item.nowNum)
          arr2.push(item.minNum)
        }
      })
      this.chartInstance.setOption({
        xAxis: [{
          id: 'xAs',
          data: xname
        }],
        series: [{ id: 'now-num', data: arr1 }, { id: 'less-num', data: arr2 }]
      })
    })
  },
  methods: {
    initEchart () {
      // var obj = JSON.parse(echartsThemeData)
      echarts.registerTheme('westeros', echartsThemeData)
      this.chartInstance = echarts.init(this.$refs.material,'westeros')
      this.chartInstance.setOption(Options)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>
