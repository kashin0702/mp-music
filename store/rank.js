import { HYEventStore } from 'hy-event-store'
import { getRanking } from '../service/api-music'
// 创建一个映射对象 用来获取对应的榜单  0:新歌榜 2:原创榜 3:飙升榜
const rankingMap = {0: 'newRanking', 2: 'originRanking', 3: 'highRanking'}
const rankingStore = new HYEventStore({
  // 公共数据
  state: {
    hotRanking: {}, // 推荐歌曲
    newRanking: {},
    originRanking: {},
    highRanking: {}
  },
  // 请求相关
  actions: {
    // 获取推荐歌曲  actions方法有1个ctx参数,可以用来获取state对象
    getRankingAction(ctx) {
      getRanking(1).then(res => {
        console.log('ranking===>', res)
        ctx.hotRanking = res.playlist // 保存共享数据hotRanking
      })
    },
    // 获取其他3个榜单 同一个接口
    getOtherRankingAction(ctx) {
      for(let i = 0; i < 4; i++) {
        getRanking(i).then(res => {
          // console.log('榜单', i, res) // then是异步的，不能保证哪个res对应的i先返回
          let rankingName = rankingMap[i] // 获取i对应的ranking
          ctx[rankingName] = res.playlist
        })
      }
    }
  }
})

export { rankingStore } 