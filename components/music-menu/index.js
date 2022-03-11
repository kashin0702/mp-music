// components/music-menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    rightText: {
      type: String,
      value: ''
    },
    playList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    menuItemClick(event) {
      console.log('子组件menu点击事件===>', event)
      const id = event.currentTarget.dataset.id
      this.triggerEvent('menuItemClick', {id}) // 传参注意要加{}
    }
  }
})
