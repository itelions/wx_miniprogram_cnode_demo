//index.js
//获取应用实例
const app = getApp();
const { topicsApi } = require('./../../utils/api.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    params:{
      page: 1,
      limit: 15,
      tab: "all",
    },
    loadingState:'init',
    tabs:[
      { name:"全部",tab:"all" },
      { name: "精华", tab: "good" },
      { name: "分享", tab: "share" },
      { name: "问答", tab: "ask" },
      { name: "招聘", tab: "job" },
      { name: "测试", tab: "dev" }
    ],
    dataList:[],
    scrollTop:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onLoad: function () {
    this.getTopics();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getTopics(refresh){
    var _this=this;
    if (refresh && typeof (refresh)=='boolean') this.setData({ dataList:[]});
    this.setData({loadingState:'loading'});
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.request({
      url: topicsApi(),
      data:Object.assign({page:1,limit:20,tab:"all"},this.data.params),
      success(res){
        var finalData = _this.dealWithResData(res.data.data);
        var loadingState = 'still';
        if (!finalData.length) loadingState = 'no_more';
        _this.setData({
          dataList: _this.data.dataList.concat(finalData||[]),
          loadingState: loadingState,
        })
        wx.hideLoading({
          title: '加载完毕',
        })
      },
      fail(err){
        wx.hideLoading();
        _this.setData({ loadingState: 'fail' });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
        console.log(err)
      }
    })
  },
  handleTabChange(e){
    var newTab = e.target.dataset.tab;
    this.setData({
      params:Object.assign(this.data.params,{tab:newTab,page:1})
    });
    this.toTop();
    this.getTopics(true);
  },
  loadMore() {
    if (this.data.loadingState == 'fail' || this.data.loadingState == 'no_more') return;
    var params = this.data.params;
    this.setData({ params: Object.assign(params, { page: params.page+1})})
    this.getTopics();
  },
  dealWithResData(data){
    var tabList=this.data.tabs;
    var newData = data||[];
    return newData.map((item)=>{
      for (var i=0;i<tabList.length;i++){
        if (item.tab == tabList[i].tab){
          item.tab = tabList[i].name
          return item
        }
      }
      item.tab = '未知';
      return item
    })
  },
  toDetail(e){
    var topicid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?topicid=${topicid}`,
    })
  },
  toTop() {
    this.setData({
      scrollTop: 0
    })
  },
  toUserDetail(e){
    var username = e.currentTarget.dataset.username;
    wx.navigateTo({
      url: `/pages/user-detail/user-detail?username=${username}`,
    })
  }
})
