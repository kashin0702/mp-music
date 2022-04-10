import {loginRequest} from './request'

export function login(code) {
  return loginRequest.post('/login', {code})
}
// 检查token是否过期
export function checkToken() {
  return loginRequest.post('/auth', {}, true, {access: '32133'}) // 测试 增加的header内容
}