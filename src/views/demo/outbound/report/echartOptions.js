export default {
  tooltip: {
    show: true,
    trigger: 'item'
  },
  legend: {
    id: 'lege',
    x: 'left'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    },
    {
      id: 'axi',
      axisLabel: {
        rotate: 30,
        interval: 0
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ]
}
