// 写的ES6的promise代码，要记得引入
import {chooseAddress,showModal,showToast} from "../../utils/asyncWx.js";

/* 
  1. 获取用户收货地址
      1. 绑定点击事件
      2. 调用小程序内置的api 获取用户的收货地址  wx.chooseAddress
  2. 页面加载完毕
      0. 用onLoad  onShow
      1. 获取本地存储中的地址
      2. 把这个数据设置给data中的一个变量即可
      3. 把获取到的地址存到本地存储中
  3. onShow
      0. 回到商品详情页面  第一添加商品时，手动添加了checked属性
          1. num=1
          2. checked=true
      1. 获取缓存中的购物车数组
      2. 将缓存数组填充到data中去，
      3. 从data中提取数据进行动态渲染
  4. 全选的实现
      1. onShow 获取缓存中的购物车数据
      2. 根据购物车中的商品数据 所有的商品都被选中 checked=true
         全选框才会被选中
      3. 空数组调用every，也会返回一个true，
         所以需要做一个判断来确认是否是空数组
  5. 总价格和总数量
      1. 都需要商品被选中 我才能那它计算
      2. 获取购物车数组
      3. 遍历
      4. 判断商品是否被选中 checked==true？
      5. 总价格+=商品的单价*商品的数量
         总数量+=商品的数量
      6. 把计算后的数据设置回data中去
  6. 商品的选中功能
      1. 绑定checked事件
      2. 获取到被修改的商品对象
      3. 商品对象的选中状态取反
      4. 重新填充回data中和缓存中
      5. 重新计算 全选 总价格 总数量。。。。
  7. 全选和反选功能
      1. 给全选的复选框给一个change事件
      2. 获取 data中的全选变量 allChecked
      3. 直接取反 allChecked=！allChecked
      4. 遍历购物车数组 让数组里所有商品的checked属性保持于allChecked一致
      5. 把购物车数组和allChecked重新设置回data中去 并把购物车数组 重新设置回缓存中
  8. 商品数量的编辑功能
      1. “+”，“-”绑定同一个点击事件 区分的关键是自定义属性值
      2. 传递被点击的商品id goods_id
      3. 获取data中购物车数组 来获取需要修改的商品对象
      4. 当购物车的数量=1 同时用户点击的是“-1”，
          弹窗提示（wx.showModal）  询问用户 是否删除该商品
          1.确定 直接执行删除
          2.取消 什么都不要做
      5. 直接修改商品对象的num属性
      6. 把cart数组重新设置回缓存和data数据中
  9. 点击结算 
      1. 判断是否有地址address信息  和购物车cart数组 信息
      1. 跳转到结算界面
      2. 获取到地址address信息和购物车cart数组
      3. 
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
     address:{},
     cart:[],
     allChecked:false,
     totalPrice:0,
     totalNum:0
  },
  
  onShow(){
    // 获取缓存中的收获地址
    const address=wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    const cart=wx.getStorageSync("cart")||[]
    // 计算全选
    // every 数组方法  会遍历 接收一个回调函数，每个回调函数都返回的是true，那么every方法的返回值就是true
    //  只要回调函数中有一个时false，那么就不会再继续执行下去，最终every方法返回的就是false
    // const allChecked=cart.length&&cart.every(v=>v.checked)  这里的every和下面的forEach都是循环，浪费性能
    this.setCart(cart)
    // 给data赋值地址
    this.setData({
      address,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户收货地址
  async handleChooseAddress(){
    // 获取调用地址
    let address=await chooseAddress()
    address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
    // 存入缓存
    wx.setStorageSync("address",address) 
  },
  // 商品选中
  handleItemChange(e){
    // 获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id 
    //获取购物车数组
    let {cart}=this.data
    // 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    cart[index].checked=!cart[index].checked
    // 重新计算总价格 总数量
    this.setCart(cart)
  },
  // 设置购物车状态的同时 重新计算底部操作栏的数据 全选 总价格 总数量
  setCart(cart){
    // 重新计算 全选 总价格 总数量。。。。
    let allChecked=true
    // 总数量
    let totalPrice=0
    let totalNum=0
    // 遍历计算
    cart.forEach(v=>{
       if(v.checked){
         totalPrice += v.num*v.goods_price
         totalNum += v.num
       }else{
         allChecked=false
       }
    })
    // 同every一样这里需要判断一下cart是否是空数组
    allChecked=cart.length!=0?allChecked:false
    // 给data赋值
    this.setData({
       cart,
      allChecked,
       totalPrice,
      totalNum
    })
    // 回填至缓冲数组里
    wx.setStorageSync("cart",cart)
  },
  // 全选功能
  handleItemAllChange(){
    // 获取data中的allchecked属性
    let {cart,allChecked}=this.data
    // 取反修改
    allChecked=!allChecked
    // 遍历购物车数组 让数组里所有商品的checked属性保持于allChecked一致
    cart.forEach(v=>v.checked=allChecked)
    // 把购物车数组和allChecked重新设置回data中去 并把购物车数组 重新设置回缓存中
    this.setData({
      cart,
      allChecked
    })
    wx.setStorageSync("cart",cart)
  },
  // 操作商品数量的加减
  async handleItemNumEdit(e){
  // 获取传递过来的参数
  const {operation,id}=e.currentTarget.dataset
  // 获取data中购物车数组 来获取需要修改的商品对象
  let {cart}=this.data
  // 需要找到被修改的商品的索引
  const index=cart.findIndex(v=>v.goods_id===id)
  // 进行修改数量 (如果数量为0了，就是删除了，不存在了)
  // 所以需要判断一下是否是删除商品
  if(cart[index].num===1&&operation===-1){
    // 弹窗提示
    const result=await showModal({content:"是否删除该商品?"})
    if(result.confirm){
      cart.splice(index,1)
      this.setCart(cart)
    } 
  }else{
    // num为其他的数量是 就正常进行加减操作
    cart[index].num+=operation
    // 设置回缓存和data中
    this.setCart(cart)
    wx.setStorageSync("cart",cart)
  }
 
  },
  // 结算
  async handlePay(){
  // 1. 判断收货地址 和购物车商品信息
  const {address,totalNum}=this.data
  if(!address.userName){
    await showToast({title:'还没有目的地噢~'})
    // 这个return很重要，不然会导致程序持续进行
    return
  }
  if(!totalNum){
    await showToast({title:'还没有宝贝噢~'})
    return
  }
  // 2.有了地址和商品 点击结算后要跳转到结算页面
  wx.navigateTo({
    url: '/pages/pay/index',
  });
  }
})
