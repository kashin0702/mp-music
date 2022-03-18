// app.js
App({
  onLaunch() {
    // 小程序启动时获取设备宽度和高度等信息
    const info = wx.getSystemInfoSync()
    console.log('设备信息===》', info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight // 手机顶部状态栏高度
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0
  }
})
