const BASE_URL = 'http://123.207.32.32:9001'
class Http {
  request(method, url, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method: method,
        data: params,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }
  get(url, params) {
    return this.request('GET', url, params)
  }
  post(url, params) {
    return this.request('POST', url, params)
  }
}
const request = new Http()
export default request