import request from '@/plugin/axios'
export function fetchList (params) {
  return request({
    url: '/work/list',
    params
  })
}
export function deleteByIds (ids) {
  return request({
    url: '/work/del',
    method: 'DELETE',
    data: ids
  })
}
export function exportExcel (params) {
  return request({
    url: '/excel/export',
    params,
    paramsSerializer (params) {
      params.type = 1
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
    url: '/work/add',
    method: 'POST',
    data
  })
}
export function fetchData (params) {
  return request({
    url: '/work/view/query-data',
    params
  })
}
