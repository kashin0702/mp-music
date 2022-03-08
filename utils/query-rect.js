export default function (selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    // 获取要查询矩形元素的样式信息
    query.select(slector).boundingClientRect()
    query.exec((res) => {
      resolve(res)
    })
    // 增强写法
    // query.exec(resolve)
  })
}