import {login, checkToken} from './service/api-login'
// Promise风格的login
import {wxLogin} from './utils/promise-login'
App({
  async onLaunch() {
    // 小程序启动时获取设备宽度和高度等信息
    const info = wx.getSystemInfoSync()
    console.log('设备信息===》', info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight // 获取手机顶部状态栏高度(显示信号电量的区域)
    const token = wx.getStorageSync('token') 
    const isExpireToken = await checkToken()
    console.log(isExpireToken) 
    if(!token || isExpireToken.errorCode) { // 没有Token或者token过期，则执行登录
      this.appLogin()
    }
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    naviHeight: 44  // 自定义导航栏高度
  },
  // 登录
  async appLogin() {
    const code = await wxLogin() // 获取微信登录code
    const {token} = await login(code) // 用code换取token
    wx.setStorageSync('token', token)
  }
})
