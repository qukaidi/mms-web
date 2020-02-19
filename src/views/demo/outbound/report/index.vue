<template>
  <d2-container>
    <template slot="header">工作日志统计图</template>
     <el-form :inline="true">
            <el-form-item label="制作时间">
              <el-date-picker
                v-model="queryDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
              <el-form-item>
              <el-button type="primary" @click="onExport">导出</el-button>
            </el-form-item>
      </el-form>
		<div ref="workSta" style="margin-top:30px;width:95%;height:90%;"></div>
		<div class="layui-word-aux">
			提示:
			1、如果要生成Excel，请先查询生成图表再导出。
			2、图表生成由于需要花费一定时间来统计,请耐心等待。
		</div>
  </d2-container>
</template>

<script>
import {
  fetchData
} from '@api/work.js'
import echarts from 'echarts'
import Options from './echartOptions.js'
export default {
  name: 'outReport',
  data () {
    return {
      chartInstance: null,
      queryDate: null
    }
  },
  mounted () {
    this.initEchart()
    fetchData().then(res => {
      const { data } = res
      let { chartInstance } = this
      let table = JSON.parse(data)
      let list = Object.keys(table)
      let dataList = []
      for (var columnKey in table) {
        var val = []; var key
        for (key in table[columnKey]) {
          var obj = table[columnKey]
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            val.push(obj[key])
          }
        }
        dataList.push({
          name: columnKey,
          type: 'bar',
          stack: '总量',
          data: val
        })
      }
      chartInstance.setOption({
        xAxis: [{
          id: 'axi',
          data: Object.keys(table[list[0]])
        }],
        legend: { id: 'lege', data: list },
        series: dataList
      })
      chartInstance.hideLoading()
    })
  },
  methods: {
    initEchart () {
      this.chartInstance = echarts.init(this.$refs.workSta)
      this.chartInstance.setOption(Options)
    },
    onSearch () {
    },
    onExport () {
    }
  }
}
</script>
<style lang="scss">
.layui-word-aux {
    color: #999;
    padding: 0 5px;
}
</style>
