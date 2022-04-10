import { HYEventStore } from 'hy-event-store'
import { getSongInfo, getLyric } from '../service/api-player'
import { parseLyric } from '../utils/parseLyric'
// 创建音频对象实例并导出，全局共用该实例 因为后续要用到store的公共方法，所以放在store层
// export const audioContext = wx.createInnerAudioContext() // 不用内置音频对象
export const audioContext = wx.getBackgroundAudioManager() // 使用全局的背景音频管理器，小程序退到后台时也能播放，方法和上面的几乎一样
// 音乐播放相关功能都抽到响应式数据内
const playerStore = new HYEventStore({
   state: {
    id: '',
    songInfo: [],
    pattarnLyric: [],
    duration: 0,
    playModeIndex: 0, // 播放模式按钮索引
    playStatus: 'pause', // 暂停|播放
    isPause: false,
    currentTime: 0, // 当前播放时间
    currentIndex: 0, // 当前播放时间对应索引
    currentLyric: '', // 当前要显示的歌词
    playList: [], // 播放歌曲列表
    playIndex: null, // 当前歌曲索引
    isFirstPlay: true // 是否第一次播放
   },
   actions: {
     getMusicPageDataAction(ctx, {id, isRefresh = false}) {
       // =========================== 网络请求 =====================================
       // 是同一首歌且不强制重播，不做任何操作返回
       if(ctx.id === id && !isRefresh) return
       ctx.id = id
       ctx.isPause = false
       ctx.playStatus = 'pause'
       // 1.请求歌曲相关数据
      getSongInfo(id).then(res => {
        console.log('歌曲信息====', res)
        ctx.songInfo = res.songs
        // ctx.duration = res.songs[0].dt
        audioContext.title = res.songs[0].name // newAdd:获取Title 使用getBackgroundAudioManager必填
      })
      // 歌词同步显示思路： 把字符串分秒换算成秒，和歌词放在一个数组对象中
      getLyric(id).then(res => {
        console.log('原始歌词====>', res)
        let lyricString = res.lrc.lyric
        lyricString = lyricString.split('\n') //利用字符串中的换行符对每行歌词切割成数组
        const pattarnLyric = []
        for(let lyricLine of lyricString) {
          let lyricItem = parseLyric(lyricLine)
          if(lyricItem) pattarnLyric.push(lyricItem)
        }
        // console.log('转化后歌词数组====', pattarnLyric)
        ctx.pattarnLyric = pattarnLyric // 直接用ctx赋值
      })

      // 2.播放歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id // newAdd:没获取到name前先获取id 否则无法播放
      audioContext.autoplay = true
      // 3. audio监听 只有首次播放时才调监听方法，否则每次调用都会增加一个回调事件
      if(ctx.isFirstPlay) {
        this.dispatch('audioContextListenerAction')
        ctx.isFirstPlay = false
      }
     },

     // =================================== audio监听 =====================================
     audioContextListenerAction(ctx) {
        audioContext.onCanplay(() => {
          audioContext.play() // 播放
          console.log('canPlay回调')
          audioContext.duration  // !!必须语句, 初始化时长!!
          setTimeout(() => { // 这里用异步设置，不然拿不到duration 
            ctx.duration = audioContext.duration
          },0)
        })
       audioContext.onTimeUpdate(() => {
         // store层没有拖动事件
        // if (!this.data.isSlider) { 
        //   this.setData({
        //     currentTime: audioContext.currentTime,
        //     sliderValue: audioContext.currentTime/audioContext.duration * 100 // 页面层数据1,在页面处理
        //   })
        // }
        ctx.currentTime = audioContext.currentTime

        for(let i = 0; i < ctx.pattarnLyric.length; i++) {
          // 显示歌词思路: 遍历歌词，当歌词时间大于当前时间时，显示数组前一条歌词
          if(ctx.pattarnLyric[i].time > audioContext.currentTime) {
            const currentIndex = i - 1 // 要显示的是前一条歌词
            if(ctx.currentIndex !== currentIndex) { // 当索引不同时再setData, 否则setData太频繁
              // this.setData({
              //   currentLyric: this.data.pattarnLyric[currentIndex].text, // 歌词
              //   currentIndex: currentIndex, // 当前歌词索引
              //   scrollLineDistance: this.data.baseHeight * currentIndex // 每次自动滚动的高度 页面层数据2，在页面处理
              // })
              ctx.currentLyric = ctx.pattarnLyric[currentIndex].text
              ctx.currentIndex = currentIndex
            }
            break // 一匹配到就立即跳出循环，否则会一直匹配，因为后面的循环都满足条件
          }
        }
      })
      audioContext.onEnded(() => {
        this.dispatch('changeSongs', 'next')
      })
     },
     // 播放按钮监听公共事件 是否暂停用参数形式传入，提升扩展性
     changePlayStatus(ctx, isPause = true) {
      ctx.isPause = isPause
      isPause ? ctx.playStatus = 'resume' : ctx.playStatus = 'pause'
      isPause ? audioContext.pause() : audioContext.play()
     },
     // 上一首、下一首
     changeSongs(ctx, btnType) {
        let index,
            id
        switch(ctx.playModeIndex) {
          case 0:// 顺序播放
            index = ctx.playIndex
            if(btnType === 'next') {
              index++
              if(index > ctx.playList.length - 1) index = 0
            } else if(btnType === 'prev') {
              index--
              if(index < 0) index = ctx.playList.length - 1
            }
            ctx.playIndex = index // 保存index 用于连续切歌
            id = ctx.playList[index].id // 获取下一个要播放的歌曲Id
            break;
          case 1: // 随机播放
            index = ctx.playIndex
            let randomIndex = Math.floor(Math.random() * ctx.playList.length)
            if(index === randomIndex) {// 随机后是同一个,继续随机
              randomIndex = Math.floor(Math.random() * ctx.playList.length)
            }else {
              id = ctx.playList[randomIndex].id
              break;
            }
          case 2: // 单曲循环
            id = ctx.playList[ctx.playIndex].id
            break;
        }
        this.dispatch('getMusicPageDataAction', {id, isRefresh: true}) // 传入下一首的id，重新调歌曲播放方法
     }
   }
})

export {playerStore}