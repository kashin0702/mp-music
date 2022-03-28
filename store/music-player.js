import { HYEventStore } from 'hy-event-store'
import { getSongInfo, getLyric } from '../service/api-player'
import { parseLyric } from '../utils/parseLyric'
// 创建音频对象实例并导出，全局共用该实例 因为后续要用到store的公共方法，所以放在store层
export const audioContext = wx.createInnerAudioContext()

// 音乐播放相关功能都抽到响应式数据内
const playerStore = new HYEventStore({
   state: {
    id: '',
    songInfo: {},
    pattarnLyric: [],
    duration: ''
   },
   actions: {
     // 网络请求 解构传过来的id
     getMusicPageDataAction(ctx, {id}) {
       ctx.id = id
       // 1.请求歌曲相关数据
      getSongInfo(id).then(res => {
        console.log('歌曲信息====', res)
        // this.setData({ songInfo: res.songs })
        ctx.songInfo = res.songs // 不能用setData，直接用ctx赋值
      })
      // 歌词同步显示思路： 把字符串分秒换算成秒，和歌词放在一个数组对象中
      getLyric(id).then(res => {
        // console.log('原始歌词====>', res)
        let lyricString = res.lrc.lyric
        lyricString = lyricString.split('\n') //利用字符串中的换行符对每行歌词切割成数组
        const pattarnLyric = []
        for(let lyricLine of lyricString) {
          let lyricItem = parseLyric(lyricLine)
          pattarnLyric.push(lyricItem)
        }
        // console.log('转化后歌词数组====', pattarnLyric)
        // this.setData({ pattarnLyric }) // 不能用setData
        ctx.pattarnLyric = pattarnLyric // 直接用ctx赋值
      })

      // 2.播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      audioContext.onCanplay(() => { 
        audioContext.play() // 播放
        console.log('canPlay回调')
        audioContext.duration  // !!必须语句, 初始化时长!!
        setTimeout(() => { // 这里用异步设置，不然拿不到duration 
          // this.setData({
          //   duration: audioContext.duration // 未播放时不能获取到duration
          // })
          ctx.duration = audioContext.duration
        },0)
      })
     }
   }
})

export {playerStore}