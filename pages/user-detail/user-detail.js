// pages/user-detail/user-detail.js
const { formatTime } = require('./../../utils/util.js');
const { userDetailApi } = require('./../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    avatar_url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thePage = getCurrentPages();
    thePage = thePage[thePage.length - 1];
    this.setData({
      username: thePage.options.username
    });
    this.getUserDetail();
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
  //获取用户详情数据
  getUserDetail() {
    // var {data} = mokeUser;
    wx.request({
      url: userDetailApi(this.data.username),
      success: res => {
        if (!res.data.success) {
          wx.showToast({
            icon: 'none',
            title: '用户详情获取失败',
          })
          return
        }

        var { data } = res.data;
        data.recent_replies.map(item => {
          item.last_reply_at = formatTime(new Date(item.last_reply_at));
        });

        data.recent_topics.map(item => {
          item.last_reply_at = formatTime(new Date(item.last_reply_at));
        });

        this.setData({
          avatar_url: data.avatar_url,
          username: data.loginname,
          recent_replies: data.recent_replies || [],
          recent_topics: data.recent_topics || [],
          create_at: formatTime(new Date(data.create_at))
        });
      },
      fail: err => {
      }
    })

  },
  //跳转话题详情页面
  toTopicDetail(e){
    var topic_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?topicid=${topic_id}`,
    })
  }
})