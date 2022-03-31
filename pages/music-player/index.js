// 导入共享对象playerStore
import { playerStore } from '../../store/music-player'
// import { getSongInfo, getLyric } from '../../service/api-player' 
// 导入音频对象实例
import { audioContext } from '../../store/music-player'
const globalData = getApp().globalData
const playMode = ['order', 'random', 'repeat'] // 全局播放模式名称
let playModeIndex = 0 // 全局playMode索引
Page({
  data: {
    ids: '',
    barHeight: globalData.statusBarHeight,
    songInfo: {},
    contentHeight: globalData.screenHeight - globalData.statusBarHeight - globalData.naviHeight, // 显示区域高度
    sliderValue: 0,  // 滑动条值
    currentTime: 0, // 当前播放位置
    duration: 0, // 歌曲时长
    isSlider: false,  // 是否正在拖动 防止拖动时进度还在走出现冲突Bug
    pattarnLyric: [], // 格式化后歌词数组
    currentLyric: '',  // 当前要显示的歌词
    currentIndex: 0,  // 当前显示歌词对应的索引
    isPause: false,
    baseHeight: 41,
    scrollLineDistance: '', // 歌词每次滚动的距离
    playModeName: 'order', // 播放模式名称
  },
  onLoad: function (options) {
    console.log('歌曲id===>', options)
    this.setData({ 
      ids: options.id
    })
    // 网络请求放到跳转时，调用store请求
    // this.getSongData(this.data.ids)

    // 这里只调用store进行数据监听，当store有数据时，对页面数据赋值
    this.handlePlayerStore()
    
    // 设置播放源 抽取到store内
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.ids}.mp3`
    // audioContext.autoplay = true
   
    // 监听当音频可以播放时的回调，每次改变进度都会回调
    // audioContext.onCanplay(() => { 
    //   audioContext.play() // 播放
    //   console.log('canPlay回调')
    //   audioContext.duration  // !!必须语句, 初始化时长!!
    //   setTimeout(() => { // 这里用异步设置，不然拿不到duration 
    //     this.setData({
    //       duration: audioContext.duration // 未播放时不能获取到duration
    //     })
    //   },0)
    // })
    audioContext.onTimeUpdate(() => {
      // console.log('进度更新回调', audioContext)
      if (!this.data.isSlider) { // 没有拖动时再设置数据，防止进度条冲突
        this.setData({
          currentTime: audioContext.currentTime,
          sliderValue: audioContext.currentTime/audioContext.duration * 100
        })
      }
      for(let i = 0; i < this.data.pattarnLyric.length; i++) {
        // 显示歌词思路: 遍历歌词，当歌词时间大于当前时间时，显示数组前一条歌词
        if(this.data.pattarnLyric[i].time > audioContext.currentTime) {
          const currentIndex = i - 1 // 要显示的是前一条歌词
          if(this.data.currentIndex !== currentIndex) { // 当索引不同时再setData, 否则setData太频繁
            // console.log(this.data.pattarnLyric[currentIndex].text)
            this.setData({
              currentLyric: this.data.pattarnLyric[currentIndex].text, // 歌词
              currentIndex: currentIndex, // 当前歌词索引
              scrollLineDistance: this.data.baseHeight * currentIndex // 每次自动滚动的高度
            })
          }
          break // 一匹配到就立即跳出循环，否则会一直匹配，因为后面的循环都满足条件
        }
      }
    })
  },
  goback() {
    wx.navigateBack()
  },
  handlePlayerStore() {
    // 监听属性可传多个属性， 当监听到数据发生改变时(如网络请求)，调setData进行页面赋值
    playerStore.onStates(['songInfo', 'pattarnLyric', 'duration'], res => {
      console.log('监听属性:', res) // 返回的是一个包含多个监听属性的对象
      if(res.songInfo) this.setData({songInfo: res.songInfo})
      if(res.pattarnLyric) this.setData({pattarnLyric: res.pattarnLyric})
      if(res.duration) this.setData({duration: res.duration})
    })

    // 监听切换按钮索引值
    playerStore.onState('playModeIndex', (playModeIndex) => {
      console.log('监听playmode', playModeIndex)
      this.setData({
        playModeName: playMode[playModeIndex]
      })
    })
  },
  // 滑动条改变事件
  sliderChange(event) {
    console.log('滑动条释放====>', event)
    let positionTime = this.data.duration * (event.detail.value / 100)
    audioContext.pause() // 防止进度按钮跳动
    audioContext.seek(positionTime) // 跳转到指定位置
    this.setData({
      currentTime: positionTime,
      sliderValue: event.detail.value,
      isSlider: false, // 滑动条释放后要把这个设置回false
    })
  },
  // 滑动条拖动事件
  sliderChanging(event) {
    let positionTime = this.data.duration * (event.detail.value / 100)
    this.setData({
      isSlider: true,
      currentTime: positionTime
    })
  },
  // 暂停 播放
  musicPause() {
    this.setData({
      isPause: !this.data.isPause
    })
    if(this.data.isPause) {
      audioContext.pause()
    } else {
      audioContext.play()
    }
  },
  // 播放模式切换
  playModeClick() {
    playModeIndex++
    if(playModeIndex > 2) playModeIndex = 0 // 自增到3时，循环切换
    playerStore.setState('playModeIndex', playModeIndex) //保存到共享数据 playModeIndex
  },
  // 网络请求
  // getSongData(ids) {
  //   getSongInfo(ids).then(res => {
  //     console.log('歌曲信息====', res)
  //     this.setData({ songInfo: res.songs })
  //   })
  //   // 歌词同步显示思路： 把字符串分秒换算成秒，和歌词放在一个数组对象中
  //   getLyric(ids).then(res => {
  //     // console.log('原始歌词====>', res)
  //     let lyricString = res.lrc.lyric
  //     lyricString = lyricString.split('\n') //利用字符串中的换行符对每行歌词切割成数组
  //     // this.setData({lyricString})
  //     const pattarnLyric = []
  //     for(let lyricLine of lyricString) {
  //       let lyricItem = this.parseLyric(lyricLine)
  //       pattarnLyric.push(lyricItem)
  //     }
  //     console.log('转化后歌词数组====', pattarnLyric)
  //     this.setData({ pattarnLyric })
  //   })
  // },
  // 歌词转化
  // parseLyric(lyric) {
  //   // [00:01.152] 正则匹配这种类型的字符串
  //   let reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  //   let result = reg.exec(lyric)
  //   // console.log('正则匹配结果', result)
  //   if (result) { // 利用result返回的正则匹配数组，计算时间
  //     let min = result[1] * 60
  //     let sec = result[2] * 1
  //     let miliSec = result[3].length === 2 ? (result[3] + '0') / 1000 : result[3] / 1000
  //     let time = min + sec + miliSec
  //     // console.log('时间点', time)
  //     let text = lyric.replace(reg, '')  // 提取歌词部分
  //     let lyricItem = { time, text } // 把转化后的时间和歌词放在一个对象中返回
  //     return lyricItem
  //   }
  // },
  onUnload: function () {
    audioContext.offCanplay(() => {})
  }
})