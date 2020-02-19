import request from '@/plugin/axios'

export function fetchList () {
  return request({
    url: '/producer/list'
  })
}
