// pages/music-player/index.js
import { getSongInfo } from '../../service/api-player'
Page({

  data: {
    ids: ''
  },
  onLoad: function (options) {
    console.log('歌曲id===>', options)
    this.setData({ ids: options.id})
    this.getSongData(this.data.ids)
  },
  getSongData(ids) {
    getSongInfo(ids).then(res => {
      console.log('歌曲信息====', res)
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