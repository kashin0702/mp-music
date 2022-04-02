// components/navi-bar/index.js
Component({
  properties: {
    barHeight: {
      type: String,
      value: 0
    }
  },

  data: {

  },

  methods: {
    // 因为是组件，所以把事件发出去让父组件调用
    goBack() {
      this.triggerEvent('back')
    }
  }
})
