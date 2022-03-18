// components/area-header/index.js
Component({
  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
    rightText: {
      type: String,
      value: ''
    },
    // 右侧文字是否显示
    showRight: {
      type: Boolean,
      value: true
    }
  },
  data: {

  },
  methods: {
    rightClick() {
      this.triggerEvent('rightClick')
    }
  }
})
