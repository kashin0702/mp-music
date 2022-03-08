import {getBanners} from '../../service/musicData'
import queryRect from '../../utils/query-rect'
import {throttle} from '../../utils/throttle'
// throttle返回一个真正执行的节流函数, 传入要节流的方法queryRect
const queryThrottle = throttle(queryRect, 1000)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannersList: [],
    swiperHeight: 0  //swiper容器高度,动态计算适配小屏
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/home-search/index',
    })
  },
  // 图片加载完成的回调函数
  imageLoaded() {
    // imageLoaded回调方法，会计算所有的banners图片，通过节流函数优化只在单位时间内计算一张图片
    // 1.调用新节流函数，2.queryRect返回一个promise, 通过then回调获取高度
    queryThrottle('.swiper-image').then(res => {
      console.log('图片属性===》', res) // 只执行了1次
      this.setData({
        swiperHeight: res[0].height
      })
    })
  },
  // 获取页面数据
  getPageData() {
    getBanners().then(res => {
      console.log('轮播图====', res)
      this.setData({
        bannersList: res.banners
      })
    })
  },

  onLoad: function (options) {
    this.getPageData()
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})