// 导入第三方库的rankingStore对象
import {rankingStore, playerStore} from '../../store/index'
import { 
  getBanners,
  getSongMenu 
} from '../../service/api-music'
import queryRect from '../../utils/query-rect'
import {throttle} from '../../utils/throttle'
// throttle返回一个真正执行的节流函数, 传入要节流的方法queryRect
const queryThrottle = throttle(queryRect, 1000)

Page({
  data: {
    bannersList: [],
    swiperHeight: 0,  //swiper容器高度,动态计算适配小屏
    recommends: [],  // 推荐歌曲， 通过store层获得
    playList1: [],
    playList2: [],
    otherRanking: { // 3个榜单放在一个总对象内，方便遍历
      'newRanking': {}, 
      'originRanking': {}, 
      'highRanking': {}
    } 
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
    // 获取轮播
    getBanners().then(res => {
      console.log('轮播图====', res)
      this.setData({
        bannersList: res.banners
      })
    })
    // 获取默认全部歌单
    getSongMenu().then(res => {
      console.log('歌单===', res)
      this.setData({
        playList1: res.playlists
      })
    })
    // 获取华语歌单
    getSongMenu('华语').then(res => {
      this.setData({
        playList2: res.playlists
      })
    })
  },
  // 获取播放列表 播放页切歌时使用
  getPlayList(event) {
    // console.log('歌曲点击', event)
    playerStore.setState('playIndex', event.target.dataset.index) // 保存点击的索引
    playerStore.setState('playList', this.data.recommends) // 保存歌曲列表
  },
  onLoad: function (options) {
    this.getPageData()
    // 调用第三方状态库store的dispatch 进行网络请求
    rankingStore.dispatch('getRankingAction')
    // 当hotRanking有变化， onsState会自动执行 做到响应式
    rankingStore.onState('hotRanking', (res) => {
      if(res.tracks) {
        const recommends = res.tracks.slice(0, 6) // 获取前6条数据
        this.setData({
          recommends
        })
      }
    })

    // 获取其他3榜单
    rankingStore.dispatch('getOtherRankingAction')
    rankingStore.onState('newRanking', this.rankingHandler('newRanking'))
    rankingStore.onState('originRanking', this.rankingHandler('originRanking'))
    rankingStore.onState('highRanking', this.rankingHandler('highRanking'))
  },
  // 监听数据的处理函数，利用柯里化返回一个真正要执行的回调函数
  rankingHandler(rankingName) { // 传入要创建的榜单名
    return (res) => {
      if(res && res.tracks && res.tracks.length > 0) {
        // 整合一个新的榜单对象
        const rankObj = {
          [rankingName]: {
            name: res.name,
            songs: res.tracks.slice(0,3),
            cover: res.coverImgUrl,
            count: res.commentCount
          }
        }
        // 写法1
        // const newObj = {...this.data.otherRanking, ...rankObj} // 用浅拷贝方法添加属性，不然每次setData都会覆盖上次的数据
        // 写法2
        const newObj = Object.assign(this.data.otherRanking, rankObj)
        this.setData({
          otherRanking: newObj
        })
      }
    }
  },
  // 右侧更多点击 进入歌曲榜单详情
  rightClick (event) {
    console.log('事件对象====', event)
    const rankname = event.currentTarget.dataset.rankname
    wx.navigateTo({
      url: `/pages/songs-detail/index?rankname=${rankname}`,
    })
  },
  // 歌单点击事件
  menuItemClick(payload) {
    console.log('携带歌单id的payload===>', payload)
    const id = payload.detail.id
    wx.navigateTo({
      url: `/pages/songs-detail/index?id=${id}`,
    })
  },

  onUnload: function () {
    rankingStore.offState('newRanking', this.rankingHandler('newRanking'))
    rankingStore.offState('originRanking', this.rankingHandler('originRanking'))
    rankingStore.offState('highRanking', this.rankingHandler('highRanking'))
  }
})