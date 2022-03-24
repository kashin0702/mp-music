// 创建音频对象实例并导出，全局共用该实例 因为后续要用到store的公共方法，所以放在store层
export const audioContext = wx.createInnerAudioContext()