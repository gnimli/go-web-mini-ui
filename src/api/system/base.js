import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/base/login',
    method: 'post',
    data
  })
}

export function refreshToken() {
  return request({
    url: '/api/base/refreshToken',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/base/logout',
    method: 'post'
  })
}
