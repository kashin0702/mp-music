// pages/songs-detail/index.js
import { rankingStore } from '../../store/index'
Page({
  data: {
    rankname: ''
  },
  getDataHandler(res) {
    console.log('对应榜单', res)
  },
  onLoad: function (options) {
    console.log('options===》', options)
    // const rankname = options.rankname
    // this.setData({ rankname })
    // rankingStore.onState(rankname, this.getDataHandler)
  },

  onUnload: function () {
    // 页面卸载后，解除监听
    if(this.data.rankname) {
      rankingStore.offState(this.data.rankname, this.getDataHandler)
    }
    
  },

  onReachBottom: function () {

  },

})