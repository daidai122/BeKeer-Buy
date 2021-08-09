// 写的ES6的promise代码，要记得引入
import {request} from "../../request/index.js";
// 写的ES6的promise代码，要记得引入
import {login} from "../../utils/asyncWx.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  // 获取用户信息
 async handleGetUserInfo(e){
  try {
    //  获取用户信息
  const {encryptedData,rawData,iv,signature}=e.detail
  // 获取小程序登录成功后的code值
  const {code}=await login()
  // 封装一些参数
  const loginParams ={encryptedData,rawData,iv,signature,code}
  //  发送请求  获取用户的token(由于没有气耶账号，所以就只能设置以恶个token值)
  wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
  wx.navigateBack({
    delta: 1
  })
  } catch (error) {
    console.log(error)
  }
  


  }
})