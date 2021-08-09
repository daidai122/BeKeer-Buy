// 写的ES6的promise代码，要记得引入
import {request} from "../../request/index.js";
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的菜单数据
    rightMenuList:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 这是右侧滚动条距离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
    Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
     0. web中的本地存储和小程序中的本地存储的区别
        1. 写代码的方式不一样
           web： localStorage.setItem("key","value")   localStorage.getItem("key","value")
           小程序： wx.setStorageSync("key","value")  wx.getStorageSync("key")
        2.存的时候，有没有做类型转换
           web：不管存入时是什么类型的数据，最终都会先调用一下 toString（），把数据变成字符串，再存入进去
           小程序：不存在类型转换的操作，存什么类型的数据，获取时就是什么类型的数据
     1. 先判断本地存储中有没有旧的数据
     2. 如果没有旧数据，就直接发送新的请求
     3. 如果有旧数据且没有过期，就是用本地存储中的旧数据即可
    */
    // this.getCategoryList();
 
    // 1. 获取本地存储中的数据（小程序中也存在本地存储 技术）
     const Cates = wx.getStorageSync("cates");
    //  2. 判断
    if(!Cates){
      // 不存在
      this.getCategoryList();
    }else{
      // 有旧数据，定义过期时间，10s改成5分钟
      if(Date.now()-Cates.time>1000*10){
        // 重新发送请求
        this.getCategoryList();
      }else{
        // 可以使用旧数据
      //  console.log("可以使用旧数据")
      this.Cates=Cates.data;
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      let rightMenuList=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightMenuList
      })
      }
    }
    
  },
  // 获取分类页面数据
  async getCategoryList(){
  //   request({url:'/categories'})
  //   .then(result=>{
  //      this.Cates=result.data.message;
  //     //  把接口数据存入本地存储中
  //     // 这个写法是本地存储的数据
  //     wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})

  //     //  构造左侧的数据
  //     let leftMenuList=this.Cates.map(v=>v.cat_name);
  //     //  构造右侧的数据
  //     let rightMenuList=this.Cates[0].children;

  //     this.setData({
  //       leftMenuList,
  //       rightMenuList
  //     })
  // })
/* 
     上述被注释的部分是es6中的promise封装
     以下是使用es7的async，它实际上就是回调一个promse函数的，只是使用起来更加方便
 */
//  1. 使用es7的async  await 来发送请求
    const result=await request({url:'/categories'})
    this.Cates=result.data.message;
    //  把接口数据存入本地存储中
    // 这个写法是本地存储的数据
    wx.setStorageSync("cates",{time:Date.now(),data:this.Cates})
    //  构造左侧的数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    //  构造右侧的数据
    let rightMenuList=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightMenuList
    })

  },
  // 当点击左侧菜单时的点击事件
  handleItemTap(e){
  /* 
     1. 获取被点击的菜单身上的索引
     2. 给data中的currentIndex赋值
     3. 根据不同的索引要渲染右侧的内容
     */   
    const {index}=e.currentTarget.dataset
    
    let rightMenuList=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightMenuList,
      // 当点击左侧菜单触发右侧菜单时，重新设置右侧菜单view标签距离顶部的距离
      scrollTop:0
    })

  }
  
})