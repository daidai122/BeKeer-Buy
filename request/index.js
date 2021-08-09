// 同时发送异步代码的次数
let ajaxTimes=0;
// 一定要再去看es6中的params
export const request=(params)=>{
    // 判断url中是否带有/my/请求的是私有路径 带上header token（用正则表达式判断）
    let header={...params.header}
    if(params.url.includes("/my/")){
        // 拼接 header 带上token
        header["Authorization"]=wx.getStorageSync("token")
    }

    ajaxTimes++;
    // 显示 加载中  效果
    wx.showLoading({
        title: '加载中',
        mask:true
      });
      
    // 定义公共的url
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
         wx.request({
           ...params,
           header:header,
           url:baseUrl+params.url,
           success:(result)=>{
            resolve(result);
           },
           fail:(error)=>{
               reject(error);
           },
        
           complete:()=>{
               ajaxTimes--;
               if(ajaxTimes===0){
            // 请求完了以后就关闭 正在等待的图标
                wx.hideLoading();
               }
           }
        });
    })
}