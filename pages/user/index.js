// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     userinfo:{},
    //  被收藏的商品数量
     collectNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow(){
    const userinfo=wx.getStorageSync("userInfo")
    const collect= wx.getStorageSync("collect")||[]
    this.setData({userinfo,collectNum:collect.length})
  }

})