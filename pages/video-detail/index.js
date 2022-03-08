// pages/video-detail/index.js
import {getMVDetail, getMVURL, getAllVideo} from '../../service/videoData'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MVInfo: {},
    MVURL: '',
    relatedVideoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('id值', options)
    const id = options.id
    this.getAllData(id)
  },

  // 这个方法不使用await, 因为有3个请求，await会阻塞后面的请求
  getAllData(id) {
    getMVDetail(id).then(res => { 
      //箭头函数不绑定this 
      this.setData({
        MVInfo: res.data
      })
    })
    getMVURL(id).then(res => {
      this.setData({
        MVURL: res.data.url
      })
    })
    getAllVideo(id).then(res => {
      this.setData({
        relatedVideoList: res.data
      })
    })
  }

})