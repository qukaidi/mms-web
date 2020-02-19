import request from '@/plugin/axios'

export function fetchData () {
  return request({
    url: '/task/statistic'
  })
}
