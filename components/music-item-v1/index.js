// components/music-item-v1/index.js
import {playerStore} from '../../store/music-player'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    itemClick(event) {
      console.log('点击的Item===>', event)
      const id = event.currentTarget.dataset.item.id
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      })
      // 跳转时进行网络请求
      playerStore.dispatch('getMusicPageDataAction', {id})
    }
  }
})
