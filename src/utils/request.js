import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 正在刷新的标记
let refreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (res.code !== 200) {
      let msg = '网络异常, 请稍后再试'
      if (res.code === 401) {
        const config = response.config
        // 记录本次请求的内容
        if (refreshing) {
          if (config.url === '/api/base/refreshToken') {
            msg = '登录超时'
            return Promise.reject(new Error(msg))
          }
          // 将当前请求记录到队列
          // 正在刷新token，将返回一个未执行resolve的promise
          return new Promise((resolve) => {
            // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
            requests.push(() => {
              resolve(service(config))
            })
          })
        } else {
          refreshing = true
          // 刷新token
          return this.$store.dispatch('user/refreshToken').then(() => {
            requests.forEach(cb => cb())
            requests = []
          }).catch(() => {
            // 刷新token失败, 必须重新登录
            MessageBox.confirm(
              '登录超时, 重新登录或继续停留在当前页？',
              '登录状态已失效',
              {
                confirmButtonText: '重新登录',
                cancelButtonText: '继续停留',
                type: 'warning'
              }
            ).then(() => {
              this.$store.dispatch('user/resetToken')
              location.reload() // To prevent bugs from vue-router
            })
          }).finally(() => {
            refreshing = false
          })
        }
      }
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // let errorMsg = error.response.data.message
    // if (!errorMsg) {
    //   errorMsg = error.message
    // }
    // Message({
    //   message: errorMsg,
    //   type: 'error',
    //   duration: 5 * 1000,
    //   showClose: true
    // })
    // return Promise.reject(errorMsg)
    return new Promise(reject => {
      reject({ code: error.response.status, message: error.response.data.message })
    })
  }
)

export default service
