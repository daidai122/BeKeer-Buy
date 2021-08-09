// components/Tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     tabs:{
       type:Array,
       value:[]
     }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 这是商品列表的点击事件
    handleItemTap(e){
      // 1.获取点击的索引
      const {index}=e.currentTarget.dataset;

      // 2. 根据索引触发   点击事件
      this.triggerEvent("tabItemChange",{index})
    }
  }
})
