const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      name: null,
      group: null
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: (options) => {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: () => {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const user = app.globalData.user
    if (user.isLogin) {
      this.setData({
        user: {
          name: user.name,
          group: user.group
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'login'
      })
        .then(res => {
          const name = res.result.name
          const group = res.result.group
          this.setData({
            user: {
              name: name,
              group: group
            }
          })
          app.globalData.user = {
            isLogin: true,
            name: name,
            group: group
          }
        })
        .catch(err => {
          console.log(err)
          wx.showToast({
            title: '请先注册',
            icon: 'none',
            duration: 1000
          })
          wx.navigateTo({ url: '../signup/signup' })
        })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: () => {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: () => {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: () => {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: () => {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: () => {

  }
})
