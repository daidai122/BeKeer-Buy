// 写的ES6的promise代码，要记得引入
import {request} from "../../request/index.js";
/*  用户上滑页面  滚动条触底 开始加载下一页数据
     1. 找到滚动条触底事件  微信官方小程序里去寻找
     2. 判断是否还有下一页数据 
          1. 获取到总页数   只有总条数total
               总页数 = Math.ceil(总条数/页容量pagesize)
          2. 获取到当前的页码  pagenum
          3. 判断方面的页码是否大于等于总页数
             表示没有下一页-----给出提示框
     3. 如果没有下一页数据，就弹出提示框
     4. 如果有下一页的数据，加继续加载数据
         1.拿到当前的页码进行++
         2. 重新发送请求  获取数据 
         3. 对获取到的新数据，在原数组中填充到结尾，而不是直接替换
             替换会导致之前的数组不见了
*/
/* 用户下拉页面 刷新数据      需要在json文件中开启一个配置项
       也就是页面数 pagenum重置为1
    1. 触发下拉事件
    2. 重置数据数组
    3. 重置页码设置为1 
    4. 重新发送请求
    5. 数据请求回来后，需要手动关闭 下拉刷新的等待效果
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabs:[
       {
        id:0,
        value:"综合推荐",
        isActive:true
       },
       {
        id:1,
        value:"销量",
        isActive:false
       },
       {
        id:2,
        value:"价格",
        isActive:false
       },
       {
        id:3,
        value:"店铺",
        isActive:false
       },
      ],
      // 商品数组
      goodsList:[],
      // 商品读取失败是显示的
      falseUrl:'https://bpic.588ku.com/element_origin_min_pic/19/04/10/e87e154ddafd724a915a119fb21c38b9.jpg'
  },
  /* 
    商品列表的接口要的参数
   */
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10,
  },
  // 总页数（全局变量）
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },
  // 获取商品数据
  async getGoodsList(){
    const res=await request({url:"/goods/search", data:this.QueryParams});
    // 获取总条数  (注意这里的total是从哪里开始获取的)
    const total=res.data.message.total;
    // 计算出总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    // console.log(this.totalPages);
    // 将获取到的商品列表数据赋值给全局变量
    this.setData({
      // 将新获取的数组拼接到旧数组的后面
       goodsList:[...this.data.goodsList,...res.data.message.goods]
      // goodsList:this.data.goodsList.push(res.data.message.goods)
    })
    // 关闭下拉刷新等待效果
      wx.stopPullDownRefresh();
  },
  // 点击事件
  handleTabItemChange(e){
    // 1. 获取被点击事件的索引
    const {index}=e.detail;
    // 2. 将该索引的isActive改为true，其他的索引中isActive改为false
    let {tabs}=this.data;
    tabs.forEach((ite,ind)=>{ind===index?ite.isActive=true:ite.isActive=false});
    
    // 3.将修改过后的tabs数组放回原来的tabs数组中去
    this.setData({
      tabs
    })
  },
  // 页面上滑滚动条触底事件
  onReachBottom(){
  //  判断是否还有下一页数据 
  if(this.QueryParams.pagenum>=this.totalPages){
    wx.showToast({
       title: '没粮了噢，喵~', //弹框内容
       image: '../../icons/falseGoods.png',  //弹框模式
       duration: 3000    //弹框显示时间
    }) 
   }else{
    this.QueryParams.pagenum++;
    this.getGoodsList();
   }
  },
  // 页面下拉 触顶事件
  onPullDownRefresh(){
    // 重置数据数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 发送请求
    this.getGoodsList();
    // 数据请求回来后，手动关闭下拉刷新的等待效果 按照逻辑是需要在获取商品列表里完成
  }

})