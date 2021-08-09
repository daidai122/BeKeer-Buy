/* 
1. 页面被打开的时候 onShow（因为是频繁打开关闭，所以onShow比onLode好）
   0. onShow 不同于onLode 无法在形参上接收 options参数
   0.5 判断缓存中有没有token 如果没有，就要跳转到授权页面进行授权 有就继续请求
   1. 获取url上的type参数
   2. 根据type来决定页面标题元素  哪个被激活选中 其他的isActive就变成false
   2.根据type发送请求获取订单数据
   3.渲染页面
2. 点击不同的标题，重新发送请求来获取和渲染数据
*/
// 写的ES6的promise代码，要记得引入
import {request} from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
       id:0,
       value:"全部订单",
       isActive:true
      },
      {
       id:1,
       value:"待付款",
       isActive:false
      },
      {
       id:2,
       value:"待收货",
       isActive:false
      },
      {
       id:3,
       value:"退款/退货",
       isActive:false
      },
     ],
  },

  onShow(options){
    // 先判断是否有token
    const token =wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 1. 获取当前的小程序的页面栈---数组  长度最大为10
    let pages= getCurrentPages()
    // 2. 数组中索引最大的就是当前页面
    let currentPage=pages[pages.length-1]
    const {type}=currentPage.options
    // 激活选中页面标题  typr=1  index=0
    this.changeTitleByIndex(type-1)
    this.getOrders(type)
  },
  //  获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}})
    this.setData({
      orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  // 根据标题索引来激活选中 标题数组 点击事件
  changeTitleByIndex(index){
  // 2. 将该索引的isActive改为true，其他的索引中isActive改为false
     let {tabs}=this.data;
     tabs.forEach((ite,ind)=>{ind===index?ite.isActive=true:ite.isActive=false});
  // 3.将修改过后的tabs数组放回原来的tabs数组中去
     this.setData({
        tabs
     })
  },

  handleTabItemChange(e){
    // 1. 获取被点击事件的索引
    const {index}=e.detail
    this.changeTitleByIndex(index)
    // 2. 点击过后，要重新发送请求
    this.getOrders(index+1)
  },
  
})