const { checkAccessTokenApi } = require('./../utils/api.js');

module.exports = {
  // 从storage中获取
  setMyInfoFromStorage: function ({ app}) {
    var my = wx.getStorageSync('my');
    
    if (my) app.globalData.my = my;
  },
  // 从后端中获取
  setMyinfoFromHttp: function ({ app, token, successFunc, errFunc}){
    wx.request({
      url: checkAccessTokenApi(),
      method: 'POST',
      data: {
        accesstoken: token||''
      },
      success: function (res) {
        if (res.statusCode !== 200) return errFunc && errFunc(res);
        var { loginname, avatar_url, id } = res.data;
        app.globalData.my.accessToken = token;
        app.globalData.my.userInfo = { loginname, avatar_url, id };
        wx.setStorageSync('my', app.globalData.my);

        successFunc && successFunc({ loginname, avatar_url, id })
      },
      fail: function (err) {
        errFunc && errFunc(err)
      }
    })
  },
  // 清除
  clearMyInfo: function ({ app, callback}) {

    app.globalData.my = {};
    wx.removeStorageSync('my');
    callback && callback();
  }
}