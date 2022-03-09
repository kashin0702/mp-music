// 第三方库的rankingStore对象
import {rankingStore} from '../../store/index'
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
    swiperHeight: 0,  //swiper容器高度,动态计算适配小屏
    recommends: []
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
    // 调用第三方库store的dispatch 进行网络请求
    rankingStore.dispatch('getRankingAction')
    // 当hotRanking有修改， onsState会自动执行 做到响应式
    rankingStore.onState('hotRanking', (res) => {
      if(res.tracks) {
        const recommends = res.tracks.slice(0, 6) // 获取前6条数据
        this.setData({
          recommends
        })
      }
    })
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