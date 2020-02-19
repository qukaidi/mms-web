import request from '@/plugin/axios'

export function fetchList () {
  return request({
    url: '/material/list'
  })
}
export function fetchById (id) {
  return request({
    url: '/material/get/id',
    params: {
      id
    }
  })
}
export function fetchListByDep (params) {
  return request({
    url: '/material/view/by/department',
    params
  })
}
export function deleteByIds (ids) {
  return request({
    url: '/material/del',
    method: 'DELETE',
    data: ids
  })
}
export function add (data) {
  return request({
    url: '/material/add',
    method: 'POST',
    data
  })
}
export function fetchParentListByDep () {
  return request({
    url: '/material/view/by/department-parent'
  })
}
export function fetchPrice (params) {
  return request({
    url: '/material/get-price',
    params
  })
}
