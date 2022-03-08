export default function (selector) {
  // 返回promise对象，供外部回调
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    // 获取要查询矩形元素的样式信息
    query.select(selector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
    // 增强写法 少执行一个函数，提高性能
    // query.exec(resolve) 
  })
}