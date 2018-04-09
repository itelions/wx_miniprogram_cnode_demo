const nodeApi = 'https://cnodejs.org/api/v1';

module.exports = {
  //获取主题话题
  topicsApi(){
    return nodeApi + '/topics';
  },
  //获取话题详情
  topicDetailApi(id){
    return nodeApi+'/topic/'+ id;
  },
  //获取用户收藏话题
  userTopicCollectionsApi(username){
    return nodeApi + `/topic_collect/${username}`;
  },
  //收藏话题
  topicCollectionApi(){
    return nodeApi +'/topic_collect/collect';
  },
  //删除收藏话题
  deleteTopicCollectionApi(){
    return nodeApi + '/topic_collect/de_collect';
  },
  //回复话题
  topicReplyApi(topic_id){
    return nodeApi + `/topic/${topic_id}/replies`;
  },
  //点赞与否
  replyUpsApi(reply_id){
    return nodeApi + `/reply/${reply_id}/ups`;
  },
  //验证用户AccessToken(登录)
  checkAccessTokenApi(){
    return nodeApi +'/accesstoken';
  },
  //获取用户详情
  userDetailApi(loginname){
    return nodeApi + `/user/${loginname}`;
  },
  //获取消息
  myMessageApi(){
    return nodeApi +'/messages';
  },
  //全部消息标记为已读
  myMessageMarkedApi(){
    return nodeApi + '/message/mark_all'
  }
}