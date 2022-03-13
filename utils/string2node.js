// 字符串转化为node节点，富文本组件使用的方法 入参：1.推荐结果， 2.查询关键字, 3.要添加到的数组
export function stringToNode(keyword, value, suggestNodeList) {
  // 都转成大写， 让大小写同时匹配
  if(keyword.toUpperCase().startsWith(value.toUpperCase())) {
    // 切割节点
    let key1 = keyword.slice(0, value.length)  
    let key2 = keyword.slice(value.length) // 除掉搜索词的部分 普通样式
    let node1 = { // 匹配词：高亮节点
      name: 'span',
      attrs: {style: 'color: red'},
      children: [{
        type: 'text',
        text: key1
      }]
    }
    let node2 = { // 非匹配词：普通节点
      name: 'span',
      attrs: {style: 'color: #000000'},
      children: [{
        type: 'text',
        text: key2
      }]
    } 
    const nodes = [node1, node2]
    suggestNodeList.push(nodes) // 把nodes整个节点作为一个数组项传入要循环渲染的数组内
  } else { // 未匹配到搜索词
    let node3 = {
      name: 'span',
      attrs: {style: 'color: #000000'},
      children: [{
        type: 'text',
        text: keyword
      }]
    }
    const nodes = [node3] // 注意： 一定要把节点放到数组中
    suggestNodeList.push(nodes)
  }
  return suggestNodeList
}