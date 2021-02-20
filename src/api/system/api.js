import request from '@/utils/request'

export function getApis(params) {
  return request({
    url: '/api/api/list',
    method: 'get',
    params
  })
}
