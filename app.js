// app.js
App({
  onLaunch() {
    // 小程序启动时获取设备宽度和高度等信息
    const info = wx.getSystemInfoSync()
    console.log('设备信息===》', info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight // 获取手机顶部状态栏高度(显示信号电量的区域)
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    naviHeight: 44  // 自定义导航栏高度
  }
})
