import request from './request'

export function getBanners() {
  return request.get('/banner', {
    type: 2
  })
}