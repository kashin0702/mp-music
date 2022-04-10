const BASE_URL = 'http://123.207.32.32:9001'  // 其他接口服务
const LOGIN_URL = 'http://123.207.32.32:3000' // 登录服务
class Http {
  constructor(BASE_URL, authHeader = {}){ // BASE_URL 由创建class时决定
    this.BASE_URL = BASE_URL
    this.authHeader = authHeader
  }
  /**
   * @param {*} isAuth 是否需要登录后权限
   */
  request(method, url, params, isAuth = false, header = {}) {
    // isAuth 判断接口是否需要登录，需要就添加authHeader且合并header
    const finalHeader = isAuth ? {...this.authHeader, ...header} : header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.BASE_URL + url,
        method: method,
        data: params,
        header: finalHeader,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
  get(url, params, isAuth = false, header) {
    return this.request('GET', url, params, isAuth, header)
  }
  post(url, params, isAuth = false, header) {
    return this.request('POST', url, params, isAuth, header)
  }
}
const request = new Http(BASE_URL)
const loginRequest = new Http(LOGIN_URL, {
  token: wx.getStorageSync('token') // 创建类时，把token传入header
}) // 登录的class请求类

export default request
export {loginRequest}