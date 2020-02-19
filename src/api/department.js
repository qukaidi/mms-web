import request from '@/plugin/axios'

export function fetchList () {
  return request({
    url: '/department/list'
  })
}

export function fetchParentList () {
  return request({
    url: '/department/list/parent'
  })
}
