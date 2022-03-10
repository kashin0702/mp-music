// pages/music/music.js
import {getTopMV} from '../../service/api-video'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMV: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopData(0)
  },

  // 二次封装请求
  async getTopData(offset) {
    // 判断是否可以请求
    if(!this.data.hasMore) return
    // 展示顶部加载动画
    wx.showNavigationBarLoading()
    const res = await getTopMV(offset)
    this.setData({
      topMV: offset === 0 ? res.data : this.data.topMV.concat(res.data),
      hasMore: res.hasMore
    })
    // 关闭动画
    wx.hideNavigationBarLoading()
    if(offset === 0){ // 0说明是下拉刷新动作 主动停止下拉产生的3个点动画
      wx.stopPullDownRefresh()
    }
  },
  goDetail(event) {
    console.log('点击对象====', event)
    const id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/video-detail/index?id=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTopData(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTopData(this.data.topMV.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})