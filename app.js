// app.js
App({
  onLaunch() {
    // 小程序启动时获取设备宽度和高度
    const info = wx.getSystemInfoSync()
    console.log('设备信息===》', info)
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
  },
  globalData: {
    screenWidth: 0,
    screenHeight: 0
  }
})
