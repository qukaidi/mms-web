export default {
  title: {
    text: '材料存量'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    y: 'top'
  },
  xAxis: {
    id: 'xAs',
    type: 'category',
    axisLabel: {
      rotate: 30,
      interval: 0
    }
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: {
    show: true,
    realtime: true,
    y: 36,
    height: 50,
    start: 0,
    end: 6
  },
  toolbox: {
    x: 'right',
    y: 'top',
    show: true,
    feature: {
      mark: { show: true },
      dataZoom: { show: true },
      dataView: { show: true },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [{
    id: 'now-num',
    name: '现有数量',
    type: 'bar'
  }, {
    id: 'less-num',
    name: '最低储备',
    type: 'bar'
  }]
}
