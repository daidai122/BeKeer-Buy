/* 
1. 输入框绑定事件   值改变 input事件
   1. 获取输入框的值
   2. 合法性判断
   3. 检验通过 就把输入框的值发送给后台
   4. 返回的数据打印到页面上
2. 防抖（防止抖动）  节流
   0. 防抖 一般 输入框中使用 防止重复输入 重复发送请求
   1. 节流  一般时用在页面下拉  上拉中
   2. 定义全局的定时器Id
3. 
*/
// 写的ES6的promise代码，要记得引入
import {request} from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
   data: {
   goods:[],
  //  取消按钮是否出现  取决于输入框是否获得焦点
   isFocus:false,
   inputValue:""
  },
  TimeId:-1,
  // 输入框的值改变就会触发的事件
  handleInput(e){
    // 获取输入框的值
   const {value}=e.detail
    // 检测合法性
   
 
    if(!value.trim()){
      // 这个清除定时器 是定时器的异步，如果不清除，那么计时器计时结束，输入内容又会重新发送请求，1s后会重新跳出搜索的goods信息
      clearTimeout(this.TimeId)
      this.setData({
        goods:[],
        isFocus:false
      })
      // 值不合法
      return
    }
    this.setData({
      isFocus:true
    })
    // 防抖处理
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(() => {
        // 检测通过 发送请求来获取数据
        this.qsearch(value)
    }, 1000);
  
  },
  //  检测通过 发送请求来获取数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}})
    this.setData({
      goods:res.data.message
    })
  },
  //  取消按钮的清空功能
  handleCancel(){
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[],
    })
  }
})