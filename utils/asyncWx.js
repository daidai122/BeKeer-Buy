/* promise形式的chooseAddress
 */
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
    wx.chooseAddress({
      success:(result)=>{
        resolve(result) 
      },
      fail:(err)=>{
          reject(err)
      }
    })  
  })
}

/* promise形式的showModal
 */
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
    wx.showModal({
      title: '提示',
      content:content,
      success: (result) => {
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      }
    })
})
}

/* promise形式的showToast
 */
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon:'success',
      success: (result) => {
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      }
    })
})
}

/* promise形式的login
 */
export const login=()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail:(err)=>{
        reject(err)
      }
    })
})
}

/* promise形式的requestPayment
   @promise {object}  pay 所必要的参数
 */
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  
})
}

