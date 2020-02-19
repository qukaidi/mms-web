import request from '@/plugin/axios'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    params: data
  })
}

export function fetchInfo (data) {
  return request({
    url: 'main/get/user/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    params: data
  })
}
