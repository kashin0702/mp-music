import request from './request'

export function getBanners() {
  return request.get('/banner', {
    type: 2
  })
}
// 请求推荐歌曲 入参idx表示热门分类
export function getRanking(idx) {
  return request.get('/top/list', {
    idx
  })
}

// 获取热门歌单
export function getSongMenu(cat="全部", limit=10, offset=0) {
  return request.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}