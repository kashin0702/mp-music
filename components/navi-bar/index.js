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
    goBack() {
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
