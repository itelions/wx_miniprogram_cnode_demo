// pages/my/my.js
const app = getApp();
const mokeCollections = require('./../../utils/moke_collections.js');
const { deleteTopicCollectionApi, userTopicCollectionsApi, myMessageApi } = require('./../../utils/api.js');

const { clearMyInfo, setMyinfoFromHttp } = require('./../../service/MyService.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    hastoken:false,
    dialogTitle:'',
    dialogContentType: '',
    dialogVisible: false,
    collections:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('show')
    var accessToken = this.checkAccessTokenLocal();
    if (accessToken){
      var myInfo = app.globalData.my.userInfo;
      if (!myInfo){
        this.requestUserInfo(accessToken)
      }else{
        this.setData({
          userInfo: myInfo
        })
      }
      
      if (this.data.dialogVisible){
        this.getDialogDataByContentType(this.data.dialogContentType)
      }
    }
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

  checkAccessTokenLocal(){
    var token = app.globalData.my.accessToken;
   
    this.setData({
      hastoken: token?true:false
    })
    return token || ''
  },

  requestUserInfo(token){
    var _this = this;
    setMyinfoFromHttp({
      app: app, 
      token:token, 
      successFunc:({ loginname, avatar_url, id })=>{
        _this.setData({
          userInfo: { loginname, avatar_url, id }
        })
      },
      errorFunc: err => {
        wx.showToast({
          icon:'none',
          title: '获取用户信息失败',
        })
      }
    })
  },
  clearLoginInfo(){
    clearMyInfo({
      app, 
      callback:_=>{
        this.setData({
          userInfo: {}
        });
        
        this.checkAccessTokenLocal();
      }})
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  showDialog(e) {
    var dialogContentType = e.currentTarget.dataset.type;
    this.setData({
      dialogContentType: dialogContentType,
      dialogTitle: e.currentTarget.dataset.title,
      dialogVisible: true,
    });

    this.getDialogDataByContentType(dialogContentType)
  },
  getDialogDataByContentType(contentType) {
    var _this = this;
    switch (contentType) {
      case 'collections':
        _this.getCollections();
        break;
      case 'messages':{
        _this.getMessage();
        break;
      }
    }
  },
  handleDialogclose(e){
    this.setData({
      dialogVisible: false,
    })
  },
  getCollections(){
    var username = app.globalData.my.userInfo.loginname;
    wx.request({
      url: userTopicCollectionsApi(username),
      success: res=>{
        this.setData({
          collections: res.data.data || []
        })
      },
      fail: err=>{
        wx.showToast({
          icon: 'none',
          title: '收藏获取失败',
        })
      }
    })
  },
  toCollectedTopic(e){
    wx.navigateTo({
      url: '/pages/detail/detail?topicid='+e.currentTarget.dataset.id,
    })
  },
  handleCollectionDelete(e){
    var targetid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除收藏',
      content: '确定删除当前收藏主题？',
      success: res=>{
        if (!res.cancel){
          this.deleteCollection(targetid);
        }
      }
    })
  },
  deleteCollection(id){
    wx.request({
      url: deleteTopicCollectionApi(),
      method: 'POST',
      data:{
        accesstoken: app.globalData.my.accessToken,
        topic_id: id
      },
      success: res=>{
        if(res.data.success){
          this.getCollections();
        }else{
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        }
      },
      fail: err=>{
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
      }
    })
  },
  getMessage(){
    wx.request({
      url: myMessageApi(),
      data:{
        accesstoken:app.globalData.my.accessToken||''
      },
      success: res =>{
        if(!res.data.success){
          wx.showToast({
            icon: 'none',
            title: '消息获取失败',
          });
          return ;
        }
        console.log(res)
      },
      fail: err =>{
        wx.showToast({
          icon: 'none',
          title: '消息获取失败',
        })
      }
    })
  }
})