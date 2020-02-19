import request from '@/plugin/axios'

export function fetchSelectList () {
  return request({
    url: '/task/select_list'
  })
}
export function deleteByIds (ids) {
  return request({
    url: '/task/del',
    method: 'DELETE',
    data: ids
  })
}
export function fetchList (params) {
  return request({
    url: '/task/list',
    params
  })
}
export function exportExcel (params) {
  return request({
    url: '/excel/export',
    params,
    paramsSerializer (params) {
      params.type = 2
      let url = ''
      Object.keys(params).forEach(field => {
        if (field === 'id') {
          if (params[field] && params[field].length) {
            params[field].forEach(id => {
              url += `${field}=${id}&`
            })
          }
        } else {
          url += `${field}=${params[field]}&`
        }
      })
      return url
    }
  })
}
export function add (data) {
  return request({
    url: '/task/add',
    method: 'POST',
    data
  })
}
