import request from './request'

export function getTopMV(offset, limit = 10){
  return request.get('/top/mv', {
    offset,
    limit
  })
}

/** 
 * 获取mv详情
 * @param {number} mvid
 * */  
export function getMVDetail(mvid) {
  return request.get('/mv/detail', {
    mvid
  })
}

/**
 * 获取播放地址 网易防盗链 需要地址才能播放
 * @param {*} id 也是mvid
 * @param {*} r  可选参数分辨率 默认1080 可从/mv/detail接口获取 
 */
export function getMVURL(id) {
  return request.get('/mv/url', {
    id
  })
}

/**
 * 相关视频
 * @param {*} id 视频id
 */
export function getAllVideo(id) {
  return request.get('/related/allvideo', {
    id
  })
}