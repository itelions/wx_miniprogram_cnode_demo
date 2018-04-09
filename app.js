//app.js
const { setMyInfoFromStorage} = require('./service/MyService.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    setMyInfoFromStorage({ app:this});
  },
  globalData: {
    userInfo: null,
    my:{
      accessToken:'',
      userInfo:null,
    }
  }
})