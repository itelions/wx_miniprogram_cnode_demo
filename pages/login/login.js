// pages/login/login.js
const app =getApp();
const { setMyinfoFromHttp} = require('./../../service/MyService.js');

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  scan(){
    wx.scanCode({
      success:(res)=>{
        wx.showToast({
          title: '扫描成功',
        })

        this.login(res.result);
      },
      fail: (err)=>{
        wx.showToast({
          icon: 'none',
          title: '扫描失败',
        })
      }
    })
  },
  login(token){

    setMyinfoFromHttp({
      app: app,
      token: token || '',
      successFunc: (res) => {
        wx.showToast({
          icon: 'none',
          title: '登陆成功',
        });
        
        var pages = getCurrentPages();
        
        if (pages.length<=1){
          wx.switchTab({
            url: '/pages/my/my',
          })
        }else{
          wx.navigateBack();
        }
      },
      errFunc: (err) => {
        wx.showToast({
          icon: 'none',
          title: '登录失败',
        })
      }
    })
  },
  setTokenFromInput(e){
    this.login(e.detail.value);
  }
})