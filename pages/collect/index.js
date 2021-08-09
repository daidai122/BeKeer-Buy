Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
       id:0,
       value:"商品收藏",
       isActive:true
      },
      {
       id:1,
       value:"品牌收藏",
       isActive:false
      },
      {
       id:2,
       value:"店铺收藏",
       isActive:false
      },
      {
       id:3,
       value:"浏览足迹",
       isActive:false
      },
     ],
    collect:[],
    // 商品读取失败是显示的
    falseUrl:'https://bpic.588ku.com/element_origin_min_pic/19/04/10/e87e154ddafd724a915a119fb21c38b9.jpg'
       
  },

  onShow(){
    const collect=wx.getStorageSync("collect")||[]
    this.setData({
      collect
    })
  },


  handleTabItemChange(e){
    // 1. 获取被点击事件的索引
    const {index}=e.detail
        // 2. 将该索引的isActive改为true，其他的索引中isActive改为false
        let {tabs}=this.data;
        tabs.forEach((ite,ind)=>{ind===index?ite.isActive=true:ite.isActive=false});
     // 3.将修改过后的tabs数组放回原来的tabs数组中去
        this.setData({
           tabs
        })
  },

  
})