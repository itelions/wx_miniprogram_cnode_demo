// pages/detail/detail.js
const { formatTime } = require('./../../utils/util.js');
const { topicDetailApi, topicReplyApi, replyUpsApi, topicCollectionApi, deleteTopicCollectionApi } = require('./../../utils/api.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic_id: '',
    content: '',
    title: '',
    is_collect: false,
    auth: '',
    create_at: '',
    last_reply_at: '',
    replies: [],
    reply_count: 0,
    scrollTop: 0,
    token: '',
    myReply: '',
    platform: app.globalData.platform,
    showTypeArea: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   topic_id:getCurrentPages()[0].options.topicid,
    // });
    this.setData({ token: app.globalData.my.accessToken || '' });
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // var theRouters = getCurrentPages()
    // var theRouter = theRouters[theRouters.length - 1];
    // console.log(theRouter.options)
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
  loadData() {
    var _this = this;
    wx.showLoading({
      title: '拼命加载中'
    });
    var thePage = getCurrentPages();
    thePage = thePage[thePage.length - 1]
    var topicid = thePage.options.topicid || '';
    this.setData({ topic_id: topicid })
    wx.request({
      url: topicDetailApi(topicid),
      data: {
        accesstoken: app.globalData.my.accessToken || ''
      },
      success(res) {
        _this.dealWithResData(res.data)
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          icon: 'none',
          title: '话题加载失败',
        })
      },
      complete() {
        wx.hideLoading();
      }
    })
  },
  // 渲染话题数据
  dealWithResData(resData) {
    // console.log(resData)
    var _this = this;
    // console.log(mokeData.data)
    var finalData = resData.data;
    var replies = finalData.replies.map(item => {
      item.content = _this.dealWithContent(item.content);
      item.create_at = _this.dealWithDate(item.create_at)
      return item;
    })
    // console.log(replies)
    _this.setData({
      content: _this.dealWithContent(finalData.content) || '未知内容',
      title: finalData.title || '未知标题',
      auth: finalData.author,
      create_at: _this.dealWithDate(finalData.create_at),
      last_reply_at: _this.dealWithDate(finalData.last_reply_at),
      visit_count: finalData.visit_count,
      is_collect: finalData.is_collect,
      replies: replies || [],
      reply_count: finalData.reply_count || 0
    })
  },
  // 处理时间格式
  dealWithDate(cnodeDate) {
    var newDate = new Date(cnodeDate);
    return formatTime(newDate);
  },
  // 处理文本内容
  dealWithContent: function (content) {
    return content.replace(/<img/g, '<img class="mark"');
  },
  // 回到顶部
  toTop() {
    this.setData({
      scrollTop: 0
    })
  },
  // 监听input事件
  handleReplyAreaInput(e) {
    this.setData({ myReply: e.detail.value })
  },
  // 点击回复按钮
  handleReplyBtnTap() {
    var errText = null;
    var replyText = this.data.myReply;
    if (!app.globalData.my.accessToken) errText = '请先登录';
    if (replyText.replace(/\s/g, '').length == 0) errText = '回复不能为空';
    if (errText) {
      wx.showToast({
        icon: 'none',
        title: errText,
      })
      return
    }

    wx.showModal({
      title: '评论提交后无法删除,是否继续',
      success: result => {
        if (!result.cancel) this.replySubmit(replyText);
      }
    })
  },
  //
  handleReplyAreaFocus() {
    if (this.data.platform !== 'android') return
    this.setData({ showTypeArea: true });
    setTimeout(_ => {
      wx.pageScrollTo({
        scrollTop: 1000000,
        duration: 0
      })
    }, 100)
  },
  handleReplyAreaBlur() {
    if (this.data.platform !== 'android') return
    this.setData({ showTypeArea: false });
  },
  // 提交回复
  replySubmit(text) {
    wx.showLoading({
      title: '回复提交中',
    })
    wx.request({
      url: topicReplyApi(this.data.topic_id),
      method: 'POST',
      data: {
        accesstoken: app.globalData.my.accessToken,
        content: text
      },
      success: res => {
        console.log(res);
        this.setData({
          myReply: ''
        });
        this.loadData();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '回复提交失败',
        })
      },
      complete: _ => {
        wx.hideLoading();
      }
    })

  },
  // 点赞与取消点赞
  toogleUp(e) {
    var reply_id = e.currentTarget.dataset.id;
    var token = app.globalData.my.accessToken;

    if (!token) {
      return wx.showToast({
        icon: 'none',
        title: '请先登录'
      })
    }

    wx.showLoading()

    wx.request({
      url: replyUpsApi(reply_id),
      method: 'POST',
      data: { accesstoken: token },
      success: res => {
        if (res.data.success) {
          this.loadData();
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.error_msg,
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '请求发送失败',
        })
      },
      complete: _ => {
        wx.hideLoading()
      }
    })
  },
  // 收藏与否
  toogleCollect(e) {
    var token = app.globalData.my.accessToken;
    if (!token) {
      return wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
    }
    var is_collect = this.data.is_collect;
    wx.request({
      url: !is_collect ? topicCollectionApi() : deleteTopicCollectionApi(),
      method: 'POST',
      data: {
        accesstoken: token,
        topic_id: this.data.topic_id
      },
      success: res => {
        if (res.data.success) {
          // this.loadData();
          wx.showToast({
            icon: 'none',
            title: !is_collect ? '收藏成功' : '取消收藏',
          })
          this.setData({
            is_collect: !is_collect
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏失败',
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '收藏失败',
        })
      }
    })
  },
  //进入用户详情页
  toUserDetail(e) {
    var username = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/user-detail/user-detail?username=${username}`,
    })
  }
})