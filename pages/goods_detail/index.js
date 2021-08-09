/* 
    1. 发起请求的封装
    2. 点击轮播图 预览大图
        1 给轮播图绑定一个点击事件
        2 调用小程序的api previewImage
    3. 点击 加入购物车   
        1 先绑定点击事件
        2 获取缓存中的购物车数据 数组格式
        3 先判断 当前的商品是否已经存在于 购物车
        4 已经存在就要 修改商品数量 购物车数量++ 重新把购物车数组 填充回缓存
        5 不存在于购物车的数组中  直接给购物车数组添加一个新元素   带上购买数量属性 num 重新把购物车数组 填充回缓存
        6 弹出提示
    4. 商品收藏
        1. 页面onshow时，加载缓存页面中的商品收藏数据
        2. 判断当前商品是不是被收藏
            1. 是。则改变收藏图标
            2. 不是，
        3. 点击商品收藏按钮
            1. 判断该商品是否已经存在与缓存数据中
                存在，删除商品
                不存在  添加商品 
 */
import {request} from "../../request/index.js";
import {showToast} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  // 申明全局变量商品详情 方便后续处理
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
   let pages= getCurrentPages()
   let currentPages=pages[pages.length-1]
   let options=currentPages.options  
   const {goods_id}=options
   this.getGoodsDetail(goods_id)

  },
  /* 获取商品的详情数据 
   */
  async getGoodsDetail(goods_id){
    const res=await request({url:"/goods/detail", data:{goods_id}})
    this.GoodsInfo=res.data.message

      //  1. 获取缓存中的商品收藏的数组(要注意类型转换，如果忘记了，它的.some就无法执行)
    let collect = wx.getStorageSync("collect")||[]
   //  判断是都存在该商品
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    
    this.setData({
      goodsObj:{
        goods_price:res.data.message.goods_price,
        goods_name:res.data.message.goods_name,
        // iphone部分手机 不识别webp格式的图片，所以为了适配，需要将该格式图片替换成jpg格式
        // 确保后台存在 1.webp=>1.jpg(临时使用的)
        goods_introduce:res.data.message.goods_introduce.replace(/\.webp/,'.jpg'),
        pics:res.data.message.pics, 
      },
      isCollect
      
    })
  },
  // 点击轮播图 放大预览图
  handlePreviewImage(e){
    // 先构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid)
    const current=e.currentTarget.dataset.url
    // 接收点击图片，传递过来的图片url
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车
   handleCartAdd(){
    // 获取缓存中的购物车数据 数组格式
   let cart=wx.getStorageSync("cart")||[];
    // 先判断 当前的商品是否已经存在于 购物车
   let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
   if(index===-1){
    //  不存在  第一次添加
    this.GoodsInfo.num=1;
    this.GoodsInfo.checked=true;
    cart.push(this.GoodsInfo);
   }else{
    //  已经存在  购物车数量 num++
    cart[index].num++;
   }
  // 填充回缓存
  wx.setStorageSync("cart",cart);
  // 弹出提示
  wx.showToast({
    title: '加入成功',
    icon: 'success',
    // true 防止用户手抖，疯狂点击添加按钮
    mask:true, 
  });
  },
  // 点击收藏图标
  async handleCollect(){
  let isCollect=false
  //  获取缓存中的商品数组
  let collect = wx.getStorageSync("collect")||[]
  //  判断当前商品是否被收藏(就是如果该数组中的goods_id是等于全局变量的goods_id，那么就会返回该商品的索引 否则就会返回-1)
  let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
  //  判断index是否为-1 是 就表示没有收藏过，则收藏  否 就表示收藏过，则取消收藏
  if(index!==-1){
    collect.splice(index,1)
    isCollect=false
    await showToast({title:"取消成功"})
  }else{
    collect.push(this.GoodsInfo)
    isCollect=true
    await showToast({title:"收藏成功"})
  }
  wx.setStorageSync("collect", collect)
  this.setData({
    isCollect
  })
  }
})