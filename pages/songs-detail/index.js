// pages/songs-detail/index.js
import { rankingStore } from '../../store/index'
import { getSongMenuDetail } from '../../service/api-music'
Page({
  data: {
    rankname: '',
    rankTitle: '',
    songList: [],
    id: '',
    isRank: false,
    isMenu: false,
    menuCover: {}
  },
  getDataHandler(res) {
    console.log('对应榜单', res)
    this.setData({
      songList: res.tracks.slice(0, 20)
    })
  },
  onLoad: function (options) {
    // 根据点击的不同，获取不同数据展示页面
    console.log('options===》', options)
    if(options.rankname) { // 1.点击的是榜单
      const rankMap = {
        'hotRanking': '热歌榜', 
        'newRanking': '新歌榜', 
        'originRanking': '原创榜', 
        'highRanking': '飙升榜'
      }
      const rankname = options.rankname
      const rankTitle = rankMap[rankname]
      this.setData({ 
        rankname, 
        rankTitle,
        isRank: true
       })
      rankingStore.onState(rankname, this.getDataHandler)
    } else if(options.id) { // 2.点击的是歌单
      const id = options.id
      this.setData({ id, isMenu: true })
      getSongMenuDetail(this.data.id).then(res => {
        console.log('歌单详情====', res)
        const cover = {
          coverImgUrl: res.playlist.coverImgUrl,
          name: res.playlist.name,
          creator: {
            avatar: res.playlist.creator.avatarUrl,
            nickname: res.playlist.creator.nickname
          },
          desc: res.playlist.description,
          favor: res.playlist.playCount
        }
        this.setData({
          songList: res.playlist.tracks,
          menuCover: cover
        })
      })
    }
    
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