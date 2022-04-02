  // 歌词转化
  export function parseLyric(lyric) {
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
  }