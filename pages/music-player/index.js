// pages/music-player/index.js
import { getSongInfo } from '../../service/api-player'
const globalData = getApp().globalData
Page({
  data: {
    ids: '',
    barHeight: globalData.statusBarHeight,
    songInfo: {},
    contentHeight: globalData.screenHeight - globalData.statusBarHeight - globalData.naviHeight // 显示区域高度
  },
  onLoad: function (options) {
    console.log('歌曲id===>', options)
    this.setData({ 
      ids: options.id
    })
    this.getSongData(this.data.ids)
  },
  getSongData(ids) {
    getSongInfo(ids).then(res => {
      console.log('歌曲信息====', res)
      this.setData({ songInfo: res.songs })
    })
  },
  onReady: function () {

  },

  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})