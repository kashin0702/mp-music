// pages/home-search/index.js
import { getSearchSuggest, getSearchResult } from '../../service/api-music'
import { debounce } from '../../utils/debounce'
import { stringToNode } from '../../utils/string2node'
// 搜索栏输入时，对推荐结果的请求进行防抖处理
const searchDebounce = debounce(getSearchSuggest, 600)
Page({
  data: {
    searchValue: '',
    suggestList: [], // 原始推荐数据
    suggestNodeList: [] // node节点转化后的推荐数据, 要渲染的数据
  },
  onSearchChange(event) {
    // console.log('搜索框change===>', event)
    let value = event.detail
    this.setData({
      searchValue: value
    })
    let suggestNodeList = []
    if(value.length) {
      // 这里调用防抖后的搜索
      searchDebounce(value).then(res => {
        console.log('搜索建议===>', res)
        if(res.result.allMatch) {
          // 转化搜索结果 转成Nodes节点 给rich-text展示
          const keywords = res.result.allMatch.map(item => item.keyword)
          for(const keyword of keywords) {
            // stringToNode: 把字符串节点转化成node节点
            suggestNodeList = stringToNode(keyword, value, suggestNodeList)
          }
          this.setData({
            suggestNodeList,
            suggestList: res.result.allMatch
          })
        } else {
          this.setData({
            suggestNodeList: [],
            suggestList: []
          })
        }
      })
    } else {
      this.setData({
        suggestNodeList: [],
        suggestList: []
      })
    }
  },
  handleSearch(event) {// 这里event不拿也没事，触发change事件时searchValue已经被保存
    const value = this.data.searchValue
    getSearchResult(value).then(res => {
      console.log('输入框回车搜索结果', res)
    })
  },
  // 点击搜索推荐列表的搜索事件
  suggestSearch(event) {
    // console.log('点击搜索推荐', event)
    // 根据点击的索引，获取对应的关键词
    const searchValue = this.data.suggestList[event.currentTarget.dataset.idx].keyword
    this.setData({searchValue})
    this.handleSearch()
  },
  onLoad: function (options) {

  },
})