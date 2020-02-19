<template>
  <d2-container>
    <template slot="header">任务统计图</template>
		<div ref="taskRecord" style="margin-top:30px;width:95%;height:90%;"></div>
  </d2-container>
</template>

<script>
import {
  fetchData
} from '@api/statistic.js'
import echarts from 'echarts'
import Options from './echartOptions.js'
export default {
  name: 'taskReport',
  data () {
    return {
      chartInstance: null
    }
  },
  mounted () {
    this.initEchart()
    fetchData().then(res => {
      let { workHourList, statistic } = res.data
      var lineDataList = []
      var lastData = null
      workHourList.forEach((value) => {
        let data = []
        data.push(value.manHour)
        data.push(value.startLine)
        if (lastData != null) {
          lastData.push(value.startLine)
        }
        lastData = data
        lineDataList.push(data)
      })
      var lineDataListSize = lineDataList.length
      if (lineDataListSize > 0) {
        lineDataList[lineDataListSize - 1].push(52)
      }
      var dataValues = []
      dataValues = Object.values(statistic).map((value, index) => [index + 1, value])
      this.chartInstance.setOption({
        series: [
          {
            id: 'week',
            data: dataValues
          },
          {
            id: 'work_hour',
            data: lineDataList
          }
        ]
      })
    })
  },
  methods: {
    initEchart () {
      this.chartInstance = echarts.init(this.$refs.taskRecord)
      this.chartInstance.setOption(Options)
    }
  }
}
</script>
