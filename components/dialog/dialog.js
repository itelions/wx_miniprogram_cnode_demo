// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      value: false, 
      observer: function (newVal, oldVal) {
        this.setData({
          visible: newVal
        })
      }
    },
    title: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          title: newVal
        })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false,
    title: '测试标题',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dialogClose(){
      this.triggerEvent('dialogclose')
    }
  }
})
