import request from './request'

// 获取歌曲详情 ids支持传多个id,用逗号分隔
export function getSongInfo(ids) {
  return request.get('/song/detail', {
    ids
  })
}