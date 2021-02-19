import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}
