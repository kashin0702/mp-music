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

// 获取歌单详情
export function getSongMenuDetail(id) {
  return request.get('/playlist/detail/dynamic', {
    id
  })
}

// 搜索建议
export function getSearchSuggest(keywords, type = 'mobile') {
  return request.get('/search/suggest', {
    keywords,
    type
  })
}

// 搜索
export function getSearchResult(keywords, limit=30, offset=0) {
  return request.get('/search', {
    keywords,
    limit,
    offset
  })
}