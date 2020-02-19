import request from '@/plugin/axios'

export function fetchList (params) {
  return request({
    url: '/purchase/list',
    params
  })
}

export function deleteByIds (ids) {
  return request({
    url: '/purchase/del',
    method: 'DELETE',
    data: ids
  })
}
export function add (data) {
  return request({
    url: '/purchase/add',
    method: 'POST',
    data
  })
}
export function fetchMaterListByTaskId (taskRecordId) {
  return request({
    url: '/purchase/get/task',
    params: {
      taskRecordId
    }
  })
}
