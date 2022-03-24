// pages/music-player/index.js
import { getSongInfo, getLyric } from '../../service/api-player'
// 导入音频对象实例
import { audioContext } from '../../store/audio-player'
const globalData = getApp().globalData
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
    isPause: false
  },
  onLoad: function (options) {
    console.log('歌曲id===>', options)
    this.setData({ 
      ids: options.id
    })
    this.getSongData(this.data.ids)
    
    // 设置播放源
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.ids}.mp3`
    audioContext.onCanplay(() => { // 监听当音频可以播放时的回调，每次改变进度都会回调
      audioContext.play() // 播放
      console.log('canPlay回调')
      audioContext.duration  // !!必须语句, 初始化时长!!
      setTimeout(() => { // 这里用异步设置，不然拿不到duration 
        this.setData({
          duration: audioContext.duration // 未播放时不能获取到duration
        })
      },0)
      
    })
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
              currentIndex: currentIndex // 当前歌词索引
            })
          }
          break // 一匹配到就立即跳出循环，否则会一直匹配，因为后面的循环都满足条件
        }
      }
    })
    
  },
  // 滑动条改变事件
  sliderChange(event) {
    console.log('滑动条释放====>', event)
    let positionTime = this.data.duration * (event.detail.value / 100)
    audioContext.pause() // 防止进度按钮跳动
    audioContext.seek(positionTime) 
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
  getSongData(ids) {
    getSongInfo(ids).then(res => {
      console.log('歌曲信息====', res)
      this.setData({ songInfo: res.songs })
    })
    // 歌词同步显示思路： 把字符串分秒换算成秒，和歌词放在一个数组对象中
    getLyric(ids).then(res => {
      // console.log('原始歌词====>', res)
      let lyricString = res.lrc.lyric
      lyricString = lyricString.split('\n') //利用字符串中的换行符对每行歌词切割成数组
      // this.setData({lyricString})
      const pattarnLyric = []
      for(let lyricLine of lyricString) {
        let lyricItem = this.parseLyric(lyricLine)
        pattarnLyric.push(lyricItem)
      }
      console.log('转化后歌词数组====', pattarnLyric)
      this.setData({ pattarnLyric })
    })
  },
  // 歌词转化
  parseLyric(lyric) {
    // [00:01.152] 正则匹配这种类型的字符串
    let reg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    let result = reg.exec(lyric)
    // console.log('正则匹配结果', result)
    if (result) { // 利用result返回的正则匹配数组，计算时间
      let min = result[1] * 60
      let sec = result[2] * 1
      let miliSec = result[3].length === 2 ? (result[3] + '0') / 1000 : result[3] / 1000
      let time = min + sec + miliSec
      // console.log('时间点', time)
      let text = lyric.replace(reg, '')  // 提取歌词部分
      let lyricItem = { time, text } // 把转化后的时间和歌词放在一个对象中返回
      return lyricItem
    }
    
  },
  onUnload: function () {

  }
})