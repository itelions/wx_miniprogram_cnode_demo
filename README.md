# wx_miniprogram_cnode_demo
#### 微信小程序 简易版cnode社区  
* 请求后台数据, 需要在 微信公众平台(小程序) > 设置 > 开发设置 > 服务器域名 > request合法域名 中添加 https://cnodejs.org
* api文档可参考 https://cnodejs.org/api 


---
项目结构  
- components => 组件文件夹
    - dialog => 模态框组件
- pages => 页面文件夹
    - detail => 话题详情页面
    - index => 首页话题列表
    - login => 登录页面
    - my => 我的tab页面
    - user-detail =>用户详情页面
- service => globalData的公共方法
    - MyService => 对应globalData中的my字段 
- util => 公共方法文件夹
    - api.js => api接口管理
    - utils.js => 公共方法
- app.js 程序入口文件
- app.json 程序配置文件
- app.wxss 公共样式文件
- project.config.json 项目配置文件 
---
已完成功能
- 查看对应主题的话题列表
- 查看话题详情
- 扫描cnode accesstoken二维码登录
- 收藏话题与查看话题收藏列表
- 回复话题
- 为用户回复点赞
- 查看用户详情
---
计划添加功能
- 消息通知功能
- 富文本节点转换为wxml节点
    - 点击富文本内容中的图片放大查看
    - 富文本内容可复制
- 富文本编辑功能
    - 使用富文本编辑器进行回复


    