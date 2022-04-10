// 把微信官方login封装成Promise风格的login
export function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success(res){
        if(res.code)
        resolve(res.code)
      },
      fail(err){
        console.log('登录失败',err)
        reject(err)
      }
    })
  })
}