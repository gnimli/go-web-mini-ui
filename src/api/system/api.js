import request from '@/utils/request'

export function getApis(params) {
  return request({
    url: '/api/api/list',
    method: 'get',
    params
  })
}

export function getApiTree(params) {
  return request({
    url: '/api/api/tree',
    method: 'get',
    params
  })
}

export function createApi(data) {
  return request({
    url: '/api/api/create',
    method: 'post',
    data
  })
}

export function updateApiById(Id, data) {
  return request({
    url: '/api/api/update/' + Id,
    method: 'patch',
    data
  })
}

export function batchDeleteApiByIds(data) {
  return request({
    url: '/api/api/delete/batch',
    method: 'delete',
    data
  })
}
