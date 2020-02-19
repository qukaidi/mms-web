import request from '@/plugin/axios'

export function fetchList(params) {
    return request({
        url: '/config/user/list',
        params
    })
}
export function deleteUserIds(ids) {
    return request({
        url: '/config/user/del',
        method: 'DELETE',
        data: ids
    })
}
export function addUser(data) {
    return request({
        url: '/config/user/add',
        method: 'POST',
        data
    })
}