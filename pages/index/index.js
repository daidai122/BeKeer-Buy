// 引入用来发送请求的方法 一定要把路径补全
import {request} from "../../request/index.js";
//Page Object
Page({
  data: {  
      //  轮播图数组
      swiperList:[],
      //导航 数组
      cateList:[],
      // 楼层数组
      floorList:[],
      query:""
  },
  //options(Object)
   // 页面开始加载，就会触发的生命周期事件
  onLoad: function(options){
  //  1. 发送异步请求 获取轮播图数据(当请求代码臃肿时，容易陷入异步请求循环)
  //  优化手段可以通过ES6的promise来解决这个问题
  // var reqTask = wx.request({
  //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
  //   success: (result)=>{
  //     this.setData({
  //       swiperList:result.data.message
  //     })
  //   } 
  // });
  this.getSwiperList();
  this.getCateList();
  this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result=>{
      this.setData({
         swiperList:result.data.message
    })
  })
  },
  //获取分类导航数据
  getCateList(){
    request({url:'/home/catitems'})
    .then(result=>{
      this.setData({
         cateList:result.data.message
    })
  })
  },
  //获取楼层数据
  async getFloorList(){
    const res=await request({url:'/home/floordata'}) 
    let floorList=res.data.message
    for(var i=0;i<3;i++){
      for(let ind=0;ind<5;ind++){
        floorList[i].product_list[ind].navigator_url=floorList[i].product_list[ind].navigator_url.replace(/goods_list/g,'goods_list/index')
      }
    }
    this.setData({
        floorList
    })

  },
  
});