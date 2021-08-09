// 写的ES6的promise代码，要记得引入
import {chooseAddress,showModal,showToast,requestPayment} from "../../utils/asyncWx.js";
import {request} from "../../request/index.js";
/* 
  1. 页面加载的时候
     1. 从缓存中获取购物车数据 渲染到页面中去（checked属性必须时true）
  2. 微信支付
     1. 哪些人 哪些账号 可以微信支付
        企业账号
        企业账号的小程序后台 必须给开发者添上白名单
        一个appID可以同时绑定多个开发者 
        这些开发者就可以公用这个appid和它的开发权限
  3. 支付按钮
     1.  先判断缓存中有没有token
     2.  没有就跳转到授权页面进行token的获取
     3.  有token 获取订单编号 
     4.  已经完成微信支付
     5.  手动删除缓存中完成支付的商品数据
     6.  把删除后的购物车数据填充会缓存中 在完成跳转

*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
     address:{},
     cart:[],
     totalPrice:0,
     totalNum:0
  },
  
  onShow(){
    // 获取缓存中的收获地址
    const address=wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    let cart=wx.getStorageSync("cart")||[]
    // 将购物车数据中checked=true的数组拿出来赋值给data渲染
    cart=cart.filter(v=>v.checked)
 
    // 重新计算 全选 总价格 总数量。。。。
    // 总数量
    let totalPrice=0
    let totalNum=0
    // 遍历计算
    cart.forEach(v=>{
         totalPrice += v.num*v.goods_price
         totalNum += v.num
    })
    // 给data赋值
    this.setData({
       cart,
       totalPrice,
       totalNum,
       address
    })
 },
// 点击支付
 async handleOrderPay(){
  try {
    //  判断缓存中有没有token
  const token=wx.getStorageSync("token")
  if(!token){
    wx.navigateTo({
      url: '/pages/auth/index',
    });
    return
  }
  // 创建订单
  //  1. 准备请求投参数
//   const header={Authorization:token}
  //  2.准备请求体参数
  const order_price=this.data.totalPrice
  const consignee_addr=this.data.address.all
  const cart=this.data.cart
  let goods=[]
  cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
  }))
  const orderParams={order_price,consignee_addr,goods}
  // 3.创建订单 获取订单编号   
  const res_data=await request({url:"/my/orders/create",method:"POST",data:orderParams})
  let order_number=res_data.data.message.order_number
  //  发起预支付接口
  const res_pay=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}}) 
  let pay=res_pay.data.message.pay
  //   发起微信支付
  await requestPayment(pay)
  //   查询后台  订单状态
  const res_state=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})  
  await showToast({title:"支付成功"})
  //  手动删除缓存中 已经支付的商品
  let newCart=wx.getStorageSync("cart");
  newCart=newCart.filter(v=>!v.checked)
  wx.setStorageSync("cart", newCart);
   // 支付成功 完成页面跳转  
  wx.navigateTo({
     url: '/pages/order/index'
  });
  } catch (error) {
     console.log(error)
     await showToast({title:"支付失败"})
  }


}
})

