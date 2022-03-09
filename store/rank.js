import { HYEventStore } from 'hy-event-store'
import { getRanking } from '../service/musicData'

const rankingStore = new HYEventStore({
  // 公共数据
  state: {
    hotRanking: {}
  },
  // 请求相关
  actions: {
    // actions方法有1个ctx参数,可以用来获取state对象
    getRankingAction(ctx) {
      getRanking(1).then(res => {
        console.log('ranking===>', res)
        ctx.hotRanking = res.playlist // 保存共享数据hotRanking
      })
    }
  }
})

export { rankingStore } 