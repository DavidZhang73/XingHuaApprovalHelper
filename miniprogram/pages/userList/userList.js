const app = getApp()

Page({
  data: {
    userList: [],
    groupMap: app.globalData.groupMap
  },
  onShow: async function () {
    const db = wx.cloud.database()
    const { data } = await db.collection('user').get()
    this.setData({
      userList: data
    })
  }
})
