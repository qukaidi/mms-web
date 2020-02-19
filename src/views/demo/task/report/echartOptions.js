export default {
  title: {
    text: '任务统计'
  },
  xAxis: {
    type: 'value',
    max: 52,
    splitNumber: 52,
    splitArea: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    name: '周期',
    nameLocation: 'end'
  },
  yAxis: {
    splitArea: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    },
    name: '基准工时',
    nameLocation: 'end'
  },
  tooltip: {
    formatter (params) {
      let tipText
      if (params.seriesId === 'week') {
        tipText = `第${params.data[0]}周的${params.data[1]}小时`
      } else if (params.seriesId === 'work_hour') {
        tipText = '基准工时为' + params.data[0]
      }
      return tipText
    }
  },
  series: [
    {
      id: 'week',
      type: 'custom',
      renderItem (params, api) {
        const weekIndex = api.value(0)
        const workHours = api.value(1)
        const start = api.coord([weekIndex, workHours])
        const size = api.size([1, workHours])
        return {
          type: 'rect',
          shape: {
            x: start[0] - 8,
            y: start[1],
            width: size[0] - 4,
            height: size[1]
          },
          style: {
            fill: '#808080'
          }
        }
      }
    },
    {
      id: 'work_hour',
      type: 'custom',
      encode: {
        x: [1, 2],
        y: 3
      },
      renderItem (params, api) {
        const end = api.coord([api.value(1), api.value(0)])
        const size = api.size([api.value(2) - api.value(1), 0])
        return {
          type: 'rect',
          shape: {
            x: end[0] - 8,
            y: end[1],
            width: size[0] - 4,
            height: 2
          },
          style: {
            fill: 'red',
            color: 'red'
          }
        }
      }
    }]
}
