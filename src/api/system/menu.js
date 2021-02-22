import request from '@/utils/request'

// 获取菜单树
export function getMenuTree() {
  return request({
    url: '/api/menu/tree',
    method: 'get'
  })
}

// 获取菜单列表
export function getMenus() {
  return request({
    url: '/api/menu/list',
    method: 'get'
  })
}

// 创建菜单
export function createMenu(data) {
  return request({
    url: '/api/menu/create',
    method: 'post',
    data
  })
}

// 更新菜单
export function updateMenuById(Id, data) {
  return request({
    url: '/api/menu/update/' + Id,
    method: 'patch',
    data
  })
}

// 批量删除菜单
export function batchDeleteMenuByIds(data) {
  return request({
    url: '/api/menu/delete/batch',
    method: 'delete',
    data
  })
}

// 获取用户的可访问菜单列表
export function getUserMenusByUserId(Id) {
  return request({
    url: '/api/menu/access/list/' + Id,
    method: 'get'
  })
}

// 获取用户的可访问菜单树
export function getUserMenuTreeByUserId(Id) {
  return request({
    url: '/api/menu/access/tree/' + Id,
    method: 'get'
  })
}
